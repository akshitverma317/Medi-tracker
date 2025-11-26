import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeStoragePolyfill } from './utils/storagePolyfill.js'

// Initialize window.storage API
initializeStoragePolyfill()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
