import React, { useState, useEffect } from 'react'
import { X, Send, Sparkles, User, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { INQUIRY_SERVICES } from '../../data/services'
import { buildWhatsAppUrl, WA_NUMBER } from '../../data/siteConfig'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Button from '../UI/Button'

const InquiryModal = () => {
    const { isPopupOpen, closePopup, popupService } = usePopup()
    const [formType, setFormType] = useState('basic') // 'basic' | 'detailed'
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceSlug: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',
        message: ''
    })

    // Pre-fill service if provided
    useEffect(() => {
        if (isPopupOpen) {
            setFormData(prev => ({
                ...prev,
                serviceSlug: popupService || ''
            }))
            setSuccess(false)
            setError(null)
            document.body.classList.add('modal-open')
        } else {
            document.body.classList.remove('modal-open')
        }
        return () => {
            document.body.classList.remove('modal-open')
        }
    }, [isPopupOpen, popupService])

    if (!isPopupOpen) return null

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const serviceTitle = INQUIRY_SERVICES.find(s => s.slug === formData.serviceSlug)?.title || 'General Inquiry'
        const finalData = { ...formData, service: serviceTitle, formType }

        try {
            // 1. Save to Firestore for records
            try {
                await addDoc(collection(db, 'inquiries'), {
                    ...finalData,
                    status: 'new',
                    createdAt: serverTimestamp()
                })
            } catch (fsErr) {
                console.warn('Firestore save notice:', fsErr)
            }

            // 2. Redirect user to WhatsApp with all details pre-filled
            const waUrl = buildWhatsAppUrl(finalData, 'Consultation Request')
            window.open(waUrl, '_blank')

            setSuccess(true)
            setTimeout(() => {
                closePopup()
            }, 2500)
        } catch (err) {
            console.error('Submission error:', err)
            // Fallback: Still open WhatsApp even if Firestore fails
            const waUrl = buildWhatsAppUrl(finalData, 'Consultation Request')
            window.open(waUrl, '_blank')
            setSuccess(true)
            setTimeout(() => closePopup(), 2500)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
            onClick={closePopup}
        >
            <div
                className="bg-[#FFFDF8] w-full max-w-[540px] rounded-2xl md:rounded-3xl shadow-2xl border border-[var(--border-warm)] overflow-hidden relative my-auto max-h-[92dvh] flex flex-col"
                onClick={e => e.stopPropagation()}
                style={{ overscrollBehavior: 'contain' }}
            >
                {/* Sticky Header with high-contrast, easily tappable close button */}
                <div className="flex justify-between items-center px-5 py-4 sm:px-6 sm:py-5 border-b border-[var(--border-warm)] bg-[var(--cream-100)] shrink-0">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-600)]">
                            Anita Doval · Consultations
                        </span>
                        <h2 className="font-serif font-semibold text-xl sm:text-2xl text-[var(--charcoal-900)] leading-tight">
                            Book a Consultation
                        </h2>
                    </div>

                    <button
                        onClick={closePopup}
                        aria-label="Close form"
                        className="w-10 h-10 rounded-full bg-white hover:bg-stone-200 border border-[var(--border-warm)] text-[var(--charcoal-700)] flex items-center justify-center shadow-xs transition-colors shrink-0 active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Switcher Tabs */}
                <div className="flex border-b border-[var(--border-warm)] bg-white px-5 sm:px-6 pt-3 gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => setFormType('basic')}
                        className={`pb-2.5 px-3 text-[13px] font-semibold transition-all border-b-2 flex items-center gap-1.5 ${formType === 'basic' ? 'border-[var(--gold-500)] text-[var(--gold-700)]' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                    >
                        <User size={15} />
                        <span>Basic Inquiry</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormType('detailed')}
                        className={`pb-2.5 px-3 text-[13px] font-semibold transition-all border-b-2 flex items-center gap-1.5 ${formType === 'detailed' ? 'border-[var(--gold-500)] text-[var(--gold-700)]' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                    >
                        <Sparkles size={15} />
                        <span>Detailed Astrology Form</span>
                    </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-[var(--charcoal-800)]">
                    {success ? (
                        <div className="text-center py-10 animate-fade-in">
                            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
                                <CheckCircle2 className="w-9 h-9 text-green-600" />
                            </div>
                            <h3 className="font-serif text-2xl font-medium mb-2 text-[var(--charcoal-900)]">Request Confirmed</h3>
                            <p className="text-[var(--charcoal-600)] text-sm max-w-sm mx-auto leading-relaxed">
                                Thank you for your inquiry. Your consultation details have been recorded securely, and our team will get back to you shortly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)] mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-[var(--gold-500)] text-[16px] transition-colors outline-hidden font-medium"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)] mb-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-[var(--gold-500)] text-[16px] transition-colors outline-hidden font-medium"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)] mb-1">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-[var(--gold-500)] text-[16px] transition-colors outline-hidden font-medium"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)] mb-1">
                                    Service Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="serviceSlug"
                                    value={formData.serviceSlug}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-white focus:border-[var(--gold-500)] text-[16px] transition-colors outline-hidden font-medium appearance-none cursor-pointer"
                                >
                                    <option value="">Select a service...</option>
                                    {INQUIRY_SERVICES.map(service => (
                                        <option key={service.id} value={service.slug}>
                                            {service.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Additional Astrological Details if 'detailed' selected */}
                            {formType === 'detailed' && (
                                <div className="p-4 bg-[var(--gold-50)]/50 rounded-2xl border border-[var(--gold-200)]/70 space-y-3.5 animate-fade-in">
                                    <p className="text-xs font-bold text-[var(--gold-800)] flex items-center gap-1.5 uppercase tracking-wider">
                                        <Sparkles size={14} /> Astrological Birth Details
                                    </p>

                                    <div>
                                        <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                                            <Calendar size={13} /> Date of Birth <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            required={formType === 'detailed'}
                                            className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-[16px] outline-hidden"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                                                <Clock size={13} /> Time of Birth
                                            </label>
                                            <input
                                                type="text"
                                                name="timeOfBirth"
                                                value={formData.timeOfBirth}
                                                onChange={handleChange}
                                                placeholder="e.g. 04:30 PM (or approximate)"
                                                className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-[16px] outline-hidden"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                                                <MapPin size={13} /> Place of Birth
                                            </label>
                                            <input
                                                type="text"
                                                name="placeOfBirth"
                                                value={formData.placeOfBirth}
                                                onChange={handleChange}
                                                placeholder="City, State, Country"
                                                className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-[16px] outline-hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)] mb-1">
                                    {formType === 'detailed' ? 'Specific Questions / Concern' : 'Message / Details'}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-[var(--gold-500)] text-[16px] transition-colors outline-hidden font-medium resize-none"
                                    placeholder={formType === 'detailed' ? "Describe career, health, relationships or specific areas you want analyzed..." : "How can we assist you?"}
                                />
                            </div>

                            <div className="pt-2">
                                <Button type="submit" loading={loading} className="w-full btn btn-primary h-12 text-sm shadow-md">
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Consultation Request
                                </Button>
                                <p className="text-center text-[11px] text-[var(--charcoal-400)] mt-2.5">
                                    Strict 100% Client Confidentiality Guaranteed.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InquiryModal
