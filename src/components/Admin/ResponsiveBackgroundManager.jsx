import React, { useState } from 'react'
import { Trash2, Upload, Sparkles, Image as ImageIcon, Sliders } from 'lucide-react'
import Loading from '../UI/Loading'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import MediaLibraryModal from './MediaLibraryModal'

const ResponsiveBackgroundManager = ({ config = {}, onChange }) => {
    const [uploading, setUploading] = useState(false)
    const [device, setDevice] = useState('desktop') // 'desktop', 'tablet', 'mobile'
    const [modalOpen, setModalOpen] = useState(false)

    const getField = (baseField) => {
        if (device === 'desktop') return baseField
        return `${device}${baseField.charAt(0).toUpperCase() + baseField.slice(1)}`
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        try {
            const result = await uploadToCloudinary(file, 'anita-doval/page-headers')
            if (result.success) {
                const urlField = getField('url')
                onChange(urlField, result.url)

                // Save to Firestore media collection
                await addDoc(collection(db, 'media'), {
                    url: result.url,
                    format: result.format || 'jpg',
                    publicId: result.publicId || '',
                    bytes: result.bytes || 0,
                    createdAt: Date.now()
                }).catch(() => { })
            } else {
                alert(result.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Upload error', error)
            alert('Image upload failed.')
        } finally {
            setUploading(false)
        }
    }

    const handleSelectFromLibrary = (url) => {
        const urlField = getField('url')
        onChange(urlField, url)
    }

    const removeImage = () => {
        const urlField = getField('url')
        onChange(urlField, '')
    }

    const currentUrl = config[getField('url')] || ''
    const currentAttachment = config[getField('attachment')] || config[getField('bgAttachment')] || 'scroll'
    const currentSize = config[getField('bgSize')] || config[getField('size')] || 'cover'
    const currentRepeat = config[getField('bgRepeat')] || config[getField('repeat')] || 'no-repeat'
    const currentPosition = config[getField('bgPosition')] || config[getField('position')] || 'center'

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-base">Responsive Background Image</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Customize background per device resolution with Cloudinary or device file upload.</p>
                </div>
            </div>

            {/* Device Tabs */}
            <div className="flex bg-stone-100 rounded-xl p-1 border border-stone-200 mb-5">
                {['desktop', 'tablet', 'mobile'].map(tab => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setDevice(tab)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${device === tab ? 'bg-white shadow-sm text-[#a67828]' : 'text-stone-600 hover:text-stone-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Image Preview & Selection Options */}
            <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200 mb-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {currentUrl ? (
                        <div className="relative w-36 h-24 bg-stone-200 rounded-xl overflow-hidden border border-stone-300 shrink-0 shadow-xs">
                            <img src={currentUrl} alt="Background preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                title="Remove background"
                                className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-md hover:bg-red-700 shadow"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-36 h-24 bg-white border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center shrink-0">
                            <ImageIcon className="w-6 h-6 text-stone-400 mb-1" />
                            <span className="text-[11px] font-medium text-stone-400 capitalize">{device} Image</span>
                        </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                            Set {device.toUpperCase()} Background:
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                            {/* Option 1: Pick from Cloudinary */}
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#a67828] hover:bg-[#8C641C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                                <Sparkles size={14} />
                                <span>Select from Cloudinary</span>
                            </button>

                            {/* Option 2: Upload File */}
                            <input
                                type="file"
                                id={`resp-upload-${device}`}
                                className="hidden"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                            <label
                                htmlFor={`resp-upload-${device}`}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition-all"
                            >
                                {uploading ? <Loading type="spinner" size="sm" /> : <Upload size={14} className="text-[#a67828]" />}
                                <span>{uploading ? 'Uploading...' : 'Upload from Device'}</span>
                            </label>
                        </div>

                        {currentUrl && (
                            <p className="text-[11px] font-mono text-stone-500 truncate max-w-md pt-1">
                                {currentUrl}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Layout & Parallax Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Background Attachment (NEW: Fixed Parallax Option) */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Sliders size={13} className="text-[#a67828]" />
                        BG Attachment
                    </label>
                    <select
                        value={currentAttachment}
                        onChange={(e) => {
                            onChange(getField('attachment'), e.target.value)
                            onChange(getField('bgAttachment'), e.target.value)
                        }}
                        className="w-full text-xs font-medium p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                    >
                        <option value="scroll">Scroll (Normal)</option>
                        <option value="fixed">Fixed (Parallax Effect ✨)</option>
                        <option value="local">Local</option>
                    </select>
                    <span className="block text-[10px] text-stone-400 mt-1">
                        {currentAttachment === 'fixed' ? '✨ Stays fixed during scroll' : 'Moves naturally with scroll'}
                    </span>
                </div>

                {/* BG Size */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        BG Size
                    </label>
                    <select
                        value={currentSize}
                        onChange={(e) => {
                            onChange(getField('bgSize'), e.target.value)
                            onChange(getField('size'), e.target.value)
                        }}
                        className="w-full text-xs font-medium p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                    >
                        <option value="cover">Cover (Fill Space)</option>
                        <option value="contain">Contain (Fit inside)</option>
                        <option value="auto">Auto (Original)</option>
                        <option value="100% 100%">Stretch (100% 100%)</option>
                    </select>
                    <span className="block text-[10px] text-stone-400 mt-1">Recommended: Cover</span>
                </div>

                {/* BG Position */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        BG Position
                    </label>
                    <select
                        value={currentPosition}
                        onChange={(e) => {
                            onChange(getField('bgPosition'), e.target.value)
                            onChange(getField('position'), e.target.value)
                        }}
                        className="w-full text-xs font-medium p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                    >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                    <span className="block text-[10px] text-stone-400 mt-1">Focal alignment</span>
                </div>

                {/* BG Repeat */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        BG Repeat
                    </label>
                    <select
                        value={currentRepeat}
                        onChange={(e) => {
                            onChange(getField('bgRepeat'), e.target.value)
                            onChange(getField('repeat'), e.target.value)
                        }}
                        className="w-full text-xs font-medium p-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                    >
                        <option value="no-repeat">No Repeat</option>
                        <option value="repeat">Repeat Both</option>
                        <option value="repeat-x">Repeat Horizontal</option>
                        <option value="repeat-y">Repeat Vertical</option>
                    </select>
                    <span className="block text-[10px] text-stone-400 mt-1">Tiling option</span>
                </div>
            </div>

            {/* Cloudinary Media Modal */}
            <MediaLibraryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleSelectFromLibrary}
                currentUrl={currentUrl}
            />
        </div>
    )
}

export default ResponsiveBackgroundManager
