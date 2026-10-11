import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'
import { Save, Loader, CheckCircle2, Sliders, AlertCircle } from 'lucide-react'

const PAGES = [
    { id: 'contact', name: 'Contact Page' },
    { id: 'connect', name: 'Connect Page' },
    { id: 'blog', name: 'Blog Page' },
    { id: 'services', name: 'Services Page' },
    { id: 'about', name: 'About Page' },
]

const PageHeadersManager = () => {
    const [activePage, setActivePage] = useState(PAGES[0].id)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [error, setError] = useState(null)

    const fetchConfig = async (pageId) => {
        setLoading(true)
        setError(null)
        try {
            const docRef = doc(db, 'page_headers', pageId)
            const snap = await getDoc(docRef)
            if (snap.exists()) {
                const data = snap.data()
                setConfig({
                    background: {
                        url: '',
                        tabletUrl: '',
                        mobileUrl: '',
                        overlayOpacity: 0.35,
                        enabled: true,
                        attachment: 'scroll',
                        size: 'cover',
                        position: 'center',
                        ...(data.background || {})
                    }
                })
            } else {
                // Default clean state
                setConfig({
                    background: {
                        url: '',
                        tabletUrl: '',
                        mobileUrl: '',
                        overlayOpacity: 0.35,
                        enabled: true,
                        attachment: 'scroll',
                        size: 'cover',
                        position: 'center'
                    }
                })
            }
        } catch (err) {
            console.error('Error fetching page header config:', err)
            setError('Failed to fetch breadcrumb configuration.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfig(activePage)
    }, [activePage])

    // Fixed handler: updates individual fields correctly without overwriting background object
    const handleBackgroundChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            background: {
                ...(prev?.background || {}),
                [field]: value,
                // If setting an image url, auto-enable
                ...(field.toLowerCase().includes('url') && value ? { enabled: true } : {})
            }
        }))
    }

    const handleSave = async () => {
        if (!config) return
        setSaving(true)
        setError(null)
        setSuccessMessage('')
        try {
            await setDoc(doc(db, 'page_headers', activePage), config, { merge: true })
            setSuccessMessage(`Breadcrumb background for ${PAGES.find(p => p.id === activePage)?.name} saved successfully!`)
            setTimeout(() => setSuccessMessage(''), 3500)
        } catch (err) {
            console.error('Error saving page header:', err)
            setError('Failed to save changes. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const currentBg = config?.background || {}

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Page Headers & Breadcrumb Backgrounds</h2>
                    <p className="text-gray-600 mt-1 text-sm">
                        Configure custom background images, Cloudinary assets, and parallax effects for top headers of inner pages.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                    <span>Save Changes</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-200">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 justify-between text-green-700 p-4 rounded-xl border border-green-200 shadow-sm flex items-center font-medium">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-600" />
                        {successMessage}
                    </div>
                </div>
            )}

            {/* Page Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl overflow-x-auto w-fit border border-gray-200">
                {PAGES.map(page => (
                    <button
                        key={page.id}
                        type="button"
                        onClick={() => setActivePage(page.id)}
                        className={`px-5 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${activePage === page.id
                                ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                            }`}
                    >
                        {page.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="p-16 flex justify-center"><Loader className="animate-spin text-gray-400" size={32} /></div>
            ) : config ? (
                <div className="space-y-6">
                    {/* Header Controls: Enable switch & Overlay Opacity */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={currentBg.enabled !== false}
                                onChange={(e) => handleBackgroundChange('enabled', e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-semibold text-gray-900 text-sm block">Enable Header Background Image</span>
                                <span className="text-xs text-gray-500">When enabled, the header displays your selected image with dark overlay for readability.</span>
                            </div>
                        </label>

                        <div className="flex items-center gap-4 bg-gray-50 p-2.5 px-4 rounded-xl border border-gray-200 w-full md:w-auto">
                            <Sliders size={16} className="text-gray-500" />
                            <div className="flex-1 min-w-[160px]">
                                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                                    <span>Dark Overlay:</span>
                                    <span>{Math.round((currentBg.overlayOpacity ?? 0.35) * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="0.9"
                                    step="0.05"
                                    value={currentBg.overlayOpacity ?? 0.35}
                                    onChange={(e) => handleBackgroundChange('overlayOpacity', parseFloat(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background Manager Component */}
                    <ResponsiveBackgroundManager
                        config={currentBg}
                        onChange={handleBackgroundChange}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default PageHeadersManager
