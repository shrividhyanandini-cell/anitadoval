import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { Star, Home, Hash, Hand, Heart } from 'lucide-react'
import AstroBackground from '../UI/AstroBackground'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground'

// Map saved icon strings to their Lucide components
const iconMap = {
    star: Star,
    home: Home,
    hash: Hash,
    hand: Hand,
    heart: Heart,
    lotus: Heart // Using heart for lotus fallback if needed
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
        id: 's1',
        title: 'Astrology',
        shortDescription: 'Understanding your birth chart, planetary influences and life patterns through Vedic astrology.',
        image: '',
        icon: 'star',
        slug: 'astrology',
        sortOrder: 1
    },
    {
        id: 's2',
        title: 'Vastu Consultation',
        shortDescription: 'Scientific Vastu analysis for homes, offices, land and commercial properties to optimize energy flow.',
        image: '',
        icon: 'home',
        slug: 'vastu-consultation',
        sortOrder: 2
    },
    {
        id: 's3',
        title: 'Prashna Kundli',
        shortDescription: 'Astrological guidance focused on a specific question or present circumstance, without requiring birth details.',
        image: '',
        icon: 'hash',
        slug: 'prashna-kundli',
        sortOrder: 3
    },
    {
        id: 's4',
        title: 'Mantra Vidhan',
        shortDescription: 'Guidance on the correct practice and utilization of mantras for positive transformation and spiritual growth.',
        image: '',
        icon: 'heart',
        slug: 'mantra-vidhan',
        sortOrder: 4
    },
    {
        id: 's5',
        title: 'Meditation Guidance',
        shortDescription: 'Structured meditation practices and guidance for mental clarity, inner peace and spiritual development.',
        image: '',
        icon: 'lotus',
        slug: 'meditation-guidance',
        sortOrder: 5
    }
]

const ServicesCarousel = () => {
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
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
                querySnapshot.forEach((doc) => {
                    if (!doc.id.includes('_config')) {
                        const data = doc.data()
                        if (data.type !== 'guide' && data.enabled !== false) {
                            fetchedServices.push({ id: doc.id, ...data })
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

    if (!config.sectionEnabled) {
        return null
    }

    const getOverlayStyle = (hasBackground) => {
        if (!hasBackground) return {}
        const opacities = {
            'Light': 0,
            'Medium': 0.3,
            'Strong': 0.6
        }
        const opacity = opacities[config.bgOverlay] || 0
        return {
            background: `rgba(251,248,241, ${opacity})`
        }
    }

    const bgPositionMap = {
        'Top': 'top center',
        'Center': 'center',
        'Bottom': 'bottom center'
    }

    const sectionStyle = {
        ...responsiveBgStyle,
        backgroundAttachment: responsiveBgStyle.backgroundImage ? "fixed" : "auto"
    }

    const hasBg = !!responsiveBgStyle.backgroundImage

    return (
        <section
            className="relative bg-[#FBF8F1] pt-[85px] md:pt-[100px] overflow-hidden"
            style={sectionStyle}
        >

            {/* Background Overlay */}
            {hasBg && (
                <div
                    className="absolute inset-0 z-[0] pointer-events-none"
                    style={getOverlayStyle(hasBg)}
                ></div>
            )}

            {/* Decorative Celestial Element */}
            {config.celestialDecoration && (
                <SectionMotionOverlay type="vastu-compass" intensity={0.1} />
            )}

            <div className="relative z-10 w-full max-w-[1240px] px-[20px] md:px-[24px] lg:px-[20px] mx-auto">

                {/* Header block matching screenshot */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-[36px] md:mb-[50px] relative z-10">
                    <div className="max-w-[650px]">
                        <p className="font-sans font-semibold text-[14px] md:text-[14px] tracking-[0.16em] uppercase text-[#A67828] mb-[16px]">
                            {config.eyebrow}
                        </p>
                        <h2 className="font-serif font-medium text-[36px] md:text-[44px] lg:text-[48px] leading-[1.05] text-[#25221E] mb-[18px]">
                            {config.heading.replace(config.highlightedHeading, '')}
                            <span className="text-[#B78325]">{config.highlightedHeading}</span>
                        </h2>
                        <p className="font-sans text-[14px] md:text-[15px] leading-[1.65] md:leading-[1.55] text-[#625B52]">
                            {config.description}
                        </p>
                    </div>

                    {config.viewAllCta?.enabled && (
                        <div className="mt-[24px] md:mt-[38px] shrink-0">
                            <Link
                                to={config.viewAllCta.url || '/services'}
                                className="inline-flex items-center justify-center h-[44px] px-[18px] border border-[#CDBB9F] rounded-[6px] text-[14px] md:text-[14px] font-sans font-semibold text-[#302C27] hover:bg-[#B78325] hover:text-white hover:border-[#B78325] transition-colors duration-[250ms] bg-transparent"
                            >
                                {config.viewAllCta.text} &rarr;
                            </Link>
                        </div>
                    )}
                </div>

                {/* Services Grid matching screenshot */}
                <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 hide-scrollbar gap-[16px] lg:gap-[18px] pb-6 lg:pb-0 snap-x snap-mandatory">
                    {loading ? (
                        <div className="col-span-5 py-8 text-center"><p className="text-sm text-gray-500">Loading services...</p></div>
                    ) : (
                        services.map((service, index) => {
                            const IconElement = iconMap[service.icon] || Star;

                            // Title handling specific to screenshot
                            const titleStr = service.title || ''
                            const splitTitle = titleStr.split(' ');
                            const formattedTitle = splitTitle.length === 2 && titleStr.length < 22
                                ? <>{splitTitle[0]}<br />{splitTitle[1]}</>
                                : titleStr;

                            return (
                                <Link
                                    to={service.link || `/services/${service.slug}`}
                                    key={service.id || index}
                                    className="group flex flex-col relative w-[280px] sm:w-[260px] md:w-[310px] lg:w-auto h-[380px] md:h-[390px] lg:h-[400px] bg-[#FFFDF8] border border-[#E7DDCE] rounded-[10px] shadow-[0_8px_25px_rgba(50,40,25,0.06)] shrink-0 snap-start transition-all duration-300 hover:-translate-y-[5px]"
                                >
                                    {/* Image Top Half Container */}
                                    <div className="relative w-full h-[180px] md:h-[190px] shrink-0">
                                        <div className="w-full h-full rounded-t-[10px] overflow-hidden bg-gray-100">
                                            {/* Gracefully handle empty images */}
                                            {service.image ? (
                                                <img
                                                    src={service.image}
                                                    alt={service.imageAlt || service.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#E7DDCE] to-[#CDBB9F] opacity-30"></div>
                                            )}
                                        </div>

                                        {/* Overlapping Icon */}
                                        <div className="absolute -bottom-[28px] left-1/2 transform -translate-x-1/2 w-[56px] h-[56px] bg-[#FFFDF8] rounded-full flex items-center justify-center border border-[#CDA55D] shadow-[0_5px_15px_rgba(50,40,25,0.08)] z-10 text-[#B78325] group-hover:text-[#8C641C] transition-colors">
                                            <IconElement strokeWidth={1.5} className="w-[26px] h-[26px]" />
                                        </div>
                                    </div>

                                    {/* Content Bottom Half */}
                                    <div className="flex-1 flex flex-col p-[18px] pt-[42px] items-center text-center">
                                        <h5 className="font-serif font-medium text-[20px] md:text-[20px] text-[#25221E] mb-[12px] leading-[1.1] min-h-[52px] flex items-center space-x-0 justify-center">
                                            <span className="block text-center w-full">{formattedTitle}</span>
                                        </h5>

                                        <p className="font-sans text-[14px] leading-[1.5] text-[#6E665D] line-clamp-2 lg:line-clamp-2 max-w-[200px] mb-[16px]">
                                            {service.shortDescription}
                                        </p>

                                        {/* Spacer to push CTA to bottom */}
                                        <div className="flex-1"></div>

                                        <div className="flex flex-col items-center justify-center w-full mt-auto">
                                            <div className="w-[50px] h-[1px] bg-[#CDA55D] opacity-60 mb-[12px]"></div>
                                            <div className="font-sans text-[14px] font-semibold text-[#B78325] flex items-center group-hover:text-[#8C641C] transition-colors">
                                                Explore &rarr;
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    )}
                </div>

            </div>
        </section>
    )
}

export default ServicesCarousel
