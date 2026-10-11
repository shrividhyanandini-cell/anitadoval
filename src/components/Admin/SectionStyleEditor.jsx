import React, { useState } from 'react'
import { Image as ImageIcon, Trash2, Upload, Sparkles, Sliders, Eye } from 'lucide-react'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Loading from '../UI/Loading'
import MediaLibraryModal from './MediaLibraryModal'

const SectionStyleEditor = ({ styleConfig, setStyleConfig, label = "Section Styling" }) => {
    const [uploadingBg, setUploadingBg] = useState(false)
    const [deviceTab, setDeviceTab] = useState('desktop') // 'desktop', 'tablet', 'mobile'
    const [mediaModalOpen, setMediaModalOpen] = useState(false)

    // Helper to safely update nested properties
    const updateStyle = (field, value) => {
        setStyleConfig(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const updateNestedStyle = (parent, field, value) => {
        setStyleConfig(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] || {}),
                [field]: value
            }
        }))
    }

    const getImgField = (baseField) => {
        return deviceTab === 'desktop' ? baseField : `${deviceTab}${baseField.charAt(0).toUpperCase() + baseField.slice(1)}`
    }

    const handleBgUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadingBg(true)
            const result = await uploadToCloudinary(file, 'anita-doval/backgrounds')
            if (result.success) {
                const urlField = getImgField('url')
                updateNestedStyle('bgImage', urlField, result.url)

                // Save to Firestore media collection so it's always preserved in Cloudinary Media Library
                await addDoc(collection(db, 'media'), {
                    url: result.url,
                    format: result.format || 'jpg',
                    publicId: result.publicId || '',
                    bytes: result.bytes || 0,
                    createdAt: Date.now()
                }).catch(() => { })
            } else {
                alert(result.error || 'Image upload failed.')
            }
        } catch (error) {
            console.error('Upload failed', error)
            alert('Image upload failed.')
        } finally {
            setUploadingBg(false)
        }
    }

    const handleSelectFromLibrary = (url) => {
        const urlField = getImgField('url')
        updateNestedStyle('bgImage', urlField, url)
    }

    const activeImageUrl = styleConfig.bgImage?.[getImgField('url')] || ''
    const activeAttachment = styleConfig.bgImage?.[getImgField('attachment')] || 'scroll'
    const activeSize = styleConfig.bgImage?.[getImgField('size')] || 'cover'
    const activePosition = styleConfig.bgImage?.[getImgField('position')] || 'center'
    const activeRepeat = styleConfig.bgImage?.[getImgField('repeat')] || 'no-repeat'

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="text-md font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">{label}</h3>

            {/* Base Configuration */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Background Type</label>
                    <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
                        {['color', 'gradient', 'image'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => updateStyle('bgType', type)}
                                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${styleConfig.bgType === type ? 'bg-[#a67828] text-white shadow-xs font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color Theme</label>
                    <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => updateStyle('textTheme', 'dark')}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${styleConfig.textTheme === 'dark' ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            Dark Text (Black)
                        </button>
                        <button
                            type="button"
                            onClick={() => updateStyle('textTheme', 'light')}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${styleConfig.textTheme === 'light' ? 'bg-gray-200 text-gray-900 font-semibold border-l border-gray-300' : 'hover:bg-gray-50 text-gray-700 border-l border-gray-300'}`}
                        >
                            Light Text (White)
                        </button>
                    </div>
                </div>
            </div>

            {/* Solid Color Config */}
            {styleConfig.bgType === 'color' && (
                <div className="flex items-center space-x-4 mb-4 bg-white p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700">Solid Color:</label>
                    <input
                        type="color"
                        value={styleConfig.bgColor || '#ffffff'}
                        onChange={(e) => updateStyle('bgColor', e.target.value)}
                        className="w-12 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-mono font-medium">{styleConfig.bgColor || '#ffffff'}</span>
                </div>
            )}

            {/* Gradient Config */}
            {styleConfig.bgType === 'gradient' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-white p-4 rounded-xl border border-gray-200">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={styleConfig.gradientColors?.start || '#FBF8F1'}
                                onChange={(e) => updateNestedStyle('gradientColors', 'start', e.target.value)}
                                className="w-10 h-9 p-1 border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="text-xs font-mono text-gray-500">{styleConfig.gradientColors?.start || '#FBF8F1'}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">End Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={styleConfig.gradientColors?.end || '#FFFFFF'}
                                onChange={(e) => updateNestedStyle('gradientColors', 'end', e.target.value)}
                                className="w-10 h-9 p-1 border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="text-xs font-mono text-gray-500">{styleConfig.gradientColors?.end || '#FFFFFF'}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Direction</label>
                        <select
                            value={styleConfig.gradientColors?.direction || '180deg'}
                            onChange={(e) => updateNestedStyle('gradientColors', 'direction', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                        >
                            <option value="180deg">Bottom (180&deg;)</option>
                            <option value="90deg">Right (90&deg;)</option>
                            <option value="135deg">Diagonal (135&deg;)</option>
                            <option value="0deg">Top (0&deg;)</option>
                            <option value="circle">Radial Focus (Circle)</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Image Config */}
            {styleConfig.bgType === 'image' && (
                <div className="space-y-4">
                    {/* Device Tabs */}
                    <div className="flex bg-gray-200/80 rounded-xl p-1 border border-gray-300">
                        {['desktop', 'tablet', 'mobile'].map(device => (
                            <button
                                key={device}
                                type="button"
                                onClick={() => setDeviceTab(device)}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${deviceTab === device ? 'bg-white shadow-sm text-[#a67828]' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                {device}
                            </button>
                        ))}
                    </div>

                    {/* Image Selection Actions */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Thumbnail Preview */}
                            {activeImageUrl ? (
                                <div className="relative w-36 h-24 rounded-xl overflow-hidden border-2 border-stone-200 shrink-0 bg-stone-100 shadow-xs">
                                    <img
                                        src={activeImageUrl}
                                        alt={`${deviceTab} Preview`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateNestedStyle('bgImage', getImgField('url'), '')}
                                        title="Remove Background"
                                        className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-md hover:bg-red-700 shadow transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-36 h-24 bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center shrink-0">
                                    <ImageIcon className="w-6 h-6 text-stone-400 mb-1" />
                                    <span className="text-[12px] font-medium text-stone-400 capitalize">{deviceTab} BG</span>
                                </div>
                            )}

                            {/* Dual Selection Option: Cloudinary vs File Upload */}
                            <div className="flex-1 w-full space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                                    Choose Background Source for {deviceTab.toUpperCase()}:
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    {/* Option 1: Pick from Cloudinary */}
                                    <button
                                        type="button"
                                        onClick={() => setMediaModalOpen(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#a67828] hover:bg-[#8C641C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        <Sparkles size={14} />
                                        <span>Select from Cloudinary</span>
                                    </button>

                                    {/* Option 2: Upload New File */}
                                    <input
                                        type="file"
                                        id={`bg-upload-${label.replace(/\s+/g, '')}-${deviceTab}`}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleBgUpload}
                                        disabled={uploadingBg}
                                    />
                                    <label
                                        htmlFor={`bg-upload-${label.replace(/\s+/g, '')}-${deviceTab}`}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition-all"
                                    >
                                        {uploadingBg ? <Loading type="spinner" size="sm" /> : <Upload size={14} className="text-[#a67828]" />}
                                        <span>{uploadingBg ? 'Uploading...' : 'Upload from Device'}</span>
                                    </label>
                                </div>

                                {activeImageUrl && (
                                    <p className="text-[11px] text-stone-500 font-mono truncate max-w-md pt-1">
                                        URL: {activeImageUrl}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Styling Controls Grid: Size, Position, Attachment, Repeat */}
                        <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Background Attachment (NEW: Fixed Parallax Option) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Sliders size={13} className="text-[#a67828]" />
                                    BG Attachment
                                </label>
                                <select
                                    value={activeAttachment}
                                    onChange={(e) => updateNestedStyle('bgImage', getImgField('attachment'), e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                                >
                                    <option value="scroll">Scroll (Normal)</option>
                                    <option value="fixed">Fixed (Parallax Effect ✨)</option>
                                    <option value="local">Local</option>
                                </select>
                                <span className="block text-[10px] text-stone-400 mt-1">
                                    {activeAttachment === 'fixed' ? '✨ Stays fixed during scroll' : 'Moves naturally with scroll'}
                                </span>
                            </div>

                            {/* Background Size */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Background Size
                                </label>
                                <select
                                    value={activeSize}
                                    onChange={(e) => updateNestedStyle('bgImage', getImgField('size'), e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                                >
                                    <option value="cover">Cover (Fills Space)</option>
                                    <option value="contain">Contain (Fits inside)</option>
                                    <option value="auto">Auto (Original size)</option>
                                    <option value="100% 100%">Stretch (100% 100%)</option>
                                </select>
                                <span className="block text-[10px] text-stone-400 mt-1">Recommended: Cover</span>
                            </div>

                            {/* Background Position */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Position
                                </label>
                                <select
                                    value={activePosition}
                                    onChange={(e) => updateNestedStyle('bgImage', getImgField('position'), e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                                >
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="top left">Top Left</option>
                                    <option value="top right">Top Right</option>
                                </select>
                                <span className="block text-[10px] text-stone-400 mt-1">Focal alignment</span>
                            </div>

                            {/* Background Repeat */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    BG Repeat
                                </label>
                                <select
                                    value={activeRepeat}
                                    onChange={(e) => updateNestedStyle('bgImage', getImgField('repeat'), e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#a67828]"
                                >
                                    <option value="no-repeat">No Repeat</option>
                                    <option value="repeat">Repeat Both</option>
                                    <option value="repeat-x">Repeat Horizontal</option>
                                    <option value="repeat-y">Repeat Vertical</option>
                                </select>
                                <span className="block text-[10px] text-stone-400 mt-1">Pattern tile</span>
                            </div>
                        </div>
                    </div>

                    {/* Color Overlay Controls */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <label className="flex items-center space-x-3 cursor-pointer mb-3">
                            <input
                                type="checkbox"
                                checked={styleConfig.overlay?.enabled || false}
                                onChange={(e) => updateNestedStyle('overlay', 'enabled', e.target.checked)}
                                className="w-4 h-4 text-[#a67828] rounded border-gray-300 focus:ring-[#a67828]"
                            />
                            <span className="text-sm font-semibold text-gray-800">Enable Color Overlay (Darkens/Lightens Image for Readability)</span>
                        </label>

                        {styleConfig.overlay?.enabled && (
                            <div className="flex items-center space-x-6 pl-7 pt-2 border-t border-gray-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Overlay Color</label>
                                    <input
                                        type="color"
                                        value={styleConfig.overlay?.color || '#000000'}
                                        onChange={(e) => updateNestedStyle('overlay', 'color', e.target.value)}
                                        className="w-10 h-8 p-1 border border-gray-300 rounded cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1 max-w-[260px]">
                                    <label className="block text-xs font-bold text-gray-600 mb-1">
                                        Opacity: {Math.round((styleConfig.overlay?.opacity ?? 0.5) * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={styleConfig.overlay?.opacity ?? 0.5}
                                        onChange={(e) => updateNestedStyle('overlay', 'opacity', parseFloat(e.target.value))}
                                        className="w-full accent-[#a67828]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Cloudinary Media Modal */}
            <MediaLibraryModal
                isOpen={mediaModalOpen}
                onClose={() => setMediaModalOpen(false)}
                onSelect={handleSelectFromLibrary}
                currentUrl={activeImageUrl}
            />
        </div>
    )
}

export default SectionStyleEditor
