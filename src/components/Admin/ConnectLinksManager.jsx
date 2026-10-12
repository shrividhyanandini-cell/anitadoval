import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { SITE_CONFIG, WA_NUMBER } from '../../data/siteConfig'
import {
    Save, Loader, CheckCircle2, AlertCircle, ExternalLink, RefreshCw,
    Link as LinkIcon, MessageSquare, Globe, MapPin, Share2, Instagram,
    Facebook, Linkedin, Twitter, Youtube, Calendar, Search
} from 'lucide-react'
import Loading from '../UI/Loading'

const DEFAULT_CONNECT_LINKS = {
    book: {
        actionType: 'popup', // 'popup' | 'custom_url'
        customUrl: '',
        label: 'Book Appointment'
    },
    waBusiness: {
        url: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Anita Ma'am, I would like to connect on WhatsApp.")}`,
        label: 'Connect On WhatsApp'
    },
    website: {
        url: 'https://anitadoval.com',
        label: 'Visit Website'
    },
    location: {
        url: 'https://maps.google.com/?q=Madhya+Pradesh+India',
        label: 'Location (Google Maps)'
    },
    whatsapp: {
        url: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Anita Ma'am, I would like to inquire about a consultation.")}`,
        label: 'WhatsApp'
    },
    facebook: {
        url: 'https://facebook.com',
        label: 'Facebook'
    },
    instagram: {
        url: 'https://instagram.com',
        label: 'Instagram'
    },
    linkedin: {
        url: 'https://linkedin.com',
        label: 'LinkedIn'
    },
    twitter: {
        url: 'https://twitter.com',
        label: 'Twitter / X'
    },
    youtube: {
        url: 'https://youtube.com',
        label: 'YouTube'
    },
    google: {
        url: 'https://google.com',
        label: 'Google Review / Profile'
    }
}

const ConnectLinksManager = () => {
    const [links, setLinks] = useState(DEFAULT_CONNECT_LINKS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchLinks()
    }, [])

    const fetchLinks = async () => {
        setLoading(true)
        setError(null)
        try {
            const docRef = doc(db, 'settings', 'connect_links')
            const snap = await getDoc(docRef)
            if (snap.exists()) {
                const data = snap.data()
                setLinks(prev => ({
                    ...prev,
                    ...data,
                    book: { ...prev.book, ...(data.book || {}) },
                    waBusiness: { ...prev.waBusiness, ...(data.waBusiness || {}) },
                    website: { ...prev.website, ...(data.website || {}) },
                    location: { ...prev.location, ...(data.location || {}) },
                    whatsapp: { ...prev.whatsapp, ...(data.whatsapp || {}) },
                    facebook: { ...prev.facebook, ...(data.facebook || {}) },
                    instagram: { ...prev.instagram, ...(data.instagram || {}) },
                    linkedin: { ...prev.linkedin, ...(data.linkedin || {}) },
                    twitter: { ...prev.twitter, ...(data.twitter || {}) },
                    youtube: { ...prev.youtube, ...(data.youtube || {}) },
                    google: { ...prev.google, ...(data.google || {}) },
                }))
            }
        } catch (err) {
            console.error('Error fetching connect links:', err)
            setError('Failed to load links from Firebase.')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            await setDoc(doc(db, 'settings', 'connect_links'), links, { merge: true })
            setSuccessMsg('All Connect & QR Hub links saved successfully!')
            setTimeout(() => setSuccessMsg(''), 3500)
        } catch (err) {
            console.error('Error saving connect links:', err)
            setError('Failed to save links to Firebase. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleResetDefaults = () => {
        if (window.confirm('Reset all links to recommended defaults? Any custom links will be replaced.')) {
            setLinks(DEFAULT_CONNECT_LINKS)
        }
    }

    const updateLink = (key, field, value) => {
        setLinks(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }))
    }

    if (loading) {
        return <div className="p-16 flex justify-center"><Loading type="spinner" /></div>
    }

    const linkConfigs = [
        {
            key: 'book',
            title: 'Book Appointment',
            subtitle: 'Grid Button 1 (Top Left)',
            icon: Calendar,
            color: 'bg-red-50 text-red-700 border-red-200',
            isSpecialBook: true
        },
        {
            key: 'waBusiness',
            title: 'Connect On WhatsApp',
            subtitle: 'Grid Button 2 (Green B icon)',
            icon: MessageSquare,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            placeholder: `https://wa.me/${WA_NUMBER}?text=...`
        },
        {
            key: 'website',
            title: 'Visit Website',
            subtitle: 'Grid Button 3 (Globe icon)',
            icon: Globe,
            color: 'bg-blue-50 text-blue-700 border-blue-200',
            placeholder: 'https://anitadoval.com or /'
        },
        {
            key: 'location',
            title: 'Location (Google Maps)',
            subtitle: 'Grid Button 4 (Red Pin icon)',
            icon: MapPin,
            color: 'bg-rose-50 text-rose-700 border-rose-200',
            placeholder: 'https://maps.google.com/?q=...'
        },
        {
            key: 'whatsapp',
            title: 'WhatsApp Direct',
            subtitle: 'Grid Button 5 (WhatsApp Logo)',
            icon: MessageSquare,
            color: 'bg-green-50 text-green-700 border-green-200',
            placeholder: `https://wa.me/${WA_NUMBER}`
        },
        {
            key: 'facebook',
            title: 'Facebook Profile / Page',
            subtitle: 'Grid Button 6 (Blue F)',
            icon: Facebook,
            color: 'bg-blue-50 text-[#1877F2] border-blue-200',
            placeholder: 'https://facebook.com/your-page'
        },
        {
            key: 'instagram',
            title: 'Instagram Profile',
            subtitle: 'Grid Button 7 (Gradient Insta)',
            icon: Instagram,
            color: 'bg-pink-50 text-pink-600 border-pink-200',
            placeholder: 'https://instagram.com/your-handle'
        },
        {
            key: 'linkedin',
            title: 'LinkedIn Profile',
            subtitle: 'Grid Button 8 (Blue IN)',
            icon: Linkedin,
            color: 'bg-sky-50 text-[#0A66C2] border-sky-200',
            placeholder: 'https://linkedin.com/in/your-profile'
        },
        {
            key: 'twitter',
            title: 'Twitter / X Profile',
            subtitle: 'Grid Button 9 (Twitter Bird)',
            icon: Twitter,
            color: 'bg-cyan-50 text-[#1DA1F2] border-cyan-200',
            placeholder: 'https://twitter.com/your-handle'
        },
        {
            key: 'youtube',
            title: 'YouTube Channel',
            subtitle: 'Grid Button 10 (Red Play)',
            icon: Youtube,
            color: 'bg-red-50 text-red-600 border-red-200',
            placeholder: 'https://youtube.com/@channel'
        },
        {
            key: 'google',
            title: 'Google Review / Search',
            subtitle: 'Grid Button 11 (Google G)',
            icon: Search,
            color: 'bg-amber-50 text-amber-700 border-amber-200',
            placeholder: 'https://g.page/r/... or https://google.com'
        }
    ]

    return (
        <div className="space-y-8 pb-16 animate-fade-in max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LinkIcon className="text-[#a67828]" size={26} />
                        Connect & QR Hub Links Manager
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage all 11 destination links shown in the "SCAN TO" grid on the Connect Page (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/connect</code>).
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCw size={14} /> Reset Defaults
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#a67828] hover:bg-[#8C641C] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                        Save All Links
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                </div>
            )}
            {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle2 size={20} /> {successMsg}
                </div>
            )}

            {/* Form List */}
            <div className="grid gap-4">
                {linkConfigs.map(item => {
                    const current = links[item.key] || {}
                    const Icon = item.icon

                    return (
                        <div
                            key={item.key}
                            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Left icon & Title */}
                                <div className="flex items-center gap-3 min-w-[240px]">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                                    </div>
                                </div>

                                {/* Right input fields */}
                                <div className="flex-1 min-w-0">
                                    {item.isSpecialBook ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="bookAction"
                                                        checked={current.actionType !== 'custom_url'}
                                                        onChange={() => updateLink('book', 'actionType', 'popup')}
                                                        className="text-[#a67828] focus:ring-[#a67828]"
                                                    />
                                                    <span>Open Consultation Inquiry Popup (Recommended)</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="bookAction"
                                                        checked={current.actionType === 'custom_url'}
                                                        onChange={() => updateLink('book', 'actionType', 'custom_url')}
                                                        className="text-[#a67828] focus:ring-[#a67828]"
                                                    />
                                                    <span>Custom URL (Calendly, Form, etc.)</span>
                                                </label>
                                            </div>

                                            {current.actionType === 'custom_url' && (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={current.customUrl || ''}
                                                        onChange={e => updateLink('book', 'customUrl', e.target.value)}
                                                        placeholder="https://calendly.com/... or booking URL"
                                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                                                    />
                                                    {current.customUrl && (
                                                        <a
                                                            href={current.customUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2.5 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-xl"
                                                            title="Test Link"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={current.url || ''}
                                                onChange={e => updateLink(item.key, 'url', e.target.value)}
                                                placeholder={item.placeholder}
                                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828] font-mono text-xs"
                                            />
                                            {current.url && (
                                                <a
                                                    href={current.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-xl shrink-0"
                                                    title="Test Link"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#a67828] hover:bg-[#8C641C] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-50"
                >
                    {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                    Save All 11 Links
                </button>
            </div>
        </div>
    )
}

export default ConnectLinksManager
