import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Dashboard from './dashboard/Dashboard.tsx'

// '#/dashboard' opens the SSI operating-system cockpit; everything else stays
// on the public landing page.
const isDashboard = window.location.hash.startsWith('#/dashboard')

window.addEventListener('hashchange', () => window.location.reload())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDashboard ? <Dashboard /> : <App />}
  </StrictMode>,
)
