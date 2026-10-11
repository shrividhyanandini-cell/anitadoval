import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { Languages, X } from 'lucide-react'

const MobileNav = ({ onClose }) => {
  const location = useLocation()
  const { content, isHindi, toggleLanguage } = useLanguage()

  const navItems = [
    { path: '/', label: content.home || 'Home' },
    { path: '/about', label: content.about || 'About Us' },
    { path: '/services', label: content.services || 'Services' },
    { path: '/blog', label: content.blog || 'Blog' },
    { path: '/connect', label: 'Connect' },
    { path: '/contact', label: content.contact || 'Contact Us' },
  ]

  return (
    <div className="md:hidden bg-white border-t border-[var(--border-warm)] shadow-lg">
      {/* Header controls (No Dark Mode) */}
      <div className="flex justify-between items-center p-4 border-b border-[var(--border-warm)] bg-[var(--cream-100)]">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-[var(--border-warm)] rounded-lg text-sm text-[var(--charcoal-800)] hover:bg-stone-50 transition-colors shadow-xs"
        >
          <Languages size={18} className="text-[var(--gold-600)]" />
          <span className="font-medium">
            {isHindi ? 'English' : 'हिंदी'}
          </span>
        </button>

        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="p-2 text-stone-600 hover:text-stone-900 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`block py-3 px-4 rounded-xl font-medium transition-colors text-[15px] ${location.pathname === item.path
                ? 'bg-[var(--gold-50)] text-[var(--gold-700)] font-semibold border border-[var(--gold-200)]'
                : 'text-stone-700 hover:bg-stone-50 hover:text-[var(--gold-600)]'
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