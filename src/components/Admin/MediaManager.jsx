import React, { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { Upload, Image as ImageIcon, Video, Trash2, CheckCircle2, RefreshCw } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const MediaManager = () => {
    const [media, setMedia] = useState([])
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState([])
    const [syncing, setSyncing] = useState(false)

    // Fetch Media from Firestore
    useEffect(() => {
        fetchMedia()
    }, [])

    const fetchMedia = async () => {
        try {
            const snap = await getDocs(collection(db, 'media'))
            const fetchedMedia = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            // Sort by newest
            fetchedMedia.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            setMedia(fetchedMedia)
        } catch (err) {
            console.error('Failed to load media', err)
        } finally {
            setLoading(false)
        }
    }

    const autoSyncMedia = async () => {
        if (!window.confirm('Scan website and auto-sync existing images to the media library?')) return;
        setSyncing(true)
        try {
            const collectionsToScan = ['settings', 'services', 'about', 'hero_config', 'blogs', 'page_headers', 'testimonials']
            const discoveredUrls = new Set(media.map(m => m.url))
            let addedCount = 0;

            for (const col of collectionsToScan) {
                const snap = await getDocs(collection(db, col))
                snap.forEach(document => {
                    const dataStr = JSON.stringify(document.data())
                    const urls = dataStr.match(/https?:\/\/(?:res\.cloudinary\.com|firebasestorage\.googleapis\.com)[^\s"']+?(?=\.(jpg|jpeg|png|webp|gif|svg|mp4|webm))\.\w+/gi) || []

                    urls.forEach(url => {
                        if (!discoveredUrls.has(url)) {
                            discoveredUrls.add(url)
                            const format = url.split('.').pop()
                            // Add to firestore
                            addDoc(collection(db, 'media'), {
                                url: url,
                                format: format,
                                bytes: 0,
                                createdAt: Date.now()
                            })
                            addedCount++
                        }
                    })
                })
            }

            if (addedCount > 0) {
                alert(`Successfully found and synced ${addedCount} existing images!`)
                fetchMedia()
            } else {
                alert('No new images found to sync. Only new uploads will appear.')
            }
        } catch (err) {
            console.error('Sync failed', err)
            alert('Sync failed. Please check permissions.')
        } finally {
            setSyncing(false)
        }
    }

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        setUploading(true)
        const newMedia = []

        for (const file of files) {
            const result = await uploadToCloudinary(file, 'anita-doval/media')
            if (result.success) {
                const docRef = await addDoc(collection(db, 'media'), {
                    url: result.url,
                    format: result.format || 'jpg',
                    publicId: result.publicId || '',
                    bytes: result.bytes || 0,
                    createdAt: Date.now()
                })
                newMedia.push({ id: docRef.id, url: result.url, format: result.format || 'jpg', bytes: result.bytes })
            }
        }

        setMedia(prev => [...newMedia, ...prev])
        setUploading(false)
    }

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const selectAll = () => {
        if (selectedIds.length === media.length) setSelectedIds([])
        else setSelectedIds(media.map(m => m.id))
    }

    const handleDeleteSelected = async () => {
        if (!window.confirm('Delete selected media? This cannot be undone.')) return

        try {
            setLoading(true)
            for (const id of selectedIds) {
                await deleteDoc(doc(db, 'media', id))
            }
            setMedia(prev => prev.filter(m => !selectedIds.includes(m.id)))
            setSelectedIds([])
        } catch (err) {
            console.error('Error deleting', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Media Management</h2>

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{selectedIds.length} Selected</span>
                        <button onClick={selectAll} className="text-sm text-blue-600">Select All</button>
                        <Button onClick={handleDeleteSelected} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 py-1.5 px-3">
                            <Trash2 size={16} className="mr-2" /> Delete
                        </Button>
                    </div>
                )}
                {selectedIds.length === 0 && (
                    <div className="flex items-center gap-4">
                        <button onClick={autoSyncMedia} disabled={syncing} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50 transition-colors">
                            {syncing ? <Loading type="spinner" size="sm" /> : <RefreshCw size={14} />} Auto-Sync Existing Images
                        </button>
                        <button onClick={selectAll} className="text-sm text-blue-600">Select All</button>
                    </div>
                )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6">
                <input
                    type="file"
                    id="media-upload"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                />
                <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        {uploading ? <Loading type="spinner" /> : <Upload size={32} />}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Upload Files</h3>
                    <p className="text-gray-500 mb-4">Upload images securely to Cloudinary & Firebase</p>
                    <span className="btn btn-primary">Choose Files</span>
                </label>
            </div>

            {loading && <div className="p-12 flex justify-center"><Loading type="dots" /></div>}

            {!loading && media.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No Media Files Found in Firestore.</p>
                    <p className="text-gray-400 text-sm mt-1">Upload files or click "Auto-Sync Existing Images".</p>
                </div>
            )}

            {media.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => toggleSelection(item.id)}
                            className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer ${selectedIds.includes(item.id) ? 'border-gold-500' : 'border-gray-200'} transition-all`}
                        >
                            <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                {['mp4', 'webm'].includes(item.format)
                                    ? <Video className="w-12 h-12 text-gray-400" />
                                    : <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                                }
                            </div>

                            {/* Checkbox badge */}
                            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${selectedIds.includes(item.id) ? 'bg-gold-500 text-white' : 'bg-black/20 text-transparent group-hover:bg-black/40 group-hover:text-white'}`}>
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MediaManager