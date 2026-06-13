import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react'

// Add dark mode class by default
document.documentElement.classList.add('dark');

// Setup auth token getter for custom-fetch
setAuthTokenGetter(() => {
  return localStorage.getItem('chemia_token');
});

// Setup base URL if needed based on environment
const baseUrl = import.meta.env.VITE_API_URL || null;
if (baseUrl) {
  setBaseUrl(baseUrl);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
