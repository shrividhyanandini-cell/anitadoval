import React, { useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { MessageCircle, Mail, MapPin, Globe, Instagram, Facebook, Youtube } from 'lucide-react'
import { SITE_CONFIG } from '../../data/siteConfig'
import { usePopup } from '../../context/PopupContext'
import { useSettings } from '../../hooks/useSettings'

const ConnectPage = () => {
    const { openPopup } = usePopup()
    const { settings } = useSettings()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const dynamicSocials = (settings.socialLinks || []).map((link, idx) => ({
        id: `custom-${idx}`,
        name: link.platformName,
        href: link.url,
        icon: <img src={link.iconUrl} alt={link.platformName} className="w-5 h-5 object-contain mix-blend-multiply" />,
        color: 'bg-[var(--cream-50)] text-[var(--charcoal-700)] border-[var(--border-warm)] hover:bg-[var(--gold-50)] hover:border-[var(--gold-300)]'
    }))

    const legacySocials = [
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            href: settings.social.whatsapp || null,
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'bg-[var(--cream-50)] text-green-600 border-[#25D366] hover:bg-green-600 hover:text-white',
            borderHover: 'hover:border-green-600'
        },
        {
            id: 'email',
            name: 'Email Us',
            href: `mailto:${settings.contact.email}`,
            icon: <Mail className="w-5 h-5" />,
            color: 'bg-[var(--cream-50)] text-[var(--charcoal-700)] border-[var(--border-warm)] hover:bg-[var(--charcoal-800)] hover:border-[var(--charcoal-800)] hover:text-white',
        },
        {
            id: 'instagram',
            name: 'Instagram',
            href: settings.social.instagram || null,
            icon: <Instagram className="w-5 h-5" />,
            color: 'bg-[var(--cream-50)] text-pink-600 border-pink-200 hover:bg-pink-600 hover:border-pink-600 hover:text-white',
        },
        {
            id: 'facebook',
            name: 'Facebook',
            href: settings.social.facebook || null,
            icon: <Facebook className="w-5 h-5" />,
            color: 'bg-[var(--cream-50)] text-blue-600 border-blue-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white',
        },
        {
            id: 'youtube',
            name: 'YouTube',
            href: settings.social.youtube || null,
            icon: <Youtube className="w-5 h-5" />,
            color: 'bg-[var(--cream-50)] text-red-600 border-red-200 hover:bg-red-600 hover:border-red-600 hover:text-white',
        }
    ].filter(link => link.href !== null && link.href !== '#')

    const socialLinks = [...dynamicSocials, ...legacySocials]

    return (
        <div className="min-h-screen bg-[var(--cream-100)] flex flex-col items-center py-12 px-4 selection:bg-[var(--gold-500)] selection:text-white">

            {/* Profile Card */}
            <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[var(--shadow-warm-lg)] overflow-hidden border border-[var(--border-light)] transform transition-transform hover:scale-[1.01] duration-500 ease-out">

                {/* Banner Section */}
                <div className="h-40 bg-gradient-to-br from-stone-800 to-stone-900 relative">
                    <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                {/* Info Section */}
                <div className="px-8 pb-10 text-center relative -mt-16">

                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-md bg-[var(--cream-50)] mb-4 overflow-hidden">
                        <img
                            src="/images/post1.jpg" // Using an existing placeholder representing profile
                            alt="Anita Doval"
                            className="w-full h-full object-cover grayscale-[20%]"
                        />
                    </div>

                    <h1 className="font-serif text-[2rem] font-semibold text-[var(--charcoal-800)] mb-1 leading-tight">
                        {SITE_CONFIG.brand.name}
                    </h1>
                    <p className="text-sm font-medium tracking-wide text-[var(--charcoal-500)] uppercase mb-6">
                        Astrologer · Vastuvid
                    </p>

                    <p className="text-[var(--charcoal-600)] text-[0.95rem] leading-relaxed mb-8 px-2">
                        Professional guidance across Vedic astrology, Vastu Shastra, and spiritual consultation.
                    </p>

                    {/* Book Action - Highly Prominent */}
                    <button
                        onClick={() => openPopup()}
                        className="w-full btn btn-primary py-4 text-base font-semibold shadow-md mb-6"
                    >
                        Book a Consultation
                    </button>

                    {/* Links Section */}
                    <div className="space-y-4">
                        {socialLinks.map(link => (
                            <a
                                key={link.id}
                                href={link.href}
                                target={link.id !== 'email' ? "_blank" : undefined}
                                rel={link.id !== 'email' ? "noopener noreferrer" : undefined}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${link.color}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0 transition-transform group-hover:scale-110 duration-300">
                                        {link.icon}
                                    </div>
                                    <span className="font-medium text-[0.95rem]">{link.name}</span>
                                </div>
                                <Globe className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>

                    {/* QR Code Section */}
                    <div className="mt-10 pt-8 border-t border-[var(--border-warm)] flex flex-col items-center">
                        <p className="text-sm text-[var(--charcoal-400)] uppercase font-semibold tracking-wider mb-4">Share Hub</p>
                        <div className="p-3 bg-white border border-[var(--border-warm)] rounded-xl shadow-sm inline-block">
                            <QRCodeSVG
                                value={SITE_CONFIG.connectUrl}
                                size={120}
                                level="L"
                                fgColor="var(--charcoal-800)"
                                bgColor="#ffffff"
                                includeMargin={false}
                            />
                        </div>
                        <p className="text-sm text-[var(--charcoal-500)] mt-4 mb-2">Scan to access this page anywhere</p>
                    </div>

                </div>
            </div>

            <div className="mt-8 text-center text-sm text-[var(--charcoal-400)]">
                &copy; {new Date().getFullYear()} Anita Doval. All rights reserved.
            </div>
        </div>
    )
}

export default ConnectPage
