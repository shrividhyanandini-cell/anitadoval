import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ArrowRight, Search } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { useSettings } from '../../hooks/useSettings'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/connect', label: 'Connect' }
]

const Header = () => {
  const { openPopup } = usePopup()
  const { settings } = useSettings()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.classList.add('modal-open')
    else document.body.classList.remove('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [mobileOpen])

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-[var(--cream-50)]/95 backdrop-blur shadow-[var(--shadow-card)] border-b border-[var(--border-warm)]'
          : 'bg-[var(--cream-50)]'
          }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-[64px] md:h-[76px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Anita Doval — Home">
              {settings?.branding?.logoUrl ? (
                <img src={settings.branding.logoUrl} alt="Anita Doval" className="h-10 md:h-12 w-auto object-contain" />
              ) : (
                <>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--gold-400)] text-white font-serif text-lg leading-none pt-1"
                    aria-hidden="true"
                  >
                    A
                  </div>
                  <div className="leading-tight xl:w-[150px]">
                    <span className="block font-serif font-medium text-[22px] text-[var(--charcoal-900)] tracking-tight">
                      Anita Doval
                    </span>
                    <span className="hidden sm:block text-[8.5px] uppercase tracking-[0.15em] text-[var(--charcoal-500)] mt-[2px]">
                      Astrology • Vastu • Spiritual Guidance
                    </span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `font-sans text-[14px] font-medium transition-colors relative py-2 ${isActive ? 'text-[var(--gold-500)]' : 'text-[#282521] hover:text-[var(--gold-400)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--gold-400)] rounded-t-sm" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right CTA / Mobile Menu */}
            <div className="flex items-center gap-[18px]">

              <div className="relative hidden lg:flex items-center">
                {searchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs & more..."
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-[220px] h-[36px] px-3 bg-white border border-[var(--border-warm)] rounded-full text-[14px] outline-none shadow-sm focus:border-[var(--gold-400)] transition-all animate-fade-in"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        window.location.href = `/blog?search=${searchQuery}`
                      }
                    }}
                  />
                )}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Toggle Search"
                  className={`flex items-center justify-center transition-colors ${searchOpen ? 'text-[var(--gold-600)]' : 'text-[var(--charcoal-800)] hover:text-[var(--gold-500)]'}`}
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
              </div>

              <button
                onClick={() => openPopup()}
                className="btn btn-primary hidden md:inline-flex"
              >
                Book a Consultation
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>

              <button
                className="lg:hidden p-2 -mr-2 text-[var(--charcoal-700)]"
                onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--cream-50)] animate-fade-in pt-[64px]">
          <nav className="flex flex-col px-6 py-8 h-full bg-white border-t border-[var(--border-warm)]">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-4 border-b border-[var(--border-light)] text-[15px] font-medium transition-colors ${isActive ? 'text-[var(--gold-500)]' : 'text-[var(--charcoal-800)]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-8">
              <button
                onClick={() => { setMobileOpen(false); openPopup() }}
                className="btn btn-primary w-full h-[46px] text-[14px]"
              >
                Book a Consultation
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export default Header