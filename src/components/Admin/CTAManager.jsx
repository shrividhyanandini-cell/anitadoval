import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { CheckCircle2 } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'TAKE THE FIRST STEP TOWARDS CLARITY',
    heading: 'Begin Your Consultation',
    description: 'Connect for personalised guidance in astrology, Vastu and spiritual practices.',
    primaryCta: { enabled: true, text: 'Book a Consultation' },
    whatsappCta: { enabled: true, text: 'Connect on WhatsApp' },
    background: {
        url: '',
        tabletUrl: '',
        mobileUrl: '',
        bgSize: 'cover',
        bgRepeat: 'no-repeat',
        bgPosition: 'center',
        bgAttachment: 'scroll'
    }
}

const CTAManager = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const [statusMessage, setStatusMessage] = useState(null)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'cta_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...snap.data() })
                } else {
                    // Check fallback in global_theme if exists
                    let themeSnap = await getDoc(doc(db, 'settings', 'global_theme'))
                    if (!themeSnap.exists()) {
                        themeSnap = await getDoc(doc(db, 'services', 'global_theme'))
                    }
                    if (themeSnap.exists() && themeSnap.data()?.cta) {
                        const ctaTheme = themeSnap.data().cta
                        if (ctaTheme.bgImage?.url) {
                            setConfig(prev => ({
                                ...prev,
                                background: {
                                    ...prev.background,
                                    url: ctaTheme.bgImage.url,
                                    tabletUrl: ctaTheme.bgImage.tabletUrl || '',
                                    mobileUrl: ctaTheme.bgImage.mobileUrl || '',
                                    bgAttachment: ctaTheme.bgImage.attachment || 'scroll'
                                }
                            }))
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load CTA configuration", err)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [])

    const handleChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.')
            setConfig(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent] || {}),
                    [child]: value
                }
            }))
        } else {
            setConfig(prev => ({ ...prev, [field]: value }))
        }
    }

    const handleNestedChange = (parent, field, value) => {
        setConfig(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        setStatusMessage(null)
        try {
            // 1. Save directly to services/cta_config
            await setDoc(doc(db, 'services', 'cta_config'), config)

            // 2. Also sync background to settings/global_theme for seamless fallback
            try {
                let themeRef = doc(db, 'settings', 'global_theme')
                let themeSnap = await getDoc(themeRef)
                if (!themeSnap.exists()) {
                    themeRef = doc(db, 'services', 'global_theme')
                    themeSnap = await getDoc(themeRef)
                    // Move to clean settings/global_theme
                    themeRef = doc(db, 'settings', 'global_theme')
                }
                const currentTheme = themeSnap.exists() ? themeSnap.data() : {}
                const bg = config.background || {}
                const updatedTheme = {
                    ...currentTheme,
                    cta: {
                        ...(currentTheme.cta || {}),
                        bgType: bg.url ? 'image' : (currentTheme.cta?.bgType || 'color'),
                        bgImage: {
                            url: bg.url || '',
                            tabletUrl: bg.tabletUrl || '',
                            mobileUrl: bg.mobileUrl || '',
                            size: bg.bgSize || bg.size || 'cover',
                            position: bg.bgPosition || bg.position || 'center',
                            repeat: bg.bgRepeat || bg.repeat || 'no-repeat',
                            attachment: bg.bgAttachment || bg.attachment || 'scroll'
                        }
                    }
                }
                await setDoc(doc(db, 'settings', 'global_theme'), updatedTheme, { merge: true })
            } catch (syncErr) {
                console.warn('Sync to global_theme skipped:', syncErr)
            }

            setStatusMessage({ type: 'success', text: 'CTA section updated successfully!' })
            setTimeout(() => setStatusMessage(null), 3000)
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Failed to save changes.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-10 flex justify-center"><Loading type="spinner" /></div>

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Bottom CTA Content</h1>
                    <p className="text-gray-600 text-sm">Manage the text and content of the Call to Action banner shown across pages.</p>
                </div>
                <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-2 bg-white shadow-sm">
                    <span className="text-sm font-medium text-gray-700 ml-2">Show Section:</span>
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                        <input type="checkbox" checked={config.sectionEnabled} onChange={(e) => handleChange('sectionEnabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">Typography</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
                            <input type="text" value={config.eyebrow} onChange={(e) => handleChange('eyebrow', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 uppercase text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                            <input type="text" value={config.heading} onChange={(e) => handleChange('heading', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 font-serif" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={config.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">Action Buttons</h3>
                    <div className="space-y-6">
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl relative">
                            <div className="absolute top-4 right-4">
                                <input type="checkbox" checked={config.primaryCta.enabled} onChange={(e) => handleNestedChange('primaryCta', 'enabled', e.target.checked)} className="rounded" title="Enable Button" />
                            </div>
                            <h4 className="font-medium text-gray-800 mb-4">Primary Button (Pop-up)</h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                <input type="text" value={config.primaryCta.text} onChange={(e) => handleNestedChange('primaryCta', 'text', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl relative">
                            <div className="absolute top-4 right-4">
                                <input type="checkbox" checked={config.whatsappCta.enabled} onChange={(e) => handleNestedChange('whatsappCta', 'enabled', e.target.checked)} className="rounded" title="Enable Whatsapp" />
                            </div>
                            <h4 className="font-medium text-gray-800 mb-4">WhatsApp Button</h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                <input type="text" value={config.whatsappCta.text} onChange={(e) => handleNestedChange('whatsappCta', 'text', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <ResponsiveBackgroundManager
                    config={config.background}
                    onChange={(field, value) => handleChange(`background.${field}`, value)}
                />
            </div>

            <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-gray-200 p-4 px-8 z-40 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                    {statusMessage && statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {statusMessage?.text || 'Changes sync directly to Firestore.'}
                </span>
                <Button onClick={handleSave} disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white min-w-[120px]">
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    )
}

export default CTAManager
