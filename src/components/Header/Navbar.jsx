import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

const Navbar = () => {
  const location = useLocation()
  const { content } = useLanguage()

  const navItems = [
    { path: '/', label: content.home || 'Home' },
    { path: '/about', label: content.about || 'About Us' },
    { path: '/services', label: content.services || 'Services' },
    { path: '/blog', label: content.blog || 'Blog' },
    { path: '/connect', label: 'Connect' },
    { path: '/contact', label: content.contact || 'Contact Us' },
  ]

  return (
    <nav className="flex items-center space-x-7">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`font-medium text-[15px] transition-colors duration-200 ${location.pathname === item.path
              ? 'text-[var(--gold-600)] font-semibold'
              : 'text-[var(--charcoal-700)] hover:text-[var(--gold-600)]'
            }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export default Navbar