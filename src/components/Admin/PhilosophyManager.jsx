import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Save, CheckCircle2, AlertCircle, Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { uploadToCloudinary } from '../../utils/cloudinary'
import Button from '../UI/Button'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'
import Loading from '../UI/Loading'

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'ASTROLOGY • SPIRITUALITY • KNOWLEDGE',
    headingLine1: 'Different Perspectives.',
    headingLine2: 'One ',
    headingHighlight: 'Deeper Understanding.',
    description: 'Our approach brings together the wisdom of astrology, the balance of Vastu, and the depth of spiritual practices to help you navigate life with greater clarity, confidence and purpose.',
    cards: [
        { id: '1', title: 'Insight', desc: 'Understanding life patterns', icon: 'Eye', enabled: true },
        { id: '2', title: 'Balance', desc: 'Harmony in personal and living spaces', icon: 'Scale', enabled: true },
        { id: '3', title: 'Clarity', desc: 'Practical and meaningful guidance', icon: 'Sparkles', enabled: true },
        { id: '4', title: 'Growth', desc: 'Support for your unique journey', icon: 'HeartHandshake', enabled: true }
    ],
    background: {
        url: '',
        bgSize: 'cover',
        bgRepeat: 'no-repeat',
        bgPosition: 'center'
    },
    celestialGraphics: true
}

const PhilosophyManager = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)
    const [statusMessage, setStatusMessage] = useState(null)
    const [config, setConfig] = useState(DEFAULT_CONFIG)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'philosophy_config')
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() })
                }
            } catch (err) {
                console.error("Failed to load philosophy configuration", err)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [])

    const handleChange = (path, value) => {
        setConfig(prev => {
            const draft = { ...prev }
            const keys = path.split('.')
            const lastKey = keys.pop()
            const lastObj = keys.reduce((obj, key) => obj[key], draft)
            lastObj[lastKey] = value
            return draft
        })
    }

    const handleCardChange = (index, field, value) => {
        setConfig(prev => {
            const draft = { ...prev }
            draft.cards[index][field] = value
            return draft
        })
    }

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            if (type === 'background') setUploadingBg(true)
            const result = await uploadToCloudinary(file)
            if (result.success) {
                handleChange(`${type}.url`, result.url)
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Image upload failed. Please check console for details.')
        } finally {
            if (type === 'background') setUploadingBg(false)
        }
    }

    const removeImage = (type) => {
        handleChange(`${type}.url`, '')
    }

    const saveChanges = async () => {
        setSaving(true)
        setStatusMessage(null)
        try {
            await setDoc(doc(db, 'services', 'philosophy_config'), config)
            setStatusMessage({ type: 'success', text: 'Philosophy settings saved successfully!' })
            setTimeout(() => setStatusMessage(null), 4000)
        } catch (err) {
            console.error(err)
            setStatusMessage({ type: 'error', text: 'Error saving settings: ' + err.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loading type="spinner" />
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">

            {/* Header */}
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Philosophy Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the &quot;Different Perspectives&quot; section on the homepage</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Enable Section on Website</span>
                        <input type="checkbox" checked={config.sectionEnabled !== false} onChange={(e) => handleChange('sectionEnabled', e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                    </label>
                    <Button onClick={saveChanges} disabled={saving} className="flex items-center gap-2 text-white bg-[#a67828] hover:bg-[#8C641C]">
                        {saving ? <Loading type="dots" /> : <Save className="w-4 h-4" />}
                        Save & Publish
                    </Button>
                </div>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium text-sm">{statusMessage.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COL: Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Text Content */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">Main Typography</h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow (Small Top Text)</label>
                                <input
                                    type="text"
                                    value={config.eyebrow}
                                    onChange={(e) => handleChange('eyebrow', e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 max-w-md"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 1</label>
                                    <input
                                        type="text"
                                        value={config.headingLine1}
                                        onChange={(e) => handleChange('headingLine1', e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 font-serif"
                                        placeholder="Different Perspectives."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 2 Prefix</label>
                                    <input
                                        type="text"
                                        value={config.headingLine2}
                                        onChange={(e) => handleChange('headingLine2', e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 font-serif"
                                        placeholder="One "
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Text (Gold)</label>
                                <input
                                    type="text"
                                    value={config.headingHighlight}
                                    onChange={(e) => handleChange('headingHighlight', e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-yellow-500 font-serif text-yellow-700 bg-yellow-50/50"
                                    placeholder="Deeper Understanding."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={config.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4 Cards Editor */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">4 Core Value Cards</h3>

                        <div className="space-y-4">
                            {config.cards.map((card, idx) => (
                                <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100 relative">
                                    <div className="absolute top-4 right-4">
                                        <input type="checkbox" checked={card.enabled} onChange={(e) => handleCardChange(idx, 'enabled', e.target.checked)} className="rounded" title="Enable Card" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 pr-6">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Icon ID</label>
                                            <input type="text" value={card.icon} onChange={(e) => handleCardChange(idx, 'icon', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" placeholder="Eye, Scale" />
                                            <p className="text-[14px] text-gray-400 mt-1">Lucide: Eye, Scale, Sparkles, HeartHandshake, Star</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                                            <input type="text" value={card.title} onChange={(e) => handleCardChange(idx, 'title', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm font-serif font-semibold" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                                            <input type="text" value={card.desc} onChange={(e) => handleCardChange(idx, 'desc', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: Minor Settings */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Visual Settings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <ResponsiveBackgroundManager
                            config={config.background}
                            onChange={(field, value) => handleChange(`background.${field}`, value)}
                        />

                        <label className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 w-full flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                Celestial Graphics (Orbits)
                                <input type="checkbox" checked={config.celestialGraphics} onChange={(e) => handleChange('celestialGraphics', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky action bar for easier saving */}
            <div className="sticky bottom-0 -mx-6 -mb-6 p-6 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-end gap-4 shadow-[0_-15px_30px_rgba(0,0,0,0.03)] z-50">
                <Button onClick={saveChanges} disabled={saving} className="flex items-center gap-2 px-8 py-3 text-[15px] shadow-lg text-white bg-[#a67828] hover:bg-[#8C641C]">
                    {saving ? <Loading type="dots" /> : <Save className="w-5 h-5" />}
                    Save & Publish Changes
                </Button>
            </div>
        </div>
    )
}

export default PhilosophyManager
