import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { uploadToCloudinary } from '../../utils/cloudinary'
import Button from '../UI/Button'
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react'
import Loading from '../UI/Loading'
import ResponsiveBackgroundManager from './ResponsiveBackgroundManager'

const DEFAULT_PROCESS_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'A SIMPLE AND SUPPORTIVE PROCESS',
    heading: 'Your Consultation Journey',
    buttonText: 'Start Your Consultation',
    background: {
        url: '',
        position: 'center',
        size: 'cover',
        repeat: 'no-repeat'
    },
    bgOverlay: 'Light',
    steps: [
        { id: '1', number: '01', title: 'Choose a Service', description: 'Select the consultation that best suits your needs.' },
        { id: '2', number: '02', title: 'Share Your Details', description: 'Provide the relevant information and preferred consultation method.' },
        { id: '3', number: '03', title: 'Consultation', description: 'Discuss your questions and circumstances with personalised guidance.' },
        { id: '4', number: '04', title: 'Guidance & Next Steps', description: 'Receive practical and meaningful insights for your journey ahead.' }
    ]
}

const ProcessManager = () => {
    const [config, setConfig] = useState(DEFAULT_PROCESS_CONFIG)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingBg, setUploadingBg] = useState(false)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'process_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setConfig({ ...DEFAULT_PROCESS_CONFIG, ...snap.data() })
                }
            } catch (err) {
                console.error("Failed to load config", err)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await setDoc(doc(db, 'services', 'process_config'), config)
            alert('Process Configuration Saved Successfully!')
        } catch (error) {
            console.error('Error saving config:', error)
            alert('Failed to save config')
        } finally {
            setSaving(false)
        }
    }

    const handleBgUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadingBg(true)
            const result = await uploadToCloudinary(file)
            if (result.success) {
                setConfig(prev => ({ ...prev, background: { ...prev.background, url: result.url } }))
            }
        } catch (error) {
            alert('Image upload failed.')
        } finally {
            setUploadingBg(false)
        }
    }

    const handleAddStep = () => {
        const newStep = {
            id: Date.now().toString(),
            number: `0${config.steps.length + 1}`.slice(-2),
            title: 'New Step Title',
            description: 'Step description text goes here.'
        }
        setConfig(prev => ({ ...prev, steps: [...prev.steps, newStep] }))
    }

    const handleUpdateStep = (index, field, value) => {
        const newSteps = [...config.steps]
        newSteps[index][field] = value
        setConfig(prev => ({ ...prev, steps: newSteps }))
    }

    const handleRemoveStep = (index) => {
        const newSteps = config.steps.filter((_, i) => i !== index)
        // Renumber remaining elements dynamically
        const renumbered = newSteps.map((step, idx) => ({ ...step, number: `0${idx + 1}`.slice(-2) }))
        setConfig(prev => ({ ...prev, steps: renumbered }))
    }

    if (loading) return <div className="p-10 flex justify-center"><Loading type="spinner" /></div>

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <h1 className="text-2xl font-bold text-gray-900">Consultation Journey Manager</h1>

            {/* Header & Background Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Heading & Background</h2>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Enable Section</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={config.sectionEnabled} onChange={(e) => setConfig(prev => ({ ...prev, sectionEnabled: e.target.checked }))} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${config.sectionEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${config.sectionEnabled ? 'translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow Text</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={config.eyebrow} onChange={e => setConfig({ ...config, eyebrow: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={config.heading} onChange={e => setConfig({ ...config, heading: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={config.buttonText} onChange={e => setConfig({ ...config, buttonText: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <ResponsiveBackgroundManager
                            config={config.background}
                            onChange={(field, value) => setConfig(prev => ({ ...prev, background: { ...prev.background, [field]: value } }))}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Background Overlay</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" value={config.bgOverlay} onChange={e => setConfig({ ...config, bgOverlay: e.target.value })}>
                                    <option value="None">None</option>
                                    <option value="Light">Light</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Strong">Strong</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Steps Editor */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Process Steps</h2>
                    <Button onClick={handleAddStep} className="bg-blue-50 text-blue-600 hover:bg-blue-100"><Plus className="w-4 h-4 mr-2" />Add Step</Button>
                </div>

                <div className="space-y-4">
                    {config.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 items-start">
                            <div className="w-[40px] h-[40px] rounded-full bg-[#D7B878] text-white flex items-center justify-center font-bold shrink-0">{step.number}</div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Step Title</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white" value={step.title} onChange={(e) => handleUpdateStep(index, 'title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white" rows="2" value={step.description} onChange={(e) => handleUpdateStep(index, 'description', e.target.value)} />
                                </div>
                            </div>
                            <button onClick={() => handleRemoveStep(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-6"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-gray-200 p-4 px-8 z-40 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <span className="text-sm text-gray-600">Save changes to push them live immediately.</span>
                <Button onClick={handleSave} disabled={saving} className="bg-[#a67828] hover:bg-[#8C641C] text-white">
                    {saving ? 'Saving Config...' : 'Save Process Config'}
                </Button>
            </div>
        </div>
    )
}

export default ProcessManager 
