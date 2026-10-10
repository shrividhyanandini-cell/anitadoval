import React, { useState, useEffect } from 'react'
import { usePopup } from '../../context/PopupContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useTheme } from '../../hooks/useTheme'
import AstroBackground from '../UI/AstroBackground'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground'

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'A SIMPLE AND SUPPORTIVE PROCESS',
    heading: 'Your Consultation Journey',
    buttonText: 'Start Your Consultation',
    background: {
        url: '',
        position: 'center',
        size: 'cover',
        repeat: 'no-repeat'
    },
    bgOverlay: 'Light',
    steps: [
        { id: '1', number: '01', title: 'Choose a Service', description: 'Select the consultation that best suits your needs.' },
        { id: '2', number: '02', title: 'Share Your Details', description: 'Provide the relevant information and preferred consultation method.' },
        { id: '3', number: '03', title: 'Consultation', description: 'Discuss your questions and circumstances with personalised guidance.' },
        { id: '4', number: '04', title: 'Guidance & Next Steps', description: 'Receive practical and meaningful insights for your journey ahead.' }
    ]
}

const ConsultationProcess = () => {
    const { openPopup } = usePopup()
    const { sectionStyle: globalStyle, textClass, overlayElement } = useTheme('process')
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const responsiveBgStyle = useResponsiveBackground(config.background)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'process_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...snap.data() })
                }
            } catch (err) {
                // Keep default
            }
        }
        fetchConfig()
    }, [])

    if (!config.sectionEnabled) return null

    const hasLocalBg = !!responsiveBgStyle.backgroundImage

    // Local image takes precedence, fallback to global style if local image not assigned
    const appliedStyle = hasLocalBg ? responsiveBgStyle : (Object.keys(globalStyle).length > 0 ? globalStyle : {})

    const overlayOpacity = config.bgOverlay === 'Strong' ? 0.6 : config.bgOverlay === 'Medium' ? 0.3 : 0;

    // Local overlay takes precedence
    const appliedOverlay = hasLocalBg && overlayOpacity > 0 ? (
        <div className="absolute inset-0 z-0 bg-[#FBF8F1] pointer-events-none" style={{ opacity: overlayOpacity }}></div>
    ) : overlayElement

    return (
        <section className={`section-pad relative border-y border-[var(--border-warm)] bg-white ${textClass}`} style={appliedStyle}>
            {appliedOverlay}

            {/* Background Animations */}
            <SectionMotionOverlay type="spiritual-glow" intensity={0.15} />
            <div className={`container max-w-[1080px] relative z-10`}>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-[64px] gap-6">
                    <div>
                        <p className={`eyebrow mb-[10px] uppercase font-semibold text-[14px] tracking-wider ${textClass.includes('white') ? 'text-gray-200' : 'text-[#A67828]'}`}>{config.eyebrow}</p>
                        <h2 className={`heading-lg font-serif ${textClass}`}>{config.heading}</h2>
                    </div>
                    <button onClick={() => openPopup()} className="btn btn-primary hidden md:inline-flex shrink-0">
                        {config.buttonText} &rarr;
                    </button>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[21px] left-[10%] right-[10%] h-[1px] bg-[#D8C6A5] z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {config.steps.map((step, idx) => (
                            <div key={idx} className="flex flex-row md:flex-col items-center md:text-center text-left">
                                {/* Number Circle */}
                                <div className="w-[44px] h-[44px] shrink-0 bg-[var(--cream-200)] border border-[var(--gold-400)] rounded-full flex items-center justify-center mb-0 md:mr-0 mr-5 md:mb-5 z-10 shadow-sm relative">
                                    <span className="text-[var(--gold-500)] text-[14px] font-semibold">{step.number}</span>
                                    {/* Connecting Line Vertical (Mobile) */}
                                    {idx < config.steps.length - 1 && (
                                        <div className="md:hidden absolute top-[44px] bottom-0 left-[21px] w-[1px] h-[calc(100%+32px)] bg-[#D8C6A5] -z-10" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`${hasLocalBg && !Object.keys(globalStyle).length ? 'bg-white/70 p-4 rounded-xl shadow-sm backdrop-blur-sm' : ''} w-full`}>
                                    <h3 className={`font-serif text-[17px] font-medium mb-[6px] ${textClass.includes('white') ? 'text-white' : 'text-[var(--charcoal-800)]'}`}>{step.title}</h3>
                                    <p className={`text-[14px] md:max-w-[180px] mx-auto leading-relaxed ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-600)]'}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-[48px] text-center md:hidden">
                    <button onClick={() => openPopup()} className="btn btn-primary w-full justify-center">
                        {config.buttonText} &rarr;
                    </button>
                </div>

            </div>
        </section>
    )
}

export default ConsultationProcess
