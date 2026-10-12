import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Stars, Leaf, ShieldCheck, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useTheme } from '../../hooks/useTheme'
import Loading from '../UI/Loading'
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
  heading: 'A Deeper Understanding of',
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
    title: 'Astrologer & Vastuvid'
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

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

  // 3-Banner Slider content
  const slides = [
    {
      id: 1,
      eyebrow: config.eyebrow || 'ASTROLOGY • VASTU • SPIRITUAL GUIDANCE',
      heading: config.heading?.replace('\\n', ' ') || 'A Deeper Understanding of',
      highlightedHeading: config.highlightedHeading || 'Life, Space & Possibility',
      description: config.description || 'Personalised consultations in Astrology, Vastu and spiritual practices to bring clarity, balance and direction to your life.',
      image: config.portrait?.url || '/images/post1.jpg',
      badgeName: config.profileCard?.name || 'Anita Doval',
      badgeTitle: config.profileCard?.title || 'Astrologer & Vastuvid',
      primaryText: config.primaryCta?.text || 'Book a Consultation',
      secondaryText: config.secondaryCta?.text || 'Explore Services',
      secondaryUrl: config.secondaryCta?.url || '/services'
    },
    {
      id: 2,
      eyebrow: 'SACRED HARMONY • ENERGY ALIGNMENT',
      heading: 'Transforming Spaces with',
      highlightedHeading: 'Vedic Vastu & Architectural Energy',
      description: 'Harmonizing residences and workspaces with natural elements and cosmic directions to elevate prosperity, wellness, and peace of mind.',
      image: '/images/post4.jpg',
      badgeName: 'Vedic Vastu Shastra',
      badgeTitle: 'Space & Energy Optimization',
      primaryText: 'Vastu Consultation',
      secondaryText: 'View Vastu Guide',
      secondaryUrl: '/brochure/vastu'
    },
    {
      id: 3,
      eyebrow: 'MIND, CONSCIOUSNESS & COSMOS',
      heading: 'Bridging the Wisdom of',
      highlightedHeading: 'Astrology, Spirituality & Science',
      description: 'A modern, grounded approach that connects ancient planetary principles with contemporary understanding and practical life decisions.',
      image: '/images/post3.jpg',
      badgeName: 'Holistic Synthesis',
      badgeTitle: 'Evidence & Spiritual Clarity',
      primaryText: 'Consult Anita Ma’am',
      secondaryText: 'Our Philosophy',
      secondaryUrl: '/about'
    }
  ]

  // Auto-play slider
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <section className="bg-[var(--cream-50)] pt-[100px] md:pt-[130px] min-h-[70vh] flex items-center justify-center">
        <Loading type="dots" />
      </section>
    )
  }

  if (config.sectionEnabled === false) {
    return null
  }

  const activeSlide = slides[currentSlide]
  const hasLocalBg = !!responsiveBgStyle.backgroundImage
  const appliedStyle = hasLocalBg ? responsiveBgStyle : (Object.keys(sectionStyle).length > 0 ? sectionStyle : {})
  const appliedOverlay = hasLocalBg ? null : overlayElement

  return (
    <section
      className={`bg-[var(--cream-50)] pt-[100px] md:pt-[140px] lg:pt-[160px] relative overflow-hidden flex flex-col ${textClass}`}
      style={appliedStyle}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {appliedOverlay}

      {/* Subtle radial lighting */}
      {!hasLocalBg && Object.keys(sectionStyle).length === 0 && (
        <div
          className="absolute w-[800px] h-[800px] -top-[200px] -right-[200px] bg-[var(--gold-400)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none z-0"
          aria-hidden="true"
        />
      )}

      <div className="container relative z-10 flex-1">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-14 lg:min-h-[540px] pb-12 items-center">

          {/* LEFT: Editorial Content Slider */}
          <div className="w-full lg:col-span-6 xl:col-span-6 pt-2 lg:pt-0 z-20 transition-all duration-700 ease-out">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--gold-50)] border border-[var(--gold-200)]/60 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-[var(--gold-500)] animate-pulse"></span>
              <p className="font-sans font-semibold text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[var(--gold-600)]">
                {activeSlide.eyebrow}
              </p>
            </div>

            <h1 className="font-serif text-[38px] sm:text-[48px] md:text-[58px] lg:text-[66px] leading-[1.08] tracking-[-0.02em] mb-6 text-[var(--charcoal-900)]">
              {activeSlide.heading}
              <span className="block italic font-medium text-[var(--gold-600)] mt-1">
                {activeSlide.highlightedHeading}
              </span>
            </h1>

            <p className="font-sans text-[15px] md:text-[16px] lg:text-[17px] leading-[1.7] mb-8 max-w-[500px] text-[var(--charcoal-600)]">
              {activeSlide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => openPopup()}
                className="btn btn-primary px-7 py-3 text-[14px] md:text-[15px] shadow-[0_8px_20px_rgba(166,120,40,0.22)] flex items-center gap-2 group"
              >
                <span>{activeSlide.primaryText}</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                to={activeSlide.secondaryUrl}
                className="btn btn-outline px-6 py-3 text-[14px] md:text-[15px] border-[#D4C8B8] text-[var(--charcoal-800)] hover:text-[var(--gold-600)] hover:border-[var(--gold-400)] transition-colors"
              >
                {activeSlide.secondaryText}
              </Link>
            </div>

            {/* Slider Controls / Indicators */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 transition-all duration-300 rounded-full ${currentSlide === idx ? 'w-8 bg-[var(--gold-500)]' : 'w-2 bg-[var(--charcoal-200)] hover:bg-[var(--charcoal-400)]'}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5 ml-4">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-8 h-8 rounded-full border border-[var(--border-warm)] bg-white/80 hover:bg-white hover:border-[var(--gold-400)] flex items-center justify-center text-[var(--charcoal-700)] transition-colors shadow-xs"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-8 h-8 rounded-full border border-[var(--border-warm)] bg-white/80 hover:bg-white hover:border-[var(--gold-400)] flex items-center justify-center text-[var(--charcoal-700)] transition-colors shadow-xs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Banner Image & Visual Frame */}
          {/* <div className="w-full lg:col-span-6 xl:col-span-6 relative mt-4 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-[480px] lg:max-w-[500px] aspect-[4/5] rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(45,35,20,0.14)] border border-[#E7DCCB]/70 bg-stone-100">
              <img
                src={activeSlide.image}
                alt={activeSlide.highlightedHeading}
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                loading="eager"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

             
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md border border-white/60 p-4 rounded-[14px] shadow-[0_12px_30px_rgba(45,35,20,0.12)] flex items-center gap-3.5 z-20">
                <div className="w-11 h-11 rounded-full bg-[var(--gold-50)] text-[var(--gold-600)] flex items-center justify-center shrink-0 border border-[var(--gold-200)] shadow-xs">
                  <ShieldCheck size={22} strokeWidth={1.6} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-bold text-[17px] leading-tight text-[var(--charcoal-900)] truncate">
                    {activeSlide.badgeName}
                  </p>
                  <p className="font-sans text-[12px] font-medium tracking-wide uppercase text-[var(--gold-600)] mt-0.5 truncate">
                    {activeSlide.badgeTitle}
                  </p>
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </div>

      {/* BOTTOM FEATURE STRIP */}
      {config.features && config.features.length > 0 && (
        <div className="border-t border-[var(--border-warm)] bg-white relative z-10 w-full mt-4">
          <div className="container mx-auto max-w-[1400px] px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-warm)]">
              {config.features.map((feature, idx) => {
                const IconComponent = iconMap[feature.icon] || Stars
                return (
                  <div key={idx} className="py-6 px-4 md:px-6 flex items-center gap-4 hover:bg-stone-50/60 transition-colors">
                    <div className="w-11 h-11 shrink-0 rounded-full border border-[var(--gold-300)] flex items-center justify-center text-[var(--gold-600)] bg-[var(--gold-50)]">
                      <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-[14px] text-[var(--charcoal-900)] mb-0.5">{feature.title}</h3>
                      <p className="font-sans text-[12px] text-[var(--charcoal-500)] leading-tight">{feature.description}</p>
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