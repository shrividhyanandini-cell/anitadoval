import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'
import { Save, Loader } from 'lucide-react'

const PAGES = [
    { id: 'contact', name: 'Contact Page' },
    { id: 'connect', name: 'Connect Page' },
    { id: 'blog', name: 'Blog Page' },
    { id: 'services', name: 'Services Page' },
]

const PageHeadersManager = () => {
    const [activePage, setActivePage] = useState(PAGES[0].id)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState(null)

    const fetchConfig = async (pageId) => {
        setLoading(true)
        try {
            const docRef = doc(db, 'page_headers', pageId)
            const snap = await getDoc(docRef)
            if (snap.exists()) {
                setConfig(snap.data())
            } else {
                // Default
                setConfig({
                    background: { url: '', tabletUrl: '', mobileUrl: '', overlayOpacity: 0.1, enabled: false }
                })
            }
        } catch (err) {
            console.error('Error fetching page header config:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfig(activePage)
    }, [activePage])

    const handleSave = async () => {
        if (!config) return
        setSaving(true)
        try {
            await setDoc(doc(db, 'page_headers', activePage), config)
            alert('Saved successfully!')
        } catch (err) {
            console.error('Error saving:', err)
            alert('Failed to save.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Page Headers / Breadcrumbs</h2>
                    <p className="text-gray-600 mt-1">Manage background images for inner pages across Desktop, Tablet and Mobile.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg overflow-x-auto w-fit">
                {PAGES.map(page => (
                    <button
                        key={page.id}
                        onClick={() => setActivePage(page.id)}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap ${activePage === page.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                    >
                        {page.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="p-12 flex justify-center"><Loader className="animate-spin text-gray-400" /></div>
            ) : config ? (
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <ResponsiveBackgroundManager
                        config={config.background}
                        onChange={(bgUpdate) => setConfig({ ...config, background: bgUpdate })}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default PageHeadersManager
