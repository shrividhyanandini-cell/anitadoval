import React, { useState } from 'react'
import { Trash2, Upload } from 'lucide-react'
import Loading from '../UI/Loading'
import { uploadToCloudinary } from '../../utils/cloudinary'

const ResponsiveBackgroundManager = ({ config = {}, onChange }) => {
    const [uploading, setUploading] = useState(false)
    const [device, setDevice] = useState('desktop') // 'desktop', 'tablet', 'mobile'

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        try {
            const result = await uploadToCloudinary(file)
            if (result.success) {
                const urlField = device === 'desktop' ? 'url' : `${device}Url`
                onChange(urlField, result.url)
            }
        } catch (error) {
            alert('Image upload failed.')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        const urlField = device === 'desktop' ? 'url' : `${device}Url`
        onChange(urlField, '')
    }

    const getField = (baseField) => {
        if (device === 'desktop') return baseField
        // e.g. bgSize -> mobileBgSize
        return `${device}${baseField.charAt(0).toUpperCase() + baseField.slice(1)}`
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-semibold text-md">Optional Background</h3>
            </div>

            {/* Device Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 mb-4">
                {['desktop', 'tablet', 'mobile'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setDevice(tab)}
                        className={`flex-1 py-1.5 text-sm font-medium capitalize rounded-md transition-colors ${device === tab ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {config[getField('url')] ? (
                <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 flex items-center justify-center">
                    <img src={config[getField('url')]} alt="Background" className="w-full h-full object-cover opacity-50" />
                    <button onClick={removeImage} className="absolute bg-white/90 text-red-600 text-sm px-3 py-1.5 rounded shadow-sm flex items-center gap-1 hover:bg-red-50"><Trash2 size={12} /> Remove</button>
                </div>
            ) : (
                <label className="flex items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                        {uploading ? <Loading type="dots" /> : <><Upload size={16} /> Upload {device.charAt(0).toUpperCase() + device.slice(1)} BG</>}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">BG Size</label>
                    <select value={config[getField('bgSize')] || 'cover'} onChange={(e) => onChange(getField('bgSize'), e.target.value)} className="w-full text-sm p-2 border border-gray-300 rounded-lg bg-gray-50">
                        <option value="cover">Cover (Fill)</option>
                        <option value="contain">Contain (Fit)</option>
                        <option value="auto">Auto (Original)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">BG Repeat</label>
                    <select value={config[getField('bgRepeat')] || 'no-repeat'} onChange={(e) => onChange(getField('bgRepeat'), e.target.value)} className="w-full text-sm p-2 border border-gray-300 rounded-lg bg-gray-50">
                        <option value="no-repeat">No Repeat</option>
                        <option value="repeat">Repeat Both</option>
                        <option value="repeat-x">Repeat Horizontal</option>
                        <option value="repeat-y">Repeat Vertical</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">BG Position</label>
                    <select value={config[getField('bgPosition')] || 'center'} onChange={(e) => onChange(getField('bgPosition'), e.target.value)} className="w-full text-sm p-2 border border-gray-300 rounded-lg bg-gray-50">
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default ResponsiveBackgroundManager
