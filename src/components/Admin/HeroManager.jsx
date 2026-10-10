import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { uploadToCloudinary } from '../../utils/cloudinary'
import MediaSelector from './MediaSelector'
import { Save, Image as ImageIcon, CheckCircle2, AlertCircle, Plus, Trash2, Upload } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'

const DEFAULT_CONFIG = {
    eyebrow: 'ASTROLOGY • VASTU • SPIRITUAL GUIDANCE',
    heading: 'A Deeper \nUnderstanding of',
    highlightedHeading: 'Life, Space & Possibility',
    description: 'Personalised consultations in Astrology, Vastu and spiritual practices to bring clarity, balance and direction to your life.',
    primaryCta: { enabled: true, text: 'Book a Consultation' },
    secondaryCta: { enabled: true, text: 'Explore Services', url: '/services' },
    portrait: { url: '/images/post1.jpg', position: 'center' },
    background: { url: '', bgSize: 'cover', bgRepeat: 'no-repeat', bgPosition: 'center' },
    celestialDecoration: true,
    profileCard: {
        enabled: true,
        name: 'Anita Doval',
        title: 'Spiritual Guide'
    },
    features: [
        { title: 'Astrology', description: 'Life Patterns & Guidance', icon: 'Stars' },
        { title: 'Vastu', description: 'Harmonious Spaces', icon: 'Compass' },
        { title: 'Spiritual Practices', description: 'Inner Balance', icon: 'Leaf' },
        { title: 'Personalised Approach', description: 'Guidance for Your Journey', icon: 'ShieldCheck' }
    ],
    sectionEnabled: true
}

const HeroManager = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingPortrait, setUploadingPortrait] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)

    const [statusMessage, setStatusMessage] = useState(null)

    const [config, setConfig] = useState(DEFAULT_CONFIG)

    // Fetch current config on load
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'hero_config')
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    // Merge with default to ensure structural safety
                    setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() })
                }
            } catch (err) {
                console.error("Failed to load hero configuration", err)
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

    const handleFeatureChange = (index, field, value) => {
        setConfig(prev => {
            const draft = { ...prev }
            draft.features[index][field] = value
            return draft
        })
    }

    const handleFeatureAdd = () => {
        if (config.features.length >= 5) return
        setConfig(prev => ({
            ...prev,
            features: [...prev.features, { title: 'New Feature', description: 'Description', icon: 'Star' }]
        }))
    }

    const handleFeatureRemove = (index) => {
        setConfig(prev => {
            const arr = [...prev.features]
            arr.splice(index, 1)
            return { ...prev, features: arr }
        })
    }

    const handleFileUpload = async (e, type) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (type === 'portrait') setUploadingPortrait(true)
        else setUploadingBg(true)

        try {
            const result = await uploadToCloudinary(file, 'anita-doval/homepage')
            if (result.success) {
                if (type === 'portrait') handleChange('portrait.url', result.url)
                else handleChange('background.url', result.url)
            } else {
                throw new Error(result.error)
            }
        } catch (err) {
            console.error(err)
            alert('Upload failed. Please try again.')
        } finally {
            if (type === 'portrait') setUploadingPortrait(false)
            else setUploadingBg(false)
        }
    }

    const removeImage = (type) => {
        if (type === 'portrait') handleChange('portrait.url', '')
    }

    const saveChanges = async () => {
        setSaving(true)
        setStatusMessage(null)
        try {
            await setDoc(doc(db, 'services', 'hero_config'), config)
            setStatusMessage({ type: 'success', text: 'Hero settings saved successfully!' })
            // Auto dismiss
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
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 ">Hero Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the primary visual area of the homepage</p>
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
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ">
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Headline (Lines 1 & 2)</label>
                                <textarea
                                    rows={2}
                                    value={config.heading}
                                    onChange={(e) => handleChange('heading', e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 font-serif text-lg py-3"
                                    placeholder="A Deeper \nUnderstanding of"
                                />
                                <p className="text-sm text-gray-500 mt-1">Use \n or Enter to break lines.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted Final Line (Gold)</label>
                                <input
                                    type="text"
                                    value={config.highlightedHeading}
                                    onChange={(e) => handleChange('highlightedHeading', e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-yellow-500 font-serif text-lg text-yellow-700 bg-yellow-50/50"
                                    placeholder="Life, Space & Possibility"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Description</label>
                                <textarea
                                    rows={2}
                                    value={config.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Card Overlay */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                            <h3 className="font-semibold text-lg">Floating Profile Card</h3>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={config.profileCard.enabled} onChange={(e) => handleChange('profileCard.enabled', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm">Enabled</span>
                            </label>
                        </div>

                        {config.profileCard.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" value={config.profileCard.name} onChange={(e) => handleChange('profileCard.name', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                                    <input type="text" value={config.profileCard.title} onChange={(e) => handleChange('profileCard.title', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Feature Strip */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                            <h3 className="font-semibold text-lg">Bottom Feature Strip</h3>
                            {config.features.length < 4 && (
                                <button onClick={handleFeatureAdd} className="text-sm font-semibold px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1">
                                    <Plus size={14} /> Add Column
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {config.features.map((feature, idx) => (
                                <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Icon (Lucide Node)</label>
                                            <input type="text" value={feature.icon} onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" placeholder="Stars, Compass..." />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                                            <input type="text" value={feature.title} onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm font-semibold" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                                            <input type="text" value={feature.description} onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                                        </div>
                                    </div>
                                    <button onClick={() => handleFeatureRemove(idx)} className="mt-5 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {config.features.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No features added. Feature strip will be hidden.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT COL: Media & Buttons */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Portrait Manager */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ">
                        <h3 className="font-semibold text-md border-b border-gray-100 pb-3 mb-4">Portrait / Hero Image</h3>

                        <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-4 group flex items-center justify-center cursor-pointer">
                            {config.portrait.url ? (
                                <>
                                    <img src={config.portrait.url} alt="Hero Portrait" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <div className="bg-white p-2 rounded flex flex-col gap-2">
                                            <MediaSelector
                                                uploading={uploadingPortrait}
                                                onSelect={(url) => handleChange('portrait.url', url)}
                                                onUpload={(e) => handleFileUpload(e, 'portrait')}
                                                id="hero-portrait-replace"
                                            />
                                        </div>
                                        <button onClick={() => removeImage('portrait')} className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600">Remove</button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 w-full">
                                    <div className="text-center mb-4">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <span className="text-sm text-gray-500 font-medium">Portrait (4:5 Ratio)</span>
                                    </div>
                                    <MediaSelector
                                        uploading={uploadingPortrait}
                                        onSelect={(url) => handleChange('portrait.url', url)}
                                        onUpload={(e) => handleFileUpload(e, 'portrait')}
                                        id="hero-portrait-upload"
                                    />
                                </div>
                            )}
                            {uploadingPortrait && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <Loading type="spinner" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Background Manager */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 ">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                            <h3 className="font-semibold text-md">Optional Background</h3>
                        </div>

                        {config.background.url ? (
                            <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 flex items-center justify-center">
                                <img src={config.background.url} alt="Background" className="w-full h-full object-cover opacity-50" />
                                <button onClick={() => removeImage('background')} className="absolute bg-white/90 text-red-600 text-sm px-3 py-1.5 rounded shadow-sm flex items-center gap-1 hover:bg-red-50"><Trash2 size={12} /> Remove</button>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <span className="block text-sm text-gray-500 font-medium mb-2">Upload BG Image</span>
                                <MediaSelector
                                    uploading={uploadingBg}
                                    onSelect={(url) => handleChange('background.url', url)}
                                    onUpload={(e) => handleFileUpload(e, 'background')}
                                    id="hero-bg-upload"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">BG Size</label>
                                <select value={config.background.bgSize || 'cover'} onChange={(e) => handleChange('background.bgSize', e.target.value)} className="w-full text-sm p-2 border border-gray-300 rounded-lg bg-gray-50">
                                    <option value="cover">Cover (Fill)</option>
                                    <option value="contain">Contain (Fit)</option>
                                    <option value="auto">Auto (Original)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">BG Repeat</label>
                                <select value={config.background.bgRepeat || 'no-repeat'} onChange={(e) => handleChange('background.bgRepeat', e.target.value)} className="w-full text-sm p-2 border border-gray-300 rounded-lg bg-gray-50">
                                    <option value="no-repeat">No Repeat</option>
                                    <option value="repeat">Repeat Both</option>
                                    <option value="repeat-x">Repeat Horizontal</option>
                                    <option value="repeat-y">Repeat Vertical</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">BG Position</label>
                                <select value={config.background.bgPosition || 'center'} onChange={(e) => handleChange('background.bgPosition', e.target.value)} className="w-full text-sm p-2 border border-gray-300 rounded-lg bg-gray-50">
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                        </div>

                        <label className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 font-medium pt-3 border-t border-gray-100 w-full flex justify-between">
                                Celestial Graphics Overlay
                                <input type="checkbox" checked={config.celestialDecoration} onChange={(e) => handleChange('celestialDecoration', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </span>
                        </label>
                    </div>

                    {/* Buttons Settings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
                        <h3 className="font-semibold text-md border-b border-gray-100 pb-3">CTA Buttons</h3>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <label className="flex items-center justify-between text-sm font-semibold mb-2">
                                Primary Button
                                <input type="checkbox" checked={config.primaryCta.enabled} onChange={(e) => handleChange('primaryCta.enabled', e.target.checked)} className="rounded" />
                            </label>
                            <input type="text" value={config.primaryCta.text} onChange={(e) => handleChange('primaryCta.text', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm mb-2" placeholder="Button Text" disabled={!config.primaryCta.enabled} />
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <label className="flex items-center justify-between text-sm font-semibold mb-2">
                                Secondary Button
                                <input type="checkbox" checked={config.secondaryCta.enabled} onChange={(e) => handleChange('secondaryCta.enabled', e.target.checked)} className="rounded" />
                            </label>
                            <input type="text" value={config.secondaryCta.text} onChange={(e) => handleChange('secondaryCta.text', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm flex-1 mb-2" placeholder="Button Text" disabled={!config.secondaryCta.enabled} />
                            <input type="text" value={config.secondaryCta.url} onChange={(e) => handleChange('secondaryCta.url', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm font-mono" placeholder="Relative URL (e.g. /services)" disabled={!config.secondaryCta.enabled} />
                        </div>
                        <p className="text-[14px] text-gray-400">Note: The Primary button always opens the Inquiry modal.</p>
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

export default HeroManager
