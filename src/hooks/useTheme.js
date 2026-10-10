import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { getSectionStyle, getTextThemeClass, renderOverlay, DEFAULT_STYLE_CONFIG } from '../utils/styleUtils'

export const useTheme = (sectionId) => {
    const [styleConfig, setStyleConfig] = useState(DEFAULT_STYLE_CONFIG)
    const [loading, setLoading] = useState(true)
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const docRef = doc(db, 'services', 'global_theme')
                const snap = await getDoc(docRef)

                if (snap.exists()) {
                    const fullTheme = snap.data()
                    if (fullTheme[sectionId]) {
                        setStyleConfig(fullTheme[sectionId])
                    }
                }
            } catch (err) {
                console.error(`Failed to load theme for ${sectionId}`, err)
            } finally {
                setLoading(false)
            }
        }

        fetchTheme()
    }, [sectionId])

    return {
        styleConfig,
        sectionStyle: getSectionStyle(styleConfig, windowWidth),
        textClass: getTextThemeClass(styleConfig),
        overlayElement: renderOverlay(styleConfig),
        loading
    }
}
