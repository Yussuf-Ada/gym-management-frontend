import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Dumbbell, ArrowLeft } from 'lucide-react'
import api from '../services/api'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const navigate = useNavigate()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link')
      setTokenValid(false)
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await api.post('/auth/password-reset/confirm/', {
        token: token,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      })
      
      if (response.status === 200) {
        setMessage('Password reset successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(response.data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="text-indigo-600 hover:underline">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center justify-center gap-2 flex-1">
            <Dumbbell className="h-10 w-10 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">GymManager</h1>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-6">Reset your password</h2>
        
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter new password"
              required
              minLength={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm new password"
              required
              minLength={8}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
