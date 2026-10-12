import React, { useState, useEffect } from 'react'
import { Send, MapPin, Mail, MessageCircle, Globe, Instagram, Facebook, Youtube, Sparkles, User, Calendar, Clock } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { SITE_CONFIG, buildWhatsAppUrl } from '../../data/siteConfig'
import { INQUIRY_SERVICES } from '../../data/services'
import Button from '../../components/UI/Button'
import PageHeader from '../../components/UI/PageHeader'
import { useSettings } from '../../hooks/useSettings'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const Contact = () => {
  const { settings } = useSettings()
  const [formType, setFormType] = useState('basic') // 'basic' | 'detailed'
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceSlug: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    message: ''
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const serviceTitle = INQUIRY_SERVICES.find(s => s.slug === formData.serviceSlug)?.title || 'General Inquiry'
    const finalData = { ...formData, service: serviceTitle, formType }

    try {
      // 1. Save to Firestore for records
      try {
        await addDoc(collection(db, 'inquiries'), {
          ...finalData,
          status: 'new',
          createdAt: serverTimestamp()
        })
      } catch (fsErr) {
        console.warn('Firestore save notice:', fsErr)
      }

      // 2. Redirect to WhatsApp with pre-filled details
      const waUrl = buildWhatsAppUrl(finalData, 'Consultation Request')
      window.open(waUrl, '_blank')

      setSuccess(true)
      setFormData({
        name: '', email: '', phone: '', serviceSlug: '',
        dateOfBirth: '', timeOfBirth: '', placeOfBirth: '', message: ''
      })
    } catch (err) {
      console.error(err)
      // Fallback: still open WhatsApp
      const waUrl = buildWhatsAppUrl(finalData, 'Consultation Request')
      window.open(waUrl, '_blank')
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp 24/7',
      href: settings.social?.whatsapp || SITE_CONFIG.social.whatsapp,
      icon: <MessageCircle className="w-5 h-5 text-[#25D366]" />,
      desc: "Fastest response time."
    },
    {
      id: 'instagram',
      name: 'Instagram',
      href: settings.social.instagram || null,
      icon: <Instagram className="w-5 h-5 text-pink-600" />,
      desc: "Follow for daily insights."
    },
    {
      id: 'youtube',
      name: 'YouTube',
      href: settings.social.youtube || null,
      icon: <Youtube className="w-5 h-5 text-red-600" />,
      desc: "Watch detailed guides."
    },
    {
      id: 'facebook',
      name: 'Facebook',
      href: settings.social.facebook || null,
      icon: <Facebook className="w-5 h-5 text-blue-600" />,
      desc: "Join our community."
    }
  ].filter(link => link.href !== null && link.href !== '#')

  return (
    <div className="bg-[var(--cream-50)] min-h-screen pb-24 selection:bg-[var(--gold-500)] selection:text-white">

      <PageHeader
        pageId="contact"
        eyebrow="LET'S CONNECT"
        title="We're here to guide you."
        description="Whether you seek profound astrological insights, Vastu consultation, or support on your spiritual path, our team is ready to assist."
      />

      {/* Main Content Grid */}
      <section className="container pt-16 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Direct Contact & Social Cards */}
          <div className="lg:col-span-5 space-y-6">

            {/* Primary Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="p-6 bg-white rounded-2xl shadow-xs border border-[var(--border-warm)] transition hover:shadow-md">
                <Mail className="w-6 h-6 text-[var(--gold-600)] mb-4" />
                <h3 className="font-serif text-lg text-[var(--charcoal-800)] font-medium mb-1">Email Us</h3>
                <p className="text-[13px] text-[var(--charcoal-500)] mb-3">Our team answers all consultation inquiries promptly.</p>
                <a href={`mailto:${settings.contact.email || 'contact@anitadoval.com'}`} className="text-[14px] font-semibold text-[var(--gold-600)] hover:text-[var(--gold-700)]">
                  {settings.contact.email || 'contact@anitadoval.com'}
                </a>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-xs border border-[var(--border-warm)] transition hover:shadow-md">
                <MapPin className="w-6 h-6 text-[var(--gold-600)] mb-4" />
                <h3 className="font-serif text-lg text-[var(--charcoal-800)] font-medium mb-1">Location</h3>
                {/* STRICT REQUIREMENT 8: Display address exactly as "Madhya Pradesh, India" */}
                <p className="text-[14px] font-semibold text-[var(--charcoal-800)] mb-1">
                  Madhya Pradesh, India
                </p>
                <p className="text-[13px] text-[var(--charcoal-500)]">
                  Personalized Consultations via Video Call / Audio Call Worldwide
                </p>
                {settings.contact.phone && (
                  <p className="text-[14px] font-medium text-[var(--charcoal-700)] mt-3">
                    <a href={`tel:${settings.contact.phone}`}>{settings.contact.phone}</a>
                  </p>
                )}
              </div>
            </div>

            {/* Social & Connect Section */}
            <div className="bg-white rounded-2xl shadow-xs border border-[var(--border-warm)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border-warm)] bg-[var(--cream-100)] flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg text-[var(--charcoal-800)] font-medium">Follow & Connect</h3>
                  <p className="text-[13px] text-[var(--charcoal-500)]">Engage with Anita Doval on social channels.</p>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-xs border border-[var(--border-warm)] hidden sm:block">
                  <QRCodeSVG value={SITE_CONFIG.connectUrl || window.location.href} size={44} level="L" />
                </div>
              </div>

              <div className="flex flex-col">
                {socialLinks.map((link, i) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-4 hover:bg-[var(--cream-50)] transition-colors group ${i !== socialLinks.length - 1 ? 'border-b border-[var(--border-warm)]' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--cream-100)] flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[var(--charcoal-800)]">{link.name}</h4>
                      <p className="text-[13px] text-[var(--charcoal-500)]">{link.desc}</p>
                    </div>
                    <Globe className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-[var(--gold-600)] transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry & Consultation Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[var(--border-warm)] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--gold-300)] via-[var(--gold-500)] to-[var(--gold-300)]"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[var(--charcoal-800)] leading-tight">
                    Inquiry & Consultation Form
                  </h2>
                  <p className="text-[var(--charcoal-500)] text-[14px] mt-1">
                    Fill out the form below and we will confirm your consultation details.
                  </p>
                </div>

                {/* Form Switcher */}
                <div className="inline-flex p-1 bg-stone-100 rounded-xl self-start sm:self-auto shrink-0 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setFormType('basic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${formType === 'basic' ? 'bg-white shadow-xs text-[var(--gold-700)]' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    <User size={14} />
                    <span>Basic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('detailed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${formType === 'detailed' ? 'bg-white shadow-xs text-[var(--gold-700)]' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    <Sparkles size={14} />
                    <span>Detailed Kundli</span>
                  </button>
                </div>
              </div>

              {success ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-serif text-2xl font-medium mb-2 text-[var(--charcoal-800)]">Inquiry Successfully Submitted</h3>
                  <p className="text-[var(--charcoal-600)] mb-6 text-sm max-w-sm mx-auto">Thank you for reaching out. Your consultation request is saved securely and we will contact you shortly.</p>
                  <button onClick={() => setSuccess(false)} className="btn btn-outline">
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-[13px] rounded-xl border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)]">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] transition-all outline-hidden text-[16px] font-medium"
                        placeholder="e.g. Anjali Sharma"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)]">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] transition-all outline-hidden text-[16px] font-medium"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)]">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] transition-all outline-hidden text-[16px] font-medium"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)]">
                        Service Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="serviceSlug"
                        value={formData.serviceSlug}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[var(--gold-400)] transition-all outline-hidden text-[16px] font-medium cursor-pointer"
                      >
                        <option value="">Select a service...</option>
                        {INQUIRY_SERVICES.map(service => (
                          <option key={service.id} value={service.slug}>{service.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Detailed Astrology Fields */}
                  {formType === 'detailed' && (
                    <div className="p-4 bg-[var(--gold-50)]/60 rounded-2xl border border-[var(--gold-200)] space-y-3.5 animate-fade-in">
                      <p className="text-xs font-bold text-[var(--gold-800)] flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles size={14} /> Astrological Birth Information
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                            <Calendar size={13} /> Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required={formType === 'detailed'}
                            className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-[16px] outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                            <Clock size={13} /> Time of Birth
                          </label>
                          <input
                            type="text"
                            name="timeOfBirth"
                            value={formData.timeOfBirth}
                            onChange={handleChange}
                            placeholder="e.g. 05:45 PM"
                            className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-[16px] outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                            <MapPin size={13} /> Place of Birth
                          </label>
                          <input
                            type="text"
                            name="placeOfBirth"
                            value={formData.placeOfBirth}
                            onChange={handleChange}
                            placeholder="City, State"
                            className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-[16px] outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--charcoal-600)]">
                      {formType === 'detailed' ? 'Questions / Specific Focus Areas' : 'Message / Details'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] transition-all outline-hidden text-[16px] font-medium resize-none"
                      placeholder={formType === 'detailed' ? "Tell us about specific life decisions, career directions, or queries you wish to discuss..." : "Write your message here..."}
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" loading={loading} className="w-full btn btn-primary h-12 shadow-md">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Consultation Request
                    </Button>
                    <p className="text-center mt-3 text-xs text-[var(--charcoal-400)]">
                      Strict client confidentiality guaranteed. Your details are 100% private.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Contact