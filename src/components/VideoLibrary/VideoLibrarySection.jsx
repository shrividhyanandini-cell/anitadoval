import React, { useState, useEffect } from 'react'
import { Play, X, ExternalLink, ArrowRight, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { WA_NUMBER } from '../../data/siteConfig'

const DEFAULT_CONFIG = {
    enabled: true,
    eyebrow: 'OFFICIAL VIDEO LIBRARY',
    heading: 'Watch Client Stories & Holistic Guidance Masterclasses',
    subNote: "Subscribe to Anita Doval's YouTube channel for new weekly releases.",
    bgType: 'color',
    bgColor: '#FAF7F0',
    bgImageUrl: '',
    bgAttachment: 'scroll',
    bgSize: 'cover',
    bgPosition: 'center',
}

const STATIC_VIDEOS = [
    { id: 's1', title: 'Jyotish & Life Direction', subtitle: 'Astrological & Spiritual Transformations', description: 'Real client experiences and testimonials detailing life-changing clarity through Janam Kundli readings and planetary remedies.', order: 0 },
    { id: 's2', title: 'Vastu for Home Harmony', subtitle: 'Spatial Energy Harmonization', description: 'Exploring how non-demolition Vastu alignment and directional energy grids alleviate chronic tension and physical stress.', order: 1 },
    { id: 's3', title: 'Mantra & Meditation Guide', subtitle: 'Vedic Spiritual Practice', description: 'Guidance on mantra repetition, individual Prakriti, and mindful yogic routines for sustainable vitality.', order: 2 },
    { id: 's4', title: 'Prashna Kundli Readings', subtitle: 'Horary Astrology Explained', description: 'Understanding how moment-specific charts answer pressing life questions with clarity and precision.', order: 3 },
    { id: 's5', title: 'Gemstone & Remedy Sessions', subtitle: 'Planetary Remediation', description: 'Comprehensive guides on gemstone selection, mantra vidhan, and elemental remedies based on birth chart analysis.', order: 4 },
]

const VideoLibrarySection = () => {
    const [config, setConfig] = useState(DEFAULT_CONFIG)
    const [videos, setVideos] = useState(STATIC_VIDEOS)
    const [activeVideo, setActiveVideo] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch section config
                const configSnap = await getDoc(doc(db, 'video_library', 'config'))
                if (configSnap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...configSnap.data() })
                }

                // Fetch video entries
                const videosSnap = await getDocs(collection(db, 'video_library'))
                const items = videosSnap.docs
                    .filter(d => d.id !== 'config' && d.data().enabled !== false)
                    .map(d => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => (a.order || 0) - (b.order || 0))

                if (items.length > 0) setVideos(items)
            } catch (err) {
                console.warn('Using static video fallback data.', err)
            } finally {
                setLoaded(true)
            }
        }
        fetchData()
    }, [])

    // Build background style from config
    const getSectionBgStyle = () => {
        if (config.bgType === 'image' && config.bgImageUrl) {
            return {
                backgroundImage: `url(${config.bgImageUrl})`,
                backgroundSize: config.bgSize || 'cover',
                backgroundPosition: config.bgPosition || 'center',
                backgroundAttachment: config.bgAttachment || 'scroll',
                backgroundRepeat: 'no-repeat',
            }
        }
        return { backgroundColor: config.bgColor || '#FAF7F0' }
    }

    const openVideo = (video) => {
        setActiveVideo(video)
        setYoutubeUrl(video.youtubeUrl || '')
    }

    if (config.enabled === false) return null

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Anita Ma'am, I would like to know more about your video consultations.")}`

    return (
        <section
            className="py-20 md:py-28 border-y border-[#EBE3D5] relative overflow-hidden"
            style={getSectionBgStyle()}
        >
            {/* Dark overlay if using image */}
            {config.bgType === 'image' && config.bgImageUrl && (
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            )}

            <div className="container max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#547345]/30 rounded-full mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#547345]"></span>
                            <span className="font-sans font-bold text-[11px] tracking-[0.2em] text-[#547345] uppercase">
                                {config.eyebrow}
                            </span>
                        </div>
                        <h2 className={`font-serif text-3xl md:text-4xl font-semibold leading-tight ${config.bgType === 'image' ? 'text-white' : 'text-[var(--charcoal-900)]'}`}>
                            {config.heading.split('&').map((part, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <span className="italic font-medium text-[var(--gold-400)]">&</span>}
                                    {i === 0 ? part : <span className="italic font-medium text-[var(--gold-400)]">{part}</span>}
                                </React.Fragment>
                            ))}
                        </h2>
                    </div>

                    <Link
                        to="/connect"
                        className="btn btn-outline text-xs h-10 px-5 border-[#547345]/40 text-[#2c4720] hover:bg-[#547345]/10 flex items-center gap-1.5 self-start md:self-auto bg-white/80"
                    >
                        <span>Open Connect & QR Hub</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Video Rows */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2D8C7] shadow-sm divide-y divide-stone-100">
                    {videos.map((item, index) => (
                        <div
                            key={item.id}
                            className={`py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/80 rounded-2xl px-3 transition-colors ${index === 0 ? 'pt-0' : ''}`}
                        >
                            <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                {item.thumbnailUrl ? (
                                    <img src={item.thumbnailUrl} alt={item.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1976D2] to-[#42A5F5] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                                        <Play size={14} fill="white" className="ml-0.5" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                        <h3 className="font-serif font-bold text-[15px] sm:text-[16px] text-[var(--charcoal-900)]">
                                            {item.title}
                                        </h3>
                                        {item.subtitle && (
                                            <span className="text-xs text-[var(--gold-600)] font-medium hidden md:inline">
                                                — {item.subtitle}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-stone-500 font-sans line-clamp-1 mt-0.5">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => openVideo(item)}
                                className="shrink-0 self-end sm:self-center py-2 px-5 rounded-full bg-[#9e1c1c] hover:bg-[#b82323] text-white font-sans font-bold text-[11px] tracking-wider uppercase transition-all shadow-xs active:scale-95"
                            >
                                CLICK HERE
                            </button>
                        </div>
                    ))}
                </div>

                {/* Note */}
                <div className="mt-6 text-center">
                    <p className={`text-xs font-sans ${config.bgType === 'image' ? 'text-white/80' : 'text-stone-500'}`}>
                        {config.subNote}
                    </p>
                </div>
            </div>

            {/* Video Player Modal */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-[9900] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => { setActiveVideo(null); setYoutubeUrl('') }}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative border border-stone-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => { setActiveVideo(null); setYoutubeUrl('') }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#9e1c1c] text-white flex items-center justify-center shrink-0">
                                <Play size={18} fill="white" className="ml-0.5" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">{activeVideo.title}</h3>
                                {activeVideo.subtitle && <p className="text-xs text-stone-500">{activeVideo.subtitle}</p>}
                            </div>
                        </div>

                        <p className="text-sm text-stone-600 mb-4 leading-relaxed">{activeVideo.description}</p>

                        {/* Embedded YouTube or thumbnail */}
                        {activeVideo.youtubeUrl && activeVideo.youtubeUrl.includes('youtube.com') ? (
                            <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black">
                                <iframe
                                    src={activeVideo.youtubeUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                    title={activeVideo.title}
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>
                        ) : activeVideo.thumbnailUrl ? (
                            <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-stone-900 relative">
                                <img src={activeVideo.thumbnailUrl} alt={activeVideo.title} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div
                                        className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                        onClick={() => activeVideo.youtubeUrl && window.open(activeVideo.youtubeUrl, '_blank')}
                                    >
                                        <Play size={24} fill="white" className="ml-1" />
                                    </div>
                                    {activeVideo.youtubeUrl && (
                                        <p className="text-white text-xs mt-2 font-medium">Click to Watch on YouTube</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video bg-stone-900 rounded-xl flex flex-col items-center justify-center text-white p-4 text-center mb-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-950 opacity-90" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div
                                        className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center mb-3 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                        onClick={() => activeVideo.youtubeUrl && window.open(activeVideo.youtubeUrl, '_blank')}
                                    >
                                        <Play size={24} fill="white" className="ml-1" />
                                    </div>
                                    <p className="text-sm font-medium">Watch Full Playlist on YouTube</p>
                                    <p className="text-xs text-stone-400 mt-1">Free open-access spiritual & wellness guidance</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center gap-3 pt-2">
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#25D366] font-semibold flex items-center gap-1 hover:underline"
                            >
                                💬 Ask on WhatsApp
                            </a>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setActiveVideo(null); setYoutubeUrl('') }}
                                    className="btn btn-outline text-xs px-4 py-2"
                                >Close</button>
                                {activeVideo.youtubeUrl && (
                                    <button
                                        onClick={() => window.open(activeVideo.youtubeUrl, '_blank')}
                                        className="btn btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
                                    >
                                        <Youtube size={14} /> Watch on YouTube
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default VideoLibrarySection
