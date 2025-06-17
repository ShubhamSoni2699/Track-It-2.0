import { createContext, useEffect, ReactNode, useContext } from 'react'; 
import { useLocalStorageState } from '../hooks/useLocalStorageState'; 

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface DarkModeProviderProps {
  children: ReactNode; 
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, 'isDarkMode');
  
  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    },
    [isDarkMode] 
  );

  
  function toggleDarkMode(): void {
    setIsDarkMode((prevMode: boolean) => !prevMode); 
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode(): DarkModeContextType {
  const context = useContext(DarkModeContext);

  if (context === undefined) {
    throw new Error('useDarkMode was used outside of DarkModeProvider');
  }

  return context; 
}

export { DarkModeProvider, useDarkMode };