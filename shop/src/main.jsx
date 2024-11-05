import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './modules/Header/Header'
import Main from './modules/Main/Main'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Main />
  </StrictMode>,
)
