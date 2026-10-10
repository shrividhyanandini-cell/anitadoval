import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Stars, Leaf, ShieldCheck, Star } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useTheme } from '../../hooks/useTheme'
import Loading from '../UI/Loading'
import AstroBackground from '../UI/AstroBackground'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground'

const iconMap = {
  Stars: Stars,
  Compass: Compass,
  Leaf: Leaf,
  ShieldCheck: ShieldCheck,
  Star: Star
}

const DEFAULT_CONFIG = {
  eyebrow: 'ASTROLOGY • VASTU • SPIRITUAL GUIDANCE',
  heading: 'A Deeper \nUnderstanding of',
  highlightedHeading: 'Life, Space & Possibility',
  description: 'Personalised consultations in Astrology, Vastu and spiritual practices to bring clarity, balance and direction to your life.',
  primaryCta: { enabled: true, text: 'Book a Consultation' },
  secondaryCta: { enabled: true, text: 'Explore Services', url: '/services' },
  portrait: { url: '/images/post1.jpg', position: 'center' },
  background: { url: '' },
  celestialDecoration: true,
  profileCard: {
    enabled: true,
    name: 'Anita Doval',
    title: 'Spiritual Guide'
  },
  features: [
    { title: 'Astrology', description: 'Life Patterns & Guidance', icon: 'Stars' },
    { title: 'Vastu', description: 'Harmonious Spaces', icon: 'Compass' },
    { title: 'Spiritual Practices', description: 'Inner Balance', icon: 'Leaf' },
    { title: 'Personalised Approach', description: 'Guidance for Your Journey', icon: 'ShieldCheck' }
  ]
}

const Hero = () => {
  const { openPopup } = usePopup()
  const { sectionStyle, textClass, overlayElement } = useTheme('hero')
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  const responsiveBgStyle = useResponsiveBackground(config.background)

  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const docRef = doc(db, 'services', 'hero_config')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() })
        }
      } catch (err) {
        console.error('Failed to load dynamic hero config:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHeroConfig()
  }, [])

  if (loading) {
    return (
      <section className="bg-[var(--cream-50)] pt-[100px] md:pt-[130px] min-h-[70vh] flex items-center justify-center">
        <Loading type="dots" />
      </section>
    )
  }

  if (config.sectionEnabled === false) {
    return null;
  }
  if (!config.heading && !config.description) {
    return null;
  }

  // Pre-process headings for exact rendering
  const headingLines = config.heading?.split('\\n').map(l => l.trim()).filter(Boolean) || []

  const hasLocalBg = !!responsiveBgStyle.backgroundImage

  // Local image takes precedence, fallback to global style if local image not assigned
  const appliedStyle = hasLocalBg ? responsiveBgStyle : (Object.keys(sectionStyle).length > 0 ? sectionStyle : {})

  const appliedOverlay = hasLocalBg ? null : overlayElement

  return (
    <section
      className={`bg-[var(--cream-50)] pt-[110px] md:pt-[150px] lg:pt-[180px] relative overflow-hidden flex flex-col ${textClass}`}
      style={appliedStyle}
    >
      {appliedOverlay}

      {/* Extremely subtle radial lighting */}
      {!hasLocalBg && Object.keys(sectionStyle).length === 0 && (
        <div
          className="absolute w-[800px] h-[800px] -top-[200px] -right-[200px] bg-[var(--gold-400)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none z-0"
          aria-hidden="true"
        />
      )}

      {/* Dynamic Astro Image Background Animations */}
      {/* {config.celestialDecoration && (
        <SectionMotionOverlay type="hero-cosmic" intensity={0.4} />
      )} */}

      <div className="container relative z-10 flex-1">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 lg:min-h-[580px] pb-16 items-center">

          {/* LEFT: 48% Editorial Content (approx col-span-5 or 6 depending on grid) */}
          <div className="w-full lg:col-span-6 xl:col-span-6 animate-fade-up pt-4 lg:pt-0 pb-8 lg:pb-0 z-20">
            <p className={`font-sans font-semibold text-[14px] md:text-[14px] uppercase tracking-[0.2em] mb-[20px] ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--gold-500)]'}`}>
              {config.eyebrow}
            </p>
            <h1 className={`font-serif text-[42px] sm:text-[54px] md:text-[64px] lg:text-[76px] leading-[1.05] tracking-[-0.02em] mb-[28px] lg:-mr-12 relative ${textClass.includes('white') ? 'text-white' : 'text-[var(--charcoal-900)]'}`}>
              {headingLines.map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))}
              <span className={`block italic mt-1 font-medium ${textClass.includes('white') ? 'text-gray-200' : 'text-[#a67828]'}`}>{config.highlightedHeading}</span>
            </h1>
            <p className={`font-sans text-[15px] md:text-[17px] lg:text-[18px] leading-[1.75] mb-[40px] max-w-[480px] ${textClass.includes('white') ? 'text-gray-200' : 'text-[var(--charcoal-600)]'}`}>
              {config.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {config.primaryCta.enabled && (
                <button onClick={() => openPopup()} className="btn btn-primary shadow-[0_8px_20px_rgba(166,120,40,0.2)]">
                  {config.primaryCta.text} <ArrowRight size={18} strokeWidth={2} />
                </button>
              )}
              {config.secondaryCta.enabled && (
                <Link to={config.secondaryCta.url} className={`btn btn-outline ${textClass.includes('white') ? 'border-gray-500 text-gray-200 hover:text-white bg-black/20 hover:bg-black/40' : 'bg-transparent border-gray-300 text-[var(--charcoal-800)] hover:text-[var(--gold-500)]'}`}>
                  {config.secondaryCta.text}
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT: 52% Editorial Image */}
          <div className="w-full lg:col-span-6 xl:col-span-6 relative animate-fade-in mt-6 lg:mt-0" style={{ animationDelay: '0.2s' }}>
            {/* <div className="relative w-full mx-auto lg:max-w-[540px] aspect-[4/5] lg:aspect-[3.8/5] rounded-[16px] lg:rounded-[16px] overflow-hidden shadow-[0_24px_60px_-15px_rgba(45,35,20,0.15)] border border-[#E7DCCB]/50">
              <img
                src={config.portrait.url || "/images/post1.jpg"}
                alt={config.portrait.alt || "Anita Doval"}
                className="w-full h-full object-cover scale-[1.01]"
                style={{ objectPosition: config.portrait.position || 'center center' }}
                loading="eager"
                fetchPriority="high"
              />
            </div> */}

            {/* Identity Badge */}
            {/* {config.profileCard.enabled && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 sm:bottom-10 sm:left-[-30px] sm:translate-x-0 w-[260px] bg-white/90 backdrop-blur-xl border border-white/40 p-[18px] md:p-[20px] rounded-[12px] shadow-[0_16px_40px_rgba(45,35,20,0.08)] flex items-center gap-[16px] z-20">
                <div className="w-11 h-11 rounded-full bg-[var(--gold-50)] text-[var(--gold-500)] flex items-center justify-center shrink-0 border border-[var(--gold-200)] shadow-sm">
                  <ShieldCheck size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-serif font-bold text-[19px] leading-tight text-[var(--charcoal-900)] mb-1">{config.profileCard.name}</p>
                  <p className="font-sans text-[14px] font-medium tracking-wide uppercase text-[var(--charcoal-500)] leading-tight">{config.profileCard.title}</p>
                </div>
              </div>
            )} */}
          </div>

        </div>
      </div>

      {/* BOTTOM FEATURE STRIP */}
      {config.features && config.features.length > 0 && (
        <div className="border-[var(--border-warm)] bg-white relative z-10 w-full mt-10 md:mt-0">
          <div className="container mx-auto max-w-[1400px] px-0 md:px-6">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(config.features.length, 4)} divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-warm)] md:border-x border-t border-[var(--border-warm)]`}>

              {config.features.map((feature, idx) => {
                const IconComponent = iconMap[feature.icon] || Stars

                return (
                  <div key={idx} className="p-[28px] md:p-[32px] lg:px-[40px] lg:py-[36px] flex flex-row items-center gap-[20px] hover:bg-gray-50/50 transition-colors">
                    <div className="w-[52px] h-[52px] shrink-0 rounded-full border border-[var(--gold-300)] flex items-center justify-center text-[var(--gold-500)] bg-[var(--gold-50)]">
                      <IconComponent className="w-[24px] h-[24px]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-[15px] lg:text-[16px] text-[var(--charcoal-900)] mb-[4px]">{feature.title}</h3>
                      <p className="font-sans text-[14px] lg:text-[14px] text-[var(--charcoal-500)] leading-[1.4]">{feature.description}</p>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Hero