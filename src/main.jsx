import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
const params = new URLSearchParams(window.location.search)
const ref = params.get('ref')
if (ref) localStorage.setItem('ms_ref', ref)
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>)
