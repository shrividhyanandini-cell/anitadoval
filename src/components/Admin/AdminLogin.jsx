import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { Lock, Mail, Eye, EyeOff, Sun, Moon } from 'lucide-react'
import Button from '../../components/UI/Button'
import Loading from '../../components/UI/Loading'

const AdminLogin = () => {
    const { login, register } = useAuth()
    const { isHindi } = useLanguage()
    const { isDark, toggleTheme } = useTheme()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isRegisterMode, setIsRegisterMode] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = isRegisterMode
            ? await register(formData.email, formData.password)
            : await login(formData.email, formData.password)

        if (result.success) {
            // Redirect will be handled by ProtectedRoute
            console.log('Auth successful')
        } else {
            setError(result.error || (isHindi ? 'विफल' : 'Authentication failed'))
        }

        setLoading(false)
    }

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setError('') // Clear error when user starts typing
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gold-50 flex items-center justify-center p-4">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all"
                title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="max-w-md w-full">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {isHindi ? (isRegisterMode ? 'नया व्यवस्थापक' : 'व्यवस्थापक लॉगिन') : (isRegisterMode ? 'Register Admin' : 'Admin Login')}
                        </h1>
                        <p className="text-gray-600 ">
                            {isHindi
                                ? 'अनिता दोवल वेबसाइट प्रबंधन'
                                : 'Anita Doval Website Management'
                            }
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isHindi ? 'ईमेल' : 'Email'}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder={isHindi ? 'आपका ईमेल' : 'your@email.com'}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isHindi ? 'पासवर्ड' : 'Password'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder={isHindi ? 'आपका पासवर्ड' : 'Enter password'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full"
                            size="large"
                        >
                            {isHindi ? (isRegisterMode ? 'रजिस्टर करें' : 'लॉग इन') : (isRegisterMode ? 'Register Admin' : 'Login')}
                        </Button>
                    </form>

                    {/* Auth Toggle */}
                    <div className="mt-6 text-center text-sm">
                        <button
                            type="button"
                            onClick={() => setIsRegisterMode(!isRegisterMode)}
                            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                        >
                            {isRegisterMode ? 'Already have an account? Login here' : 'Need to set up the first admin? Register here'}
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 ">
                        {isHindi
                            ? 'केवल अधिकृत व्यवस्थापक'
                            : 'Authorized Administrators Only'
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin