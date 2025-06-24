import { useContext } from 'react';
import { PrivacyModeContext } from '../context/PrivacyModeContext';

export function usePrivacyMode() {
  const context = useContext(PrivacyModeContext);
  if (!context) {
    throw new Error('usePrivacyMode must be used within a PrivacyModeProvider');
  }
  return context;
}
