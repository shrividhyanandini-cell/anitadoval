import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import ProtectedRoute from '../../components/ProtectedRoute'
import AdminLogin from '../../components/Admin/AdminLogin'
import Dashboard from '../../components/Admin/Dashboard'
import Loading from '../../components/UI/Loading'

const AdminPage = () => {
 const { user, loading } = useAuth()

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
 <Loading type="dots" text="Loading..." />
 </div>
 )
 }

 if (!user) {
 return <AdminLogin />
 }

 return (
 <ProtectedRoute>
 <Dashboard />
 </ProtectedRoute>
 )
}

export default AdminPage