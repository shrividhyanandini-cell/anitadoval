import React, { useState, useEffect } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { motion, AnimatePresence } from 'framer-motion'

const Preloader = () => {
    const { settings, loading } = useSettings()
    const [show, setShow] = useState(true)

    useEffect(() => {
        // Hide preloader after settings load and a minimum time for smooth aesthetic
        if (!loading) {
            const timer = setTimeout(() => {
                setShow(false)
            }, 1200) // minimum display time
            return () => clearTimeout(timer)
        }
    }, [loading])

    // Respect admin choice to disable
    if (!loading && !settings.preloader?.enabled) {
        return null
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--cream-50)]"
                >
                    {/* Background Graphic if selected */}
                    {settings.preloader?.backgroundUrl && (
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply"
                            style={{ backgroundImage: `url(${settings.preloader.backgroundUrl})` }}
                        />
                    )}

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Astrological Mandala / Preloader Animation */}
                        <div className="w-24 h-24 mb-6 relative">
                            {settings.branding?.logoUrl ? (
                                <img src={settings.branding.logoUrl} alt="Logo" className="w-full h-full object-contain animate-pulse" />
                            ) : (
                                <>
                                    <div className="absolute inset-0 border-2 border-[var(--gold-300)] rounded-full animate-[spin_4s_linear_infinite]" border-style="dashed"></div>
                                    <div className="absolute inset-2 border border-[var(--gold-500)] rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-[var(--gold-400)] shadow-[0_0_20px_var(--gold-300)] animate-pulse"></div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Title text */}
                        {!settings.branding?.logoUrl && (
                            <h2 className="font-serif text-2xl tracking-widest text-[var(--charcoal-800)] uppercase mb-2">
                                Anita Doval
                            </h2>
                        )}
                        <p className="text-[var(--gold-600)] text-sm uppercase tracking-[0.3em] font-medium animate-pulse">
                            {settings.preloader?.message || "Awakening Energies..."}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Preloader
