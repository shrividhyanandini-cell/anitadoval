import React, { useEffect, useMemo } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Info } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { SERVICES } from '../../data/services'
import PageHeader from '../../components/UI/PageHeader'

const DigitalBrochure = () => {
    const { type } = useParams()
    const { openPopup } = usePopup()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [type])

    // Get all services belonging to this category
    const categoryServices = useMemo(() => {
        return SERVICES.filter(s => s.category === type)
    }, [type])

    // Validation
    if (type !== 'astrology' && type !== 'vastu') {
        return <Navigate to="/services" replace />
    }

    const title = type === 'astrology' ? 'Astrology Consultation Guide' : 'Vastu Shastra Guide'
    const description = type === 'astrology'
        ? "A comprehensive overview of our astrological consultation process, methodologies, and the insights you can expect."
        : "Understanding our approach to spatial energy, architectural consultation, and residential/commercial Vastu harmony."

    return (
        <div className="bg-[var(--cream-50)] min-h-screen pb-24">

            <PageHeader
                pageId={`brochure_${type}`}
                eyebrow="Official E-Brochure"
                title={title}
                description={description}
            />

            {/* Back link above content */}
            <div className="container pt-8 pb-4">
                <Link to="/services" className="inline-flex items-center text-sm font-medium text-[var(--charcoal-400)] hover:text-[var(--gold-600)] transition-colors tracking-wide uppercase">
                    <ArrowLeft size={16} className="mr-2" /> Back to Services
                </Link>
            </div>

            {/* Main Content */}
            <section className="container pt-4">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Important Notice */}
                    <div className="flex gap-4 p-6 bg-[var(--gold-50)] border border-[var(--gold-200)] rounded-xl items-start">
                        <Info className="w-6 h-6 text-[var(--gold-600)] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-serif font-medium text-[var(--charcoal-800)] text-lg mb-2">Notice Regarding Fees & Timing</h4>
                            <p className="text-sm text-[var(--charcoal-600)]">
                                The scope, duration, and fees for each consultation are dynamic and tailored to individual requirements. Precise details and commercial terms will be shared confidentially upon reviewing your initial inquiry.
                            </p>
                        </div>
                    </div>

                    {/* Service Details Iteration */}
                    <div className="space-y-16">
                        {categoryServices.map((service, idx) => (
                            <div key={service.id} className="scroll-mt-24 pt-6" id={service.slug}>

                                <h2 className="heading-md text-[var(--charcoal-800)] mb-6 flex items-center gap-4">
                                    <span className="text-[var(--gold-300)] font-sans text-3xl font-light">0{idx + 1}</span>
                                    {service.title}
                                </h2>

                                <div className="prose prose-lg max-w-none text-[var(--charcoal-600)] mb-8 whitespace-pre-line">
                                    {service.description}
                                </div>

                                {service.includes && service.includes.length > 0 && (
                                    <div className="bg-white border border-[var(--border-light)] rounded-2xl p-6 md:p-8 shadow-sm">
                                        <h3 className="font-serif font-medium text-[var(--charcoal-800)] text-xl mb-6 border-b border-[var(--border-warm)] pb-4">
                                            What to expect / Scope of work
                                        </h3>
                                        <ul className="grid md:grid-cols-2 gap-4">
                                            {service.includes.map((item, i) => (
                                                <li key={i} className="flex items-start text-[var(--charcoal-600)]">
                                                    <CheckCircle2 className="w-5 h-5 text-[var(--gold-500)] shrink-0 mr-3 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Visual Separator if not last */}
                                {idx < categoryServices.length - 1 && (
                                    <div className="my-10 w-full max-w-[200px] h-[1px] bg-[var(--border-warm)] bg-gradient-to-r from-transparent via-[var(--gold-300)] to-transparent opacity-50 mx-auto"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-20 pt-12 border-t border-[var(--border-warm)] text-center">
                        <h2 className="font-serif text-2xl mb-4 text-[var(--charcoal-800)]">Ready to proceed?</h2>
                        <p className="text-[var(--charcoal-600)] mb-8 max-w-lg mx-auto">
                            If you have identified the right service or need help selecting one, please submit an inquiry.
                        </p>
                        <button
                            onClick={() => openPopup()}
                            className="btn btn-primary"
                        >
                            Book a Consultation
                        </button>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default DigitalBrochure
