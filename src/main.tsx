import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import './styles/index.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ui/ErrorFallback.jsx';
import GlobalStyles from './styles/GlobalStyles.js';

const container = document.getElementById("root");

// Check if the container element was found
if (container) {
  const root = createRoot(container); // Now TypeScript knows 'container' is not null
  root.render(
    <>
    <GlobalStyles/>
    <StrictMode  >
      <ErrorBoundary  
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.replace('/')}
        >
        <App/>
      </ErrorBoundary>
    </StrictMode>
    </>
  );
} else {
  // Handle the case where the root element is not found (e.g., log an error)
  console.error("Root element with ID 'root' not found in the document.");
  // You might want to throw an error here as well, as the app cannot mount without it.
  // throw new Error("Root element not found");
}