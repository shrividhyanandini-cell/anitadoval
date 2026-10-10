import React, { useState } from 'react'
import { Image as ImageIcon, Trash2 } from 'lucide-react'
import { uploadToCloudinary } from '../../utils/cloudinary'
import Loading from '../UI/Loading'

const SectionStyleEditor = ({ styleConfig, setStyleConfig, label = "Section Styling" }) => {
    const [uploadingBg, setUploadingBg] = useState(false)
    const [deviceTab, setDeviceTab] = useState('desktop') // 'desktop', 'tablet', 'mobile'

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
                ...prev[parent],
                [field]: value
            }
        }))
    }

    const handleBgUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadingBg(true)
            const result = await uploadToCloudinary(file)
            if (result.success) {
                const urlField = deviceTab === 'desktop' ? 'url' : `${deviceTab}Url`
                updateNestedStyle('bgImage', urlField, result.url)
            }
        } catch (error) {
            alert('Image upload failed.')
        } finally {
            setUploadingBg(false)
        }
    }

    const getImgField = (baseField) => {
        return deviceTab === 'desktop' ? baseField : `${deviceTab}${baseField.charAt(0).toUpperCase() + baseField.slice(1)}`
    }

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
                                onClick={() => updateStyle('bgType', type)}
                                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${styleConfig.bgType === type ? 'bg-primary-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
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
                            onClick={() => updateStyle('textTheme', 'dark')}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${styleConfig.textTheme === 'dark' ? 'bg-gray-800 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            Dark Text (Black)
                        </button>
                        <button
                            onClick={() => updateStyle('textTheme', 'light')}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${styleConfig.textTheme === 'light' ? 'bg-gray-200 text-gray-900 border-l border-gray-300' : 'hover:bg-gray-50 text-gray-700 border-l border-gray-300'}`}
                        >
                            Light Text (White)
                        </button>
                    </div>
                </div>
            </div>

            {/* Solid Color Config */}
            {styleConfig.bgType === 'color' && (
                <div className="flex items-center space-x-4 mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Solid Color:</label>
                    <input
                        type="color"
                        value={styleConfig.bgColor || '#ffffff'}
                        onChange={(e) => updateStyle('bgColor', e.target.value)}
                        className="w-12 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">{styleConfig.bgColor || '#ffffff'}</span>
                </div>
            )}

            {/* Gradient Config */}
            {styleConfig.bgType === 'gradient' && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Color</label>
                        <input
                            type="color"
                            value={styleConfig.gradientColors?.start || '#FBF8F1'}
                            onChange={(e) => updateNestedStyle('gradientColors', 'start', e.target.value)}
                            className="w-full h-10 p-1 border border-gray-300 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">End Color</label>
                        <input
                            type="color"
                            value={styleConfig.gradientColors?.end || '#FFFFFF'}
                            onChange={(e) => updateNestedStyle('gradientColors', 'end', e.target.value)}
                            className="w-full h-10 p-1 border border-gray-300 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Direction</label>
                        <select
                            value={styleConfig.gradientColors?.direction || '180deg'}
                            onChange={(e) => updateNestedStyle('gradientColors', 'direction', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                    <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                        {['desktop', 'tablet', 'mobile'].map(device => (
                            <button
                                key={device}
                                onClick={() => setDeviceTab(device)}
                                className={`flex-1 py-1.5 text-sm font-medium capitalize rounded-md transition-colors ${deviceTab === device ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                {device}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-start space-x-4">
                        {styleConfig.bgImage?.[getImgField('url')] ? (
                            <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                                <img src={styleConfig.bgImage[getImgField('url')]} alt={`${deviceTab} Preview`} className="w-full h-full object-cover" />
                                <button onClick={() => updateNestedStyle('bgImage', getImgField('url'), '')} className="absolute top-1 right-1 bg-white/90 p-1 rounded-md text-red-500 hover:bg-white shadow"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <div className="w-32 h-24 bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center shrink-0">
                                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-[14px] text-gray-400 capitalize">{deviceTab} BG</span>
                            </div>
                        )}
                        <div className="flex-1">
                            <input type="file" id={`bg-upload-${label.replace(/\s+/g, '')}-${deviceTab}`} className="hidden" accept="image/*" onChange={handleBgUpload} />
                            <label htmlFor={`bg-upload-${label.replace(/\s+/g, '')}-${deviceTab}`} className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 text-sm font-medium mb-3">
                                {uploadingBg ? <Loading type="spinner" size="sm" /> : <ImageIcon className="w-4 h-4" />}
                                <span>Upload {deviceTab.charAt(0).toUpperCase() + deviceTab.slice(1)} Background</span>
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Background Size</label>
                                    <select value={styleConfig.bgImage?.[getImgField('size')] || 'cover'} onChange={(e) => updateNestedStyle('bgImage', getImgField('size'), e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white">
                                        <option value="cover">Cover (Fills Space)</option>
                                        <option value="contain">Contain (Fits inside)</option>
                                        <option value="auto">Auto (Original size)</option>
                                        <option value="100% 100%">Stretch (100% 100%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Position</label>
                                    <select value={styleConfig.bgImage?.[getImgField('position')] || 'center'} onChange={(e) => updateNestedStyle('bgImage', getImgField('position'), e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white">
                                        <option value="center">Center</option>
                                        <option value="top">Top</option>
                                        <option value="bottom">Bottom</option>
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <label className="flex items-center space-x-3 cursor-pointer mb-3">
                            <input
                                type="checkbox"
                                checked={styleConfig.overlay?.enabled || false}
                                onChange={(e) => updateNestedStyle('overlay', 'enabled', e.target.checked)}
                                className="w-4 h-4 text-primary-600 rounded border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-800">Enable Color Overlay (Darkens/Lightens Image)</span>
                        </label>

                        {styleConfig.overlay?.enabled && (
                            <div className="flex items-center space-x-6 pl-7">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Overlay Color</label>
                                    <input
                                        type="color"
                                        value={styleConfig.overlay?.color || '#000000'}
                                        onChange={(e) => updateNestedStyle('overlay', 'color', e.target.value)}
                                        className="w-10 h-8 p-1 border border-gray-300 rounded cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1 max-w-[200px]">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Opacity: {styleConfig.overlay?.opacity || 0.5}</label>
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={styleConfig.overlay?.opacity || 0.5}
                                        onChange={(e) => updateNestedStyle('overlay', 'opacity', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SectionStyleEditor
