import { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import PaperUpload from '../../components/teacher/PaperUpload';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, FileText, Calendar, Lock, CheckCircle2 } from 'lucide-react';

const TeacherDashboard = () => {
  const { contract, account } = useWeb3();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchPapers = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const count = await contract.paperCount();
      const fetchedPapers = [];
      // Determine if count is BigNumber or regular number
      const countNum = count.toNumber ? count.toNumber() : Number(count);
      
      for (let i = 1; i <= countNum; i++) {
        const paper = await contract.getPaper(i);
        if (paper.teacher.toLowerCase() === account.toLowerCase()) {
          fetchedPapers.push({
            id: i,
            ...paper
          });
        }
      }
      setPapers(fetchedPapers);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [contract, account]);

  const getStatusBadge = (paper) => {
    if (paper.isUnlocked) return <Badge variant="success">Unlocked</Badge>;
    if (paper.isScheduled) return <Badge variant="security">Scheduled</Badge>;
    return <Badge variant="secondary">Uploaded</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Paper Management</h2>
          <p className="text-slate-400">Securely upload and manage exam papers with cryptographic guarantees.</p>
        </div>
        <Button 
          onClick={() => setShowUpload(!showUpload)} 
          variant={showUpload ? 'secondary' : 'primary'}
        >
          {showUpload ? (
            <>
              <FileText className="mr-2 h-4 w-4" />
              View My Papers
            </>
          ) : (
             <>
              <Plus className="mr-2 h-4 w-4" />
              Upload New Paper
            </>
          )}
        </Button>
      </div>

      <Card className="bg-emerald-950/10 border-emerald-900/30">
        <CardContent className="flex items-start gap-4 p-4 text-emerald-400/80 text-sm">
          <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-400">Zero-Trust Architecture Active</p>
            <p className="opacity-90">
              Papers uploaded here are locally encrypted (LAYER-1) before IPFS storage. Keys are re-encrypted (LAYER-2) 
              and split via Shamir's Secret Sharing. You retain NO access to the original content after upload.
            </p>
          </div>
        </CardContent>
      </Card>

      {showUpload ? (
        <PaperUpload onUploadSuccess={() => {
          setShowUpload(false);
          fetchPapers();
        }} />
      ) : (
        <Card className="border-slate-800 bg-slate-900/30">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400">Syncing with blockchain...</p>
              </div>
            ) : papers.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                   <h3 className="text-lg font-medium text-white">No Papers Found</h3>
                   <p className="text-slate-500">You haven't uploaded any secure papers yet.</p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Exam Name</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Upload Date</th>
                    <th className="px-6 py-4 font-medium">Unlock Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {papers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{paper.examName}</div>
                        <div className="text-xs text-slate-500 font-mono">ID: {paper.id}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{paper.subject}</td>
                      <td className="px-6 py-4">{getStatusBadge(paper)}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        <div className="flex items-center gap-2">
                           <Calendar className="w-3 h-3" />
                           {new Date((paper.uploadTimestamp.toNumber ? paper.uploadTimestamp.toNumber() : Number(paper.uploadTimestamp)) * 1000).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                        {paper.isScheduled 
                          ? new Date((paper.unlockTimestamp.toNumber ? paper.unlockTimestamp.toNumber() : Number(paper.unlockTimestamp)) * 1000).toLocaleString() 
                          : <span className="text-slate-600">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
