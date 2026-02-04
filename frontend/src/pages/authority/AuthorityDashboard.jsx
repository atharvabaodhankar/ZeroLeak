import { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import ScheduleExamModal from '../../components/authority/ScheduleExamModal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Shield, RefreshCw, Calendar, CheckCircle2, AlertTriangle, UserPlus } from 'lucide-react';

const AuthorityDashboard = () => {
  const { contract, account } = useWeb3();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [txStatus, setTxStatus] = useState('');
  const [authorityStatus, setAuthorityStatus] = useState('Checking authority status...');
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  const fetchAllPapers = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const count = await contract.paperCount();
      const countNum = count.toNumber ? count.toNumber() : Number(count);
      const fetchedPapers = [];
      for (let i = 1; i <= countNum; i++) {
        const paper = await contract.getPaper(i);
        fetchedPapers.push({
          id: i,
          examName: paper.examName,
          subject: paper.subject,
          teacher: paper.teacher,
          isScheduled: paper.isScheduled,
          isUnlocked: paper.isUnlocked,
          unlockTimestamp: paper.unlockTimestamp,
          uploadTimestamp: paper.uploadTimestamp,
          ipfsCIDs: paper.ipfsCIDs
        });
      }
      setPapers(fetchedPapers.reverse()); // Newest first
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerAsAuthority = async () => {
    if (!contract || !account) return;
    
    try {
      setAuthorityStatus('Registering as Authority...');
      setCheckingRegistration(true);
      
      const tx = await contract.registerAuthority('Exam Authority');
      setAuthorityStatus('Waiting for blockchain confirmation...');
      await tx.wait();
      
      setAuthorityStatus(`Successfully registered as Authority`);
      setIsRegistered(true);
      fetchAllPapers();
      
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthorityStatus(`Registration failed: ${error.message}`);
    } finally {
      setCheckingRegistration(false);
    }
  };

  useEffect(() => {
    const checkAuthorityStatus = async () => {
      if (!account || !contract) return;

      try {
        setCheckingRegistration(true);
        const authorityInfo = await contract.authorities(account);
        
        if (!authorityInfo.isRegistered) {
          setAuthorityStatus('Not registered as Authority.');
          setIsRegistered(false);
        } else if (!authorityInfo.isActive) {
          setAuthorityStatus('Authority account is inactive.');
          setIsRegistered(false);
        } else {
          setAuthorityStatus('Registered Authority');
          setIsRegistered(true);
        }
        
      } catch (error) {
        setAuthorityStatus(`Error: ${error.message}`);
        setIsRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkAuthorityStatus();
    fetchAllPapers();
  }, [contract, account]);

  const handleSchedule = async (paperId, unlockTimestamp, centers, classrooms) => {
    try {
      setTxStatus('Submitting schedule to blockchain...');
      const tx = await contract.scheduleExam(
        paperId, 
        unlockTimestamp, 
        centers, 
        classrooms
      );
      
      setTxStatus('Waiting for blockchain confirmation...');
      await tx.wait();
      
      setTxStatus('Success! Exam scheduled with Smart Contract Timelock.');
      setSelectedPaper(null);
      fetchAllPapers();
      setTimeout(() => setTxStatus(''), 3000);
    } catch (error) {
      console.error('Scheduling failed:', error);
      setTxStatus(`Error: ${error.reason || error.message}`);
    }
  };

  const getStatusBadge = (paper) => {
    if (paper.isUnlocked) return <Badge variant="success">Unlocked</Badge>;
    if (paper.isScheduled) return <Badge variant="security">Scheduled</Badge>;
    return <Badge variant="secondary">Pending Schedule</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Authority Overview */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                isRegistered ? 'border-emerald-500 bg-emerald-500/10' : 'border-amber-500 bg-amber-500/10'
            }`}>
                <Shield className={`w-6 h-6 ${isRegistered ? 'text-emerald-500' : 'text-amber-500'}`} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Authority Dashboard</h3>
              <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${isRegistered ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                 <p className="text-sm text-slate-400">{authorityStatus}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isRegistered && !checkingRegistration && (
               <Button onClick={registerAsAuthority} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                 <UserPlus className="w-4 h-4 mr-2" />
                 Register Authority
               </Button>
            )}
            <Button variant="outline" size="sm" onClick={fetchAllPapers} disabled={loading}>
               <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
               Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {txStatus && (
        <Card className="bg-blue-900/20 border-blue-900/50">
           <CardContent className="p-4 flex items-center gap-3">
             <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-blue-200 text-sm font-medium">{txStatus}</span>
           </CardContent>
        </Card>
      )}

      {/* Papers List */}
      <Card className="border-slate-800 bg-slate-900/30">
        <CardHeader>
           <CardTitle>Uploaded Papers</CardTitle>
           <CardDescription>
              Schedule dates and assign centers for encrypted papers.
           </CardDescription>
        </CardHeader>
        <CardContent>
            {loading && papers.length === 0 ? (
               <div className="py-12 text-center text-slate-500">Loading blockchain data...</div>
            ) : papers.length === 0 ? (
               <div className="py-12 text-center text-slate-500">No papers found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4 font-medium">Paper Details</th>
                                <th className="p-4 font-medium">Teacher</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {papers.map((paper) => (
                                <tr key={paper.id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{paper.examName}</div>
                                        <div className="text-xs text-slate-500">{paper.subject}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-mono bg-black/40 p-1.5 rounded inline-block text-slate-300 border border-slate-800">
                                            {paper.teacher.slice(0, 6)}...{paper.teacher.slice(-4)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(paper)}
                                        {paper.isScheduled && (
                                            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                                                <Calendar className="w-3 h-3" />
                                                {new Date((paper.unlockTimestamp.toNumber ? paper.unlockTimestamp.toNumber() : Number(paper.unlockTimestamp)) * 1000).toLocaleString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {!paper.isScheduled ? (
                                            <Button 
                                                size="sm" 
                                                onClick={() => setSelectedPaper(paper)}
                                                disabled={!isRegistered}
                                            >
                                                Schedule Exam
                                            </Button>
                                        ) : (
                                            <span className="flex items-center justify-end gap-1 text-xs text-emerald-500 font-medium">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Scheduled
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </CardContent>
      </Card>

      {selectedPaper && (
        <ScheduleExamModal 
          paper={selectedPaper} 
          onClose={() => setSelectedPaper(null)} 
          onSchedule={handleSchedule}
        />
      )}
    </div>
  );
};

export default AuthorityDashboard;
