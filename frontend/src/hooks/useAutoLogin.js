import { useEffect, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook that automatically logs in when MetaMask account changes
 */
export const useAutoLogin = () => {
  const { account, isConnected } = useWeb3();
  const { loginWithWallet, isAuthenticated, user } = useAuth();
  const previousAccount = useRef(null);
  const isLoggingIn = useRef(false);

  useEffect(() => {
    const handleAccountChange = async () => {
      // Skip if no account or already logging in
      if (!account || !isConnected || isLoggingIn.current) {
        return;
      }

      // Skip if this is the same account
      if (previousAccount.current === account) {
        return;
      }

      // Skip if user is already authenticated with this account
      if (isAuthenticated && user?.walletAddress === account) {
        previousAccount.current = account;
        return;
      }

      console.log('🔄 Account changed, auto-logging in with:', account);
      
      try {
        isLoggingIn.current = true;
        const result = await loginWithWallet(account);
        
        if (result.success) {
          console.log('✅ Auto-login successful');
          previousAccount.current = account;
        } else {
          console.error('❌ Auto-login failed:', result.error);
        }
      } catch (error) {
        console.error('❌ Auto-login error:', error);
      } finally {
        isLoggingIn.current = false;
      }
    };

    handleAccountChange();
  }, [account, isConnected, loginWithWallet, isAuthenticated, user]);

  // Update previous account when user manually logs out
  useEffect(() => {
    if (!isAuthenticated) {
      previousAccount.current = null;
    }
  }, [isAuthenticated]);

  return {
    isAutoLoggingIn: isLoggingIn.current
  };
};