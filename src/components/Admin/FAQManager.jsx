import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'HAVE QUESTIONS?',
    heading: 'Frequently \nAsked Questions',
    description: 'Find answers to common questions about our consultations, services and process.',
    buttonText: 'Contact Us',
    buttonUrl: '/contact',
    faqs: [
        { id: 'faq-1', question: 'What can I expect in a consultation?', answer: 'Our consultations provide deep insights into your current life path...' }
    ]
}

const FAQManager = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const [statusMessage, setStatusMessage] = useState(null)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'services', 'faq_config')
                const snap = await getDoc(docRef)
                if (snap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...snap.data() })
                }
            } catch (err) {
                console.error("Failed to load FAQ configuration", err)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [])

    const handleChange = (field, value) => setConfig(prev => ({ ...prev, [field]: value }))

    const handleFaqChange = (idx, field, value) => {
        const newFaqs = [...config.faqs]
        newFaqs[idx] = { ...newFaqs[idx], [field]: value }
        handleChange('faqs', newFaqs)
    }

    const addFaq = () => {
        handleChange('faqs', [...config.faqs, { id: `faq-${Date.now()}`, question: 'New Question?', answer: 'Answer here.' }])
    }

    const removeFaq = (idx) => {
        const newFaqs = [...config.faqs]
        newFaqs.splice(idx, 1)
        handleChange('faqs', newFaqs)
    }

    const handleSave = async () => {
        setSaving(true)
        setStatusMessage(null)
        try {
            await setDoc(doc(db, 'services', 'faq_config'), config)
            setStatusMessage({ type: 'success', text: 'FAQ section updated successfully!' })
            setTimeout(() => setStatusMessage(null), 3000)
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Failed to save changes.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-10 flex justify-center"><Loading type="spinner" /></div>

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
                    <p className="text-gray-600 text-sm">Manage the questions and answers displayed in the FAQ section.</p>
                </div>
                <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-2 bg-white shadow-sm">
                    <span className="text-sm font-medium text-gray-700 ml-2">Show Section:</span>
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                        <input type="checkbox" checked={config.sectionEnabled} onChange={(e) => handleChange('sectionEnabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">Text Content</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
                                <input type="text" value={config.eyebrow} onChange={(e) => handleChange('eyebrow', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                                <textarea value={config.heading} onChange={(e) => handleChange('heading', e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 font-serif" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={config.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                <input type="text" value={config.buttonText} onChange={(e) => handleChange('buttonText', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                            <h3 className="font-semibold text-lg">Questions & Answers</h3>
                            <button onClick={addFaq} className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                                <Plus size={16} /> Add FAQ
                            </button>
                        </div>

                        <div className="space-y-4">
                            {config.faqs.map((faq, idx) => (
                                <div key={faq.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                    <button onClick={() => removeFaq(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 bg-white rounded shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="mr-8">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Question {idx + 1}</label>
                                        <input type="text" value={faq.question} onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 mb-3 font-medium text-sm" />

                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Answer</label>
                                        <textarea value={faq.answer} onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-gray-200 p-4 px-8 z-40 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                    {statusMessage && statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {statusMessage?.text || 'Changes sync directly to Firestore.'}
                </span>
                <Button onClick={handleSave} disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white min-w-[120px]">
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    )
}

export default FAQManager
