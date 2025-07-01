import { useEffect, useState } from 'react';

interface DevModeState {
  isHMRConnected: boolean;
  shouldShowReconnect: boolean;
  connectionIssues: number;
}

export function useDevMode() {
  const [state, setState] = useState<DevModeState>({
    isHMRConnected: true,
    shouldShowReconnect: false,
    connectionIssues: 0
  });

  useEffect(() => {
    if (import.meta.env.DEV) {
      let reconnectTimeout: NodeJS.Timeout;
      let checkInterval: NodeJS.Timeout;

      // Monitor HMR connection status
      const checkHMRConnection = () => {
        try {
          // Check if Vite's HMR client is available and connected
          const viteHMR = (window as any).__vite_plugin_react_preamble_installed__;
          const isConnected = viteHMR !== undefined;
          
          setState(prev => ({
            ...prev,
            isHMRConnected: isConnected,
            shouldShowReconnect: prev.connectionIssues > 2 && !isConnected
          }));

          if (!isConnected) {
            setState(prev => ({ ...prev, connectionIssues: prev.connectionIssues + 1 }));
          } else {
            setState(prev => ({ ...prev, connectionIssues: 0 }));
          }
        } catch (error) {
          console.warn('HMR connection check failed:', error);
        }
      };

      // Check connection every 5 seconds
      checkInterval = setInterval(checkHMRConnection, 5000);
      
      // Initial check
      checkHMRConnection();

      // Listen for page visibility changes
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          // Page became visible - check connection immediately
          setTimeout(checkHMRConnection, 1000);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Listen for beforeunload to detect tab switching
      const handleBeforeUnload = () => {
        clearInterval(checkInterval);
        clearTimeout(reconnectTimeout);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(reconnectTimeout);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  const forceReconnect = () => {
    if (import.meta.env.DEV) {
      console.log('Forcing HMR reconnection...');
      // Force a page reload to restore HMR connection
      window.location.reload();
    }
  };

  return {
    ...state,
    forceReconnect,
    isDev: import.meta.env.DEV
  };
}