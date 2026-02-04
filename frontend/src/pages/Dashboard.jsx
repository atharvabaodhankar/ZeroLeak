import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';
import TeacherDashboard from './teacher/TeacherDashboard';
import AuthorityDashboard from './authority/AuthorityDashboard';
import ExamCenterDashboard from './examCenter/ExamCenterDashboard';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LogOut, UserCircle, Shield, Printer, Wallet } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { account, disconnectWallet, isOnSepolia, switchToSepolia } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    disconnectWallet();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      teacher: { name: 'Teacher', icon: UserCircle, variant: 'default' },
      authority: { name: 'Exam Authority', icon: Shield, variant: 'secondary' },
      examCenter: { name: 'Exam Center', icon: Printer, variant: 'destructive' },
    };
    return roleMap[role] || roleMap.teacher;
  };

  const roleInfo = getRoleDisplay(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar Info */}
      <div className="lg:col-span-1 space-y-6">
         <Card className="border-slate-800 bg-slate-900/50">
           <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-950 mx-auto mb-4 flex items-center justify-center border border-slate-800 shadow-inner">
                  <RoleIcon className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="font-bold text-lg text-white">{user?.name}</h3>
                <Badge variant={roleInfo.variant} className="mt-2">
                  {roleInfo.name}
                </Badge>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    Wallet Address
                  </p>
                  <p className="font-mono text-[11px] truncate bg-black/40 p-2 rounded text-slate-300 border border-slate-800/50">
                    {account}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm text-emerald-400">Verified Profile</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full mt-4">
                  <LogOut className="w-4 h-4 mr-2" />
                  Divest Session
                </Button>
              </div>
           </CardContent>
         </Card>

        {!isOnSepolia && (
          <Card className="bg-amber-950/20 border-amber-900/50">
            <CardContent className="p-4">
              <p className="text-sm text-amber-500 font-semibold mb-2">⚠️ Network Mismatch</p>
              <p className="text-xs text-amber-400/80 mb-3">
                You are not on Sepolia. Please switch to interact with blockchain.
              </p>
              <Button 
                onClick={switchToSepolia} 
                variant="outline"
                size="sm"
                className="w-full border-amber-700 text-amber-500 hover:bg-amber-950"
              >
                Switch to Sepolia
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        {user?.role === 'teacher' && <TeacherDashboard />}
        {user?.role === 'authority' && <AuthorityDashboard />}
        {user?.role === 'examCenter' && <ExamCenterDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
