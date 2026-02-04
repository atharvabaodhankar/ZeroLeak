import { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { combineShares } from '../../utils/shamirSecretSharing';
import { decryptKeyWithMasterKey, decryptAES } from '../../utils/crypto';
import { ethers } from 'ethers';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Lock, Unlock, Download, Clock, Printer, MapPin, Building2, Loader2 } from 'lucide-react';

const ExamCenterDashboard = () => {
  const { contract, account } = useWeb3();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyStatus, setKeyStatus] = useState('Checking security keys...');
  const [downloadingId, setDownloadingId] = useState(null);
  const [status, setStatus] = useState('');
  const [centerName, setCenterName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (unlockTimestamp) => {
    const unlockTime = (unlockTimestamp.toNumber ? unlockTimestamp.toNumber() : Number(unlockTimestamp)) * 1000;
    const remaining = unlockTime - currentTime;
    
    if (remaining <= 0) return { text: 'UNLOCKED', isReady: true };
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    return { 
        text: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        isReady: false 
    };
  };

  useEffect(() => {
    const checkRegistration = async () => {
      if (!account || !contract) return;

      try {
        setKeyStatus('Checking registration...');
        const centerInfo = await contract.centers(account);
        
        if (!centerInfo.isRegistered) {
          setKeyStatus('');
          setShowNamePrompt(true);
        } else {
          setKeyStatus('');
        }
      } catch (error) {
        console.error("Error checking registration:", error);
        setKeyStatus('Error checking registration.');
      }
    };

    checkRegistration();
  }, [account, contract]);

  const handleRegisterCenter = async () => {
    if (!centerName.trim()) {
      alert('Please enter a center name');
      return;
    }

    try {
      setStatus('Registering center on blockchain...');
      const placeholderKey = ethers.utils.toUtf8Bytes('time-locked-system');
      const tx = await contract.registerExamCenter(centerName, placeholderKey);
      await tx.wait();
      setStatus('Center registered successfully!');
      setShowNamePrompt(false);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Registration failed:', error);
      setStatus(`Error: ${error.reason || error.message}`);
    }
  };

  const fetchPapers = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const count = await contract.paperCount();
      const fetchedPapers = [];
      const countNum = count.toNumber ? count.toNumber() : Number(count);
      
      for (let i = 1; i <= countNum; i++) {
        const paper = await contract.getPaper(i);
        const isAssigned = await contract.isAssignedToCenter(i, account);
        if (isAssigned && paper.isScheduled) {
          const myClassroom = await contract.getMyClassroom(i);
          fetchedPapers.push({ 
            id: i, 
            ...paper,
            roomNumber: myClassroom
          });
        }
      }
      setPapers(fetchedPapers.reverse());
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showNamePrompt) {
      fetchPapers();
    }
  }, [contract, showNamePrompt]);

  const handleDownload = async (paper) => {
    try {
      setDownloadingId(paper.id);
      setStatus('Fetching decryption shares from blockchain...');
      
      const [encryptedK1Bytes, shareBytes, threshold] = await contract.getDecryptionShares(paper.id);
      
      const encryptedK1BytesArray = ethers.utils.arrayify(encryptedK1Bytes);
      const encryptedK1 = new TextDecoder().decode(encryptedK1BytesArray);
      
      const shares = shareBytes.map(bytes => {
        const arr = ethers.utils.arrayify(bytes);
        return new TextDecoder().decode(arr);
      });
      
      setStatus('Reconstructing Master Key (K2) from Shamir shares...');
      const masterKey = combineShares(shares);
      
      setStatus('Decrypting Paper Key (K1) using Master Key...');
      const aesKey = await decryptKeyWithMasterKey(encryptedK1, masterKey);
      
      setStatus('Fetching and decrypting PDF chunks from IPFS...');
      
      const decryptedChunks = [];
      for (let i = 0; i < paper.ipfsCIDs.length; i++) {
        const cid = paper.ipfsCIDs[i];
        
        let response;
        const dedicatedGateway = import.meta.env.VITE_GATEWAY_URL;
        const gatewayKey = import.meta.env.VITE_GATEWAY_KEY;

        try {
            if (dedicatedGateway && gatewayKey) {
                response = await axios.get(`https://${dedicatedGateway}/ipfs/${cid}?pinataGatewayToken=${gatewayKey}`, {
                    withCredentials: false
                });
            } else {
                throw new Error('No Gateway');
            }
        } catch (e) {
            response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`, {
                withCredentials: false
            });
        }
        
        const { iv, encryptedData } = response.data;
        const decryptedChunk = await decryptAES(encryptedData, iv, aesKey);
        decryptedChunks.push(decryptedChunk);
      }
      
      const totalLength = decryptedChunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const mergedArray = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of decryptedChunks) {
        mergedArray.set(chunk, offset);
        offset += chunk.length;
      }
      
      const pdfBlob = new Blob([mergedArray], { type: 'application/pdf' });
      setStatus('Success! Opening PDF...');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${paper.examName}_${paper.subject}.pdf`;
      link.click();

      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Download failed:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleUnlock = async (paperId) => {
    try {
      setStatus('Unlocking paper on-chain...');
      const tx = await contract.unlockPaper(paperId);
      await tx.wait();
      setStatus('Paper unlocked successfully!');
      fetchPapers();
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      let errorMessage = `Unlock failed: ${error.reason || error.message}`;
      setStatus(errorMessage);
      setTimeout(() => setStatus(''), 5000);
    }
  };

  if (showNamePrompt) {
    return (
      <Card className="max-w-md mx-auto mt-20 border-slate-700">
        <CardHeader>
          <CardTitle>Exam Center Registration</CardTitle>
          <CardDescription>Register this node as an authorized exam center.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            value={centerName} 
            onChange={(e) => setCenterName(e.target.value)} 
            placeholder="Official Center Name (e.g. City High School)" 
          />
          <Button onClick={handleRegisterCenter} className="w-full">
            <Building2 className="w-4 h-4 mr-2" />
            Register Node
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Exam Center Console</h2>
          <p className="text-slate-400">Decrypt and print papers only during the authorized window.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPapers} disabled={loading}>
            Refresh
        </Button>
      </div>

      {status && (
         <Card className="bg-slate-900 border-slate-700 mb-6">
            <CardContent className="p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-slate-200">{status}</span>
            </CardContent>
         </Card>
      )}

      {loading && papers.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Connecting to secure network...</div>
      ) : papers.length === 0 ? (
          <Card className="border-dashed border-slate-800 bg-transparent">
             <CardContent className="py-20 text-center">
                <Printer className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400">No Assigned Exams</h3>
                <p className="text-slate-600">You have not been assigned any papers for upcoming exams.</p>
             </CardContent>
          </Card>
      ) : (
          <div className="grid gap-6">
             {papers.map(paper => {
                const timeStatus = getTimeRemaining(paper.unlockTimestamp);
                const isLocked = !paper.isUnlocked && !timeStatus.isReady;
                
                return (
                  <Card key={paper.id} className={`border-l-4 ${paper.isUnlocked ? 'border-l-emerald-500' : 'border-l-amber-500'} bg-slate-900/40`}>
                    <CardContent className="p-6">
                       <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-slate-700 text-slate-400">
                                   ID: {paper.id}
                                </Badge>
                                {paper.isUnlocked ? (
                                   <Badge variant="success" className="animate-pulse">DECRYPTION ACTIVE</Badge>
                                ) : (
                                   <Badge variant="warning">TIMELOCK ACTIVE</Badge>
                                )}
                             </div>
                             <h3 className="text-2xl font-bold text-white">{paper.examName}</h3>
                             <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Room: {paper.roomNumber}</span>
                                <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Subject: {paper.subject}</span>
                             </div>
                          </div>

                          <div className={`p-6 rounded-xl border min-w-[200px] text-center flex flex-col items-center justify-center ${
                             paper.isUnlocked 
                               ? 'bg-emerald-950/20 border-emerald-900' 
                               : 'bg-black/40 border-slate-800'
                          }`}>
                              {paper.isUnlocked ? (
                                 <>
                                    <Unlock className="w-8 h-8 text-emerald-500 mb-2" />
                                    <span className="text-emerald-400 font-bold tracking-widest">UNLOCKED</span>
                                 </>
                              ) : (
                                 <>
                                    <div className="font-mono text-3xl font-bold text-white tracking-widest mb-1 tabular-nums">
                                       {timeStatus.text}
                                    </div>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                                       <Clock className="w-3 h-3" /> Time Remaining
                                    </span>
                                 </>
                              )}
                          </div>
                       </div>
                       
                       <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-800">
                          {!paper.isUnlocked ? (
                             <Button 
                               onClick={() => handleUnlock(paper.id)}
                               disabled={!timeStatus.isReady}
                               className={timeStatus.isReady ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-800 text-slate-500 border-slate-700'}
                               variant={timeStatus.isReady ? 'default' : 'outline'}
                             >
                                {timeStatus.isReady ? <><Unlock className="w-4 h-4 mr-2" /> Unlock Paper</> : <><Lock className="w-4 h-4 mr-2" /> Locked</>}
                             </Button>
                          ) : (
                             <Button onClick={() => handleDownload(paper)} disabled={downloadingId === paper.id} className="bg-emerald-600 hover:bg-emerald-700">
                                {downloadingId === paper.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                Decrypt & Print
                             </Button>
                          )}
                       </div>
                    </CardContent>
                  </Card>
                );
             })}
          </div>
      )}
    </div>
  );
};

export default ExamCenterDashboard;
