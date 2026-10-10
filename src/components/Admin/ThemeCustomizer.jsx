import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Button from '../UI/Button'
import Loading from '../UI/Loading'
import SectionStyleEditor from './SectionStyleEditor'
import { DEFAULT_STYLE_CONFIG } from '../../utils/styleUtils'

const SECTIONS = [
    { id: 'hero', name: 'Header / Hero Banner' },
    { id: 'about', name: 'About Anita Doval' },
    { id: 'philosophy', name: '"Understanding the person" (Philosophy)' },
    { id: 'brochures', name: 'Digital Brochures (Guides)' },
    { id: 'process', name: 'Consultation Process (Journey)' },
    { id: 'services', name: 'Services Grid' },
    { id: 'articles', name: 'Articles & Insights' },
    { id: 'faq', name: 'Frequently Asked Questions (FAQ)' },
    { id: 'cta', name: 'Begin Consultation (Bottom CTA)' },
    { id: 'footer', name: 'Website Footer' }
]

const ThemeCustomizer = () => {
    const [themeConfig, setThemeConfig] = useState(() => {
        const initial = {}
        SECTIONS.forEach(s => { initial[s.id] = { ...DEFAULT_STYLE_CONFIG } })
        return initial
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id)

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const docRef = doc(db, 'services', 'global_theme')
                const snap = await getDoc(docRef)

                let data = snap.exists() ? snap.data() : {}

                // Merge incoming config onto default structure
                setThemeConfig(prev => {
                    const freshConfig = { ...prev }
                    Object.keys(data).forEach(key => {
                        if (freshConfig[key]) {
                            freshConfig[key] = { ...freshConfig[key], ...data[key] }
                        }
                    })
                    return freshConfig
                })
            } catch (err) {
                console.error("Failed to load global theme", err)
            } finally {
                setLoading(false)
            }
        }
        fetchTheme()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await setDoc(doc(db, 'services', 'global_theme'), themeConfig)
            alert('Global Theme Configuration Saved Successfully!')
        } catch (error) {
            console.error('Error saving global theme:', error)
            alert('Failed to save global theme')
        } finally {
            setSaving(false)
        }
    }

    const setSectionStyleConfig = (sectionId) => (newStyleFn) => {
        setThemeConfig(prev => ({
            ...prev,
            [sectionId]: typeof newStyleFn === 'function' ? newStyleFn(prev[sectionId]) : newStyleFn
        }))
    }

    if (loading) return <div className="p-10 flex justify-center"><Loading type="spinner" /></div>

    const activeSection = SECTIONS.find(s => s.id === activeSectionId)

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">WordPress-Style Theme Customizer</h1>
                <p className="text-gray-600 text-sm">Visually design the background colors, gradients, and overlay stylings for every major section of the website natively from this dashboard.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-4 shadow-sm">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Website Sections</h3>
                    </div>
                    <div className="flex flex-col p-2 space-y-1">
                        {SECTIONS.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSectionId(section.id)}
                                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSectionId === section.id ? 'bg-[#D7B878] text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                {section.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                    <div className="mb-6 pb-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Customizing: {activeSection?.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">Changes applied here will globally override the section background.</p>
                        </div>
                    </div>

                    {themeConfig[activeSectionId] && (
                        <SectionStyleEditor
                            label={`${activeSection?.name} Background`}
                            styleConfig={themeConfig[activeSectionId]}
                            setStyleConfig={setSectionStyleConfig(activeSectionId)}
                        />
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-gray-200 p-4 px-8 z-40 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <span className="text-sm text-gray-600">Theme updates process globally across the store.</span>
                <Button onClick={handleSave} disabled={saving} className="bg-[#a67828] hover:bg-[#8C641C] text-white">
                    {saving ? 'Publishing Theme...' : 'Save & Publish Styles'}
                </Button>
            </div>
        </div>
    )
}

export default ThemeCustomizer
