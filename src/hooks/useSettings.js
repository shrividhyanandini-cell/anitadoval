import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { SITE_CONFIG } from '../data/siteConfig'

export const useSettings = () => {
    const [settings, setSettings] = useState({
        contact: SITE_CONFIG.contact,
        social: SITE_CONFIG.social, // legacy
        socialLinks: [], // dynamic social links
        branding: { logoUrl: '', faviconUrl: '' },
        preloader: { backgroundUrl: '', enabled: true }
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch contact_config (legacy) and global_config
                const globalRef = doc(db, 'settings', 'global_config')
                const contactRef = doc(db, 'settings', 'contact_config')

                const [globalSnap, contactSnap] = await Promise.all([
                    getDoc(globalRef),
                    getDoc(contactRef)
                ])

                let mergedData = {
                    contact: SITE_CONFIG.contact,
                    social: SITE_CONFIG.social,
                    socialLinks: [],
                    branding: { logoUrl: '', faviconUrl: '' },
                    preloader: { backgroundUrl: '', enabled: true }
                }

                if (contactSnap.exists()) {
                    const cData = contactSnap.data()
                    if (cData.contact) mergedData.contact = { ...mergedData.contact, ...cData.contact }
                    if (cData.social) mergedData.social = { ...mergedData.social, ...cData.social }
                }

                if (globalSnap.exists()) {
                    const gData = globalSnap.data()
                    if (gData.contact) mergedData.contact = { ...mergedData.contact, ...gData.contact }
                    if (gData.social) mergedData.social = { ...mergedData.social, ...gData.social }
                    if (gData.socialLinks) mergedData.socialLinks = gData.socialLinks
                    if (gData.branding) mergedData.branding = { ...mergedData.branding, ...gData.branding }
                    if (gData.preloader) mergedData.preloader = { ...mergedData.preloader, ...gData.preloader }
                }

                setSettings(mergedData)

                // Update Favicon natively
                if (mergedData.branding?.faviconUrl) {
                    let link = document.querySelector("link[rel~='icon']")
                    if (!link) {
                        link = document.createElement('link')
                        link.rel = 'icon'
                        document.head.appendChild(link)
                    }
                    link.href = mergedData.branding.faviconUrl
                }

            } catch (err) {
                console.error("Error fetching settings:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    return { settings, loading }
}
