import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePopup } from '../../context/PopupContext'
import { useFirestore } from '../../hooks/useFirestore'
import Loading from '../../components/UI/Loading'
import PageHeader from '../../components/UI/PageHeader'
import ServiceDetailsModal from '../../components/Services/ServiceDetailsModal'
import { Eye, ArrowRight, Check } from 'lucide-react'

const FALLBACK_SERVICES = [
    {
        id: 'astrology-consultation',
        title: 'Astrology Consultation',
        shortDescription: 'Understanding your birth chart, planetary influences and life patterns through Vedic astrology.',
        detailedDescription: 'A comprehensive, deeply personalized reading of your Vedic birth chart (Janam Kundli). Discover planetary placements, Dasha cycles, career guidance, relationship compatibility, health indications, and practical remedial measures.',
        image: '/images/post1.jpg',
        category: 'Astrology',
        slug: 'astrology-consultation',
        sortOrder: 1,
        features: ['Birth chart (Kundli) analysis', 'Dasha cycle evaluation', 'Career & financial guidance', 'Personalized remedial measures']
    },
    {
        id: 'vastu-consultation',
        title: 'Vastu Consultation',
        shortDescription: 'Scientific Vastu analysis for homes, offices, land and commercial properties to optimize energy flow.',
        detailedDescription: 'Detailed spatial and architectural energy assessment for residential and commercial spaces. Learn how directional orientations, natural elements (Panchamahabhutas), and entrance alignments shape health, peace, and financial prosperity.',
        image: '/images/post4.jpg',
        category: 'Vastu',
        slug: 'vastu-consultation',
        sortOrder: 2,
        features: ['Residential & commercial evaluation', 'Directional grid alignment', 'Non-demolition remedial remedies', 'Energy balancing techniques']
    },
    {
        id: 'numerology-consultation',
        title: 'Numerology Consultation',
        shortDescription: 'Explore the vibration of your birth date and name to uncover hidden potentials and auspicious timings.',
        detailedDescription: 'Unlock the numerical resonance of your life path, destiny, and soul urge numbers. Receive actionable recommendations for name correction, favorable business naming, and identifying your most auspicious dates.',
        image: '/images/post2.jpg',
        category: 'Numerology',
        slug: 'numerology-consultation',
        sortOrder: 3,
        features: ['Life path & destiny number calculation', 'Name spelling correction & alignment', 'Auspicious dates & timing guidance', 'Personal year forecast']
    },
    {
        id: 'palmistry-consultation',
        title: 'Palmistry Consultation',
        shortDescription: 'Traditional reading of palm lines, mounts, and hands to reveal personality traits and life trajectories.',
        detailedDescription: 'Detailed palm reading examining the major lines (Heart, Head, Life, Fate), mounts of the planets, and subtle markings. Gain clarity on inherent strengths, subconscious patterns, and upcoming milestones.',
        image: '/images/post5.jpg',
        category: 'Palmistry',
        slug: 'palmistry-consultation',
        sortOrder: 4,
        features: ['Primary lines & mounts evaluation', 'Career & life direction indicators', 'Health & emotional well-being signs', 'Remedial suggestions']
    },
    {
        id: 'yoga-meditation',
        title: 'Yog & Meditation',
        shortDescription: 'Structured practices and yogic breathing techniques designed for mental stillness and inner equilibrium.',
        detailedDescription: 'Holistic mind-body alignment incorporating authentic Pranayama, Chakra dhyana, and mindful meditation routines tailored to your constitutional temperament (Prakriti).',
        image: '/images/post3.jpg',
        category: 'Spiritual',
        slug: 'yoga-meditation',
        sortOrder: 5,
        features: ['Pranayama & breath control', 'Chakra & elemental meditation', 'Stress reduction & mental clarity', 'Daily spiritual routine blueprint']
    },
    {
        id: 'mantra-upasana',
        title: 'Mantra Upasana',
        shortDescription: 'Guidance on sacred sound vibrations, proper intonation, and ritual recitation for spiritual upliftment.',
        detailedDescription: 'Sacred chanting and japa methodologies according to ancient Vedic traditions. Understand Beej mantras, planetary appeasement recitations, and daily discipline to invoke clarity and positive divine frequencies.',
        image: '/images/post6.jpg',
        category: 'Spiritual',
        slug: 'mantra-upasana',
        sortOrder: 6,
        features: ['Authentic Vedic mantra prescription', 'Correct pronunciation & meter guidance', 'Spiritual discipline & japa counts', 'Auspicious timings & directions']
    },
    {
        id: 'spiritual-guidance',
        title: 'Spiritual Guidance',
        shortDescription: 'Deep, compassionate one-on-one sessions addressing existential questions and inner peace.',
        detailedDescription: 'Individualized spiritual mentorship assisting you in life crossroads, emotional grounding, karmic understanding, and aligning your daily actions with higher spiritual purpose.',
        image: '/images/post7.jpg',
        category: 'Guidance',
        slug: 'spiritual-guidance',
        sortOrder: 7,
        features: ['Karmic pattern comprehension', 'Emotional & spiritual grounding', 'Personalized mindfulness guidance', 'Compassionate one-on-one listening']
    }
]

const ServicesPage = () => {
    const { openPopup } = usePopup()
    const { documents: allServices, loading } = useFirestore('services')
    const [selectedService, setSelectedService] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Filter out config documents, ensure enabled and not archived
    const filteredServices = allServices
        .filter(s => !s.id.includes('_config') && s.id !== 'global_theme' && s.id !== 'cta_config' && s.id !== 'faq_config' && s.enabled !== false && s.status !== 'archived' && s.type !== 'guide' && Boolean(s.title && s.title.trim()))
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    const displayServices = filteredServices.length > 0 ? filteredServices : FALLBACK_SERVICES

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-24 selection:bg-[var(--gold-500)] selection:text-white">

            <PageHeader
                pageId="services"
                eyebrow="OFFICIAL SERVICES"
                title="Expert Consultation & Guidance"
                description="Explore our comprehensive range of services across Vedic astrology, Vastu Shastra, and spiritual practices. Each consultation is thoughtfully tailored to your unique circumstances and birth chart."
            />

            {/* Premium Services Grid */}
            <section className="container max-w-[1240px] px-4 md:px-8 mt-12 md:mt-16">
                {loading && filteredServices.length === 0 ? (
                    <div className="flex justify-center p-20"><Loading type="spinner" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
                        {displayServices.map((service, idx) => {
                            const imageSrc = service.image || service.imageUrl || `/images/post${(idx % 7) + 1}.jpg`

                            return (
                                <div
                                    key={service.id || idx}
                                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(35,31,28,0.04)] hover:shadow-[0_14px_40px_rgba(35,31,28,0.09)] transition-all duration-400 border border-[#E9E4DC]"
                                >
                                    {/* Image Header */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
                                        <img
                                            src={imageSrc}
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => { e.target.src = '/images/post1.jpg' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                        {/* Category Badge */}
                                        {service.category && (
                                            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] font-semibold text-white uppercase tracking-wider">
                                                {service.category}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 md:p-7 flex-1 flex flex-col bg-white">
                                        <h2 className="font-serif text-[1.4rem] font-semibold text-[#231F1C] mb-2.5 group-hover:text-[var(--gold-600)] transition-colors leading-tight">
                                            {service.title}
                                        </h2>

                                        <p className="text-[14px] text-[#6b6b6b] leading-relaxed mb-5 font-normal line-clamp-3 flex-1">
                                            {service.shortDescription || service.description}
                                        </p>

                                        {/* What's Included Preview */}
                                        {Array.isArray(service.features) && service.features.length > 0 && (
                                            <div className="mb-6 pt-4 border-t border-stone-100">
                                                <p className="text-[11px] font-bold tracking-widest text-stone-400 uppercase mb-2">Key Highlights</p>
                                                <ul className="space-y-1.5">
                                                    {service.features.slice(0, 3).map((feat, fIdx) => (
                                                        <li key={fIdx} className="flex items-center text-[13px] text-[#4a4a4a]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-500)] mr-2 shrink-0"></span>
                                                            <span className="truncate">{feat}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Action Buttons: View Details & Inquire */}
                                        <div className="flex items-center gap-3 mt-auto pt-2">
                                            <button
                                                onClick={() => setSelectedService(service)}
                                                className="btn btn-outline flex-1 text-[13px] h-10 px-3 flex items-center justify-center gap-1.5 hover:border-[var(--gold-500)] hover:text-[var(--gold-600)]"
                                            >
                                                <Eye size={15} />
                                                <span>View Details</span>
                                            </button>

                                            <button
                                                onClick={() => openPopup(service.slug || service.id)}
                                                className="btn btn-primary flex-1 text-[13px] h-10 px-3 flex items-center justify-center gap-1.5 shadow-sm"
                                            >
                                                <span>Inquire</span>
                                                <ArrowRight size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Service Details Modal */}
            <ServiceDetailsModal
                service={selectedService}
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
            />
        </div>
    )
}

export default ServicesPage
