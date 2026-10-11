import React from 'react'
import { X, CheckCircle, Calendar, Clock, ArrowRight } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'

const ServiceDetailsModal = ({ service, isOpen, onClose }) => {
    const { openPopup } = usePopup()

    if (!isOpen || !service) return null

    const handleBook = () => {
        onClose()
        openPopup(service.slug || service.id)
    }

    return (
        <div
            className="fixed inset-0 z-[9500] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-[var(--cream-50)] w-full max-w-[620px] rounded-2xl md:rounded-3xl shadow-2xl border border-[var(--border-warm)] overflow-hidden relative my-auto max-h-[92dvh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Image & Close */}
                <div className="relative w-full h-[180px] sm:h-[220px] shrink-0 bg-stone-900 overflow-hidden">
                    {service.image ? (
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover opacity-90"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-stone-800 to-amber-950 opacity-90" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Close button with large tap target for iPhones */}
                    <button
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-4 left-5 right-5 text-white">
                        {service.category && (
                            <span className="inline-block px-3 py-1 bg-[var(--gold-500)] text-white text-[11px] font-semibold uppercase tracking-wider rounded-full mb-1.5 shadow-xs">
                                {service.category}
                            </span>
                        )}
                        <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-white drop-shadow-xs">
                            {service.title}
                        </h2>
                    </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-5 sm:p-7 overflow-y-auto overscroll-contain flex-1 space-y-5 text-[var(--charcoal-800)]">
                    {/* Meta Info */}
                    {(service.duration || service.price) && (
                        <div className="flex flex-wrap items-center gap-4 p-3 bg-white rounded-xl border border-[var(--border-warm)] text-xs sm:text-sm font-medium text-[var(--charcoal-600)]">
                            {service.duration && (
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} className="text-[var(--gold-600)]" />
                                    <span>Duration: <strong>{service.duration}</strong></span>
                                </div>
                            )}
                            {service.price && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-[var(--gold-600)]" />
                                    <span>Fee: <strong>{service.price}</strong></span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h4 className="font-serif text-lg font-semibold text-[var(--charcoal-900)] mb-2">
                            About this Consultation
                        </h4>
                        <p className="font-sans text-[14px] sm:text-[15px] leading-relaxed text-[var(--charcoal-700)] whitespace-pre-line">
                            {service.detailedDescription || service.description || service.shortDescription}
                        </p>
                    </div>

                    {/* Features / What's Included */}
                    {Array.isArray(service.features) && service.features.length > 0 && (
                        <div className="pt-2">
                            <h4 className="font-serif text-lg font-semibold text-[var(--charcoal-900)] mb-3">
                                What's Included
                            </h4>
                            <ul className="space-y-2">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[var(--charcoal-700)] leading-snug">
                                        <CheckCircle size={17} className="text-[var(--gold-600)] shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-5 bg-white border-t border-[var(--border-warm)] flex items-center justify-between gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="btn btn-outline text-xs sm:text-sm px-4 py-2.5"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleBook}
                        className="btn btn-primary text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                        <span>Book This Consultation</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServiceDetailsModal
