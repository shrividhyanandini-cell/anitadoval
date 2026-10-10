import React, { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { SITE_CONFIG } from '../../data/siteConfig'
import { usePopup } from '../../context/PopupContext'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'TAKE THE FIRST STEP TOWARDS CLARITY',
    heading: 'Begin Your Consultation',
    description: 'Connect for personalised guidance in astrology, Vastu and spiritual practices.',
    primaryCta: { enabled: true, text: 'Book a Consultation' },
    whatsappCta: { enabled: true, text: 'Connect on WhatsApp' }
}

const CTASection = () => {
    const { openPopup } = usePopup()
    const { sectionStyle, textClass, overlayElement } = useTheme('cta')
    const [config, setConfig] = useState(DEFAULT_CONFIG)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'cta_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...snap.data() })
                }
            } catch (err) { }
        }
        fetchConfig()
    }, [])

    if (config.sectionEnabled === false) return null;

    return (
        <section className={`relative overflow-hidden min-h-[300px] md:min-h-[320px] flex items-center justify-center p-8 ${textClass}`} style={sectionStyle}>
            {overlayElement && overlayElement}
            <SectionMotionOverlay type="spiritual-glow" intensity={0.1} />
            {!sectionStyle.backgroundImage && !overlayElement && (
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(rgba(35,24,14,0.65), rgba(35,24,14,0.85))'
                    }}
                ></div>
            )}

            <div className={`container relative z-10 text-center max-w-[700px]`}>
                <p className={`eyebrow mb-[14px] tracking-[0.2em] uppercase text-[14px] font-semibold ${textClass.includes('white') ? 'text-[rgba(255,248,236,0.8)]' : 'text-[#A67828]'}`}>{config.eyebrow}</p>
                <h2 className={`heading-xl font-serif mb-[16px]`}>
                    {config.heading}
                </h2>
                <p className={`body-md mb-[32px] max-w-[480px] mx-auto ${textClass.includes('white') ? 'text-[#FFF8EC]/80' : 'text-gray-600'}`}>
                    {config.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px]">
                    {config.primaryCta.enabled && (
                        <button onClick={() => openPopup()} className="btn btn-primary w-full sm:w-auto min-w-[200px]">
                            {config.primaryCta.text} <ArrowRight size={16} strokeWidth={2.5} />
                        </button>
                    )}

                    {config.whatsappCta.enabled && (
                        <a
                            href={SITE_CONFIG.social.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center gap-2 font-sans font-semibold text-[14px] border h-[46px] px-[22px] rounded-[5px] transition-colors w-full sm:w-auto ${textClass.includes('white') ? 'text-white border-[rgba(255,255,255,0.3)] hover:border-white' : 'text-gray-700 border-gray-300 hover:border-gray-500'}`}
                        >
                            <MessageCircle size={16} strokeWidth={2} className="text-[#25D366]" />
                            {config.whatsappCta.text}
                        </a>
                    )}
                </div>
            </div>
        </section>
    )
}

export default CTASection
