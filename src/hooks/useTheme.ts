import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dwo-theme-preference';
const INSTANCE_ID = `dwo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface ThemeState {
  darkMode: boolean;
  isLoading: boolean;
}

export function useTheme() {
  const [state, setState] = useState<ThemeState>({
    darkMode: true,
    isLoading: true
  });

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Get stored preference with instance-specific fallback
        const stored = localStorage.getItem(STORAGE_KEY);
        const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
        
        let shouldBeDark = true;
        
        if (stored !== null) {
          try {
            const parsed = JSON.parse(stored);
            shouldBeDark = typeof parsed === 'boolean' ? parsed : systemPrefersDark;
          } catch {
            shouldBeDark = systemPrefersDark;
          }
        } else {
          shouldBeDark = systemPrefersDark;
        }

        // Apply theme immediately to prevent flash
        document.documentElement.classList.toggle('dark', shouldBeDark);
        
        setState({
          darkMode: shouldBeDark,
          isLoading: false
        });
      } catch (error) {
        console.warn('Theme initialization failed:', error);
        // Fallback to dark mode
        document.documentElement.classList.add('dark');
        setState({
          darkMode: true,
          isLoading: false
        });
      }
    };

    initializeTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a manual preference
      const hasManualPreference = localStorage.getItem(STORAGE_KEY) !== null;
      if (!hasManualPreference) {
        setState(prev => ({ ...prev, darkMode: e.matches }));
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for storage changes from other tabs/instances
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setState(prev => ({ ...prev, darkMode: newValue }));
          document.documentElement.classList.toggle('dark', newValue);
        } catch (error) {
          console.warn('Failed to sync theme from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for page visibility changes to detect when returning from inactivity
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible again - sync theme state
        const currentClass = document.documentElement.classList.contains('dark');
        if (currentClass !== state.darkMode) {
          setState(prev => ({ ...prev, darkMode: currentClass }));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.darkMode]);

  const setDarkMode = useCallback((darkMode: boolean) => {
    try {
      // Update state
      setState(prev => ({ ...prev, darkMode }));
      
      // Apply to DOM immediately
      document.documentElement.classList.toggle('dark', darkMode);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(darkMode));
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!state.darkMode);
  }, [state.darkMode, setDarkMode]);

  return {
    darkMode: state.darkMode,
    isLoading: state.isLoading,
    setDarkMode,
    toggleDarkMode,
    instanceId: INSTANCE_ID
  };
}