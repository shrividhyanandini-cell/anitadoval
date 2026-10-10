import React, { useState, useEffect } from 'react'
import { Send, MapPin, Mail, MessageCircle, Phone, Globe, Instagram, Facebook, Youtube } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { SITE_CONFIG } from '../../data/siteConfig'
import { INQUIRY_SERVICES } from '../../data/services'
import Button from '../../components/UI/Button'
import PageHeader from '../../components/UI/PageHeader'
import { useSettings } from '../../hooks/useSettings'

const Contact = () => {
  const { settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceSlug: '',
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

    try {
      const response = await fetch(SITE_CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: INQUIRY_SERVICES.find(s => s.slug === formData.serviceSlug)?.title || 'General Inquiry'
        })
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', serviceSlug: '', message: '' })
      } else {
        throw new Error(result.message || 'Failed to submit')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again or reach out directly on WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp 24/7',
      href: settings.social.whatsapp || null,
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
        eyebrow="Let's Connect"
        title="We're here to guide you."
        description="Whether you seek profound astrological insights, Vastu consultation, or support on your spiritual path, our team is ready to assist."
      />

      {/* Main Content Grid */}
      <section className="container pt-16 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Direct Contact & Social Integration (Merged ConnectPage) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Primary Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-[var(--border-warm)] transition hover:shadow-md">
                <Mail className="w-6 h-6 text-[var(--gold-600)] mb-4" />
                <h3 className="font-serif text-lg text-[var(--charcoal-800)] font-medium mb-2">Email Us</h3>
                <p className="text-[14px] text-[var(--charcoal-500)] mb-4">Our team is available to answer elaborate questions.</p>
                <a href={`mailto:${settings.contact.email}`} className="text-[14px] font-semibold text-[var(--gold-600)] hover:text-[var(--gold-700)]">
                  {settings.contact.email}
                </a>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-[var(--border-warm)] transition hover:shadow-md">
                <MapPin className="w-6 h-6 text-[var(--gold-600)] mb-4" />
                <h3 className="font-serif text-lg text-[var(--charcoal-800)] font-medium mb-2">Office Headquarters</h3>
                <p className="text-[14px] text-[var(--charcoal-500)] mb-4">{settings.contact.address || 'Madhya Pradesh, India'}</p>
                <p className="text-[14px] font-semibold text-[var(--charcoal-800)]">Global Consultations via Zoom/Call</p>
                {settings.contact.phone && (
                  <p className="text-[14px] font-medium text-[var(--charcoal-700)] mt-2">
                    <a href={`tel:${settings.contact.phone}`}>{settings.contact.phone}</a>
                  </p>
                )}
              </div>
            </div>

            {/* Merged Linktree / Connect Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-warm)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border-warm)] bg-[var(--cream-100)] flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg text-[var(--charcoal-800)] font-medium">Follow & Connect</h3>
                  <p className="text-[14px] text-[var(--charcoal-500)]">Engage with us on social media.</p>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-sm border border-[var(--border-warm)] hidden sm:block tooltip-trigger">
                  <QRCodeSVG value={SITE_CONFIG.connectUrl || window.location.href} size={48} level="L" fgColor="var(--charcoal-800)" />
                </div>
              </div>

              <div className="flex flex-col">
                {socialLinks.map((link, i) => (
                  <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center p-4 hover:bg-[var(--cream-50)] transition-colors group ${i !== socialLinks.length - 1 ? 'border-b border-[var(--border-warm)]' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--cream-100)] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[var(--charcoal-800)]">{link.name}</h4>
                      <p className="text-[14px] text-[var(--charcoal-500)]">{link.desc}</p>
                    </div>
                    <Globe className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-[var(--gold-600)] transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>


          {/* Right Column: Premium Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-[var(--border-warm)] shadow-[var(--shadow-card)] relative overflow-hidden">

              {/* Decorative line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--gold-300)] via-[var(--gold-500)] to-[var(--gold-300)]"></div>

              <h2 className="font-serif text-[2rem] text-[var(--charcoal-800)] mb-3 leading-tight">Send an Inquiry</h2>
              <p className="text-[var(--charcoal-500)] mb-8 text-[14px]">Fill out the form below and we will get back to you promptly.</p>

              {success ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-serif text-2xl font-medium mb-3 text-[var(--charcoal-800)]">Message Delivered</h3>
                  <p className="text-[var(--charcoal-600)] mb-8 text-sm max-w-sm mx-auto">Thank you for reaching out. A confirmation has been logged securely and we will reply to you shortly.</p>
                  <button onClick={() => setSuccess(false)} className="btn btn-outline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-[14px] font-medium rounded-xl border border-red-100 flex items-start gap-3">
                      <div className="mt-0.5">⚠️</div>
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-semibold uppercase tracking-wider text-[var(--charcoal-600)]">Full Name <span className="text-red-400">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full h-[52px] px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] focus:border-transparent transition-all outline-none font-medium text-[var(--charcoal-800)]"
                        placeholder="e.g. Anjali Sharma"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-semibold uppercase tracking-wider text-[var(--charcoal-600)]">Email Address <span className="text-red-400">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full h-[52px] px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] focus:border-transparent transition-all outline-none font-medium text-[var(--charcoal-800)]"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-semibold uppercase tracking-wider text-[var(--charcoal-600)]">Phone Number <span className="text-red-400">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                        className="w-full h-[52px] px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] focus:border-transparent transition-all outline-none font-medium text-[var(--charcoal-800)]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-semibold uppercase tracking-wider text-[var(--charcoal-600)]">Service Inquiry</label>
                      <div className="relative">
                        <select name="serviceSlug" value={formData.serviceSlug} onChange={handleChange}
                          className="w-full h-[52px] px-4 pr-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] focus:border-transparent transition-all outline-none font-medium text-[var(--charcoal-800)] appearance-none cursor-pointer"
                        >
                          <option value="">General Inquiry</option>
                          {INQUIRY_SERVICES.map(service => (
                            <option key={service.id} value={service.slug}>{service.title}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--charcoal-500)]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-semibold uppercase tracking-wider text-[var(--charcoal-600)]">How can we help? <span className="text-red-400">*</span></label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="4"
                      className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--gold-400)] focus:border-transparent transition-all outline-none font-medium text-[var(--charcoal-800)] resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" loading={loading} className="w-full btn btn-primary shadow-md hover:shadow-lg transition-all">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Secure Inquiry
                    </Button>
                    <p className="text-center mt-4 text-[14px] text-[var(--charcoal-400)]">
                      By submitting this form, you agree to our privacy policy. Your information is 100% secure.
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