import React from 'react';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevMode } from '../hooks/useDevMode';

export function DevModeIndicator() {
  const { isHMRConnected, shouldShowReconnect, forceReconnect, isDev } = useDevMode();

  if (!isDev) return null;

  return (
    <AnimatePresence>
      {shouldShowReconnect && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Connection Issues Detected
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  The development server connection may be unstable. This can cause flashing or broken state.
                </p>
                <button
                  onClick={forceReconnect}
                  className="mt-3 flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reconnect
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* HMR Status Indicator (bottom right) */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${
          isHMRConnected 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          {isHMRConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>HMR {isHMRConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </AnimatePresence>
  );
}