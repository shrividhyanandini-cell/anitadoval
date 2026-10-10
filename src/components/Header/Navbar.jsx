import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

const Navbar = () => {
  const location = useLocation()
  const { content } = useLanguage()

  const navItems = [
    { path: '/', label: content.home },
    { path: '/about', label: content.about },
    { path: '/services', label: content.services },
    { path: '/blog', label: content.blog },
    { path: '/contact', label: content.contact },
  ]

  return (
    <nav className="flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`font-medium transition-colors duration-200 ${
            location.pathname === item.path
              ? 'text-primary-600 dark:text-yellow-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-yellow-400'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export default Navbar