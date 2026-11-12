import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './lib/auth.tsx'

// SHADCN INSTALL/DOCS
// https://ui.shadcn.com/docs/installation/vite

// SUPABASE INSTALL/DOCS
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
