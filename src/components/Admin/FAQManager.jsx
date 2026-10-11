import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Plus, Trash2, CheckCircle2, AlertCircle, Edit, ArrowUpDown } from 'lucide-react'
import Button from '../UI/Button'
import Loading from '../UI/Loading'

const DEFAULT_CONFIG = {
    sectionEnabled: true,
    eyebrow: 'HAVE QUESTIONS?',
    heading: 'Frequently \nAsked Questions',
    description: 'Find answers to common questions about our consultations, services and process.',
    buttonText: 'Contact Us',
    buttonUrl: '/contact'
}

const FAQManager = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const [faqsList, setFaqsList] = useState([])
    const [statusMessage, setStatusMessage] = useState(null)
    const [editingFaq, setEditingFaq] = useState(null)
    const [faqForm, setFaqForm] = useState({
        id: '',
        question: '',
        answer: '',
        sortOrder: 1,
        enabled: true,
        status: 'draft'
    })
    const [showForm, setShowForm] = useState(false)

    const fetchAllData = async () => {
        try {
            setLoading(true)
            // 1. Fetch Config
            let conf = { ...DEFAULT_CONFIG }
            const faqConfRef = doc(db, 'faqs', 'faq_config')
            const faqConfSnap = await getDoc(faqConfRef)
            if (faqConfSnap.exists()) {
                conf = { ...DEFAULT_CONFIG, ...faqConfSnap.data() }
            } else {
                const legacySnap = await getDoc(doc(db, 'services', 'faq_config'))
                if (legacySnap.exists()) {
                    conf = { ...DEFAULT_CONFIG, ...legacySnap.data() }
                }
            }
            setConfig(conf)

            // 2. Fetch FAQ docs from 'faqs' collection
            const snap = await getDocs(collection(db, 'faqs'))
            let items = []
            snap.forEach(d => {
                if (!d.id.includes('_config')) {
                    items.push({ id: d.id, ...d.data() })
                }
            })

            // If no individual faqs exist in 'faqs' collection yet, check legacy array in config
            if (items.length === 0 && Array.isArray(conf.faqs) && conf.faqs.length > 0) {
                items = conf.faqs.map((f, i) => ({
                    id: f.id || `faq-${i + 1}`,
                    question: f.question,
                    answer: f.answer,
                    sortOrder: i + 1,
                    enabled: true,
                    status: 'draft'
                }))
            }

            items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            setFaqsList(items)
        } catch (err) {
            console.error("Failed to load FAQ data", err)
            setStatusMessage({ type: 'error', text: 'Error loading FAQs' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllData()
    }, [])

    const handleConfigChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

    const handleSaveConfig = async () => {
        setSaving(true)
        setStatusMessage(null)
        try {
            await setDoc(doc(db, 'faqs', 'faq_config'), config, { merge: true })
            // Backwards compatibility mirror
            await setDoc(doc(db, 'services', 'faq_config'), config, { merge: true })
            setStatusMessage({ type: 'success', text: 'FAQ section settings saved successfully!' })
            setTimeout(() => setStatusMessage(null), 3000)
        } catch (error) {
            console.error('Error saving FAQ config:', error)
            setStatusMessage({ type: 'error', text: 'Failed to save section settings.' })
        } finally {
            setSaving(false)
        }
    }

    const handleOpenAddForm = () => {
        setEditingFaq(null)
        setFaqForm({
            id: `faq-${Date.now()}`,
            question: '',
            answer: '',
            sortOrder: faqsList.length + 1,
            enabled: true,
            status: 'draft'
        })
        setShowForm(true)
    }

    const handleOpenEditForm = (item) => {
        setEditingFaq(item)
        setFaqForm({
            id: item.id,
            question: item.question || '',
            answer: item.answer || '',
            sortOrder: item.sortOrder || 1,
            enabled: item.enabled !== false,
            status: item.status || 'draft'
        })
        setShowForm(true)
    }

    const handleSaveFaqItem = async (e) => {
        e.preventDefault()
        if (!faqForm.question.trim()) {
            alert('Please enter a question')
            return
        }

        setSaving(true)
        try {
            const docId = faqForm.id || `faq-${Date.now()}`
            const payload = {
                id: docId,
                slug: docId,
                question: faqForm.question,
                answer: faqForm.answer,
                sortOrder: Number(faqForm.sortOrder) || 1,
                enabled: faqForm.enabled !== false,
                status: faqForm.status || 'draft',
                updatedAt: new Date()
            }

            await setDoc(doc(db, 'faqs', docId), payload, { merge: true })
            setStatusMessage({ type: 'success', text: `FAQ "${payload.question.slice(0, 30)}..." saved!` })
            setShowForm(false)
            await fetchAllData()
            setTimeout(() => setStatusMessage(null), 3000)
        } catch (error) {
            console.error('Error saving FAQ document:', error)
            setStatusMessage({ type: 'error', text: `Failed to save FAQ: ${error.message}` })
        } finally {
            setSaving(false)
        }
    }

    const handleToggleStatus = async (item) => {
        const nextStatus = item.status === 'published' ? 'draft' : 'published'
        try {
            await setDoc(doc(db, 'faqs', item.id), {
                status: nextStatus,
                updatedAt: new Date()
            }, { merge: true })

            setFaqsList(prev => prev.map(f => f.id === item.id ? { ...f, status: nextStatus } : f))
        } catch (err) {
            console.error('Error updating status:', err)
        }
    }

    const handleDeleteFaq = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return

        try {
            await deleteDoc(doc(db, 'faqs', id))
            setFaqsList(prev => prev.filter(f => f.id !== id))
            setStatusMessage({ type: 'success', text: 'FAQ deleted.' })
            setTimeout(() => setStatusMessage(null), 3000)
        } catch (err) {
            console.error('Error deleting FAQ:', err)
            setStatusMessage({ type: 'error', text: 'Failed to delete FAQ.' })
        }
    }

    if (loading) return <div className="p-10 flex justify-center"><Loading type="spinner" /></div>

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">FAQ Content Manager</h1>
                    <p className="text-gray-600 text-sm">Manage individual FAQs in the Firestore <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">faqs</code> collection and section layout.</p>
                </div>
                <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-2 bg-white shadow-sm">
                    <span className="text-sm font-medium text-gray-700 ml-2">Show Section:</span>
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                        <input type="checkbox" checked={config.sectionEnabled} onChange={(e) => handleConfigChange('sectionEnabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                    {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <span className="font-medium text-sm">{statusMessage.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Section Settings */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-semibold text-lg border-b border-gray-100 pb-4 mb-6">Section Text Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
                                <input type="text" value={config.eyebrow} onChange={(e) => handleConfigChange('eyebrow', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                                <textarea value={config.heading} onChange={(e) => handleConfigChange('heading', e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 font-serif" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={config.description} onChange={(e) => handleConfigChange('description', e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                <input type="text" value={config.buttonText} onChange={(e) => handleConfigChange('buttonText', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                                <input type="text" value={config.buttonUrl} onChange={(e) => handleConfigChange('buttonUrl', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 text-sm" />
                            </div>
                            <Button onClick={handleSaveConfig} loading={saving} className="w-full bg-[#A67828] hover:bg-[#8C641C] text-white">
                                Save Section Settings
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right: FAQs List & Editor */}
                <div className="lg:col-span-8 space-y-6">
                    {showForm ? (
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                                <h3 className="font-semibold text-lg">{editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}</h3>
                                <button onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            </div>

                            <form onSubmit={handleSaveFaqItem} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Question *</label>
                                    <input
                                        type="text"
                                        required
                                        value={faqForm.question}
                                        onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium"
                                        placeholder="e.g. What can I expect in a consultation?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Answer *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={faqForm.answer}
                                        onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed"
                                        placeholder="Detailed answer for the accordion..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort Order</label>
                                        <input
                                            type="number"
                                            value={faqForm.sortOrder}
                                            onChange={e => setFaqForm({ ...faqForm, sortOrder: parseInt(e.target.value) || 0 })}
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Publishing Status</label>
                                        <select
                                            value={faqForm.status}
                                            onChange={e => setFaqForm({ ...faqForm, status: e.target.value })}
                                            className={`w-full p-2 border rounded-lg text-sm font-semibold ${faqForm.status === 'published' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}
                                        >
                                            <option value="draft">Draft (Hidden)</option>
                                            <option value="published">Published (Live)</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center pt-5">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={faqForm.enabled}
                                                onChange={e => setFaqForm({ ...faqForm, enabled: e.target.checked })}
                                                className="w-4 h-4 text-[#A67828] rounded border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Enabled</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button type="submit" loading={saving} className="bg-[#A67828] hover:bg-[#8C641C] text-white">Save FAQ</Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">FAQs ({faqsList.length})</h3>
                                    <p className="text-xs text-gray-500">Only enabled FAQs with status = "published" appear on the website.</p>
                                </div>
                                <button onClick={handleOpenAddForm} className="flex items-center gap-1.5 text-[#A67828] bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors text-sm font-semibold">
                                    <Plus size={16} /> Add FAQ
                                </button>
                            </div>

                            {faqsList.length === 0 ? (
                                <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-sm">No FAQs found. Click "Add FAQ" or run the seed import from System Backup.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {faqsList.map((faq, idx) => (
                                        <div key={faq.id || idx} className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl hover:bg-white transition-all">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">#{faq.sortOrder || idx + 1}</span>
                                                        <button
                                                            onClick={() => handleToggleStatus(faq)}
                                                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider cursor-pointer transition-colors ${faq.status === 'published' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                                                            title="Click to toggle Draft / Published"
                                                        >
                                                            {faq.status === 'published' ? 'Published' : 'Draft'}
                                                        </button>
                                                        {!faq.enabled && (
                                                            <span className="bg-gray-400 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">Disabled</span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{faq.question}</h4>
                                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{faq.answer}</p>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button onClick={() => handleOpenEditForm(faq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FAQManager
