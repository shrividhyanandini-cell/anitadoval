import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Plus, Edit, Trash2, Save, X, Star, Home, Hash, Hand, Heart, Clock, Users, Award, Image as ImageIcon, CheckCircle, GripVertical } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'

const DEFAULT_SECTION_CONFIG = {
    eyebrow: 'CONSULTATIONS FOR A MORE BALANCED LIFE',
    heading: 'Explore Our Services',
    highlightedHeading: 'Our Services',
    description: '',
    viewAllCta: { enabled: true, text: 'View All Services', url: '/services' },
    background: {
        url: '',
        alt: '',
        bgSize: 'cover',
        bgRepeat: 'no-repeat',
        bgPosition: 'center'
    },
    bgOverlay: 'Light',   // Light, Medium, Strong
    celestialDecoration: true,
    sectionEnabled: true
}

const ServicesManager = () => {
    const { isHindi } = useLanguage()
    const { documents: allServices, addDocument, updateDocument, deleteDocument, loading } = useFirestore('services')
    const [editingService, setEditingService] = useState(null)
    const [showForm, setShowForm] = useState(false)

    // Section Config State
    const [sectionConfig, setSectionConfig] = useState(DEFAULT_SECTION_CONFIG)
    const [savingConfig, setSavingConfig] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)

    // Form Data for individual service
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        image: '',
        imageAlt: '',
        icon: 'star',
        link: '',
        sortOrder: 0,
        enabled: true,
        features: [''],
        duration: '',
        price: ''
    })
    const [uploadingServiceImg, setUploadingServiceImg] = useState(false)

    const servicesList = allServices.filter(s => !s.id.includes('_config') && s.type !== 'guide').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    const icons = [
        { value: 'star', label: 'Star / Astrology', icon: Star },
        { value: 'home', label: 'Home / Vastu', icon: Home },
        { value: 'hash', label: 'Hash / Numerology', icon: Hash },
        { value: 'hand', label: 'Hand / Palmistry', icon: Hand },
        { value: 'heart', label: 'Heart / Spiritual', icon: Heart },
        { value: 'lotus', label: 'Lotus / Meditation', icon: Heart } // fallback icon for lotus
    ]

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'services_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setSectionConfig({ ...DEFAULT_SECTION_CONFIG, ...snap.data() })
                }
            } catch (err) {
                console.error("Failed to load services config", err)
            }
        }
        fetchConfig()
    }, [])

    const handleSaveSectionConfig = async () => {
        setSavingConfig(true)
        try {
            await setDoc(doc(db, 'services', 'services_config'), sectionConfig, { merge: true })
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
                setSectionConfig(prev => ({
                    ...prev,
                    background: { ...prev.background, url: result.url }
                }))
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Image upload failed. Please try again.')
        } finally {
            setUploadingBg(false)
        }
    }

    const handleServiceImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploadingServiceImg(true)
            const result = await uploadToCloudinary(file)
            if (result.success) {
                setFormData(prev => ({ ...prev, image: result.url }))
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Image upload failed.')
        } finally {
            setUploadingServiceImg(false)
        }
    }

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features]
        newFeatures[index] = value
        setFormData({ ...formData, features: newFeatures })
    }

    const addFeatureField = () => {
        setFormData({ ...formData, features: [...formData.features, ''] })
    }

    const removeFeatureField = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index)
            setFormData({ ...formData, features: newFeatures })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const filteredFeatures = formData.features.filter(f => f.trim() !== '')

        const serviceData = {
            ...formData,
            features: filteredFeatures,
            updatedAt: new Date(),
            slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }

        if (editingService) {
            await updateDocument(editingService.id, serviceData)
        } else {
            await addDocument({
                ...serviceData,
                createdAt: new Date()
            })
        }

        resetForm()
    }

    const handleEdit = (service) => {
        setEditingService(service)
        setFormData({
            title: service.title || '',
            shortDescription: service.shortDescription || '',
            description: service.description || '',
            image: service.image || '',
            imageAlt: service.imageAlt || '',
            icon: service.icon || 'star',
            link: service.link || '',
            sortOrder: service.sortOrder || 0,
            enabled: service.enabled !== false,
            features: service.features?.length > 0 ? service.features : [''],
            duration: service.duration || '',
            price: service.price || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            await deleteDocument(serviceId)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            shortDescription: '',
            description: '',
            image: '',
            imageAlt: '',
            icon: 'star',
            link: '',
            sortOrder: servicesList.length + 1,
            enabled: true,
            features: [''],
            duration: '',
            price: ''
        })
        setEditingService(null)
        setShowForm(false)
    }

    const getIconComponent = (iconName) => {
        const iconObj = icons.find(icon => icon.value === iconName)
        const IconComponent = iconObj ? iconObj.icon : Star
        return <IconComponent className="w-6 h-6" />
    }

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Services Section Manager</h1>
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
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Description</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows="3" value={sectionConfig.description} onChange={e => setSectionConfig({ ...sectionConfig, description: e.target.value })} />
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Save Bar exactly like Hero & Philosophy */}
            <div className="fixed bottom-0 left-0 sm:left-[280px] right-0 bg-white border-t border-gray-200 p-4 px-8 z-40 flex items-center justify-between animate-fade-up shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600">You have unsaved changes in the section configuration</span>
                </div>
                <Button
                    onClick={handleSaveSectionConfig}
                    disabled={savingConfig}
                    className="bg-[#a67828] hover:bg-[#8C641C] text-white shadow-sm font-medium flex items-center space-x-2"
                >
                    {savingConfig ? (
                        <>
                            <Loading type="spinner" size="sm" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save & Publish</span>
                        </>
                    )}
                </Button>
            </div>

            {/* INDIVIDUAL SERVICES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Manage Services Cards</h2>
                    {!showForm && (
                        <Button onClick={() => { resetForm(); setShowForm(true) }} className="bg-[#a67828] hover:bg-[#8C641C] text-white px-4">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Service
                        </Button>
                    )}
                </div>

                {showForm ? (
                    <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6 mb-8 relative">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-bold text-gray-800">{editingService ? 'Edit Service' : 'Create New Service'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Form Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Service Title *</label>
                                        <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#a67828] focus:border-[#a67828]" placeholder="e.g. Astrology" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Card Short Description * (Max 150 chars)</label>
                                        <textarea required maxLength="150" rows="3" value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#a67828] focus:border-[#a67828]" placeholder="Appears directly on the card..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Card Image *</label>
                                        <div className="flex items-start space-x-4">
                                            {formData.image ? (
                                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="absolute top-1 right-1 bg-white/90 p-1 rounded-md text-red-500 hover:bg-white shadow">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input type="file" id="service-img" className="hidden" accept="image/*" onChange={handleServiceImageUpload} />
                                                <label htmlFor="service-img" className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 text-sm font-medium">
                                                    {uploadingServiceImg ? <Loading type="spinner" size="sm" /> : <ImageIcon className="w-4 h-4" />}
                                                    <span>Upload Image</span>
                                                </label>
                                                <p className="mt-2 text-sm text-gray-500 text-left">Ideal size: 600x400px. Used on the card header.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Right Form Column */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Sort Order</label>
                                            <input type="number" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Card Icon</label>
                                            <select value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                                {icons.map(ic => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <label className="flex items-center space-x-3 cursor-pointer py-2">
                                        <input type="checkbox" checked={formData.enabled} onChange={e => setFormData({ ...formData, enabled: e.target.checked })} className="rounded border-gray-300 text-[#a67828] focus:ring-[#a67828] w-4 h-4" />
                                        <span className="text-sm font-bold text-gray-700">Service Enabled (Visible on Frontend)</span>
                                    </label>

                                    {/* Additional detailed fields */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Detail Page Info</p>
                                        <div className="space-y-3">
                                            <input type="text" placeholder="Price (e.g. ₹1500)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg" />
                                            <input type="text" placeholder="Duration (e.g. 60 mins)" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* NEW DETAILS FIELDS */}
                            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Description (Optional)</label>
                                    <textarea rows="6" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#a67828] focus:border-[#a67828]" placeholder="Full description for detail page..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">What's Included (Features)</label>
                                    <div className="space-y-2">
                                        {formData.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={e => handleFeatureChange(idx, e.target.value)}
                                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-[#a67828]"
                                                    placeholder="e.g. Mantra selection and initiation"
                                                />
                                                <button type="button" onClick={() => removeFeatureField(idx)} className="text-gray-400 hover:text-red-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={addFeatureField} className="mt-2 text-sm font-semibold text-[#a67828] hover:text-[#8C641C] flex items-center">
                                        <Plus className="w-3 h-3 mr-1" /> Add Feature
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-3 justify-end pt-4 border-t border-gray-200">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#a67828] hover:bg-[#8C641C] text-white flex items-center">
                                    <Save className="w-4 h-4 mr-2" /> Save Service Card
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        {loading ? (
                            <div className="py-10"><Loading type="dots" /></div>
                        ) : servicesList.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">No services added yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {servicesList.map(service => (
                                    <div key={service.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative ${!service.enabled ? 'opacity-60' : 'border-gray-200'}`}>
                                        <div className="h-32 bg-gray-100 relative">
                                            {service.image ? (
                                                <img src={service.image} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-8 h-8" /></div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded p-1 shadow flex space-x-1">
                                                <button onClick={() => handleEdit(service)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(service.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            {!service.enabled && (
                                                <div className="absolute top-2 left-2 bg-black/70 text-white text-[14px] font-bold px-2 py-1 rounded uppercase tracking-wider">Hidden</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-gray-900 border-b-2 border-transparent">{service.title}</h3>
                                                <span className="text-sm text-gray-500 font-medium">Order: {service.sortOrder}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{service.shortDescription}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    )
}

export default ServicesManager