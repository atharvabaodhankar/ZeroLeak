import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';
import { useAutoLogin } from './hooks/useAutoLogin';
import AutoLoginIndicator from './components/AutoLoginIndicator';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { AppShell } from './components/layout/AppShell';

// AppContent component that uses the auto-login hook
function AppContent() {
  // This hook will automatically login when MetaMask account changes
  const { isAutoLoggingIn } = useAutoLogin();

  return (
    <AppShell>
      <AutoLoginIndicator isAutoLoggingIn={isAutoLoggingIn} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/complete-profile"
          element={
            <PrivateRoute requireCompleteProfile={false}>
              <CompleteProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

function App() {
  return (
    <Router>
      <Web3Provider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Web3Provider>
    </Router>
  );
}

export default App;
