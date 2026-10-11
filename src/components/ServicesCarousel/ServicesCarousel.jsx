import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Star, Home, Hash, Hand, Heart, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground'
import ServiceDetailsModal from '../Services/ServiceDetailsModal'

const iconMap = {
    star: Star,
    home: Home,
    hash: Hash,
    hand: Hand,
    heart: Heart,
    lotus: Heart
}

const DEFAULT_CONFIG = {
    eyebrow: 'CONSULTATIONS FOR A MORE BALANCED LIFE',
    heading: 'Explore Our Services',
    highlightedHeading: 'Our Services',
    description: 'Personalised guidance across astrology, Vastu and spiritual practices to bring clarity, harmony and positive transformation in your life.',
    viewAllCta: { enabled: true, text: 'View All Services', url: '/services' },
    background: { url: '', alt: '' },
    bgOverlay: 'Light',
    bgPosition: 'Center',
    celestialDecoration: true,
    sectionEnabled: true
}

const DEFAULT_SERVICES = [
    {
        id: 'astrology-consultation',
        title: 'Astrology Consultation',
        shortDescription: 'Understanding your birth chart, planetary influences and life patterns through Vedic astrology.',
        detailedDescription: 'A comprehensive, deeply personalized reading of your Vedic birth chart (Janam Kundli). Discover planetary placements, Dasha cycles, career guidance, relationship compatibility, health indications, and practical remedial measures.',
        image: '/images/post1.jpg',
        icon: 'star',
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
        icon: 'home',
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
        icon: 'hash',
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
        icon: 'hand',
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
        icon: 'lotus',
        slug: 'yoga-meditation',
        sortOrder: 5,
        features: ['Pranayama & breath control', 'Chakra & elemental meditation', 'Stress reduction & mental clarity', 'Daily spiritual routine blueprint']
    }
]

const ServicesCarousel = () => {
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeServiceModal, setActiveServiceModal] = useState(null)
    const carouselRef = useRef(null)
    const responsiveBgStyle = useResponsiveBackground(config.background)

    useEffect(() => {
        const fetchServicesData = async () => {
            try {
                // Fetch config
                const configRef = doc(db, 'services', 'services_config')
                const configSnap = await getDoc(configRef)
                let currentConfig = DEFAULT_CONFIG
                if (configSnap.exists()) {
                    currentConfig = { ...DEFAULT_CONFIG, ...configSnap.data() }
                    setConfig(currentConfig)
                }

                // Fetch services
                const q = query(collection(db, 'services'))
                const querySnapshot = await getDocs(q)

                let fetchedServices = []
                querySnapshot.forEach((docSnap) => {
                    if (!docSnap.id.includes('_config')) {
                        const data = docSnap.data()
                        if (data.type !== 'guide' && data.enabled !== false && data.status !== 'archived') {
                            fetchedServices.push({ id: docSnap.id, ...data })
                        }
                    }
                })

                if (fetchedServices.length > 0) {
                    fetchedServices.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    setServices(fetchedServices)
                } else {
                    setServices(DEFAULT_SERVICES)
                }
            } catch (error) {
                console.error("Error fetching services data:", error)
                setServices(DEFAULT_SERVICES)
            } finally {
                setLoading(false)
            }
        }

        fetchServicesData()
    }, [])

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' })
        }
    }

    if (!config.sectionEnabled) {
        return null
    }

    const sectionStyle = {
        ...responsiveBgStyle,
        backgroundAttachment: responsiveBgStyle.backgroundImage ? "fixed" : "auto"
    }

    const hasBg = !!responsiveBgStyle.backgroundImage

    return (
        <section
            className="relative bg-[#FAF9F5] py-[80px] md:py-[100px] overflow-hidden"
            style={sectionStyle}
        >
            {config.celestialDecoration && (
                <SectionMotionOverlay type="vastu-compass" intensity={0.08} />
            )}

            <div className="relative z-10 w-full max-w-[1240px] px-4 md:px-8 mx-auto">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6 relative z-10">
                    <div className="max-w-[650px]">
                        <p className="font-sans font-semibold text-[13px] md:text-[14px] tracking-[0.2em] uppercase text-[var(--gold-600)] mb-3">
                            {config.eyebrow}
                        </p>
                        <h2 className="font-serif font-medium text-[34px] md:text-[44px] leading-[1.1] text-[var(--charcoal-900)] mb-3">
                            {config.heading.replace(config.highlightedHeading, '')}
                            <span className="text-[var(--gold-600)]">{config.highlightedHeading}</span>
                        </h2>
                        <p className="font-sans text-[15px] leading-relaxed text-[var(--charcoal-600)]">
                            {config.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Carousel Scroll Buttons */}
                        <button
                            onClick={scrollLeft}
                            aria-label="Scroll left"
                            className="w-10 h-10 rounded-full border border-[var(--border-warm)] bg-white hover:bg-[var(--gold-50)] hover:border-[var(--gold-400)] text-[var(--charcoal-700)] flex items-center justify-center transition-colors shadow-xs"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={scrollRight}
                            aria-label="Scroll right"
                            className="w-10 h-10 rounded-full border border-[var(--border-warm)] bg-white hover:bg-[var(--gold-50)] hover:border-[var(--gold-400)] text-[var(--charcoal-700)] flex items-center justify-center transition-colors shadow-xs"
                        >
                            <ChevronRight size={18} />
                        </button>

                        {config.viewAllCta?.enabled && (
                            <Link
                                to={config.viewAllCta.url || '/services'}
                                className="inline-flex items-center justify-center h-10 px-5 border border-[var(--gold-300)] rounded-lg text-[14px] font-sans font-semibold text-[var(--charcoal-800)] hover:bg-[var(--gold-500)] hover:text-white hover:border-[var(--gold-500)] transition-colors ml-2 bg-white shadow-xs"
                            >
                                {config.viewAllCta.text} &rarr;
                            </Link>
                        )}
                    </div>
                </div>

                {/* Services Carousel */}
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto hide-scrollbar gap-5 md:gap-6 pb-6 snap-x snap-mandatory scroll-smooth"
                >
                    {loading ? (
                        <div className="w-full py-16 text-center text-stone-500">Loading services...</div>
                    ) : (
                        services.map((service, index) => {
                            const IconElement = iconMap[service.icon] || Star
                            const imageUrl = service.image || service.imageUrl || `/images/post${(index % 7) + 1}.jpg`

                            return (
                                <div
                                    key={service.id || index}
                                    className="group flex flex-col relative w-[285px] sm:w-[305px] md:w-[325px] bg-white border border-[var(--border-warm)] rounded-2xl shadow-[0_4px_20px_rgba(50,40,25,0.05)] shrink-0 snap-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(50,40,25,0.1)] overflow-hidden"
                                >
                                    {/* Image Top */}
                                    <div className="relative w-full h-[180px] bg-stone-100 overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={service.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                        {/* Floating Badge */}
                                        <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center border border-[var(--gold-200)] text-[var(--gold-600)] shadow-sm">
                                            <IconElement strokeWidth={1.6} size={20} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col p-5">
                                        <h3 className="font-serif font-semibold text-[20px] text-[var(--charcoal-900)] mb-2 group-hover:text-[var(--gold-600)] transition-colors line-clamp-1">
                                            {service.title}
                                        </h3>

                                        <p className="font-sans text-[13.5px] leading-relaxed text-[var(--charcoal-600)] line-clamp-2 mb-4 flex-1">
                                            {service.shortDescription || service.description}
                                        </p>

                                        {/* Action buttons */}
                                        <div className="pt-3 border-t border-[var(--border-warm)] flex items-center justify-between gap-2 mt-auto">
                                            <button
                                                onClick={() => setActiveServiceModal(service)}
                                                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--charcoal-700)] hover:text-[var(--gold-600)] py-1.5 transition-colors"
                                            >
                                                <Eye size={15} />
                                                <span>View Details</span>
                                            </button>

                                            <button
                                                onClick={() => setActiveServiceModal(service)}
                                                className="btn btn-primary text-[12px] h-8 px-3.5 rounded-md"
                                            >
                                                Consult &rarr;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

            </div>

            {/* Service Details Popup Modal */}
            <ServiceDetailsModal
                service={activeServiceModal}
                isOpen={!!activeServiceModal}
                onClose={() => setActiveServiceModal(null)}
            />
        </section>
    )
}

export default ServicesCarousel
