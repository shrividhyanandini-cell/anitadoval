import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePopup } from '../../context/PopupContext'
import { useFirestore } from '../../hooks/useFirestore'
import Loading from '../../components/UI/Loading'
import PageHeader from '../../components/UI/PageHeader'

const ServicesPage = () => {
    const { openPopup } = usePopup()
    const { documents: allServices, loading } = useFirestore('services')

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Filter out config documents and sort by admin defined order
    const displayServices = allServices
        .filter(s => !s.id.includes('_config') && s.enabled !== false && s.type !== 'guide')
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-24 selection:bg-[var(--gold-500)] selection:text-white">

            <PageHeader
                pageId="services"
                eyebrow="Official Services"
                title="Expert Consultation & Guidance"
                description="Explore our comprehensive range of services across Vedic astrology, Vastu Shastra, and spiritual practices. Each consultation is thoughtfully tailored to your unique circumstances and birth chart."
            />

            {/* Premium Services Grid */}
            <section className="container max-w-[1240px] px-4 md:px-8 mt-16">
                {loading ? (
                    <div className="flex justify-center p-20"><Loading type="spinner" /></div>
                ) : displayServices.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-[#E9E4DC]">
                        <p className="text-[var(--charcoal-500)]">No services available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {displayServices.map((service) => (
                            <div
                                key={service.id}
                                className="group flex flex-col bg-white rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(35,31,28,0.04)] hover:shadow-[0_12px_45px_rgba(35,31,28,0.1)] transition-all duration-500 border border-[#E9E4DC]"
                            >
                                {/* Premium Image Header */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#231F1C]">
                                    <div className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 opacity-80 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-40 z-10`}></div>

                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-[1.03]"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 z-0 bg-[#382E25]"></div>
                                    )}

                                    {/* Elegant Category Badge */}
                                    {service.category && (
                                        <div className="absolute top-5 left-5 z-20 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-[14px] sm:text-[14px] font-semibold text-white uppercase tracking-widest">
                                            {service.category}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col relative z-20 bg-white">
                                    <h2 className="font-serif text-[1.5rem] tracking-tight text-[#231F1C] mb-3 group-hover:text-[var(--gold-600)] transition-colors">
                                        {service.title}
                                    </h2>
                                    <div className="flex-1">
                                        <p className="text-[14.5px] text-[#6b6b6b] leading-relaxed mb-6 font-light line-clamp-2 text-ellipsis overflow-hidden">
                                            {service.description?.split('\n\n')[0] || service.shortDescription || ''}
                                        </p>
                                    </div>

                                    {/* Features / Includes Summary if present */}
                                    {service.features && service.features.length > 0 && service.features[0] !== "" && (
                                        <div className="mb-8 pt-6 border-t border-[#f0f0f0]">
                                            <p className="text-[14px] font-semibold tracking-wider text-[#999] uppercase mb-3">What's Included</p>
                                            <ul className="space-y-2.5">
                                                {service.features.slice(0, 3).map((feat, idx) => (
                                                    <li key={idx} className="flex items-start text-[14px] text-[#4a4a4a] leading-tight">
                                                        <span className="w-4 h-4 rounded-full bg-[var(--gold-50)] text-[var(--gold-600)] flex items-center justify-center shrink-0 mt-[1px] mr-3">
                                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                        </span>
                                                        {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 mt-auto">
                                        <button
                                            onClick={() => openPopup(service.slug)}
                                            className="btn btn-primary flex-1 min-w-0"
                                        >
                                            Inquire Now
                                        </button>

                                        {(service.category?.toLowerCase() === 'astrology' || service.category?.toLowerCase() === 'vastu') && (
                                            <Link
                                                to={`/brochure/${service.category.toLowerCase()}`}
                                                className="w-[48px] flex items-center justify-center rounded-xl border border-[#E9E4DC] bg-white text-[#231F1C] hover:text-[var(--gold-600)] hover:border-[var(--gold-300)] hover:bg-[var(--gold-50)] transition-all"
                                                title="View Digital Brochure"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default ServicesPage
