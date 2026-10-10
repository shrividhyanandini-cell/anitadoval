import React, { useEffect, useRef, useState } from 'react';
import AstroBackground from '../UI/AstroBackground';
import SectionMotionOverlay from '../UI/SectionMotionOverlay';
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground';
import { Eye, Scale, Sparkles, HeartHandshake, Star, Moon } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const iconMap = { Eye, Scale, Sparkles, HeartHandshake, Star, Moon };

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'ASTROLOGY • SPIRITUALITY • KNOWLEDGE',
    headingLine1: 'Different Perspectives.',
    headingLine2: 'One ',
    headingHighlight: 'Deeper Understanding.',
    description: 'Our approach brings together the wisdom of astrology, the balance of Vastu, and the depth of spiritual practices to help you navigate life with greater clarity, confidence and purpose.',
    cards: [
        { id: '1', title: 'Insight', desc: 'Understanding life patterns', icon: 'Eye', enabled: true },
        { id: '2', title: 'Balance', desc: 'Harmony in personal and living spaces', icon: 'Scale', enabled: true },
        { id: '3', title: 'Clarity', desc: 'Practical and meaningful guidance', icon: 'Sparkles', enabled: true },
        { id: '4', title: 'Growth', desc: 'Support for your unique journey', icon: 'HeartHandshake', enabled: true }
    ],
    celestialGraphics: true
};

const Philosophy = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const sectionRef = useRef(null);
    const responsiveBgStyle = useResponsiveBackground(config.background)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'philosophy_config');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setConfig(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (err) {
                // Silently fallback to DEFAULT_CONFIG
            }
        };
        fetchConfig();
    }, []);

    useEffect(() => {
        if (config.sectionEnabled === false) return; // Don't observe if disabled

        const currentObserverRefTarget = sectionRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15 }
        );

        if (currentObserverRefTarget) {
            observer.observe(currentObserverRefTarget);
        }

        return () => {
            if (currentObserverRefTarget) observer.unobserve(currentObserverRefTarget);
        };
    }, [config.sectionEnabled]);

    if (config.sectionEnabled === false) return null;
    if (!config.headingLine1 && !config.headingLine2 && !config.description) return null;

    const hasLocalBg = !!responsiveBgStyle.backgroundImage

    const sectionBgStyle = hasLocalBg ? responsiveBgStyle : {
        backgroundColor: 'var(--section-bg)',
    };

    const styles = {
        '--section-bg': '#FBF8F1',
        '--section-card': '#FFFDF8',
        '--text-primary': '#25221E',
        '--text-secondary': '#625B52',
        '--text-muted': '#8C8378',
        '--gold': '#B78325',
        '--gold-dark': '#8C641C',
        '--gold-light': '#D7B878',
        '--border': '#E8DDCB',
        '--decorative': '#D9C39A',
    };

    return (
        <section
            ref={sectionRef}
            className={`relative w-full overflow-hidden flex flex-col items-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
                ...styles,
                ...sectionBgStyle,
                minHeight: '640px',
                paddingTop: '90px',
                paddingBottom: '80px',
            }}
        >
            {hasLocalBg && (
                <div className="absolute inset-0 bg-[rgba(251,248,241,0)] z-[0] pointer-events-none"></div>
            )}

            <style>{`
        .philosophy-card {
           background-color: var(--section-card);
           border: 1px solid var(--border);
           border-radius: 16px;
          box-shadow: 0 12px 30px rgba(70,50,25,0.03);
          transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .philosophy-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 50px rgba(70,50,25,0.08);
        }
        .philosophy-card:hover .icon-container {
          color: var(--gold-dark);
          border-color: var(--gold);
        }
        
        .orbit-circle {
          position: absolute;
          border: 1px solid var(--gold-light);
          border-radius: 50%;
          opacity: 0.12;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .anim-fade-up {
          opacity: 0;
          transform: translateY(15px);
          animation: fadeUpAnim 600ms ease forwards;
        }
        
        @keyframes fadeUpAnim {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
          
        @keyframes fadeInAnim {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up, .philosophy-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

            {/* Decorative Orbits */}
            {config.celestialGraphics && (
                <SectionMotionOverlay type="astrology-wheel" intensity={0.15} />
            )}

            {/* Radial Light behind heading */}
            <div className="absolute z-0 pointer-events-none" style={{
                top: '42%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '800px', height: '400px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(251,248,241,0) 65%)'
            }}></div>

            {/* Background Mountain Texture */}
            <div className="absolute bottom-0 left-0 w-full h-[200px] z-0 pointer-events-none overflow-hidden opacity-[0.14]" style={{ color: '#E7DCC9' }}>
                <svg preserveAspectRatio="none" viewBox="0 0 1440 320" style={{ width: '100%', height: '100%' }}>
                    <path fill="currentColor" d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,213.3C1120,203,1280,149,1360,122.7L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                    <path fill="currentColor" d="M0,128L60,112C120,96,240,64,360,74.7C480,85,600,139,720,165.3C840,192,960,192,1080,176C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" opacity="0.5"></path>
                </svg>
            </div>

            <div className="relative z-10 w-full max-w-[1360px] px-6 md:px-10 lg:px-14 mx-auto flex flex-col items-center">

                {/* Top Ornament */}
                <div className="flex items-center justify-center w-full mb-[40px] md:mb-[56px] opacity-0" style={{ animation: isVisible ? 'fadeInAnim 800ms ease forwards' : 'none' }}>
                    <div style={{ width: '100px', height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>
                    <div className="mx-6 text-[var(--gold)]" style={{ width: '40px', height: '40px' }}>
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 21.5c-3.14-3.5-4-9-4-9a4 4 0 0 1 8 0s-.86 5.5-4 9z" />
                            <path d="M12 21.5s-6.5-5-6.5-10.5a5 5 0 0 1 9.5 0" />
                            <path d="M12 21.5s6.5-5 6.5-10.5a5 5 0 0 0-9.5 0" />
                        </svg>
                    </div>
                    <div style={{ width: '100px', height: '1px', background: 'var(--gold)', opacity: 0.3 }}></div>
                </div>

                {/* Header Block */}
                <div className="text-center w-full max-w-[900px] flex flex-col items-center">
                    <div className={`mb-[20px] md:mb-[24px] uppercase font-sans font-bold text-[14px] md:text-[14px] tracking-[0.2em] text-[#A67828] ${isVisible ? 'anim-fade-up' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
                        {config.eyebrow}
                    </div>

                    <h2 className={`font-serif text-[38px] sm:text-[50px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] mb-[24px] max-w-[440px] md:max-w-full mx-auto ${isVisible ? 'anim-fade-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
                        {config.headingLine1}<br className="hidden md:block" />
                        {config.headingLine2} <span style={{ color: '#A67828', fontStyle: 'italic' }}>{config.headingHighlight}</span>
                    </h2>

                    <p className={`font-sans text-[15px] md:text-[16px] lg:text-[18px] leading-[1.75] text-[#554E46] max-w-[340px] md:max-w-[700px] mb-[20px] md:mb-[30px] ${isVisible ? 'anim-fade-up' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
                        {config.description}
                    </p>
                </div>

                {/* 4 Core Value Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full mx-auto">
                    {config.cards && config.cards.filter(card => card.enabled !== false).map((card, i) => {
                        const IconElement = iconMap[card.icon] || Eye;
                        const delayCount = 400 + (i * 80);
                        return (
                            <div key={card.id || i} className={`philosophy-card flex flex-col items-center text-center px-6 pt-[40px] pb-[60px] min-h-[220px] w-full mx-auto max-w-[340px] lg:max-w-none ${isVisible ? 'anim-fade-up' : 'opacity-0'}`} style={{ animationDelay: `${delayCount}ms` }}>

                                <div className="icon-container w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center mb-[24px] transition-colors duration-400" style={{ border: '1px solid #E7DCCB', backgroundColor: '#FFFDF8', color: '#A67828', boxShadow: '0 4px 12px rgba(70,50,25,0.03)' }}>
                                    <IconElement className="w-[26px] md:w-[30px] h-[26px] md:h-[30px]" strokeWidth={1.5} />
                                </div>

                                <h3 className="font-serif text-[26px] md:text-[28px] lg:text-[30px] font-medium text-[var(--text-primary)] mb-[12px] tracking-[-0.01em]">
                                    {card.title}
                                </h3>

                                <p className="font-sans text-[14px] md:text-[14px] lg:text-[15px] leading-[1.6] text-[#6E665D]">
                                    {card.desc}
                                </p>

                                {/* Card Bottom Ornament */}
                                <div className="absolute bottom-[28px] left-0 w-full flex items-center justify-center gap-[14px] opacity-[0.55]">
                                    <div style={{ width: '45px', height: '1px', background: '#A67828' }}></div>
                                    <div style={{ width: '6px', height: '6px', border: '1px solid #A67828', transform: 'rotate(45deg)' }}></div>
                                    <div style={{ width: '45px', height: '1px', background: '#A67828' }}></div>
                                </div>

                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    );
};

export default Philosophy;
