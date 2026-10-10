import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Plus, Edit, Trash2, Save, X, Star, Home, Compass, Map, Image as ImageIcon } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'

const DEFAULT_SECTION_CONFIG = {
    eyebrow: 'DETAILED GUIDES TO OUR SERVICES',
    heading: 'Explore Our Consultation Guides',
    highlightedHeading: 'Consultation Guides',
    description: 'Detailed guides to help visitors understand consultation services.',
    background: {
        url: '',
        alt: '',
        bgSize: 'cover',
        bgRepeat: 'no-repeat',
        bgPosition: 'center'
    },
    bgOverlay: 'Light',
    bgPosition: 'Center',
    celestialDecoration: true,
    sectionEnabled: true
}

const GuidesManager = () => {
    const { isHindi } = useLanguage()
    const { documents: allGuides, addDocument, updateDocument, deleteDocument, loading } = useFirestore('services')
    const [editingGuide, setEditingGuide] = useState(null)
    const [showForm, setShowForm] = useState(false)

    // Section Config State
    const [sectionConfig, setSectionConfig] = useState(DEFAULT_SECTION_CONFIG)
    const [savingConfig, setSavingConfig] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)

    // Form Data for individual guide
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        imageAlt: '',
        imagePosition: 'Center',
        icon: 'star',
        buttonLabel: 'View E-Brochure',
        buttonUrl: '',
        sortOrder: 0,
        enabled: true,
    })
    const [uploadingGuideImg, setUploadingGuideImg] = useState(false)

    const guidesList = allGuides.filter(s => s.type === 'guide').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    const DEFAULT_GUIDES = [
        { id: 'default1', title: 'Astrology Consultation (Default)', description: 'Explore detailed astrology consultation services, areas of guidance and more.', image: '', icon: 'star', buttonLabel: 'View E-Brochure', buttonUrl: '/brochure/astrology', sortOrder: 1, isDefault: true },
        { id: 'default2', title: 'Vastu Consultation (Default)', description: 'Discover Vastu consultation and planning services for homes, offices and more.', image: '', icon: 'home', buttonLabel: 'View E-Brochure', buttonUrl: '/brochure/vastu', sortOrder: 2, isDefault: true }
    ]
    const displayGuides = guidesList.length > 0 ? guidesList : DEFAULT_GUIDES;

    const icons = [
        { value: 'star', label: 'Star / Astrology', icon: Star },
        { value: 'home', label: 'Home / Vastu', icon: Home },
        { value: 'compass', label: 'Compass', icon: Compass },
        { value: 'map', label: 'Map', icon: Map }
    ]

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'guides_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setSectionConfig({ ...DEFAULT_SECTION_CONFIG, ...snap.data() })
                }
            } catch (err) {
                console.error("Failed to load config", err)
            }
        }
        fetchConfig()
    }, [])

    const handleSaveSectionConfig = async () => {
        setSavingConfig(true)
        try {
            await setDoc(doc(db, 'services', 'guides_config'), sectionConfig, { merge: true })
            alert('Section Configuration Saved!')
        } catch (error) {
            console.error('Error saving config:', error)
            alert('Failed to save config')
        } finally {
            setSavingConfig(false)
        }
    }

    const handleBgUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadingBg(true)
            const result = await uploadToCloudinary(file)
            if (result.success) {
                setSectionConfig(prev => ({ ...prev, background: { ...prev.background, url: result.url } }))
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Image upload failed.')
        } finally {
            setUploadingBg(false)
        }
    }

    const handleGuideImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadingGuideImg(true)
            const result = await uploadToCloudinary(file)
            if (result.success) {
                setFormData(prev => ({ ...prev, image: result.url }))
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Image upload failed.')
        } finally {
            setUploadingGuideImg(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const guideData = { ...formData, type: 'guide', updatedAt: new Date() }
        let result
        if (editingGuide && editingGuide.id) {
            result = await updateDocument(editingGuide.id, guideData)
        } else {
            result = await addDocument({ ...guideData, createdAt: new Date() })
        }

        if (result?.error) {
            alert('Failed to save guide: ' + result.error)
            return
        }
        resetForm()
    }

    const handleEdit = (guide) => {
        setEditingGuide(guide)
        setFormData({
            title: guide.title || '',
            description: guide.description || '',
            image: guide.image || '',
            imageAlt: guide.imageAlt || '',
            imagePosition: guide.imagePosition || 'Center',
            icon: guide.icon || 'star',
            buttonLabel: guide.buttonLabel || 'View E-Brochure',
            buttonUrl: guide.buttonUrl || '',
            sortOrder: guide.sortOrder || 0,
            enabled: guide.enabled !== false,
        })
        setShowForm(true)
    }

    const handleDelete = async (guideId) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            await deleteDocument(guideId)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '', description: '', image: '', imageAlt: '', imagePosition: 'Center', icon: 'star',
            buttonLabel: 'View E-Brochure', buttonUrl: '', sortOrder: guidesList.length + 1, enabled: true
        })
        setEditingGuide(null)
        setShowForm(false)
    }

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Consultation Guides Manager</h1>
            </div>

            {/* SECTION CONFIGURATION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Section Header & Background</h2>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Enable Section</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={sectionConfig.sectionEnabled} onChange={(e) => setSectionConfig(prev => ({ ...prev, sectionEnabled: e.target.checked }))} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${sectionConfig.sectionEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${sectionConfig.sectionEnabled ? 'translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Background Settings */}
                    <div className="space-y-5">
                        <ResponsiveBackgroundManager
                            config={sectionConfig.background}
                            onChange={(field, value) => setSectionConfig(prev => ({ ...prev, background: { ...prev.background, [field]: value } }))}
                        />
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Background Overlay</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" value={sectionConfig.bgOverlay} onChange={e => setSectionConfig({ ...sectionConfig, bgOverlay: e.target.value })}>
                                <option value="Light">Light</option>
                                <option value="Medium">Medium</option>
                                <option value="Strong">Strong</option>
                            </select>
                        </div>
                    </div>
                    <label className="flex items-center space-x-2 mt-4 cursor-pointer">
                        <input type="checkbox" checked={sectionConfig.celestialDecoration} onChange={(e) => setSectionConfig({ ...sectionConfig, celestialDecoration: e.target.checked })} className="rounded border-gray-300 text-[#a67828] focus:ring-[#a67828]" />
                        <span className="text-sm font-medium text-gray-700">Enable Celestial Orbit Decoration</span>
                    </label>
                </div>
                {/* Text Settings */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow Text</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={sectionConfig.eyebrow} onChange={e => setSectionConfig({ ...sectionConfig, eyebrow: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={sectionConfig.heading} onChange={e => setSectionConfig({ ...sectionConfig, heading: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Highlight</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={sectionConfig.highlightedHeading} onChange={e => setSectionConfig({ ...sectionConfig, highlightedHeading: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows="2" value={sectionConfig.description} onChange={e => setSectionConfig({ ...sectionConfig, description: e.target.value })} />
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-gray-200 p-4 px-8 z-40 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <span className="text-sm text-gray-600">Save changes to publish them to the live site.</span>
                <Button onClick={handleSaveSectionConfig} disabled={savingConfig} className="bg-[#a67828] hover:bg-[#8C641C] text-white">
                    {savingConfig ? 'Saving...' : 'Save Section Config'}
                </Button>
            </div>
            {/* GUIDES LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Manage Guide Cards</h2>
                    {!showForm && <Button onClick={() => { resetForm(); setShowForm(true) }} className="bg-[#a67828] hover:bg-[#8C641C] text-white px-4"><Plus className="w-4 h-4 mr-2" />Add Guide</Button>}
                </div>

                {showForm ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-bold text-gray-800">{editingGuide ? 'Edit Guide' : 'Create New Guide'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Guide Title *</label>
                                        <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
                                        <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Card Full Background Image *</label>
                                        <div className="flex items-start space-x-4">
                                            {formData.image ? (
                                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-1 right-1 bg-white/90 p-1 rounded-md text-red-500 shadow"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center"><ImageIcon className="w-8 h-8 text-gray-400" /></div>
                                            )}
                                            <div className="flex-1">
                                                <input type="file" id="guide-img" className="hidden" accept="image/*" onChange={handleGuideImageUpload} />
                                                <label htmlFor="guide-img" className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white text-sm font-medium">
                                                    {uploadingGuideImg ? <Loading type="spinner" size="sm" /> : <ImageIcon className="w-4 h-4" />}
                                                    <span>Upload Image</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-bold mb-1">Image Position</label>
                                            <select value={formData.imagePosition} onChange={e => setFormData({ ...formData, imagePosition: e.target.value })} className="w-full px-4 py-2 border rounded-lg"><option>Center</option><option>Top</option><option>Bottom</option></select></div>
                                        <div><label className="block text-sm font-bold mb-1">Card Icon</label>
                                            <select value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{icons.map(ic => <option key={ic.value} value={ic.value}>{ic.label}</option>)}</select></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-bold mb-1">Button text</label>
                                            <input type="text" value={formData.buttonLabel} onChange={e => setFormData({ ...formData, buttonLabel: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                                        <div><label className="block text-sm font-bold mb-1">Button URL</label>
                                            <input type="text" value={formData.buttonUrl} onChange={e => setFormData({ ...formData, buttonUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Sort Order</label>
                                        <input type="number" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-lg" />
                                    </div>
                                    <label className="flex items-center space-x-2 mt-4 cursor-pointer">
                                        <input type="checkbox" checked={formData.enabled} onChange={e => setFormData({ ...formData, enabled: e.target.checked })} className="rounded text-[#a67828] w-4 h-4" />
                                        <span className="text-sm font-bold text-gray-700">Guide Visible</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 space-x-3 border-t">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#a67828] hover:bg-[#8C641C] text-white">Save Guide</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? <Loading type="dots" /> : displayGuides.map(guide => (
                            <div key={guide.id} className={`border rounded-xl  overflow-hidden relative ${guide.enabled !== false ? 'bg-white' : 'opacity-50'} ${guide.isDefault ? 'border-dashed border-2 border-[#D7B878] bg-[#FBF8F1]' : ''}`}>
                                <div className="h-40 bg-gray-100 relative group">
                                    {guide.image ? (
                                        <img src={guide.image} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-b border-gray-100">
                                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                            <span className="text-sm font-semibold">No Background Assigned</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        {guide.isDefault ? (
                                            <button onClick={() => handleEdit({ ...guide, id: null, isDefault: false, title: guide.title.replace(' (Default)', '') })} className="bg-[#a67828] hover:bg-[#8C641C] text-white px-4 py-1.5 rounded-lg shadow-sm text-sm font-bold uppercase tracking-wider transition-colors">Start Customizing</button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(guide)} className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-[#a67828] hover:bg-[#a67828] hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(guide.id)} className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-red-600 hover:bg-red-600 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3 mb-3 break-words">{guide.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{guide.description}</p>
                                    {guide.isDefault && (
                                        <div className="mt-4 p-3 bg-[#FFFDF8] border border-[#E8DCC4] rounded-lg">
                                            <p className="text-sm text-[#8C641C] font-semibold leading-relaxed">
                                                This is a frontend placeholder. Click "Start Customizing" above to upload images and permanently save it to your database.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    )
}

export default GuidesManager
