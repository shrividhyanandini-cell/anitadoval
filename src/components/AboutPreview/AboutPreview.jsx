import React, { useState, useEffect } from 'react'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground'

const LotusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c-2.4 0-4.8-.9-6.6-2.6A9.95 9.95 0 0 1 2 12c0-3.6 2.3-6.8 5.6-8.2 1.5-.6 3.1-.7 4.7-.3.9.2 1.8.6 2.6 1.1.8-.5 1.7-.9 2.6-1.1 1.6-.4 3.2-.3 4.7.3 3.3 1.4 5.6 4.6 5.6 8.2 0 2.6-.9 5-2.6 6.8C18.6 21 15.3 22 12 22Z" />
        <path d="M12 12a10 10 0 1 0 0 10 10 10 0 1 0 0-10Z" />
        <path d="M12 12v10" />
    </svg>
)

const PointIcon1 = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M7 14s2-2 5-2 5 2 5 2" />
        <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
)

const PointIcon2 = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const PointIcon3 = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
)

const DEFAULT_CONFIG = {
    eyebrow: 'ABOUT ANITA DOVAL',
    heading: 'Understanding the\nperson beyond the chart.',
    description: 'Anita Doval\'s journey has been shaped by years of study, practice and real-life experience. Her approach combines the wisdom of astrology and Vastu with a deep understanding of human nature and spiritual principles.',
    portrait: { url: '/images/post1.jpg', position: 'center center', alt: 'Anita Doval' },
    badge: {
        enabled: true,
        label: 'Years of',
        mainText: 'Guidance & Practice',
    },
    points: [
        { text: 'Holistic and practical approach', enabled: true },
        { text: 'Personalised consultations', enabled: true },
        { text: 'Guidance rooted in knowledge and experience', enabled: true }
    ],
    cta: {
        enabled: true,
        text: 'Book a Consultation',
        url: '/about'
    },
    quote: {
        enabled: true,
        text: 'Every chart tells\na story, but every\nperson\'s journey\nis unique.',
        decorationEnabled: true
    }
}

const QuoteDecoration = () => (
    <div className="flex items-center justify-center gap-3 mt-6 opacity-70">
        <div className="h-[1px] w-[30px] bg-[var(--gold-400)]"></div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold-400)">
            <path d="M12 2L2 12l10 10 10-10L12 2z" />
        </svg>
        <div className="h-[1px] w-[30px] bg-[var(--gold-400)]"></div>
    </div>
)

const AboutPreview = () => {
    const { openPopup } = usePopup()
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const responsiveBgStyle = useResponsiveBackground(config.background)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Fetch from about_section first, then fallback to legacy services/about_config
                let snap = await getDoc(doc(db, 'about_section', 'about_config'))
                if (!snap.exists()) {
                    snap = await getDoc(doc(db, 'about_section', 'profile'))
                }
                if (!snap.exists()) {
                    snap = await getDoc(doc(db, 'services', 'about_config'))
                }
                if (snap.exists()) {
                    setConfig(prev => ({ ...prev, ...snap.data() }))
                }
            } catch (err) {
                // Silently fallback to DEFAULT_CONFIG
            }
        }
        fetchConfig()
    }, [])

    const headingLines = config.heading?.split('\\n').map(l => l.trim()).filter(Boolean) || []
    if (headingLines.length === 0 && config.heading) {
        headingLines.push(...config.heading.split('\n'))
    }

    const quoteLines = config.quote?.text?.split('\\n').map(l => l.trim()).filter(Boolean) || []
    if (quoteLines.length === 0 && config.quote?.text) {
        quoteLines.push(...config.quote.text.split('\n'))
    }

    if (config.sectionEnabled === false) {
        return null
    }

    if (!config.heading && !config.description) {
        return null
    }

    const hasLocalBg = !!responsiveBgStyle.backgroundImage

    const sectionStyle = hasLocalBg ? responsiveBgStyle : {}

    return (
        <section
            className="relative py-[90px] md:py-[120px] lg:py-[150px] bg-[#FBF8F1] flex justify-center items-center overflow-hidden"
            style={sectionStyle}
        >

            {/* Optional Background Overlay for readability if BG exists */}
            {hasLocalBg && (
                <div className="absolute inset-0 bg-[rgba(245,239,228,0)] z-0 pointer-events-none"></div>
            )}

            <SectionMotionOverlay type="astrology-wheel" intensity={0.1} />


            <div className="relative z-10 container max-w-[1360px] px-[24px] md:px-[40px] lg:px-[56px] mx-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-[50px] lg:gap-[40px] xl:gap-[60px] items-center lg:items-stretch">

                    {/* LEFT COLUMN — IMAGE (Approx 5 cols ~ 41.6%) */}
                    <div className="w-full lg:col-span-5 relative flex-1 flex flex-col justify-center animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4.2/5] rounded-[16px] overflow-hidden shadow-[0_24px_60px_-15px_rgba(45,35,20,0.15)] group cursor-default border border-[#E7DCCB]/50">
                            <img
                                src={config.portrait?.url}
                                alt={config.portrait?.alt}
                                className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-[1.03]"
                                style={{ objectPosition: config.portrait?.position || 'center' }}
                                loading="lazy"
                            />
                            {/* BADGE */}
                            {config.badge?.enabled && (
                                <div className="absolute bottom-[20px] left-[20px] lg:bottom-[32px] lg:left-[-24px] bg-white/95 backdrop-blur-xl border border-white/40 shadow-[0_16px_40px_rgba(45,35,20,0.08)] px-[20px] py-[16px] rounded-[12px] flex items-center gap-[16px] max-w-[260px] z-20">
                                    <div className="text-[#A67828] bg-[#FBF8F1] w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-[#E7DCCB]/60 shadow-sm">
                                        <LotusIcon />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="font-sans text-[14px] md:text-[14px] text-[#8C8378] font-bold tracking-wider uppercase leading-none mb-[4px]">{config.badge?.label}</span>
                                        <span className="font-serif text-[16px] md:text-[18px] font-bold text-[#29251F] leading-[1.1]">{config.badge?.mainText}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CENTER COLUMN — CONTENT (Approx 5 cols ~ 41.6%) */}
                    <div className="w-full lg:col-span-5 flex flex-col justify-center animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                        <p className="font-sans text-[14px] md:text-[14px] font-semibold tracking-[0.2em] uppercase text-[#A67828] mb-[20px]">
                            {config.eyebrow}
                        </p>

                        <h2 className="font-serif font-medium text-[38px] md:text-[48px] lg:text-[56px] leading-[1.05] tracking-[-0.02em] text-[#25221E] mb-[24px] max-w-[540px]">
                            {headingLines.map((line, idx) => (
                                <React.Fragment key={idx}>
                                    {line}{idx !== headingLines.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </h2>

                        <p className="font-sans text-[15px] lg:text-[16px] leading-[1.75] text-[#554E46] mb-[32px] max-w-[500px]">
                            {config.description}
                        </p>

                        <div className="flex flex-col gap-[14px] md:gap-[16px] mb-[36px]">
                            {config.points?.[0]?.enabled && (
                                <div className="flex items-center gap-[14px]">
                                    <div className="w-[44px] h-[44px] shrink-0 rounded-full border border-[#E7DCCB] bg-[#FFFDF8] flex items-center justify-center text-[#A67828] shadow-[0_2px_8px_rgba(70,50,25,0.04)]">
                                        <PointIcon1 />
                                    </div>
                                    <span className="font-sans text-[14px] lg:text-[15px] font-medium text-[#403A33] leading-[1.4]">{config.points[0].text}</span>
                                </div>
                            )}
                            {config.points?.[1]?.enabled && (
                                <div className="flex items-center gap-[14px]">
                                    <div className="w-[44px] h-[44px] shrink-0 rounded-full border border-[#E7DCCB] bg-[#FFFDF8] flex items-center justify-center text-[#A67828] shadow-[0_2px_8px_rgba(70,50,25,0.04)]">
                                        <PointIcon2 />
                                    </div>
                                    <span className="font-sans text-[14px] lg:text-[15px] font-medium text-[#403A33] leading-[1.4]">{config.points[1].text}</span>
                                </div>
                            )}
                            {config.points?.[2]?.enabled && (
                                <div className="flex items-center gap-[14px]">
                                    <div className="w-[44px] h-[44px] shrink-0 rounded-full border border-[#E7DCCB] bg-[#FFFDF8] flex items-center justify-center text-[#A67828] shadow-[0_2px_8px_rgba(70,50,25,0.04)]">
                                        <PointIcon3 />
                                    </div>
                                    <span className="font-sans text-[14px] lg:text-[15px] font-medium text-[#403A33] leading-[1.4]">{config.points[2].text}</span>
                                </div>
                            )}
                        </div>

                        {config.cta?.enabled && (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => openPopup()}
                                    className="btn btn-primary"
                                >
                                    {config.cta?.text && config.cta.text !== 'Discover Her Journey' ? config.cta.text : 'Book a Consultation'}
                                    <ArrowRight size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN — QUOTE (Approx 2 cols ~ 16.6%) */}
                    {config.quote?.enabled && (
                        <div className="w-full lg:col-span-2 flex flex-col justify-start animate-fade-in relative lg:pl-[40px] mt-[40px] md:mt-0 pt-[40px] md:pt-0 border-t md:border-t-0 md:border-l border-[#E7DCCB]/60" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0 max-w-[320px] lg:max-w-full lg:mt-[20px]">
                                <span className="font-serif text-[100px] leading-[0.5] text-[#DBC6A3] opacity-[0.5] mb-[30px] self-center lg:self-start lg:-ml-2">
                                    “
                                </span>
                                <p className="font-serif italic text-[24px] md:text-[28px] font-medium leading-[1.3] text-[#74695D] max-w-[240px] mx-auto lg:mx-0">
                                    {quoteLines.map((line, idx) => (
                                        <React.Fragment key={idx}>
                                            {line}{idx !== quoteLines.length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                                {config.quote?.decorationEnabled && <QuoteDecoration />}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}

export default AboutPreview
