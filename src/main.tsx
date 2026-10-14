import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/playfair-display/latin-500.css'
import '@fontsource/playfair-display/latin-400-italic.css'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
