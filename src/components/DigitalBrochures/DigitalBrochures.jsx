import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import AstroBackground from '../UI/AstroBackground'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'
import { useResponsiveBackground } from '../../hooks/useResponsiveBackground'
import { Star, Home, Compass, Map } from 'lucide-react'

const iconMap = {
    star: Star,
    home: Home,
    compass: Compass,
    map: Map
}

const DEFAULT_CONFIG = {
    eyebrow: 'DETAILED GUIDES TO OUR SERVICES',
    heading: 'Explore Our ',
    highlightedHeading: 'Consultation Guides',
    description: 'Detailed guides to help visitors understand consultation services.',
    background: { url: '', alt: '' },
    bgOverlay: 'Light',
    bgPosition: 'Center',
    celestialDecoration: true,
    sectionEnabled: true
}

const DEFAULT_GUIDES = [
    {
        id: 'g1',
        title: 'Astrology Consultation',
        description: 'Explore detailed astrology consultation services, areas of guidance and more.',
        image: '/images/post3.jpg',
        imagePosition: 'Center',
        icon: 'star',
        buttonLabel: 'View E-Brochure',
        buttonUrl: '/brochure/astrology',
        sortOrder: 1
    },
    {
        id: 'g2',
        title: 'Vastu Consultation',
        description: 'Discover Vastu consultation and planning services for homes, offices and more.',
        image: '/images/post4.jpg',
        imagePosition: 'Center',
        icon: 'home',
        buttonLabel: 'View E-Brochure',
        buttonUrl: '/brochure/vastu',
        sortOrder: 2
    }
]

const DigitalBrochures = () => {
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const [guides, setGuides] = useState([])
    const [loading, setLoading] = useState(true)
    const responsiveBgStyle = useResponsiveBackground(config.background)

    useEffect(() => {
        const fetchGuidesData = async () => {
            try {
                // Fetch config
                const configRef = doc(db, 'services', 'guides_config')
                const configSnap = await getDoc(configRef)

                let currentConfig = DEFAULT_CONFIG
                if (configSnap.exists()) {
                    const data = configSnap.data()
                    currentConfig = {
                        ...DEFAULT_CONFIG,
                        ...data,
                        heading: data.heading?.replace(data.highlightedHeading, '') || DEFAULT_CONFIG.heading
                    }
                    setConfig(currentConfig)
                }

                // Fetch guides from services collection since we migrated them there
                const q = query(collection(db, 'services'))
                const querySnapshot = await getDocs(q)

                let fetchedGuides = []
                querySnapshot.forEach((doc) => {
                    if (!doc.id.includes('_config')) {
                        const data = doc.data()
                        if (data.type === 'guide' && data.enabled !== false) {
                            fetchedGuides.push({ id: doc.id, ...data })
                        }
                    }
                })

                if (fetchedGuides.length > 0) {
                    fetchedGuides.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    setGuides(fetchedGuides)
                } else {
                    setGuides(DEFAULT_GUIDES)
                }
            } catch (error) {
                console.error("Error fetching guides data:", error)
                setGuides(DEFAULT_GUIDES)
            } finally {
                setLoading(false)
            }
        }

        fetchGuidesData()
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
            className="relative bg-[#FBF8F1] pt-[80px] md:pt-[90px] pb-[85px] md:pb-[100px] overflow-hidden transition-opacity duration-1000"
            style={sectionStyle}
        >

            {/* Background Overlay */}
            {hasBg && (
                <div className="absolute inset-0 z-[0] mix-blend-normal pointer-events-none" style={getOverlayStyle(hasBg)}></div>
            )}



            {/* Decorative Celestial Element */}
            {config.celestialDecoration && (
                <SectionMotionOverlay type="vastu-compass" intensity={0.1} />
            )}

            <div className="relative z-10 w-full max-w-[1240px] px-[20px] md:px-[24px] lg:px-[32px] mx-auto flex flex-col items-center">

                {/* Top Subtle Lotus */}
                <div className="flex justify-center items-center w-full mb-[24px] md:mb-[32px] opacity-70">
                    <div className="w-[30px] md:w-[40px] h-[1px] bg-[#C0933E] opacity-30 mr-3"></div>
                    <svg className="w-[35px] md:w-[45px] h-auto text-[#C0933E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M12 2C12 2 11 6 8 8C5 10 2 9 2 9C2 9 5 12 8 13C11 14 12 18 12 18C12 18 13 14 16 13C19 12 22 9 22 9C22 9 19 10 16 8C13 6 12 2 12 2Z" fill="currentColor" fillOpacity="0.1" />
                    </svg>
                    <div className="w-[30px] md:w-[40px] h-[1px] bg-[#C0933E] opacity-30 ml-3"></div>
                </div>

                {/* Header block matching screenshot */}
                <div className="text-center md:text-left w-full max-w-[650px] md:mr-auto mb-[32px] md:mb-[54px] relative z-10">
                    <p className="font-sans font-semibold text-[14px] md:text-[14px] tracking-[0.16em] md:tracking-[0.2em] uppercase text-[#A67828] mb-[12px] md:mb-[16px]">
                        {config.eyebrow}
                    </p>
                    <h2 className="font-serif font-medium text-[36px] md:text-[44px] lg:text-[52px] leading-[1.05] text-[#25221E] mb-[16px]">
                        {config.heading}
                        <span className="text-[#B78325]">{config.highlightedHeading}</span>
                    </h2>
                    <p className="font-sans text-[14px] md:text-[15px] leading-[1.55] md:leading-[1.6] text-[#625B52]">
                        {config.description}
                    </p>

                    {/* Decorative Divider */}
                    <div className="hidden md:flex items-center mt-[24px] opacity-60">
                        <div className="w-[4px] h-[4px] rotate-45 border border-[#B78325]"></div>
                        <div className="w-[90px] h-[1px] bg-[#B78325] mx-1"></div>
                        <div className="w-[4px] h-[4px] rotate-45 border border-[#B78325]"></div>
                    </div>
                </div>

                {/* Guides Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] lg:gap-[26px] w-full">
                    {loading ? (
                        <div className="col-span-2 py-8 text-center"><p className="text-sm text-gray-500">Loading guides...</p></div>
                    ) : (
                        guides.map((guide, index) => {
                            const IconElement = iconMap[guide.icon] || Star;

                            // Content Position Alignment
                            return (
                                <div
                                    key={guide.id || index}
                                    className="group relative w-full h-[340px] md:h-[350px] lg:h-[360px] rounded-[10px] md:rounded-[12px] overflow-hidden bg-[#25221E] shadow-[0_12px_24px_rgba(37,34,30,0.08)] transform transition-transform duration-[400ms] hover:-translate-y-[4px]"
                                >
                                    {/* Image Base */}
                                    <img
                                        src={guide.image}
                                        alt={guide.imageAlt || guide.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[450ms] ease-out group-hover:scale-[1.03]"
                                        style={{ objectPosition: bgPositionMap[guide.imagePosition] || 'center' }}
                                        onError={(e) => { e.target.style.display = 'none' }}
                                    />

                                    {/* Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 group-hover:from-black/95 transition-colors duration-[400ms] pointer-events-none"></div>

                                    {/* Content Wrapper */}
                                    <div className="absolute inset-0 p-[24px] md:p-[32px] lg:p-[45px] flex flex-col justify-center max-w-[440px] z-10">

                                        {/* Icon */}
                                        <div className="w-[46px] h-[46px] md:w-[50px] md:h-[50px] rounded-full border border-[rgba(215,184,120,0.75)] flex items-center justify-center text-[#D7B878] mb-[18px] md:mb-[22px] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm shadow-sm group-hover:bg-[rgba(215,184,120,0.1)] transition-colors duration-300">
                                            <IconElement strokeWidth={1.5} className="w-[22px] h-[22px] md:w-[24px] md:h-[24px]" />
                                        </div>

                                        {/* Typography */}
                                        <h3 className="font-serif font-medium text-[30px] md:text-[34px] lg:text-[36px] !text-white leading-[1.05] mb-[12px] drop-shadow-md z-20">
                                            {guide.title.split(' ').map((word, i) => (
                                                <React.Fragment key={i}>
                                                    {word}{i !== guide.title.split(' ').length - 1 && <br className="hidden lg:block" />}
                                                    {i !== guide.title.split(' ').length - 1 && <span className="lg:hidden"> </span>}
                                                </React.Fragment>
                                            ))}
                                        </h3>

                                        <p className="font-sans text-[14px] md:text-[14px] leading-[1.5] !text-gray-100 mb-[24px] max-w-[390px] z-20">
                                            {guide.description}
                                        </p>

                                        {/* Button */}
                                        <div className="mt-auto md:mt-0">
                                            <Link
                                                to={guide.buttonUrl}
                                                className="inline-flex items-center justify-center h-[46px] md:h-[50px] px-[20px] md:px-[24px] bg-[#FFFDF8] text-[#25221E] font-sans font-semibold text-[14px] md:text-[14px] rounded-[6px] md:rounded-[7px] transition-all duration-[250ms] group-hover:bg-[#B78325] group-hover:text-white shadow-sm ring-1 ring-transparent hover:ring-[#B78325] hover:shadow-md"
                                            >
                                                {guide.buttonLabel} <span className="ml-[6px] transition-transform group-hover:translate-x-1">&rarr;</span>
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

            </div>
        </section>
    )
}

export default DigitalBrochures
