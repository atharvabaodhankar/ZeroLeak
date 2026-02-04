import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { UserCircle, Shield, Building, Printer, CheckCircle2 } from 'lucide-react';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { completeProfile, loading } = useAuth();
  const { account } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    role: 'teacher',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    const result = await completeProfile(formData.name, formData.role);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to complete profile');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'teacher': return <UserCircle className="w-5 h-5 text-blue-400" />;
      case 'authority': return <Shield className="w-5 h-5 text-amber-400" />;
      case 'examCenter': return <Printer className="w-5 h-5 text-purple-400" />;
      default: return <UserCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/80">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl text-white">Identity Setup</CardTitle>
          <CardDescription>
            Complete your profile to access the secure system
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase">Linked Wallet</span>
            <span className="font-mono text-xs text-slate-300">
              {account?.slice(0, 10)}...{account?.slice(-8)}
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your official name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-300">
                System Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
                >
                  <option value="teacher">Teacher / Paper Setter</option>
                  <option value="authority">Exam Authority</option>
                  <option value="examCenter">Exam Center</option>
                </select>
              </div>
              
              <div className="mt-4 p-4 rounded-lg bg-slate-800/30 border border-slate-800">
                <div className="flex items-start gap-3">
                  {getRoleIcon(formData.role)}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1 capitalize">
                      {formData.role === 'examCenter' ? 'Exam Center' : formData.role}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {formData.role === 'teacher' && 'Access to paper upload, encryption tools, and secure submission channels.'}
                      {formData.role === 'authority' && 'Oversight capabilities, audit logs access, and exam scheduling rights.'}
                      {formData.role === 'examCenter' && 'Restricted access for secure paper decryption and printing during exam windows.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Registering...' : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Identity
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;
