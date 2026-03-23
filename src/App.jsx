import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div className="p-8">Gym Management - Setup Complete</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
