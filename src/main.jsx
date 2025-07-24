import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/route'
import { AppProvider } from './components/fragments/app-provider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
    <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
)
