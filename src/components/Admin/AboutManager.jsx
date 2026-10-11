import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { uploadToCloudinary } from '../../utils/cloudinary'
import MediaSelector from './MediaSelector'
import { Save, Image as ImageIcon, CheckCircle2, AlertCircle, Upload, Trash2 } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'

const DEFAULT_CONFIG = {
    eyebrow: 'ABOUT ANITA DOVAL',
    heading: 'Understanding the\nperson beyond the chart.',
    description: 'Anita Doval\'s journey has been shaped by years of study, practice and real-life experience. Her approach combines the wisdom of astrology and Vastu with a deep understanding of human nature and spiritual principles.',
    portrait: { url: '/images/post1.jpg', position: 'center center', alt: 'Anita Doval' },
    badge: {
        enabled: true,
        label: 'Years of',
        mainText: 'Guidance & Practice',
    },
    points: [
        { text: 'Holistic and practical approach', enabled: true },
        { text: 'Personalised consultations', enabled: true },
        { text: 'Guidance rooted in knowledge and experience', enabled: true }
    ],
    background: {
        url: '',
        bgSize: 'cover',
        bgRepeat: 'no-repeat',
        bgPosition: 'center'
    },
    cta: {
        enabled: true,
        text: 'Book a Consultation',
        url: ''
    },
    quote: {
        enabled: true,
        text: 'Every chart tells\na story, but every\nperson\'s journey\nis unique.',
        decorationEnabled: true
    },
    sectionEnabled: true
}

const AboutManager = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingPortrait, setUploadingPortrait] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)
    const [statusMessage, setStatusMessage] = useState(null)
    const [config, setConfig] = useState({ ...DEFAULT_CONFIG, status: 'published' })

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                let snap = await getDoc(doc(db, 'about_section', 'about_config'))
                if (!snap.exists()) {
                    snap = await getDoc(doc(db, 'about_section', 'profile'))
                }
                if (!snap.exists()) {
                    snap = await getDoc(doc(db, 'services', 'about_config'))
                }
                if (snap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...snap.data() })
                }
            } catch (err) {
                console.error("Failed to load about config", err)
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

    const handlePointChange = (index, field, value) => {
        setConfig(prev => {
            const draft = { ...prev }
            draft.points[index][field] = value
            return draft
        })
    }

    const handleFileUpload = async (e, type = 'portrait') => {
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
        else handleChange('background.url', '')
    }

    const saveChanges = async () => {
        setSaving(true)
        setStatusMessage(null)
        try {
            // Save to primary about_section collection
            await setDoc(doc(db, 'about_section', 'about_config'), config)
            // Sync to legacy services collection for backwards compatibility
            try {
                await setDoc(doc(db, 'services', 'about_config'), config)
            } catch (e) { }

            setStatusMessage({ type: 'success', text: 'About settings saved successfully!' })
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
                    <h2 className="text-2xl font-bold text-gray-800">About Section</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the About section on the homepage (Firestore: about_section)</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={config.status || 'published'}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border cursor-pointer ${config.status === 'published' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}
                    >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Live)</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Enable Section</span>
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
                {/* LEFT COL */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Content */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">Text Content</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow (Small Top Text)</label>
                                <input type="text" value={config.eyebrow} onChange={(e) => handleChange('eyebrow', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 max-w-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                                <textarea rows={2} value={config.heading} onChange={(e) => handleChange('heading', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500 font-serif text-lg py-3" placeholder="Understanding the\nperson beyond the chart." />
                                <p className="text-sm text-gray-500 mt-1">Use \n or Enter to break lines.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={3} value={config.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Approach Points */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">Approach Points</h3>
                        <div className="space-y-4">
                            {config.points.map((pt, idx) => (
                                <div key={idx} className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <input type="checkbox" checked={pt.enabled} onChange={(e) => handlePointChange(idx, 'enabled', e.target.checked)} className="rounded" title="Enable Point" />
                                    <div className="flex-1">
                                        <input type="text" value={pt.text} onChange={(e) => handlePointChange(idx, 'text', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" placeholder="Text for point..." disabled={!pt.enabled} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA & Quote */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 grid grid-cols-2 gap-6">
                        <div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                                <h3 className="font-semibold text-lg">CTA Button (Pop-up)</h3>
                                <input type="checkbox" checked={config.cta.enabled} onChange={(e) => handleChange('cta.enabled', e.target.checked)} className="rounded" />
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Button Text</label>
                                    <input type="text" value={config.cta.text} onChange={(e) => handleChange('cta.text', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" disabled={!config.cta.enabled} placeholder="Book a Consultation" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                                <h3 className="font-semibold text-lg">Quote Column</h3>
                                <input type="checkbox" checked={config.quote.enabled} onChange={(e) => handleChange('quote.enabled', e.target.checked)} className="rounded" />
                            </div>
                            <div className="space-y-3">
                                <textarea rows={4} value={config.quote.text} onChange={(e) => handleChange('quote.text', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm font-serif" placeholder="Quote Text" disabled={!config.quote.enabled} />
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input type="checkbox" checked={config.quote.decorationEnabled} onChange={(e) => handleChange('quote.decorationEnabled', e.target.checked)} className="rounded" disabled={!config.quote.enabled} />
                                    Show bottom gold decoration
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Image */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-semibold text-md border-b border-gray-100 pb-3 mb-4">Portrait / Primary Image</h3>
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-4 group flex items-center justify-center cursor-pointer">
                            {config.portrait.url ? (
                                <>
                                    <img src={config.portrait.url} alt="Portrait" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <div className="bg-white p-2 rounded flex flex-col gap-2">
                                            <MediaSelector
                                                uploading={uploadingPortrait}
                                                onSelect={(url) => handleChange('portrait.url', url)}
                                                onUpload={(e) => handleFileUpload(e, 'portrait')}
                                                id="about-portrait-replace"
                                            />
                                        </div>
                                        <button onClick={() => removeImage('portrait')} className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600">Remove</button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 w-full">
                                    <div className="text-center mb-4">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <span className="text-sm text-gray-500 font-medium">Upload Portrait</span>
                                    </div>
                                    <MediaSelector
                                        uploading={uploadingPortrait}
                                        onSelect={(url) => handleChange('portrait.url', url)}
                                        onUpload={(e) => handleFileUpload(e, 'portrait')}
                                        id="about-portrait-upload"
                                    />
                                </div>
                            )}
                            {uploadingPortrait && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loading type="spinner" /></div>}
                        </div>
                        <input type="text" value={config.portrait.alt} onChange={(e) => handleChange('portrait.alt', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm mb-3" placeholder="Alt text" />
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image Object Position (CSS)</label>
                        <input type="text" value={config.portrait.position} onChange={(e) => handleChange('portrait.position', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm font-mono" placeholder="center center" />
                    </div>

                    <ResponsiveBackgroundManager
                        config={config.background}
                        onChange={(field, value) => handleChange(`background.${field}`, value)}
                    />

                    {/* Badge */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                            <h3 className="font-semibold text-md">Floating Image Badge</h3>
                            <input type="checkbox" checked={config.badge.enabled} onChange={(e) => handleChange('badge.enabled', e.target.checked)} className="rounded" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Top Label (sm)</label>
                                <input type="text" value={config.badge.label} onChange={(e) => handleChange('badge.label', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" disabled={!config.badge.enabled} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Main Label (bold)</label>
                                <input type="text" value={config.badge.mainText} onChange={(e) => handleChange('badge.mainText', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold" disabled={!config.badge.enabled} />
                            </div>
                        </div>
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

export default AboutManager
