import { createContext, ReactNode } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface PrivacyModeContextType {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

interface PrivacyModeProviderProps {
  children: ReactNode;
}

const PrivacyModeContext = createContext<PrivacyModeContextType | undefined>(
  undefined
);

function PrivacyModeProvider({ children }: PrivacyModeProviderProps) {
  const [isPrivacyMode, setIsPrivacyMode] = useLocalStorageState(
    false,
    'isPrivacyMode'
  );

  function togglePrivacyMode(): void {
    setIsPrivacyMode((prevMode: boolean) => !prevMode);
  }

  return (
    <PrivacyModeContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyModeContext.Provider>
  );
}

export { PrivacyModeProvider, PrivacyModeContext };
