import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { account, disconnectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    disconnectWallet();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      teacher: { name: 'Teacher', icon: '📝', color: 'primary' },
      authority: { name: 'Exam Authority', icon: '🏛️', color: 'secondary' },
      examCenter: { name: 'Exam Center', icon: '🖨️', color: 'success' },
    };
    return roleMap[role] || roleMap.teacher;
  };

  const roleInfo = getRoleDisplay(user?.role);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-card mb-8">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}! {roleInfo.icon}
              </h1>
              <p className="text-[hsl(var(--color-text-secondary))]">
                <span className={`badge-${roleInfo.color}`}>{roleInfo.name}</span>
              </p>
            </div>
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom">
        {/* User Info Card */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[hsl(var(--color-text-muted))]">Wallet Address</p>
                <p className="font-mono text-sm">{account}</p>
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--color-text-muted))]">Role</p>
                <p>{roleInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--color-text-muted))]">Network</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--color-success))] animate-glow"></div>
                  <span>Sepolia Testnet</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--color-text-muted))]">Papers Uploaded</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--color-text-muted))]">Active Exams</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--color-text-muted))]">Total Transactions</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Specific Content */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">
            {user?.role === 'teacher' && 'Upload Question Papers'}
            {user?.role === 'authority' && 'Manage Exams'}
            {user?.role === 'examCenter' && 'Print Papers'}
          </h2>

          <div className="text-center py-12">
            <div className="text-6xl mb-4">{roleInfo.icon}</div>
            <p className="text-[hsl(var(--color-text-secondary))] mb-6">
              {user?.role === 'teacher' && 'Upload and manage your question papers securely'}
              {user?.role === 'authority' && 'Create exams and monitor the system'}
              {user?.role === 'examCenter' && 'Access and print papers at exam time'}
            </p>
            <button className="btn-primary">
              {user?.role === 'teacher' && 'Upload Paper'}
              {user?.role === 'authority' && 'Create Exam'}
              {user?.role === 'examCenter' && 'View Exams'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
