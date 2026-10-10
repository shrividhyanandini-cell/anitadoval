import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon, Languages, X } from 'lucide-react'

const MobileNav = ({ onClose }) => {
  const location = useLocation()
  const { content, isHindi, toggleLanguage } = useLanguage()
  const { isDark, toggleTheme } = useTheme()

  const navItems = [
    { path: '/', label: content.home },
    { path: '/about', label: content.about },
    { path: '/services', label: content.services },
    { path: '/blog', label: content.blog },
    { path: '/contact', label: content.contact },
  ]

  return (
    <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Toggle Buttons */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Languages size={18} />
          <span className="font-medium">
            {isHindi ? 'English' : 'हिंदी'}
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} />}
          <span className="font-medium">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>

        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`block py-3 px-4 rounded-lg font-medium transition-colors duration-200 mb-2 ${
              location.pathname === item.path
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default MobileNav