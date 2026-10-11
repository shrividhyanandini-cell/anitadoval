// ============================================================
// SITE CONFIGURATION — SINGLE SOURCE OF TRUTH
// ============================================================
// All phone numbers, emails, WhatsApp numbers, social links
// and site metadata live here. Never duplicate these values
// in individual components.
// ============================================================

export const SITE_CONFIG = {
  brand: {
    name: 'Anita Doval',
    tagline: 'Astrologer, Vastuvid & Spiritual Advisor',
    taglineHindi: 'ज्योतिषी, वास्तुविद और आध्यात्मिक सलाहकार',
    organization: 'Shri Vidhya Nandini Astrological & Vastu Centre',
    quote: 'Man is the architect of his own destiny. Right timing and proper guidance can bring about a change in one\'s fate.',
    quoteHindi: 'मनुष्य अपने भाग्य का निर्माता स्वयं है। सही समय और उचित मार्गदर्शन भाग्य में परिवर्तन ला सकता है।',
  },

  // ── Contact ─────────────────────────────────────────────
  contact: {
    phone: '+91 88899 00033',
    whatsapp: '918889900033',
    email: 'contact@anitadoval.com',
    address: 'Madhya Pradesh, India',
  },

  // ── Social Links ─────────────────────────────────────────
  social: {
    instagram: '#',
    facebook: '#',
    youtube: '#',
    whatsapp: 'https://wa.me/918889900033?text=' + encodeURIComponent("Hello Anita Ma'am, I would like to connect for a consultation."),
  },

  // ── Connect Page ─────────────────────────────────────────
  connectUrl: 'https://anitadoval.com/connect',

  // ── Form Endpoint ────────────────────────────────────────
  formEndpoint: 'https://backend.anitadoval.com/send_email.php',

  // ── SEO ──────────────────────────────────────────────────
  seo: {
    titleSuffix: '| Anita Doval — Astrologer & Vastu Expert',
    description: 'Anita Doval is a distinguished astrologer, Vastuvid and spiritual advisor based in Madhya Pradesh, India. Expert consultations in astrology, Vastu Shastra, Prashna Kundli, Mantra Vidhan and meditation.',
    ogImage: '/images/og-image.jpg',
    siteUrl: 'https://anitadoval.com',
  },
}

// ── WhatsApp Master Number ───────────────────────────────
// Always use this number for ALL WhatsApp redirects site-wide
export const WA_NUMBER = '918889900033'

/**
 * Builds a WhatsApp redirect URL with a pre-filled message from form data.
 * @param {Object} formData — form fields (name, phone, service, message, etc.)
 * @param {string} [context] — optional context label e.g. 'Consultation Request'
 * @returns {string} — wa.me URL
 */
export const buildWhatsAppUrl = (formData = {}, context = 'Consultation Inquiry') => {
  const lines = [`🙏 *${context}* — Anita Doval Consultations`]
  if (formData.name) lines.push(`👤 *Name:* ${formData.name}`)
  if (formData.phone) lines.push(`📞 *Phone:* ${formData.phone}`)
  if (formData.email) lines.push(`📧 *Email:* ${formData.email}`)
  if (formData.service || formData.serviceSlug)
    lines.push(`🔯 *Service:* ${formData.service || formData.serviceSlug}`)
  if (formData.dateOfBirth) lines.push(`🎂 *Date of Birth:* ${formData.dateOfBirth}`)
  if (formData.timeOfBirth) lines.push(`⏰ *Time of Birth:* ${formData.timeOfBirth}`)
  if (formData.placeOfBirth) lines.push(`📍 *Place of Birth:* ${formData.placeOfBirth}`)
  if (formData.message) lines.push(`💬 *Message:* ${formData.message}`)
  const msg = lines.join('\n')
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default SITE_CONFIG
