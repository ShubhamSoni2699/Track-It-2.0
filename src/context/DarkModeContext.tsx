import { createContext, useContext, useEffect, ReactNode } from 'react'; // Import ReactNode
import { useLocalStorageState } from '../hooks/useLocalStorageState'; // Assuming this hook is also typed or will be

// 1. Define the interface for the value that the DarkModeContext will provide.
interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// 2. Define the interface for the props of the DarkModeProvider.
interface DarkModeProviderProps {
  children: ReactNode; // children can be any valid React node
}

// 3. Create the context with a default value that matches the DarkModeContextType.
// Providing a default value that aligns with the interface prevents TypeScript errors
// when the context is first created, even if it's an "empty" function for the toggle.
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

function DarkModeProvider({ children }: DarkModeProviderProps) {
  // Assuming useLocalStorageState is typed as:
  // function useLocalStorageState<T>(initialState: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>]
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, 'isDarkMode');

  // Effect to apply/remove dark-mode/light-mode classes to the document.documentElement
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
    [isDarkMode] // Dependency array: re-run effect when isDarkMode changes
  );

  // Function to toggle the dark mode state
  function toggleDarkMode(): void {
    setIsDarkMode((prevMode: boolean) => !prevMode); // Using functional update for safety
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode(): DarkModeContextType {
  const context = useContext(DarkModeContext);

  // Type guard: Check if the context is undefined, which means it's used outside the provider.
  if (context === undefined) {
    throw new Error('useDarkMode was used outside of DarkModeProvider');
  }

  return context; // TypeScript now knows 'context' is of type DarkModeContextType
}

// Export the provider and hook
// eslint-disable-next-line react-refresh/only-export-components
export { DarkModeProvider, useDarkMode };