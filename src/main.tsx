import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// SHADCN INSTALL/DOCS
// https://ui.shadcn.com/docs/installation/vite

// SUPABASE INSTALL/DOCS
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
