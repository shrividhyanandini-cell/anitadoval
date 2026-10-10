import React, { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'HAVE QUESTIONS?',
    heading: 'Frequently \nAsked Questions',
    description: 'Find answers to common questions about our consultations, services and process.',
    buttonText: 'Contact Us',
    buttonUrl: '/contact',
    faqs: [
        { id: 'faq-1', question: 'What can I expect in a consultation?', answer: 'Our consultations provide deep insights into your current life path...' }
    ]
}

const FAQSection = () => {
    const [openId, setOpenId] = useState('faq-0')
    const { sectionStyle, textClass, overlayElement } = useTheme('faq')
    const [config, setConfig] = useState(DEFAULT_CONFIG)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'faq_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...snap.data() })
                }
            } catch (err) {
                // keep defaults
            }
        }
        fetchConfig()
    }, [])

    if (config.sectionEnabled === false) return null;

    const headingLines = config.heading?.split('\\n').map(l => l.trim()).filter(Boolean) || []

    return (
        <section className={`section-pad relative bg-[var(--cream-100)] border-y border-[var(--border-warm)] ${textClass}`} style={sectionStyle}>
            {overlayElement}
            <SectionMotionOverlay type="stars" intensity={0.15} />
            <div className={`container max-w-[1080px] relative z-10`}>

                <div className="grid md:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left: Content */}
                    <div className="md:col-span-5 md:pr-4">
                        <p className={`eyebrow mb-[14px] uppercase font-semibold text-[14px] tracking-wider ${textClass.includes('white') ? 'text-gray-200' : 'text-[#A67828]'}`}>{config.eyebrow}</p>
                        <h2 className={`heading-lg font-serif mb-[16px] max-w-[320px] ${textClass}`}>
                            {headingLines.map((line, i) => <React.Fragment key={i}>{line}{i < headingLines.length - 1 && <br className="hidden md:block" />}</React.Fragment>)}
                        </h2>
                        <p className={`body-md mb-[32px] max-w-[360px] ${textClass.includes('white') ? 'text-gray-100' : 'text-[var(--charcoal-600)]'}`}>
                            {config.description}
                        </p>
                        {config.buttonText && (
                            <Link to={config.buttonUrl || "/contact"} className={`btn hidden md:inline-flex font-sans text-[14px] ${textClass.includes('white') ? 'bg-transparent text-white border border-white hover:bg-white hover:text-black hover:border-black' : 'btn-outline'}`}>
                                {config.buttonText} &rarr;
                            </Link>
                        )}
                    </div>

                    {/* Right: Accordion */}
                    <div className="md:col-span-7">
                        <div className={`border-t ${textClass.includes('white') ? 'border-white/20' : 'border-[#DED3C4]'}`}>
                            {config.faqs.map((faq) => {
                                const isOpen = openId === faq.id
                                return (
                                    <div key={faq.id} className={`border-b ${textClass.includes('white') ? 'border-white/20' : 'border-[#DED3C4]'}`}>
                                        <button
                                            onClick={() => setOpenId(isOpen ? null : faq.id)}
                                            className="w-full flex items-center justify-between text-left min-h-[52px] py-[16px] group"
                                        >
                                            <span className={`font-medium text-[14px] md:text-[15px] pr-8 transition-colors flex-1 ${isOpen ? 'text-[var(--gold-500)]' : textClass.includes('white') ? 'text-gray-100 group-hover:text-white' : 'text-[var(--charcoal-800)] group-hover:text-[var(--gold-400)]'}`}>
                                                {faq.question}
                                            </span>
                                            <span className={`shrink-0 ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-300)]'}`}>
                                                {isOpen ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                                            </span>
                                        </button>

                                        <div
                                            className="overflow-hidden transition-all duration-300 ease-premium"
                                            style={{ maxHeight: isOpen ? '300px' : '0px', opacity: isOpen ? 1 : 0 }}
                                        >
                                            <p className={`text-[14px] pb-[20px] leading-relaxed ${textClass.includes('white') ? 'text-gray-300' : 'text-[var(--charcoal-600)]'}`}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default FAQSection
