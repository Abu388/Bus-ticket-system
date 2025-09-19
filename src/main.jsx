// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BookingProvider } from "./BookingContext";
import './index.css'
import { HashRouter } from "react-router-dom";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BookingProvider>
    <BrowserRouter>
    <HashRouter>
      <App />
      </HashRouter>
    </BrowserRouter>
    </BookingProvider>
  
)
