import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { db } from './utils/firebase'
import { clearIndexedDbPersistence } from 'firebase/firestore'

async function init() {
  try { // Force clear corrupt cache to resolve Firestore internal assertion ID: ca9/b815
    await clearIndexedDbPersistence(db)
    console.log("Firestore cache cleared successfully.")
  } catch (err) {
    console.warn("Could not clear firestore cache:", err)
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  )
}

init()