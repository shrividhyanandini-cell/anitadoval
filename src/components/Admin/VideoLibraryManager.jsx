import React, { useState, useEffect } from 'react'
import {
    collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { uploadToCloudinary } from '../../utils/cloudinary'
import {
    Plus, Save, Trash2, Loader, CheckCircle2, AlertCircle,
    Play, Youtube, Image as ImageIcon, Upload, Sparkles, RefreshCw, Edit3, X, ExternalLink
} from 'lucide-react'
import Loading from '../UI/Loading'
import MediaLibraryModal from './MediaLibraryModal'

export const DEFAULT_5_VIDEOS = [
    {
        id: 'patient-success-stories',
        title: 'Patient Success Stories',
        desc: 'Real experiences & life transformations through astrology and Vastu guidance.',
        url: '',
        thumbnail: '',
        order: 1,
        enabled: true
    },
    {
        id: 'joint-spine-recovery',
        title: 'Joint & Spine Recovery Videos',
        desc: 'Holistic energetic remedies, posture alignment & Vastu spatial healing.',
        url: '',
        thumbnail: '',
        order: 2,
        enabled: true
    },
    {
        id: 'weight-loss-transformations',
        title: 'Weight Loss Transformations',
        desc: 'Ayurvedic lifestyle, yogic discipline & planetary metabolism alignment.',
        url: '',
        thumbnail: '',
        order: 3,
        enabled: true
    },
    {
        id: 'liver-detox-ayurveda',
        title: 'Liver Detox and Ayurveda Videos',
        desc: 'Panchamahabhuta body cleansing, natural herbal remedies & dietary wisdom.',
        url: '',
        thumbnail: '',
        order: 4,
        enabled: true
    },
    {
        id: 'expert-health-education',
        title: 'Expert Health Education Videos',
        desc: 'Educational masterclasses bridging astrological cycles, physical health & consciousness.',
        url: '',
        thumbnail: '',
        order: 5,
        enabled: true
    }
]

const DEFAULT_SECTION_CONFIG = {
    enabled: true,
    eyebrow: 'OFFICIAL VIDEO LIBRARY',
    heading: 'Watch Client Stories & Holistic Guidance Masterclasses',
    subNote: "Subscribe to Anita Doval's YouTube channel for new weekly releases.",
    bgType: 'color',          // 'color' | 'image'
    bgColor: '#FAF7F0',
    bgImageUrl: '',
    bgAttachment: 'scroll',
    bgSize: 'cover',
    bgPosition: 'center',
}

const VideoLibraryManager = () => {
    const [section, setSection] = useState(DEFAULT_SECTION_CONFIG)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [seeding, setSeeding] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [error, setError] = useState(null)
    const [bgMediaOpen, setBgMediaOpen] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)

    // Editing state
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [addingNew, setAddingNew] = useState(false)
    const [newForm, setNewForm] = useState({
        title: '',
        desc: '',
        url: '',
        thumbnail: '',
        order: 0,
        enabled: true
    })
    const [thumbnailUploading, setThumbnailUploading] = useState(false)
    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false)
    const [thumbnailTarget, setThumbnailTarget] = useState(null) // 'new' | id

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch section config
            const configSnap = await getDoc(doc(db, 'video_library', 'config'))
            if (configSnap.exists()) {
                setSection({ ...DEFAULT_SECTION_CONFIG, ...configSnap.data() })
            }

            // Fetch videos
            const videosSnap = await getDocs(collection(db, 'video_library'))
            const items = videosSnap.docs
                .filter(d => d.id !== 'config')
                .map(d => {
                    const data = d.data()
                    return {
                        id: d.id,
                        title: data.title || '',
                        desc: data.desc || data.description || '',
                        url: data.url || data.youtubeUrl || '',
                        thumbnail: data.thumbnail || data.thumbnailUrl || '',
                        order: data.order ?? 0,
                        enabled: data.enabled !== false,
                        ...data
                    }
                })
                .sort((a, b) => (a.order || 0) - (b.order || 0))

            if (items.length > 0) {
                setVideos(items)
            } else {
                // Auto seed the 5 default videos if Firestore is completely empty
                console.log('No videos found in Firestore. Seeding default 5 videos...')
                await seedDefaultVideos(false)
            }
        } catch (err) {
            console.error('Failed to load video library', err)
            // Fallback to local default 5 videos so admin can see and edit them immediately
            setVideos(DEFAULT_5_VIDEOS)
            setError('Using local default videos. (Check Firebase connection or permissions)')
        } finally {
            setLoading(false)
        }
    }

    // Seed or reset the 5 default videos to Firebase
    const seedDefaultVideos = async (showNotice = true) => {
        setSeeding(true)
        try {
            const batchPromises = DEFAULT_5_VIDEOS.map(async (item) => {
                const docRef = doc(db, 'video_library', item.id)
                const payload = {
                    title: item.title,
                    desc: item.desc,
                    description: item.desc,
                    url: item.url,
                    youtubeUrl: item.url,
                    thumbnail: item.thumbnail,
                    thumbnailUrl: item.thumbnail,
                    order: item.order,
                    enabled: true,
                    updatedAt: serverTimestamp()
                }
                await setDoc(docRef, payload, { merge: true })
                return { id: item.id, ...payload }
            })

            const seeded = await Promise.all(batchPromises)
            setVideos(seeded)
            if (showNotice) {
                showSuccess('Successfully seeded all 5 default videos into Firebase!')
            }
        } catch (err) {
            console.error('Error seeding default videos:', err)
            setVideos(DEFAULT_5_VIDEOS)
            if (showNotice) setError('Failed to seed videos into Firebase.')
        } finally {
            setSeeding(false)
        }
    }

    const showSuccess = (msg) => {
        setSuccessMsg(msg)
        setTimeout(() => setSuccessMsg(''), 4000)
    }

    // ────── Save section config ──────
    const handleSaveSection = async () => {
        setSaving(true)
        setError(null)
        try {
            await setDoc(doc(db, 'video_library', 'config'), section, { merge: true })
            showSuccess('Video Library section settings saved!')
        } catch (err) {
            console.error(err)
            setError('Failed to save section settings.')
        } finally {
            setSaving(false)
        }
    }

    // ────── BG upload ──────
    const handleBgUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploadingBg(true)
        try {
            const result = await uploadToCloudinary(file, 'anita-doval/video-library')
            if (result.success) {
                setSection(prev => ({ ...prev, bgImageUrl: result.url, bgType: 'image' }))
            }
        } catch (err) {
            alert('Upload failed')
        } finally {
            setUploadingBg(false)
        }
    }

    // ────── Add new video ──────
    const handleAddVideo = async () => {
        if (!newForm.title.trim()) {
            alert('Please enter a Video Title.')
            return
        }
        setSaving(true)
        try {
            const payload = {
                title: newForm.title.trim(),
                desc: newForm.desc || '',
                description: newForm.desc || '',
                url: newForm.url || '',
                youtubeUrl: newForm.url || '',
                thumbnail: newForm.thumbnail || '',
                thumbnailUrl: newForm.thumbnail || '',
                order: Number(newForm.order) || videos.length + 1,
                enabled: newForm.enabled !== false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }
            const docRef = await addDoc(collection(db, 'video_library'), payload)
            setVideos(prev => [...prev, { id: docRef.id, ...payload }])
            setNewForm({ title: '', desc: '', url: '', thumbnail: '', order: 0, enabled: true })
            setAddingNew(false)
            showSuccess('New video added successfully to Firebase!')
        } catch (err) {
            console.error(err)
            setError('Failed to add video.')
        } finally {
            setSaving(false)
        }
    }

    // ────── Delete video ──────
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this video entry from Firebase?')) return
        try {
            await deleteDoc(doc(db, 'video_library', id))
            setVideos(prev => prev.filter(v => v.id !== id))
            showSuccess('Video deleted from Firebase.')
        } catch (err) {
            setError('Failed to delete.')
        }
    }

    // ────── Update video ──────
    const handleUpdateVideo = async (id) => {
        setSaving(true)
        try {
            const currentVideo = videos.find(v => v.id === id) || {}
            const title = (editForm.title !== undefined ? editForm.title : currentVideo.title) || ''
            const desc = (editForm.desc !== undefined ? editForm.desc : (currentVideo.desc || currentVideo.description || ''))
            const url = (editForm.url !== undefined ? editForm.url : (currentVideo.url || currentVideo.youtubeUrl || ''))
            const thumbnail = (editForm.thumbnail !== undefined ? editForm.thumbnail : (currentVideo.thumbnail || currentVideo.thumbnailUrl || ''))
            const order = editForm.order !== undefined ? Number(editForm.order) : (currentVideo.order || 0)
            const enabled = editForm.enabled !== undefined ? editForm.enabled : (currentVideo.enabled !== false)

            const payload = {
                title,
                desc,
                description: desc,
                url,
                youtubeUrl: url,
                thumbnail,
                thumbnailUrl: thumbnail,
                order,
                enabled,
                updatedAt: serverTimestamp()
            }

            await setDoc(doc(db, 'video_library', id), payload, { merge: true })
            setVideos(prev => prev.map(v => v.id === id ? { ...v, ...payload } : v))
            setEditingId(null)
            showSuccess('Video updated in Firebase!')
        } catch (err) {
            console.error('Update failed:', err)
            setError('Failed to update video.')
        } finally {
            setSaving(false)
        }
    }

    // ────── Thumbnail upload ──────
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setThumbnailUploading(true)
        try {
            const result = await uploadToCloudinary(file, 'anita-doval/video-thumbs')
            if (result.success) {
                if (thumbnailTarget === 'new') {
                    setNewForm(p => ({ ...p, thumbnail: result.url }))
                } else {
                    setEditForm(p => ({ ...p, thumbnail: result.url }))
                }
            }
        } catch (err) {
            alert('Thumbnail upload failed')
        } finally {
            setThumbnailUploading(false)
        }
    }

    if (loading) return <div className="p-16 flex justify-center"><Loading type="spinner" /></div>

    return (
        <div className="space-y-8 pb-16 animate-fade-in max-w-5xl mx-auto">
            {/* Top Header & Sync Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Play className="text-[#a67828]" size={26} />
                        Video Library Manager
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage videos shown across both the Connect Page (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/connect</code>) and the Homepage Video Library.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => seedDefaultVideos(true)}
                        disabled={seeding}
                        className="px-4 py-2.5 text-xs font-bold text-[#8C641C] bg-[#FAF5EC] hover:bg-[#F3EAD5] border border-[#E8DCC2] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                        title="Seed or reset the 5 default videos to Firebase"
                    >
                        {seeding ? <Loader size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Sync 5 Default Videos
                    </button>
                    <button
                        type="button"
                        onClick={() => setAddingNew(true)}
                        className="flex items-center gap-2 bg-[#a67828] hover:bg-[#8C641C] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                        <Plus size={16} /> Add Video
                    </button>
                </div>
            </div>

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

            {/* ── SECTION SETTINGS PANEL ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Play size={18} className="text-[#a67828]" /> Section Settings & Background
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Control heading, sub-note and background styling.</p>
                    </div>
                    <button
                        onClick={handleSaveSection}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#a67828] hover:bg-[#8C641C] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Settings
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Enable Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={e => setSection(p => ({ ...p, enabled: e.target.checked }))}
                            className="w-5 h-5 rounded text-[#a67828] border-gray-300 focus:ring-[#a67828] accent-[#a67828]"
                        />
                        <span className="font-semibold text-gray-800 text-sm">Show Video Library section on Homepage</span>
                    </label>

                    {/* Text Content */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Section Eyebrow</label>
                            <input
                                type="text"
                                value={section.eyebrow}
                                onChange={e => setSection(p => ({ ...p, eyebrow: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Section Heading</label>
                            <input
                                type="text"
                                value={section.heading}
                                onChange={e => setSection(p => ({ ...p, heading: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Subscribe Note (bottom)</label>
                            <input
                                type="text"
                                value={section.subNote}
                                onChange={e => setSection(p => ({ ...p, subNote: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                            />
                        </div>
                    </div>

                    {/* Background Controls */}
                    <div className="border-t border-gray-100 pt-5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Section Background</label>
                        <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 w-fit mb-5">
                            {['color', 'image'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setSection(p => ({ ...p, bgType: t }))}
                                    className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${section.bgType === t ? 'bg-white shadow-sm text-[#a67828]' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {section.bgType === 'color' ? (
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={section.bgColor}
                                    onChange={e => setSection(p => ({ ...p, bgColor: e.target.value }))}
                                    className="w-14 h-12 p-1 border border-gray-300 rounded-xl cursor-pointer"
                                />
                                <span className="text-sm font-mono text-gray-700">{section.bgColor}</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    {section.bgImageUrl ? (
                                        <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-gray-300 shrink-0">
                                            <img src={section.bgImageUrl} alt="BG Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setSection(p => ({ ...p, bgImageUrl: '' }))}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md hover:bg-red-700"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-24 bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center shrink-0">
                                            <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                            <span className="text-[11px] text-gray-400">No BG</span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Select Background:</label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setBgMediaOpen(true)}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#a67828] hover:bg-[#8C641C] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
                                            >
                                                <Sparkles size={14} /> Select from Cloudinary
                                            </button>
                                            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer">
                                                {uploadingBg ? <Loading type="spinner" size="sm" /> : <Upload size={14} className="text-[#a67828]" />}
                                                <span>{uploadingBg ? 'Uploading...' : 'Upload File'}</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} disabled={uploadingBg} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── VIDEOS LIST WITH EXACT FIELDS (title, desc, url, thumbnail) ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Youtube size={20} className="text-red-600" />
                            Video Entries ({videos.length})
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Fields: <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-[11px]">title</code>, <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-[11px]">desc</code>, <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-[11px]">url</code>, <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-[11px]">thumbnail</code>. Video URL can be added anytime.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setAddingNew(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                    >
                        <Plus size={16} /> Add Video
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {/* Add new video form */}
                    {addingNew && (
                        <div className="p-6 bg-blue-50/60 border-b border-blue-200 space-y-4">
                            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                                <Plus size={16} /> Add New Video Entry
                            </h4>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="e.g. Patient Success Stories"
                                        value={newForm.title}
                                        onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-blue-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                                        Description (desc)
                                    </label>
                                    <textarea
                                        placeholder="Short description of this session or topic..."
                                        value={newForm.desc}
                                        onChange={e => setNewForm(p => ({ ...p, desc: e.target.value }))}
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-blue-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                                        Video URL (url) <span className="text-xs font-normal text-blue-700">(Optional — Can be added later)</span>
                                    </label>
                                    <input
                                        placeholder="https://youtube.com/watch?v=... or leave blank for now"
                                        value={newForm.url}
                                        onChange={e => setNewForm(p => ({ ...p, url: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-blue-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                                        Thumbnail Image (thumbnail) <span className="text-xs font-normal text-blue-700">(Optional)</span>
                                    </label>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {newForm.thumbnail && (
                                            <div className="relative">
                                                <img src={newForm.thumbnail} alt="thumb" className="w-24 h-16 object-cover rounded-lg border border-blue-200" />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewForm(p => ({ ...p, thumbnail: '' }))}
                                                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="Paste image URL or upload below..."
                                            value={newForm.thumbnail}
                                            onChange={e => setNewForm(p => ({ ...p, thumbnail: e.target.value }))}
                                            className="flex-1 min-w-[200px] px-3 py-2 border border-blue-300 rounded-xl text-xs bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setThumbnailTarget('new'); setThumbnailModalOpen(true) }}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#a67828] text-white text-xs font-bold rounded-xl"
                                        >
                                            <Sparkles size={13} /> Select Media
                                        </button>
                                        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-blue-300 text-blue-900 text-xs font-bold rounded-xl cursor-pointer">
                                            {thumbnailUploading ? <Loading type="spinner" size="sm" /> : <Upload size={13} />}
                                            Upload
                                            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={thumbnailUploading} />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">Order</label>
                                    <input
                                        type="number"
                                        value={newForm.order}
                                        onChange={e => setNewForm(p => ({ ...p, order: e.target.value }))}
                                        className="w-24 px-3 py-2 border border-blue-300 rounded-xl text-xs bg-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleAddVideo}
                                    disabled={saving || !newForm.title.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save Video to Firebase
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddingNew(false)}
                                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Videos List */}
                    {videos.map((video, idx) => {
                        const isEditing = editingId === video.id
                        const currentTitle = editForm.title !== undefined ? editForm.title : video.title
                        const currentDesc = editForm.desc !== undefined ? editForm.desc : (video.desc || video.description || '')
                        const currentUrl = editForm.url !== undefined ? editForm.url : (video.url || video.youtubeUrl || '')
                        const currentThumb = editForm.thumbnail !== undefined ? editForm.thumbnail : (video.thumbnail || video.thumbnailUrl || '')
                        const currentOrder = editForm.order !== undefined ? editForm.order : (video.order || idx + 1)

                        return (
                            <div key={video.id} className="p-5">
                                {isEditing ? (
                                    /* Edit Form */
                                    <div className="space-y-4 bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                                                <Edit3 size={15} /> Editing Video: {video.title}
                                            </h4>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="text-amber-800 hover:text-amber-950 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                                                    Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    placeholder="Video Title"
                                                    value={currentTitle}
                                                    onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                                                    Description (desc)
                                                </label>
                                                <textarea
                                                    placeholder="Description"
                                                    value={currentDesc}
                                                    onChange={e => setEditForm(p => ({ ...p, desc: e.target.value }))}
                                                    rows={2}
                                                    className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none resize-none"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                                                    Video URL (url) <span className="text-xs font-normal text-amber-700">(YouTube / Video Link — Can be updated anytime)</span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        placeholder="https://youtube.com/watch?v=... or leave blank"
                                                        value={currentUrl}
                                                        onChange={e => setEditForm(p => ({ ...p, url: e.target.value }))}
                                                        className="flex-1 px-4 py-2.5 border border-amber-300 rounded-xl text-xs bg-white focus:outline-none font-mono"
                                                    />
                                                    {currentUrl && (
                                                        <a
                                                            href={currentUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
                                                            title="Test Video URL"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                                                    Thumbnail Image (thumbnail)
                                                </label>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    {currentThumb && (
                                                        <div className="relative">
                                                            <img src={currentThumb} alt="thumb" className="w-24 h-16 object-cover rounded-lg border border-amber-200" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditForm(p => ({ ...p, thumbnail: '' }))}
                                                                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="text"
                                                        placeholder="Paste image URL..."
                                                        value={currentThumb}
                                                        onChange={e => setEditForm(p => ({ ...p, thumbnail: e.target.value }))}
                                                        className="flex-1 min-w-[200px] px-3 py-2 border border-amber-300 rounded-xl text-xs bg-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setThumbnailTarget(video.id); setThumbnailModalOpen(true) }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#a67828] text-white text-xs font-bold rounded-xl"
                                                    >
                                                        <Sparkles size={13} /> Select Media
                                                    </button>
                                                    <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-xl cursor-pointer">
                                                        {thumbnailUploading && thumbnailTarget === video.id ? <Loading type="spinner" size="sm" /> : <Upload size={13} />}
                                                        Upload
                                                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} onClick={() => setThumbnailTarget(video.id)} disabled={thumbnailUploading} />
                                                    </label>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">Display Order</label>
                                                <input
                                                    type="number"
                                                    value={currentOrder}
                                                    onChange={e => setEditForm(p => ({ ...p, order: e.target.value }))}
                                                    className="w-24 px-3 py-2 border border-amber-300 rounded-xl text-xs bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateVideo(video.id)}
                                                disabled={saving}
                                                className="bg-[#a67828] hover:bg-[#8C641C] text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2"
                                            >
                                                {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                                Save Changes in Firebase
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode Card */
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1976D2] to-[#42A5F5] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-xs">
                                            {idx + 1}
                                        </div>

                                        {video.thumbnail || video.thumbnailUrl ? (
                                            <img
                                                src={video.thumbnail || video.thumbnailUrl}
                                                alt={video.title}
                                                className="w-24 h-16 object-cover rounded-xl border border-gray-200 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-24 h-16 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0">
                                                <Youtube size={20} className="text-red-500 opacity-60" />
                                                <span className="text-[10px] mt-0.5">No thumb</span>
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <h4 className="font-bold text-gray-900 text-base">{video.title}</h4>
                                                <span className="text-xs text-gray-400 font-mono">#{video.order || idx + 1}</span>
                                            </div>
                                            {(video.desc || video.description) && (
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                                    {video.desc || video.description}
                                                </p>
                                            )}

                                            {/* Link Status */}
                                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                {video.url || video.youtubeUrl ? (
                                                    <a
                                                        href={video.url || video.youtubeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-lg hover:underline"
                                                    >
                                                        <Youtube size={13} />
                                                        <span className="truncate max-w-[280px]">{(video.url || video.youtubeUrl)}</span>
                                                        <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                        ⚠️ URL not added yet (Add anytime)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0 self-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(video.id)
                                                    setEditForm({
                                                        title: video.title,
                                                        desc: video.desc || video.description || '',
                                                        url: video.url || video.youtubeUrl || '',
                                                        thumbnail: video.thumbnail || video.thumbnailUrl || '',
                                                        order: video.order || idx + 1,
                                                        enabled: video.enabled !== false
                                                    })
                                                }}
                                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1"
                                                title="Edit Video"
                                            >
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(video.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Delete Video"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Media Library Modals */}
            <MediaLibraryModal
                isOpen={bgMediaOpen}
                onClose={() => setBgMediaOpen(false)}
                onSelect={(url) => {
                    setSection(p => ({ ...p, bgImageUrl: url, bgType: 'image' }))
                    setBgMediaOpen(false)
                }}
                currentUrl={section.bgImageUrl}
            />

            <MediaLibraryModal
                isOpen={thumbnailModalOpen}
                onClose={() => setThumbnailModalOpen(false)}
                onSelect={(url) => {
                    if (thumbnailTarget === 'new') {
                        setNewForm(p => ({ ...p, thumbnail: url }))
                    } else {
                        setEditForm(p => ({ ...p, thumbnail: url }))
                    }
                    setThumbnailModalOpen(false)
                }}
                currentUrl={thumbnailTarget === 'new' ? newForm.thumbnail : editForm.thumbnail}
            />
        </div>
    )
}

export default VideoLibraryManager
