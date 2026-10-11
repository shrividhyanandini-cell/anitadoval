import React, { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground'

const PageHeader = ({
    pageId, // for fetching dynamic background: 'contact', 'services', 'blog', 'about', 'connect' etc.
    eyebrow = '',
    title = '',
    description = ''
}) => {
    const [config, setConfig] = useState({
        background: {
            url: '',
            tabletUrl: '',
            mobileUrl: '',
            overlayOpacity: 0.35,
            enabled: true,
            attachment: 'scroll'
        }
    })

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'page_headers', pageId)
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setConfig(snap.data())
                }
            } catch (err) {
                console.error(`Error fetching page header config for ${pageId}:`, err)
            }
        }
        if (pageId) fetchConfig()
    }, [pageId])

    const responsiveBgStyle = useResponsiveBackground(config?.background)
    const hasBg = Boolean(responsiveBgStyle?.backgroundImage) && (config?.background?.enabled !== false)

    return (
        <section
            className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#1B1814] overflow-hidden"
            style={hasBg ? responsiveBgStyle : {}}
        >
            {/* Background Graphic Fallbacks */}
            {!hasBg && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--gold-900)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--gold-900)] rounded-full mix-blend-screen filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute inset-0 bg-transparent opacity-[0.03] mix-blend-overlay"></div>
                </div>
            )}

            {/* Dark overlay for contrast */}
            {hasBg && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none bg-black"
                    style={{ opacity: config.background?.overlayOpacity ?? 0.35 }}
                />
            )}

            <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
                {eyebrow && <p className="uppercase tracking-[0.2em] text-[14px] font-bold text-[var(--gold-400)] mb-6 animate-fade-in">{eyebrow}</p>}
                {title && (
                    <h1 className="font-serif text-[2.5rem] md:text-[4rem] text-white leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        {title}
                    </h1>
                )}
                {description && (
                    <p className="text-lg md:text-xl text-[var(--charcoal-300)] max-w-2xl mx-auto font-light leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {description}
                    </p>
                )}
            </div>
        </section>
    )
}

export default PageHeader
