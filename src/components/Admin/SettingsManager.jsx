import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Save, AlertCircle, Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react'
import Loading from '../UI/Loading'

const SettingsManager = () => {
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    const [formData, setFormData] = useState({
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
                const docRef = doc(db, 'settings', 'contact_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    const data = snap.data()
                    setFormData({
                        contact: { ...formData.contact, ...data.contact },
                        social: { ...formData.social, ...data.social }
                    })
                }
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
            const docRef = doc(db, 'settings', 'contact_config')
            await setDoc(docRef, formData, { merge: true })
            setSuccessMessage('Contact details updated successfully!')
            setTimeout(() => setSuccessMessage(''), 3000)
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
                    <h2 className="text-2xl font-bold text-gray-800">Global Contact Settings</h2>
                    <p className="text-gray-600 mt-1">Update your email, phone, location, and social media links across the website.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 justify-between text-green-700 p-4 rounded-lg border border-green-200 shadow-sm flex items-center font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {successMessage}
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
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
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
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
                                placeholder="contact@example.com"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" /> Office Address
                            </label>
                            <textarea
                                value={formData.contact.address}
                                onChange={(e) => handleChange('contact', 'address', e.target.value)}
                                placeholder="Madhya Pradesh, India"
                                rows="3"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px] resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-800">Social Media & Links</h3>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <MessageCircle size={16} className="text-green-500" /> WhatsApp Number / Link
                            </label>
                            <input
                                type="text"
                                value={formData.social.whatsapp}
                                onChange={(e) => handleChange('social', 'whatsapp', e.target.value)}
                                placeholder="https://wa.me/91..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
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
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
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
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
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
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[14px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsManager
