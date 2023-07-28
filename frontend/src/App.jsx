import { useEffect } from "react"

import { Router } from "./routes/router"
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./context/authContext"

function App() {

  useEffect(() => {
    
  }, [])

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
