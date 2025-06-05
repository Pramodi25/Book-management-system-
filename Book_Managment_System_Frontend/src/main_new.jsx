import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SimpleApp from './SimpleApp.jsx'
import { AppContextProvider } from './contexts/AppContext'

// Use SimpleApp for testing
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
      <SimpleApp />
    </AppContextProvider>
  </React.StrictMode>
)