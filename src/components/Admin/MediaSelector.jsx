import React, { useState, useEffect } from 'react'
import { Image as ImageIcon, X, CheckCircle2 } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Loading from '../UI/Loading'

const MediaSelector = ({ uploading, onSelect, onUpload, id, accept = 'image/*', multiple = false }) => {
    const [libOpen, setLibOpen] = useState(false)
    const [media, setMedia] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState([])

    useEffect(() => {
        if (libOpen && media.length === 0) fetchMedia()
    }, [libOpen])

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const snap = await getDocs(collection(db, 'media'))
            const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            fetched.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            setMedia(fetched)
        } catch (err) {
            console.error('Failed to load media', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleSelect = (url) => {
        if (!multiple) {
            setSelected([url])
        } else {
            setSelected(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url])
        }
    }

    const handleConfirm = () => {
        if (!multiple) {
            if (selected.length > 0) onSelect(selected[0])
        } else {
            onSelect(selected)
        }
        setLibOpen(false)
        setSelected([])
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
                <input type="file" id={id} className="hidden" accept={accept} onChange={onUpload} />
                <label htmlFor={id} className="btn btn-outline flex-1 flex items-center justify-center gap-2 cursor-pointer">
                    {uploading ? <Loading type="spinner" size="sm" /> : 'Upload New'}
                </label>
                <button type="button" onClick={() => setLibOpen(true)} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                    <ImageIcon size={16} /> Select Media
                </button>
            </div>

            {libOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Media Library</h3>
                                <p className="text-sm text-gray-500 mt-1">{multiple ? 'Select multiple files' : 'Select a file'} from your previously uploaded media.</p>
                            </div>
                            <button onClick={() => setLibOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {loading ? (
                                <div className="py-12 flex justify-center"><Loading type="dots" /></div>
                            ) : media.length === 0 ? (
                                <div className="text-center py-16">
                                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No media found in your library.</p>
                                    <p className="text-sm text-gray-400 mt-1">Go to Media Management tab to upload or Auto-Sync existing files.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {media.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleSelect(item.url)}
                                            className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer ${selected.includes(item.url) ? 'border-gold-500' : 'border-gray-200'}`}
                                        >
                                            <div className="aspect-square bg-white flex items-center justify-center">
                                                <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                                            </div>
                                            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${selected.includes(item.url) ? 'bg-gold-500 text-white' : 'bg-black/20 text-transparent opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                                                <CheckCircle2 size={16} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 lg:p-6 border-t border-gray-100 bg-white flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">{selected.length} Selected</span>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setLibOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="button" onClick={handleConfirm} disabled={selected.length === 0} className="btn btn-primary px-8">Confirm Selection</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MediaSelector
