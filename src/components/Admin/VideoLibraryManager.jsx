import React, { useState, useEffect } from 'react'
import {
    collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { uploadToCloudinary } from '../../utils/cloudinary'
import {
    Plus, Save, Trash2, Loader, CheckCircle2, AlertCircle,
    Play, Youtube, Image as ImageIcon, Upload, Sparkles, GripVertical, Edit3, X
} from 'lucide-react'
import Loading from '../UI/Loading'
import MediaLibraryModal from './MediaLibraryModal'

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
    const [successMsg, setSuccessMsg] = useState('')
    const [error, setError] = useState(null)
    const [bgMediaOpen, setBgMediaOpen] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)

    // Editing state
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [addingNew, setAddingNew] = useState(false)
    const [newForm, setNewForm] = useState({
        title: '', subtitle: '', description: '', youtubeUrl: '', thumbnailUrl: '', order: 0
    })
    const [thumbnailUploading, setThumbnailUploading] = useState(false)
    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false)
    const [thumbnailTarget, setThumbnailTarget] = useState(null) // 'new' | id

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
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
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => (a.order || 0) - (b.order || 0))
            setVideos(items)
        } catch (err) {
            console.error('Failed to load video library', err)
            setError('Failed to load. Check Firestore rules.')
        } finally {
            setLoading(false)
        }
    }

    const showSuccess = (msg) => {
        setSuccessMsg(msg)
        setTimeout(() => setSuccessMsg(''), 3500)
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
        if (!newForm.title.trim()) return
        setSaving(true)
        try {
            const docRef = await addDoc(collection(db, 'video_library'), {
                ...newForm,
                order: videos.length,
                enabled: true,
                createdAt: serverTimestamp()
            })
            setVideos(prev => [...prev, { id: docRef.id, ...newForm, enabled: true }])
            setNewForm({ title: '', subtitle: '', description: '', youtubeUrl: '', thumbnailUrl: '', order: 0 })
            setAddingNew(false)
            showSuccess('Video added successfully!')
        } catch (err) {
            console.error(err)
            setError('Failed to add video.')
        } finally {
            setSaving(false)
        }
    }

    // ────── Delete video ──────
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this video entry?')) return
        try {
            await deleteDoc(doc(db, 'video_library', id))
            setVideos(prev => prev.filter(v => v.id !== id))
            showSuccess('Video deleted.')
        } catch (err) {
            setError('Failed to delete.')
        }
    }

    // ────── Update video ──────
    const handleUpdateVideo = async (id) => {
        setSaving(true)
        try {
            await updateDoc(doc(db, 'video_library', id), { ...editForm })
            setVideos(prev => prev.map(v => v.id === id ? { ...v, ...editForm } : v))
            setEditingId(null)
            showSuccess('Video updated!')
        } catch (err) {
            setError('Failed to update.')
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
                    setNewForm(p => ({ ...p, thumbnailUrl: result.url }))
                } else {
                    setEditForm(p => ({ ...p, thumbnailUrl: result.url }))
                }
            }
        } catch (err) {
            alert('Upload failed')
        } finally {
            setThumbnailUploading(false)
        }
    }

    if (loading) return <div className="p-16 flex justify-center"><Loading type="spinner" /></div>

    return (
        <div className="space-y-8 pb-16 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Video Library Manager</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage the video library section content, background, and individual video items.</p>
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
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Play size={18} className="text-[#a67828]" /> Section Settings & Background</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Control heading, sub-note and background style for the entire Video Library Section.</p>
                    </div>
                    <button
                        onClick={handleSaveSection}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#a67828] hover:bg-[#8C641C] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Section
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
                                {/* BG Image Preview + Select */}
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

                                {/* BG Style Controls */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Attachment</label>
                                        <select
                                            value={section.bgAttachment}
                                            onChange={e => setSection(p => ({ ...p, bgAttachment: e.target.value }))}
                                            className="w-full text-xs font-medium p-2.5 border border-gray-300 rounded-lg bg-white"
                                        >
                                            <option value="scroll">Scroll (Normal)</option>
                                            <option value="fixed">Fixed (Parallax ✨)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Size</label>
                                        <select
                                            value={section.bgSize}
                                            onChange={e => setSection(p => ({ ...p, bgSize: e.target.value }))}
                                            className="w-full text-xs font-medium p-2.5 border border-gray-300 rounded-lg bg-white"
                                        >
                                            <option value="cover">Cover</option>
                                            <option value="contain">Contain</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Position</label>
                                        <select
                                            value={section.bgPosition}
                                            onChange={e => setSection(p => ({ ...p, bgPosition: e.target.value }))}
                                            className="w-full text-xs font-medium p-2.5 border border-gray-300 rounded-lg bg-white"
                                        >
                                            <option value="center">Center</option>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── VIDEOS LIST ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Youtube size={18} className="text-red-600" /> Video Entries ({videos.length})</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Each entry shows in the video list. Add YouTube URLs or thumbnails.</p>
                    </div>
                    <button
                        onClick={() => setAddingNew(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                    >
                        <Plus size={16} /> Add Video
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {/* Add new video form */}
                    {addingNew && (
                        <div className="p-5 bg-blue-50 border-b border-blue-200">
                            <h4 className="font-bold text-blue-800 text-sm mb-4 flex items-center gap-2"><Plus size={16} /> New Video Entry</h4>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <input
                                    placeholder="Video Title *"
                                    value={newForm.title}
                                    onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))}
                                    className="px-4 py-2.5 border border-blue-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <input
                                    placeholder="Subtitle / Category"
                                    value={newForm.subtitle}
                                    onChange={e => setNewForm(p => ({ ...p, subtitle: e.target.value }))}
                                    className="px-4 py-2.5 border border-blue-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <input
                                    placeholder="YouTube URL (https://youtube.com/...)"
                                    value={newForm.youtubeUrl}
                                    onChange={e => setNewForm(p => ({ ...p, youtubeUrl: e.target.value }))}
                                    className="px-4 py-2.5 border border-blue-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:col-span-2"
                                />

                                {/* Thumbnail */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">Thumbnail Image (Optional)</label>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {newForm.thumbnailUrl && (
                                            <img src={newForm.thumbnailUrl} alt="thumb" className="w-24 h-16 object-cover rounded-lg border border-blue-200" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => { setThumbnailTarget('new'); setThumbnailModalOpen(true) }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#a67828] text-white text-xs font-bold rounded-xl"
                                        >
                                            <Sparkles size={13} /> Select Thumbnail
                                        </button>
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-800 text-xs font-bold rounded-xl cursor-pointer">
                                            {thumbnailUploading ? <Loading type="spinner" size="sm" /> : <Upload size={13} />}
                                            Upload
                                            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={thumbnailUploading} />
                                        </label>
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Short description..."
                                    value={newForm.description}
                                    onChange={e => setNewForm(p => ({ ...p, description: e.target.value }))}
                                    rows={2}
                                    className="px-4 py-2.5 border border-blue-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:col-span-2 resize-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddVideo}
                                    disabled={saving || !newForm.title.trim()}
                                    className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save Video
                                </button>
                                <button onClick={() => setAddingNew(false)} className="btn btn-outline text-xs py-2 px-4">Cancel</button>
                            </div>
                        </div>
                    )}

                    {videos.length === 0 && !addingNew && (
                        <div className="py-16 text-center text-gray-500">
                            <Play className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-medium">No video entries yet. Click "Add Video" to get started.</p>
                        </div>
                    )}

                    {videos.map((video, idx) => (
                        <div key={video.id} className="p-5">
                            {editingId === video.id ? (
                                /* Edit Mode */
                                <div className="space-y-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                                    <h4 className="font-bold text-amber-800 text-sm flex items-center gap-2"><Edit3 size={15} /> Editing: {video.title}</h4>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <input
                                            placeholder="Title *"
                                            value={editForm.title ?? video.title}
                                            onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                                            className="px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none"
                                        />
                                        <input
                                            placeholder="Subtitle"
                                            value={editForm.subtitle ?? video.subtitle ?? ''}
                                            onChange={e => setEditForm(p => ({ ...p, subtitle: e.target.value }))}
                                            className="px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none"
                                        />
                                        <input
                                            placeholder="YouTube URL"
                                            value={editForm.youtubeUrl ?? video.youtubeUrl ?? ''}
                                            onChange={e => setEditForm(p => ({ ...p, youtubeUrl: e.target.value }))}
                                            className="px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none sm:col-span-2"
                                        />

                                        {/* Edit Thumbnail */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Thumbnail</label>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {(editForm.thumbnailUrl ?? video.thumbnailUrl) && (
                                                    <img src={editForm.thumbnailUrl ?? video.thumbnailUrl} alt="thumb" className="w-24 h-16 object-cover rounded-lg border border-amber-200" />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => { setThumbnailTarget(video.id); setThumbnailModalOpen(true) }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#a67828] text-white text-xs font-bold rounded-xl"
                                                >
                                                    <Sparkles size={13} /> Select from Cloudinary
                                                </button>
                                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 text-amber-800 text-xs font-bold rounded-xl cursor-pointer">
                                                    {thumbnailUploading && thumbnailTarget === video.id ? <Loading type="spinner" size="sm" /> : <Upload size={13} />}
                                                    Upload
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} onClick={() => setThumbnailTarget(video.id)} disabled={thumbnailUploading} />
                                                </label>
                                            </div>
                                        </div>

                                        <textarea
                                            placeholder="Description"
                                            value={editForm.description ?? video.description ?? ''}
                                            onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                                            rows={2}
                                            className="px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none resize-none sm:col-span-2"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateVideo(video.id)}
                                            disabled={saving}
                                            className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2"
                                        >
                                            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                            Update
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="btn btn-outline text-xs py-2 px-4 flex items-center gap-1"><X size={14} /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1976D2] to-[#42A5F5] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                                        {idx + 1}
                                    </div>

                                    {video.thumbnailUrl && (
                                        <img src={video.thumbnailUrl} alt={video.title} className="w-20 h-14 object-cover rounded-lg border border-gray-200 shrink-0" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <h4 className="font-bold text-gray-900 text-sm">{video.title}</h4>
                                            {video.subtitle && <span className="text-xs text-[#a67828]">— {video.subtitle}</span>}
                                        </div>
                                        {video.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{video.description}</p>}
                                        {video.youtubeUrl && (
                                            <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-red-600 mt-1 hover:underline">
                                                <Youtube size={12} /> {video.youtubeUrl.substring(0, 50)}...
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => { setEditingId(video.id); setEditForm({ ...video }) }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(video.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
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
                        setNewForm(p => ({ ...p, thumbnailUrl: url }))
                    } else {
                        setEditForm(p => ({ ...p, thumbnailUrl: url }))
                    }
                    setThumbnailModalOpen(false)
                }}
                currentUrl={thumbnailTarget === 'new' ? newForm.thumbnailUrl : editForm.thumbnailUrl}
            />
        </div>
    )
}

export default VideoLibraryManager
