import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/UI/Loading'
import { useLanguage } from '../context/LanguageContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const { isHindi } = useLanguage()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loading 
          type="dots" 
          text={isHindi ? 'जाँच हो रही है...' : 'Verifying...'} 
        />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute