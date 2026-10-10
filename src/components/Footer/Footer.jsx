import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, MessageCircle, MapPin, Mail, Phone } from 'lucide-react'
import { SITE_CONFIG } from '../../data/siteConfig'
import { useTheme } from '../../hooks/useTheme'
import { useSettings } from '../../hooks/useSettings'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { sectionStyle, textClass, overlayElement } = useTheme('footer')
  const { settings } = useSettings()

  return (
    <footer className={`relative bg-[var(--cream-50)] border-t border-[var(--border-warm)]`} style={sectionStyle}>
      {overlayElement}
      <div className={`container max-w-[1240px] relative z-10 ${textClass}`}>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[40px] lg:gap-[32px] py-[64px] pb-[80px]">

          {/* Col 1: Brand (4 cols) */}
          <div className="lg:col-span-4 lg:pr-8">
            <Link to="/" className="flex items-center gap-3 mb-[24px]">
              {settings?.branding?.logoUrl ? (
                <img src={settings.branding.logoUrl} alt="Anita Doval" className="h-10 md:h-12 w-auto object-contain" />
              ) : (
                <>
                  <div aria-hidden="true" className={`w-[32px] h-[32px] rounded-full flex items-center justify-center bg-[var(--gold-400)] font-serif text-[15px] leading-none pt-0.5 ${textClass.includes('white') ? 'text-white' : 'text-white'}`}>
                    A
                  </div>
                  <div className="leading-tight">
                    <span className={`block font-serif font-medium text-[20px] tracking-tight ${textClass.includes('white') ? 'text-white' : 'text-[var(--charcoal-900)]'}`}>
                      Anita Doval
                    </span>
                    <span className={`block text-[8.5px] uppercase tracking-widest mt-[2px] ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-200)]'}`}>
                      Astrology • Vastu • Spiritual Guidance
                    </span>
                  </div>
                </>
              )}
            </Link>

            <p className={`text-[14px] leading-[1.65] mb-[28px] max-w-[280px] ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>
              Guidance for a more balanced, <br className="hidden lg:block" />purposeful and harmonious life.
            </p>

            <div className="flex items-center gap-[14px]">
              {settings.socialLinks && settings.socialLinks.length > 0 ? (
                settings.socialLinks.map((social, idx) => (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" title={social.platformName} className="w-[34px] h-[34px] rounded-full bg-[var(--cream-100)] flex items-center justify-center overflow-hidden hover:bg-[var(--gold-100)] transition-colors p-[8px]">
                    <img src={social.iconUrl} alt={social.platformName} className="w-full h-full object-contain mix-blend-multiply" />
                  </a>
                ))
              ) : (
                <>
                  {settings.social?.instagram && (
                    <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full bg-[var(--cream-100)] flex items-center justify-center text-[var(--charcoal-700)] hover:bg-[var(--gold-100)] transition-colors">
                      <Instagram size={15} strokeWidth={1.5} />
                    </a>
                  )}
                  {settings.social?.facebook && (
                    <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full bg-[var(--cream-100)] flex items-center justify-center text-[var(--charcoal-700)] hover:bg-[var(--gold-100)] transition-colors">
                      <Facebook size={15} strokeWidth={1.5} />
                    </a>
                  )}
                  {settings.social?.youtube && (
                    <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full bg-[var(--cream-100)] flex items-center justify-center text-[var(--charcoal-700)] hover:bg-[var(--gold-100)] transition-colors">
                      <Youtube size={15} strokeWidth={1.5} />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className={`font-sans text-[14px] font-bold uppercase tracking-[0.1em] mb-[20px] ${textClass.includes('white') ? 'text-gray-100' : 'text-[var(--charcoal-800)]'}`}>
              Quick Links
            </h4>
            <ul className="space-y-[12px]">
              <li><Link to="/" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Home</Link></li>
              <li><Link to="/about" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>About Us</Link></li>
              <li><Link to="/services" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Services</Link></li>
              <li><Link to="/blog" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Blog</Link></li>
              <li><Link to="/connect" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Connect</Link></li>
              <li><Link to="/contact" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className={`font-sans text-[14px] font-bold uppercase tracking-[0.1em] mb-[20px] ${textClass.includes('white') ? 'text-gray-100' : 'text-[var(--charcoal-800)]'}`}>
              Our Services
            </h4>
            <ul className="space-y-[12px]">
              <li><Link to="/services/astrology-consultation" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Astrology</Link></li>
              <li><Link to="/services/vastu-consultation" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Vastu Consultation</Link></li>
              <li><Link to="/services/prashna-kundli" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Prashna Kundli</Link></li>
              <li><Link to="/services/mantra-vidhan" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Mantra Vidhan</Link></li>
              <li><Link to="/services/meditation" className={`text-[14px] hover:text-[var(--gold-500)] transition-colors ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>Meditation</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className={`font-sans text-[14px] font-bold uppercase tracking-[0.1em] mb-[20px] ${textClass.includes('white') ? 'text-gray-100' : 'text-[var(--charcoal-800)]'}`}>
              Contact
            </h4>
            <ul className="space-y-[14px]">
              <li className={`flex gap-[12px] text-[14px] ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>
                <MapPin size={16} strokeWidth={1.5} className="text-[var(--gold-400)] shrink-0 mt-[2px]" />
                <span className="leading-relaxed">{settings.contact.address || 'Madhya Pradesh, India'}</span>
              </li>
              <li className={`flex gap-[12px] text-[14px] ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>
                <Mail size={16} strokeWidth={1.5} className="text-[var(--gold-400)] shrink-0 mt-[2px]" />
                <a href={`mailto:${settings.contact.email}`} className="hover:text-[var(--gold-500)] transition-colors">{settings.contact.email}</a>
              </li>
              {settings.contact.phone && (
                <li className={`flex gap-[12px] text-[14px] ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>
                  <Phone size={16} strokeWidth={1.5} className="text-[var(--gold-400)] shrink-0 mt-[2px]" />
                  <a href={`tel:${settings.contact.phone}`} className="hover:text-[var(--gold-500)] transition-colors">{settings.contact.phone}</a>
                </li>
              )}
              {settings.social.whatsapp && (
                <li className={`flex gap-[12px] text-[14px] pt-[4px] ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-500)]'}`}>
                  <MessageCircle size={16} strokeWidth={1.5} className="text-[#25D366] shrink-0 mt-[2px]" />
                  <a href={settings.social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors leading-relaxed">
                    Connect on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`border-t py-[20px] flex flex-col md:flex-row justify-between items-center gap-[12px] ${textClass.includes('white') ? 'border-white/10' : 'border-[var(--border-light)]'}`}>
          <p className={`text-[14px] ${textClass.includes('white') ? 'text-gray-400' : 'text-[var(--charcoal-400)]'}`}>
            &copy; {currentYear} {SITE_CONFIG.brand.name}. All rights reserved.
          </p>
          <div className="flex gap-[20px] text-[14px] text-[var(--charcoal-400)]">
            <Link to="/privacy-policy" className="hover:text-[var(--gold-500)] transition-colors shrink-0">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-[var(--gold-500)] transition-colors shrink-0">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer