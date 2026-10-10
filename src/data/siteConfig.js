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
  // TODO: Replace placeholders with confirmed contact details
  contact: {
    // phone: '+91-XXXXXXXXXX',       // Awaiting client confirmation
    // whatsapp: '+91-XXXXXXXXXX',    // Awaiting client confirmation
    email: 'contact@anitadoval.com',  // To be confirmed / activated
    address: 'Madhya Pradesh, India', // Client-approved address format
  },

  // ── Social Links ─────────────────────────────────────────
  // TODO: Replace # with actual social profile URLs
  social: {
    instagram: '#',   // Awaiting client confirmation
    facebook: '#',    // Awaiting client confirmation
    youtube: '#',     // Awaiting client confirmation
    whatsapp: '#',    // Awaiting client WhatsApp link/number
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

export default SITE_CONFIG
