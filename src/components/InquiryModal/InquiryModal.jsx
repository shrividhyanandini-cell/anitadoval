import React, { useState, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { INQUIRY_SERVICES } from '../../data/services'
import { SITE_CONFIG } from '../../data/siteConfig'
import Button from '../UI/Button'

const InquiryModal = () => {
    const { isPopupOpen, closePopup, popupService } = usePopup()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceSlug: '',
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

        try {
            const response = await fetch(SITE_CONFIG.formEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    service: INQUIRY_SERVICES.find(s => s.slug === formData.serviceSlug)?.title || 'General Inquiry'
                })
            })

            if (!response.ok) throw new Error('Network response was not ok')

            const result = await response.json()

            if (result.success) {
                setSuccess(true)
                setTimeout(() => {
                    closePopup()
                }, 3000)
            } else {
                throw new Error(result.message || 'Failed to submit')
            }
        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please try again or contact us via WhatsApp.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={closePopup}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[var(--border-warm)] bg-[var(--cream-50)] rounded-t-[1.25rem]">
                    <h2 className="font-serif font-semibold text-2xl text-[var(--charcoal-800)]">
                        Book a Consultation
                    </h2>
                    <button
                        onClick={closePopup}
                        className="p-2 -mr-2 rounded-lg text-[var(--charcoal-600)] hover:bg-[var(--cream-200)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-medium mb-2">Request Submitted</h3>
                            <p className="text-[var(--charcoal-600)]">We will get back to you shortly to confirm your consultation.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Your number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Consultation Service</label>
                                <div className="relative">
                                    <select
                                        name="serviceSlug"
                                        value={formData.serviceSlug}
                                        onChange={handleChange}
                                        className="form-input pr-10 appearance-none bg-white"
                                    >
                                        <option value="">Select a service...</option>
                                        {INQUIRY_SERVICES.map(service => (
                                            <option key={service.id} value={service.slug}>
                                                {service.title}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--charcoal-500)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Additional Details / Question</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    className="form-input resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" loading={loading} className="w-full btn btn-primary">
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Request
                                </Button>
                                <p className="text-center text-sm text-[var(--charcoal-400)] mt-3">
                                    Your information is completely confidential and secure.
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
