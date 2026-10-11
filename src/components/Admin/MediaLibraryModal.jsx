import React, { useState, useEffect } from 'react'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { Image as ImageIcon, X, CheckCircle2, Upload, Search, Link as LinkIcon, Sparkles } from 'lucide-react'
import Loading from '../UI/Loading'

// Common preset images from the project so the library is never empty
const PRESET_SITE_IMAGES = [
    { id: 'p1', url: '/images/hero.jpg', name: 'Hero Banner' },
    { id: 'p2', url: '/images/post1.jpg', name: 'Birth Chart (Astrology)' },
    { id: 'p3', url: '/images/post2.jpg', name: 'Vastu Shastra Home' },
    { id: 'p4', url: '/images/post3.jpg', name: 'Sacred Ritual / Yagya' },
    { id: 'p5', url: '/images/post4.jpg', name: 'Vedic Compass / Vastu' },
    { id: 'p6', url: '/images/post5.jpg', name: 'Rudraksha Mala' },
    { id: 'p7', url: '/images/post6.jpg', name: 'Meditation & Spiritual' },
    { id: 'p8', url: '/images/vastu-purush.jpg', name: 'Vastu Purush Mandala' },
]

const MediaLibraryModal = ({ isOpen, onClose, onSelect, currentUrl = '' }) => {
    const [activeTab, setActiveTab] = useState('cloudinary') // 'cloudinary', 'upload', 'url', 'presets'
    const [media, setMedia] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState(currentUrl)
    const [searchQuery, setSearchQuery] = useState('')
    const [customUrlInput, setCustomUrlInput] = useState('')

    useEffect(() => {
        if (isOpen) {
            setSelectedUrl(currentUrl)
            fetchMedia()
        }
    }, [isOpen, currentUrl])

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const snap = await getDocs(collection(db, 'media'))
            const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            fetched.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            setMedia(fetched)
        } catch (err) {
            console.error('Failed to load media', err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const result = await uploadToCloudinary(file, 'anita-doval/backgrounds')
            if (result.success) {
                // Save to Firestore media collection
                await addDoc(collection(db, 'media'), {
                    url: result.url,
                    format: result.format || 'jpg',
                    publicId: result.publicId || '',
                    bytes: result.bytes || 0,
                    createdAt: Date.now()
                })
                setSelectedUrl(result.url)
                // Add to local state
                setMedia(prev => [{ id: Date.now().toString(), url: result.url, createdAt: Date.now() }, ...prev])
                setActiveTab('cloudinary')
            } else {
                alert(result.error || 'Upload failed')
            }
        } catch (err) {
            console.error('Upload error', err)
            alert('Upload failed: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleConfirm = () => {
        if (selectedUrl) {
            onSelect(selectedUrl)
            onClose()
        }
    }

    const handleApplyCustomUrl = (e) => {
        e.preventDefault()
        if (customUrlInput.trim()) {
            onSelect(customUrlInput.trim())
            onClose()
        }
    }

    if (!isOpen) return null

    const filteredMedia = media.filter(item => {
        if (!searchQuery) return true
        return item.url?.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return (
        <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-3 md:p-6 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50">
                    <div>
                        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                            <ImageIcon className="text-[#a67828]" size={20} />
                            Select Background Image
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                            Choose an existing Cloudinary image, upload a new file from your device, or paste a link.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-white">
                    <button
                        type="button"
                        onClick={() => setActiveTab('cloudinary')}
                        className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t-lg border-b-2 transition-all flex items-center gap-2 ${activeTab === 'cloudinary'
                                ? 'border-[#a67828] text-[#a67828] bg-stone-50'
                                : 'border-transparent text-stone-600 hover:text-stone-900'
                            }`}
                    >
                        <Sparkles size={14} /> Cloudinary Library ({media.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t-lg border-b-2 transition-all flex items-center gap-2 ${activeTab === 'upload'
                                ? 'border-[#a67828] text-[#a67828] bg-stone-50'
                                : 'border-transparent text-stone-600 hover:text-stone-900'
                            }`}
                    >
                        <Upload size={14} /> Upload from Device
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('presets')}
                        className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t-lg border-b-2 transition-all flex items-center gap-2 ${activeTab === 'presets'
                                ? 'border-[#a67828] text-[#a67828] bg-stone-50'
                                : 'border-transparent text-stone-600 hover:text-stone-900'
                            }`}
                    >
                        <ImageIcon size={14} /> Site Presets
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('url')}
                        className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t-lg border-b-2 transition-all flex items-center gap-2 ${activeTab === 'url'
                                ? 'border-[#a67828] text-[#a67828] bg-stone-50'
                                : 'border-transparent text-stone-600 hover:text-stone-900'
                            }`}
                    >
                        <LinkIcon size={14} /> Enter URL
                    </button>
                </div>

                {/* Tab Contents */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
                    {/* Tab 1: Cloudinary Library */}
                    {activeTab === 'cloudinary' && (
                        <div>
                            <div className="flex items-center justify-between mb-4 gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by URL or filename..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                                    />
                                </div>
                                <span className="text-xs text-stone-500">
                                    Showing {filteredMedia.length} Cloudinary images
                                </span>
                            </div>

                            {loading ? (
                                <div className="py-20 flex justify-center"><Loading type="dots" /></div>
                            ) : filteredMedia.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300">
                                    <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                                    <p className="text-stone-700 font-medium">No images uploaded to Cloudinary yet.</p>
                                    <p className="text-xs text-stone-500 mt-1 mb-4">Upload a new image or use our site presets.</p>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('upload')}
                                        className="btn btn-primary text-xs py-2 px-4"
                                    >
                                        Upload Image Now
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {filteredMedia.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedUrl(item.url)}
                                            className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer bg-white transition-all shadow-xs ${selectedUrl === item.url ? 'border-[#a67828] ring-2 ring-[#a67828]/20' : 'border-stone-200 hover:border-stone-400'
                                                }`}
                                        >
                                            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center overflow-hidden">
                                                <img src={item.url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedUrl === item.url ? 'bg-[#a67828] text-white shadow' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                                                }`}>
                                                <CheckCircle2 size={16} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Upload from Device */}
                    {activeTab === 'upload' && (
                        <div className="max-w-lg mx-auto py-8">
                            <label className="border-2 border-dashed border-stone-300 hover:border-[#a67828] bg-white rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <div className="w-16 h-16 rounded-full bg-[var(--gold-50)] text-[#a67828] flex items-center justify-center mb-4">
                                    {uploading ? <Loading type="spinner" size="sm" /> : <Upload size={28} />}
                                </div>
                                <h4 className="font-semibold text-stone-800 text-base mb-1">
                                    {uploading ? 'Uploading to Cloudinary...' : 'Click to Upload from Device'}
                                </h4>
                                <p className="text-xs text-stone-500 max-w-xs mb-3">
                                    Supports JPG, PNG, WEBP. Your file will be automatically optimized and added to your Cloudinary media library.
                                </p>
                                <span className="btn btn-primary text-xs py-2 px-5">
                                    {uploading ? 'Processing...' : 'Browse Computer / Files'}
                                </span>
                            </label>
                        </div>
                    )}

                    {/* Tab 3: Site Presets */}
                    {activeTab === 'presets' && (
                        <div>
                            <p className="text-xs text-stone-500 mb-4">
                                Select high-resolution astrology, Vastu, and spiritual photography included with the theme:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {PRESET_SITE_IMAGES.map((preset) => (
                                    <div
                                        key={preset.id}
                                        onClick={() => setSelectedUrl(preset.url)}
                                        className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer bg-white transition-all shadow-xs ${selectedUrl === preset.url ? 'border-[#a67828] ring-2 ring-[#a67828]/20' : 'border-stone-200 hover:border-stone-400'
                                            }`}
                                    >
                                        <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                        <div className="p-2.5 bg-white border-t border-stone-100">
                                            <p className="text-xs font-semibold text-stone-800 truncate">{preset.name}</p>
                                        </div>
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedUrl === preset.url ? 'bg-[#a67828] text-white shadow' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                                            }`}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Direct URL */}
                    {activeTab === 'url' && (
                        <form onSubmit={handleApplyCustomUrl} className="max-w-lg mx-auto py-8 bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
                            <h4 className="font-semibold text-stone-800 text-sm mb-2 flex items-center gap-2">
                                <LinkIcon size={16} className="text-[#a67828]" />
                                Direct Image Link (Cloudinary or Web URL)
                            </h4>
                            <p className="text-xs text-stone-500 mb-4">
                                Paste the exact link of any image hosted on Cloudinary or another secure HTTPS server.
                            </p>
                            <input
                                type="url"
                                required
                                value={customUrlInput}
                                onChange={(e) => setCustomUrlInput(e.target.value)}
                                placeholder="https://res.cloudinary.com/.../image.jpg"
                                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a67828] mb-4"
                            />
                            {customUrlInput && (
                                <div className="mb-4 aspect-video max-h-40 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center">
                                    <img
                                        src={customUrlInput}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full btn btn-primary text-sm py-2.5"
                            >
                                Use This Image
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-stone-200 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {selectedUrl ? (
                            <div className="flex items-center gap-2 text-xs text-stone-600">
                                <span className="font-semibold text-stone-900">Selected:</span>
                                <span className="max-w-[200px] md:max-w-[320px] truncate font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded">{selectedUrl}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-stone-400">No image selected</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!selectedUrl}
                            className="btn btn-primary text-xs py-2 px-6 disabled:opacity-50"
                        >
                            Confirm Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MediaLibraryModal
