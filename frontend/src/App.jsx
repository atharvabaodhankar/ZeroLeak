import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';
import { useAutoLogin } from './hooks/useAutoLogin';
import AutoLoginIndicator from './components/AutoLoginIndicator';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// AppContent component that uses the auto-login hook
function AppContent() {
  // This hook will automatically login when MetaMask account changes
  const { isAutoLoggingIn } = useAutoLogin();

  return (
    <>
      <AutoLoginIndicator isAutoLoggingIn={isAutoLoggingIn} />
      <Routes>
        {/* Public Routes */}
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

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
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
