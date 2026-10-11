import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Save, AlertCircle, Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle, Image, Globe, Trash2 } from 'lucide-react'
import Loading from '../UI/Loading'

const SettingsManager = () => {
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    const [formData, setFormData] = useState({
        branding: {
            logoUrl: '',
            faviconUrl: ''
        },
        contact: {
            phone: '',
            email: '',
            address: '',
        },
        social: {
            whatsapp: '',
            instagram: '',
            facebook: '',
            youtube: ''
        }
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const globalRef = doc(db, 'settings', 'global_config')
                const contactRef = doc(db, 'settings', 'contact_config')

                const [globalSnap, contactSnap] = await Promise.all([
                    getDoc(globalRef),
                    getDoc(contactRef)
                ])

                let loadedContact = { phone: '', email: '', address: 'Madhya Pradesh, India' }
                let loadedSocial = { whatsapp: '', instagram: '', facebook: '', youtube: '' }
                let loadedBranding = { logoUrl: '', faviconUrl: '' }

                if (contactSnap.exists()) {
                    const cData = contactSnap.data()
                    if (cData.contact) loadedContact = { ...loadedContact, ...cData.contact }
                    if (cData.social) loadedSocial = { ...loadedSocial, ...cData.social }
                }

                if (globalSnap.exists()) {
                    const gData = globalSnap.data()
                    if (gData.contact) loadedContact = { ...loadedContact, ...gData.contact }
                    if (gData.social) loadedSocial = { ...loadedSocial, ...gData.social }
                    if (gData.branding) loadedBranding = { ...loadedBranding, ...gData.branding }
                }

                setFormData({
                    branding: loadedBranding,
                    contact: loadedContact,
                    social: loadedSocial
                })
            } catch (err) {
                console.error('Error fetching settings:', err)
                setError('Failed to load settings.')
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const handleChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        setSuccessMessage('')

        try {
            // Save to both global_config and contact_config for full backwards compatibility
            const globalRef = doc(db, 'settings', 'global_config')
            const contactRef = doc(db, 'settings', 'contact_config')

            await Promise.all([
                setDoc(globalRef, formData, { merge: true }),
                setDoc(contactRef, { contact: formData.contact, social: formData.social }, { merge: true })
            ])

            setSuccessMessage('Branding and settings updated successfully!')
            setTimeout(() => setSuccessMessage(''), 3500)
        } catch (err) {
            console.error('Error saving settings:', err)
            setError('Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Loading type="dots" /></div>

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Global Website Settings & Logo</h2>
                    <p className="text-gray-600 mt-1">Manage brand logo, favicon, contact details, and social media links across the storefront.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                    Save Changes
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
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {successMessage}
                    </div>
                </div>
            )}

            {/* Logo & Branding Management */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <Image size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Logo & Brand Identity</h3>
                </div>
                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo Image URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.branding.logoUrl}
                                    onChange={(e) => handleChange('branding', 'logoUrl', e.target.value)}
                                    placeholder="https://... or /images/logo.png"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter image URL or select from Media Library. If left empty, the website will display the default gold "A" Anita Doval monogram.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Favicon URL (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.branding.faviconUrl}
                                    onChange={(e) => handleChange('branding', 'faviconUrl', e.target.value)}
                                    placeholder="https://... or /favicon.ico"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                />
                            </div>

                            {formData.branding.logoUrl && (
                                <button
                                    type="button"
                                    onClick={() => handleChange('branding', 'logoUrl', '')}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 pt-1"
                                >
                                    <Trash2 size={13} />
                                    Reset to Default Monogram Logo
                                </button>
                            )}
                        </div>

                        {/* Live Preview of Header Logo */}
                        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Live Header Preview</p>
                            <div className="bg-white p-4 rounded-xl border border-stone-200 inline-flex items-center gap-3 shadow-xs min-h-[64px]">
                                {formData.branding.logoUrl ? (
                                    <img
                                        src={formData.branding.logoUrl}
                                        alt="Uploaded Logo Preview"
                                        className="h-10 max-w-[180px] object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--gold-400)] text-white font-serif text-lg leading-none pt-1">
                                            A
                                        </div>
                                        <div className="text-left leading-tight">
                                            <span className="block font-serif font-medium text-lg text-stone-900">
                                                Anita Doval
                                            </span>
                                            <span className="block text-[10px] tracking-wider text-stone-500 uppercase">
                                                Astrologer & Vastuvid
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-[11px] text-stone-400 mt-3">
                                {formData.branding.logoUrl ? 'Custom logo active.' : 'Using default monogram.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                        <MapPin size={18} className="text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Contact Information</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" /> Phone Number
                            </label>
                            <input
                                type="text"
                                value={formData.contact.phone}
                                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                                placeholder="+91-XXXXXXXXXX"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.contact.email}
                                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                                placeholder="contact@anitadoval.com"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" /> Office Address (Should be "Madhya Pradesh, India")
                            </label>
                            <input
                                type="text"
                                value={formData.contact.address}
                                onChange={(e) => handleChange('contact', 'address', e.target.value)}
                                placeholder="Madhya Pradesh, India"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                        <Globe size={18} className="text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Social Media & WhatsApp</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <MessageCircle size={16} className="text-green-500" /> WhatsApp Number / Chat Link
                            </label>
                            <input
                                type="text"
                                value={formData.social.whatsapp}
                                onChange={(e) => handleChange('social', 'whatsapp', e.target.value)}
                                placeholder="https://wa.me/91... or +919876543210"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Instagram size={16} className="text-pink-600" /> Instagram URL
                            </label>
                            <input
                                type="text"
                                value={formData.social.instagram}
                                onChange={(e) => handleChange('social', 'instagram', e.target.value)}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Facebook size={16} className="text-blue-600" /> Facebook URL
                            </label>
                            <input
                                type="text"
                                value={formData.social.facebook}
                                onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Youtube size={16} className="text-red-500" /> YouTube URL
                            </label>
                            <input
                                type="text"
                                value={formData.social.youtube}
                                onChange={(e) => handleChange('social', 'youtube', e.target.value)}
                                placeholder="https://youtube.com/..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsManager
