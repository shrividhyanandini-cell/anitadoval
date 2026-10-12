import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Play, Share2, ExternalLink, MessageCircle } from 'lucide-react'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { usePopup } from '../../context/PopupContext'
import { useSettings } from '../../hooks/useSettings'
import { WA_NUMBER, buildWhatsAppUrl } from '../../data/siteConfig'
import { DEFAULT_5_VIDEOS } from '../../components/Admin/VideoLibraryManager'

const DEFAULT_CONNECT_LINKS = {
    book: {
        actionType: 'popup',
        customUrl: ''
    },
    waBusiness: {
        url: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Anita Ma'am, I would like to connect on WhatsApp.")}`
    },
    website: {
        url: '/'
    },
    location: {
        url: 'https://maps.google.com/?q=Madhya+Pradesh+India'
    },
    whatsapp: {
        url: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Anita Ma'am, I would like to inquire about a consultation.")}`
    },
    facebook: {
        url: 'https://facebook.com'
    },
    instagram: {
        url: 'https://instagram.com'
    },
    linkedin: {
        url: 'https://linkedin.com'
    },
    twitter: {
        url: 'https://twitter.com'
    },
    youtube: {
        url: 'https://youtube.com'
    },
    google: {
        url: 'https://google.com'
    }
}

const ConnectPage = () => {
    const { openPopup } = usePopup()
    const { settings } = useSettings()
    const [connectLinks, setConnectLinks] = useState(DEFAULT_CONNECT_LINKS)
    const [videoLibraryItems, setVideoLibraryItems] = useState(DEFAULT_5_VIDEOS)
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)

        // 1. Fetch Dynamic Connect Links from Firestore
        const fetchConnectLinks = async () => {
            try {
                const linksSnap = await getDoc(doc(db, 'settings', 'connect_links'))
                if (linksSnap.exists()) {
                    setConnectLinks(prev => ({
                        ...prev,
                        ...linksSnap.data()
                    }))
                }
            } catch (err) {
                console.warn('Using default connect links', err)
            }
        }

        // 2. Fetch Dynamic Video Library from Firestore
        const fetchVideos = async () => {
            try {
                const videosSnap = await getDocs(collection(db, 'video_library'))
                const items = videosSnap.docs
                    .filter(d => d.id !== 'config' && d.data().enabled !== false)
                    .map(d => {
                        const data = d.data()
                        return {
                            id: d.id,
                            title: data.title || '',
                            desc: data.desc || data.description || '',
                            url: data.url || data.youtubeUrl || '',
                            thumbnail: data.thumbnail || data.thumbnailUrl || '',
                            order: data.order ?? 0,
                            ...data
                        }
                    })
                    .sort((a, b) => (a.order || 0) - (b.order || 0))

                if (items.length > 0) {
                    setVideoLibraryItems(items)
                }
            } catch (err) {
                console.warn('Using default videos fallback', err)
            }
        }

        fetchConnectLinks()
        fetchVideos()
    }, [])

    const whatsappDefaultUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Anita Ma'am, I would like to inquire about a consultation.")}`

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Connect with Anita Doval',
                text: 'Connect with Anita Doval — Astrology, Vastu & Spiritual Guidance',
                url: window.location.href,
            }).catch(() => { })
        } else {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    // Helper to execute dynamic link actions
    const handleLinkClick = (url, fallbackUrl = '') => {
        const target = url || fallbackUrl
        if (!target) return
        if (target.startsWith('http://') || target.startsWith('https://')) {
            window.open(target, '_blank')
        } else {
            window.location.href = target
        }
    }

    // Exact 11 grid items from user's flyer design, powered by dynamic Firestore links
    const scanItems = [
        {
            id: 'book',
            title: 'Book\nAppointment',
            action: () => {
                if (connectLinks.book?.actionType === 'custom_url' && connectLinks.book?.customUrl) {
                    handleLinkClick(connectLinks.book.customUrl)
                } else {
                    openPopup()
                }
            },
            icon: (
                <div className="w-14 h-14 rounded-full bg-[#8c1818] text-white flex flex-col items-center justify-center font-bold text-[10px] leading-tight uppercase border-2 border-[#b52626] shadow-sm">
                    <span>BOOK</span>
                    <span>NOW</span>
                    <span className="text-[10px]">👆</span>
                </div>
            )
        },
        {
            id: 'wa-business',
            title: 'Connect On\nWhatsApp',
            action: () => handleLinkClick(connectLinks.waBusiness?.url, whatsappDefaultUrl),
            icon: (
                <div className="w-14 h-14 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                    B
                </div>
            )
        },
        {
            id: 'website',
            title: 'Visit\nWebsite',
            action: () => handleLinkClick(connectLinks.website?.url, '/'),
            icon: (
                <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm overflow-hidden p-1">
                    <svg viewBox="0 0 48 48" className="w-11 h-11">
                        <circle cx="24" cy="24" r="20" fill="#295b88" />
                        <ellipse cx="24" cy="24" rx="10" ry="20" fill="none" stroke="#fff" strokeWidth="2" />
                        <line x1="4" y1="24" x2="44" y2="24" stroke="#fff" strokeWidth="2" />
                        <circle cx="34" cy="28" r="8" fill="#e84a27" />
                        <circle cx="34" cy="28" r="5" fill="#f4b400" />
                        <line x1="39" y1="33" x2="45" y2="39" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
            )
        },
        {
            id: 'location',
            title: 'location',
            action: () => handleLinkClick(connectLinks.location?.url, 'https://maps.google.com/?q=Madhya+Pradesh+India'),
            icon: (
                <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#d32f2f]" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                    </svg>
                </div>
            )
        },
        {
            id: 'whatsapp',
            title: 'whatsapp',
            action: () => handleLinkClick(connectLinks.whatsapp?.url, whatsappDefaultUrl),
            icon: (
                <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                </div>
            )
        },
        {
            id: 'facebook',
            title: 'facebook',
            action: () => handleLinkClick(connectLinks.facebook?.url, settings?.social?.facebook || 'https://facebook.com'),
            icon: (
                <div className="w-14 h-14 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </div>
            )
        },
        {
            id: 'instagram',
            title: 'instagram',
            action: () => handleLinkClick(connectLinks.instagram?.url, settings?.social?.instagram || 'https://instagram.com'),
            icon: (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </div>
            )
        },
        {
            id: 'linkedin',
            title: 'linkdin',
            action: () => handleLinkClick(connectLinks.linkedin?.url, settings?.social?.linkedin || 'https://linkedin.com'),
            icon: (
                <div className="w-14 h-14 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-3xl shadow-sm">
                    in
                </div>
            )
        },
        {
            id: 'twitter',
            title: 'twitter',
            action: () => handleLinkClick(connectLinks.twitter?.url, settings?.social?.twitter || 'https://twitter.com'),
            icon: (
                <div className="w-14 h-14 rounded-2xl bg-[#1DA1F2] text-white flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                    </svg>
                </div>
            )
        },
        {
            id: 'youtube',
            title: 'youtube',
            action: () => handleLinkClick(connectLinks.youtube?.url, settings?.social?.youtube || 'https://youtube.com'),
            icon: (
                <div className="w-14 h-14 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                </div>
            )
        },
        {
            id: 'google',
            title: 'google',
            action: () => handleLinkClick(connectLinks.google?.url, 'https://google.com'),
            icon: (
                <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-9 h-9">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                </div>
            )
        }
    ]

    const handleVideoClick = (item) => {
        // If a direct URL exists and is not YouTube, open directly or open modal
        setSelectedVideo(item)
    }

    return (
        <div className="min-h-screen bg-[#FAF6EC] pt-20 pb-10 md:pb-16 md:pt-26 px-3 sm:px-6 flex flex-col items-center selection:bg-[var(--gold-500)] selection:text-white">

            {/* Container Box matching the Flyer layout */}
            <div className="w-full max-w-[650px] bg-[#FAF6ED] border-2 border-[#547345]/30 rounded-3xl p-6 sm:p-10 shadow-xl relative">

                {/* Top QR Share Floating Action */}
                <div className="flex justify-between items-center mb-6 border-b border-[#547345]/20 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl border border-stone-200 shadow-xs">
                            <QRCodeSVG value={window.location.href} size={48} level="M" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#547345]">Digital Hub</p>
                            <p className="font-serif font-semibold text-stone-800 text-sm">Anita Doval</p>
                        </div>
                    </div>
                    <button
                        onClick={handleShare}
                        className="btn btn-outline text-xs h-9 px-3 flex items-center gap-1.5 border-[#547345]/40 text-[#2f4b23] hover:bg-[#547345]/10 cursor-pointer"
                    >
                        <Share2 size={14} />
                        <span>{copied ? 'Link Copied!' : 'Share Page'}</span>
                    </button>
                </div>

                {/* Main Heading: SCAN TO */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#2b251e] tracking-[0.2em] uppercase">
                        SCAN TO
                    </h1>
                    <div className="w-24 h-0.5 bg-[#547345]/40 mx-auto mt-2"></div>
                </div>

                {/* 11 Cards Grid matching screenshot */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mb-12">
                    {scanItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#FAF6ED] border-[1.5px] border-[#547345] rounded-2xl p-3 flex flex-col items-center justify-between text-center min-h-[160px] shadow-xs hover:shadow-md hover:scale-[1.02] transition-all"
                        >
                            <div className="my-1.5 flex items-center justify-center">
                                {item.icon}
                            </div>

                            <p className="font-serif font-bold text-[13px] text-[#1f1a14] leading-tight my-1 whitespace-pre-line">
                                {item.title}
                            </p>

                            <button
                                onClick={item.action}
                                className="w-full mt-auto py-1 px-2 rounded-full bg-[#9e1c1c] hover:bg-[#b82323] text-white font-sans font-bold text-[10px] tracking-wider uppercase transition-colors shadow-xs active:scale-95 cursor-pointer"
                            >
                                CLICK HERE
                            </button>
                        </div>
                    ))}
                </div>

                {/* VIDEO LIBRARY Section matching screenshot */}
                <div className="mt-8 pt-8 border-t-2 border-[#547345]/30">
                    <div className="text-center mb-8">
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2b251e] tracking-[0.18em] uppercase">
                            VIDEO LIBRARY
                        </h2>
                        <div className="w-20 h-0.5 bg-[#547345]/40 mx-auto mt-2"></div>
                    </div>

                    <div className="space-y-4">
                        {videoLibraryItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl hover:bg-stone-50/70 transition-colors"
                            >
                                {/* Left icon & Title with dotted leader */}
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1976D2] to-[#42A5F5] text-white flex items-center justify-center shrink-0 shadow-xs">
                                        <Play size={12} fill="white" className="ml-0.5" />
                                    </div>

                                    <div className="flex items-baseline min-w-0 flex-1 overflow-hidden">
                                        <span className="font-serif font-bold text-[13px] sm:text-[14px] text-[#241e17] shrink-0 truncate">
                                            {item.title}
                                        </span>
                                        <span className="text-stone-400 font-mono tracking-widest text-xs hidden sm:inline-block ml-1 truncate">
                                            ...........................................................................
                                        </span>
                                    </div>
                                </div>

                                {/* Red Pill Action Button */}
                                <button
                                    onClick={() => handleVideoClick(item)}
                                    className="shrink-0 py-1.5 px-4 rounded-full bg-[#9e1c1c] hover:bg-[#b82323] text-white font-sans font-bold text-[10px] sm:text-[11px] tracking-wider uppercase transition-colors shadow-xs active:scale-95 cursor-pointer"
                                >
                                    CLICK HERE
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-10 pt-6 border-t border-[#547345]/20 text-center">
                    <p className="text-xs text-stone-600 font-sans">
                        Madhya Pradesh, India · Global Consultations Available
                    </p>
                </div>

            </div>

            {/* Video Player / Information Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-[9900] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative border border-stone-200 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#9e1c1c] text-white flex items-center justify-center shrink-0 shadow-sm">
                                <Play size={18} fill="white" className="ml-0.5" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                                    {selectedVideo.title}
                                </h3>
                                <p className="text-xs text-stone-500">Official Video Library · Anita Doval</p>
                            </div>
                        </div>

                        {selectedVideo.desc && (
                            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                                {selectedVideo.desc}
                            </p>
                        )}

                        {/* Video Content / Iframe or Placeholder */}
                        {selectedVideo.url && (selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be')) ? (
                            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-5">
                                <iframe
                                    src={selectedVideo.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                    title={selectedVideo.title}
                                    allowFullScreen
                                    className="w-full h-full border-0"
                                />
                            </div>
                        ) : selectedVideo.thumbnail ? (
                            <div className="aspect-video bg-stone-900 rounded-xl overflow-hidden mb-5 relative">
                                <img src={selectedVideo.thumbnail} alt={selectedVideo.title} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                        onClick={() => {
                                            if (selectedVideo.url) {
                                                window.open(selectedVideo.url, '_blank')
                                            } else {
                                                window.open(connectLinks.youtube?.url || 'https://youtube.com', '_blank')
                                            }
                                        }}
                                    >
                                        <Play size={24} fill="white" className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video bg-stone-900 rounded-xl flex flex-col items-center justify-center text-white p-4 text-center mb-5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-950 opacity-90" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div
                                        className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center mb-3 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                        onClick={() => {
                                            if (selectedVideo.url) {
                                                window.open(selectedVideo.url, '_blank')
                                            } else {
                                                window.open(connectLinks.youtube?.url || 'https://youtube.com', '_blank')
                                            }
                                        }}
                                    >
                                        <Play size={24} fill="white" className="ml-1" />
                                    </div>
                                    <p className="text-sm font-medium">
                                        {selectedVideo.url ? 'Watch Video' : 'Official Guidance Episode'}
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1 max-w-xs">
                                        {selectedVideo.url ? 'Click to open video stream' : 'Watch client transformations & guidance on YouTube, or inquire via WhatsApp'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                            <a
                                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello Anita Ma'am, I would like to inquire about "${selectedVideo.title}".`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#25D366] font-semibold flex items-center gap-1.5 hover:underline"
                            >
                                <MessageCircle size={15} /> Inquire on WhatsApp
                            </a>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="btn btn-outline text-xs px-4 py-2 cursor-pointer"
                                >
                                    Close
                                </button>
                                {selectedVideo.url ? (
                                    <button
                                        onClick={() => window.open(selectedVideo.url, '_blank')}
                                        className="btn btn-primary text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span>Watch Video</span>
                                        <ExternalLink size={14} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.open(connectLinks.youtube?.url || 'https://youtube.com', '_blank')}
                                        className="btn btn-primary text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span>Visit YouTube</span>
                                        <ExternalLink size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ConnectPage
