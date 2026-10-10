// ============================================================
// CENTRALIZED SERVICE DATA
// ============================================================
// This is the SINGLE source of truth for all services.
// The same data powers: homepage cards, services page,
// service detail pages, inquiry form dropdown, and brochures.
//
// price / duration / consultationMethod:
//   Awaiting final confirmation from client.
//   Old brochure prices are NOT used here.
// ============================================================

export const SERVICE_CATEGORIES = {
    ASTROLOGY: 'astrology',
    VASTU: 'vastu',
    SPIRITUAL: 'spiritual',
}

export const SERVICES = [
    {
        id: 'astrology',
        slug: 'astrology',
        category: SERVICE_CATEGORIES.ASTROLOGY,
        title: 'Astrology',
        titleHindi: 'ज्योतिष शास्त्र',
        shortDescription: 'Understanding your birth chart, planetary influences and life patterns through Vedic astrology.',
        shortDescriptionHindi: 'जन्म कुंडली विश्लेषण, ग्रह प्रभाव और जीवन के पैटर्न को समझना।',
        description: `Vedic astrology consultation provides insights into an individual's personality, potential and life circumstances through the study of birth charts (Kundli), planetary positions and their influences.

A consultation explores the Lagna (ascendant), Navmansh, Chandra and Surya Kundli, along with detailed study of Dashas and Mahadashas to understand the timing of events and suggest appropriate remedies where needed.`,
        includes: [
            'Lagna Kundli Analysis',
            'Navmansh Kundli',
            'Chandra & Surya Kundli',
            'General Kundli Predictions',
            'Detailed Kundli Predictions',
            'Dasha and Mahadasha Study',
            'Varshaphala (Annual Horoscope)',
            'Relevant Remedies',
        ],
        image: '/images/service-astrology.jpg',
        fallbackGradient: 'from-amber-900 to-stone-800',
        price: null,              // Awaiting client confirmation
        duration: null,           // Awaiting client confirmation
        consultationMethod: null, // Awaiting client confirmation
        active: true,
        inquiryEnabled: true,
        displayOrder: 1,
    },
    {
        id: 'vastu',
        slug: 'vastu',
        category: SERVICE_CATEGORIES.VASTU,
        title: 'Vastu Consultation',
        titleHindi: 'वास्तु शास्त्र',
        shortDescription: 'Scientific Vastu analysis for homes, offices, land and commercial properties to optimize energy flow.',
        shortDescriptionHindi: 'घर, ऑफिस और व्यावसायिक स्थलों के लिए वैज्ञानिक वास्तु विश्लेषण।',
        description: `Vastu Shastra consultation applies principles of direction, space and energy to residential, commercial and industrial properties.

Using scientific tools including Aura Energy Reports and direction-based energy analysis, consultations identify imbalances and suggest appropriate remedies including space corrections, element placements and spiritual crystal therapy.`,
        includes: [
            'Residence & Office Consultation',
            'Architectural Design & Planning',
            'Land Visit & Assessment',
            'Construction Design as per Vastu',
            'Commercial & Group Housing',
            'Industrial Project Consultation',
            'Aura Energy Report',
            'Direction-based Energy Distribution',
            'Spiritual & Crystal Therapy Remedies',
        ],
        image: '/images/service-vastu.jpg',
        fallbackGradient: 'from-stone-700 to-amber-800',
        price: null,
        duration: null,
        consultationMethod: null,
        active: true,
        inquiryEnabled: true,
        displayOrder: 2,
    },
    {
        id: 'prashna-kundli',
        slug: 'prashna-kundli',
        category: SERVICE_CATEGORIES.ASTROLOGY,
        title: 'Prashna Kundli',
        titleHindi: 'प्रश्न कुंडली',
        shortDescription: 'Astrological guidance focused on a specific question or present circumstance, without requiring birth details.',
        shortDescriptionHindi: 'किसी विशेष प्रश्न या वर्तमान परिस्थिति के लिए ज्योतिषीय मार्गदर्शन।',
        description: `Prashna Kundli (Question Horoscope) is a specialized Vedic astrology technique where guidance is provided based on the exact time and place the question is asked, rather than requiring full birth details.

This consultation is particularly useful when exact birth details are unavailable or when seeking specific guidance around a present situation or decision.`,
        includes: [
            'Prashna Kundli Analysis',
            'Guidance on Present Circumstances',
            'Specific Question Resolution',
            'Relevant Remedies',
        ],
        image: '/images/service-kundli.jpg',
        fallbackGradient: 'from-amber-800 to-yellow-900',
        price: null,
        duration: null,
        consultationMethod: null,
        active: true,
        inquiryEnabled: true,
        displayOrder: 3,
    },
    {
        id: 'mantra-vidhan',
        slug: 'mantra-vidhan',
        category: SERVICE_CATEGORIES.SPIRITUAL,
        title: 'Mantra Vidhan',
        titleHindi: 'मंत्र विधान',
        shortDescription: 'Guidance on the correct practice and utilization of mantras for positive transformation and spiritual growth.',
        shortDescriptionHindi: 'सकारात्मक परिवर्तन और आध्यात्मिक विकास के लिए मंत्रों के सही अभ्यास पर मार्गदर्शन।',
        description: `Mantra Vidhan consultation provides guidance on the correct selection, practice and utilization of mantras aligned with an individual's circumstances and spiritual goals.

The consultation includes understanding the purpose and significance of specific mantras and their integration into daily practice for meaningful, positive change.`,
        includes: [
            'Personalized Mantra Selection',
            'Correct Method of Practice',
            'Integration into Daily Life',
            'Progress Guidance',
        ],
        image: '/images/service-mantra.jpg',
        fallbackGradient: 'from-orange-900 to-red-900',
        price: null,
        duration: null,
        consultationMethod: null,
        active: true,
        inquiryEnabled: true,
        displayOrder: 4,
    },
    {
        id: 'meditation',
        slug: 'meditation',
        category: SERVICE_CATEGORIES.SPIRITUAL,
        title: 'Meditation Guidance',
        titleHindi: 'ध्यान मार्गदर्शन',
        shortDescription: 'Structured meditation practice guidance for mental clarity, inner peace and spiritual development.',
        shortDescriptionHindi: 'मानसिक स्पष्टता, आंतरिक शांति और आध्यात्मिक विकास के लिए ध्यान मार्गदर्शन।',
        description: `Meditation guidance provides individuals with the correct methods, practices and philosophy for developing a meaningful meditation practice aligned with their spiritual nature and life circumstances.

Guidance integrates traditional Indian meditation practices with an understanding of individual constitution and current life patterns.`,
        includes: [
            'Personalized Meditation Method',
            'Breathing Techniques',
            'Focus and Concentration Practices',
            'Integration into Daily Routine',
        ],
        image: '/images/service-meditation.jpg',
        fallbackGradient: 'from-stone-600 to-amber-700',
        price: null,
        duration: null,
        consultationMethod: null,
        active: true,
        inquiryEnabled: true,
        displayOrder: 5,
    },
    {
        id: 'palmistry',
        slug: 'palmistry',
        category: SERVICE_CATEGORIES.ASTROLOGY,
        title: 'Palmistry',
        titleHindi: 'हस्तरेखा शास्त्र',
        shortDescription: 'Personality and life pattern analysis through the study of palm lines and hand characteristics.',
        shortDescriptionHindi: 'हाथ की रेखाओं के अध्ययन से व्यक्तित्व और जीवन के पैटर्न का विश्लेषण।',
        description: `Palmistry consultation provides insights into personality traits, life tendencies and circumstances through the scientific study of palm lines, mounts and hand characteristics.

The consultation complements astrological analysis, providing an additional perspective on the individual's journey.`,
        includes: [
            'Palm Line Analysis',
            'Hand Type Assessment',
            'Personality Insights',
            'Life Pattern Guidance',
        ],
        image: '/images/service-palmistry.jpg',
        fallbackGradient: 'from-yellow-800 to-amber-900',
        price: null,
        duration: null,
        consultationMethod: null,
        active: true,
        inquiryEnabled: true,
        displayOrder: 6,
    },
    {
        id: 'gemology',
        slug: 'gemology',
        category: SERVICE_CATEGORIES.ASTROLOGY,
        title: 'Gemology',
        titleHindi: 'रत्नशास्त्र',
        shortDescription: 'Expert guidance on gemstone selection aligned with individual astrology and planetary influences.',
        shortDescriptionHindi: 'व्यक्तिगत ज्योतिष और ग्रह प्रभाव के अनुसार रत्न चयन पर विशेषज्ञ मार्गदर्शन।',
        description: `Gemology consultation provides guidance on the selection of appropriate gemstones based on individual birth charts and planetary positions.

The consultation identifies stones that may be beneficial for individual circumstances and explains the correct method of wearing and maintaining them.`,
        includes: [
            'Birth Chart-Based Stone Selection',
            'Planetary Correlation',
            'Wearing Method Guidance',
            'Quality and Authenticity Guidance',
        ],
        image: '/images/service-gemology.jpg',
        fallbackGradient: 'from-amber-700 to-stone-800',
        price: null,
        duration: null,
        consultationMethod: null,
        active: true,
        inquiryEnabled: true,
        displayOrder: 7,
    },
    {
        id: 'muhurat',
        slug: 'muhurat',
        category: SERVICE_CATEGORIES.ASTROLOGY,
        title: 'Muhurat Consultation',
        titleHindi: 'मुहूर्त',
        shortDescription: 'Identification of auspicious timings for important events — marriage, business, travel and more.',
        shortDescriptionHindi: 'विवाह, व्यावसायिक कार्य, यात्रा और अन्य महत्वपूर्ण घटनाओं के लिए शुभ मुहूर्त।',
        description: `Muhurat consultation identifies auspicious timings (Shubh Muhurat) for significant life events including marriages, new ventures, construction, investments and travel.

The timing selection is based on Vedic astrology principles, aligning the event with favorable planetary configurations for the best possible start.`,
        includes: [
            'Specific Muhurat for Marriage',
            'Business Muhurat',
            'Travel Muhurat',
            'Construction & Property Muhurat',
            'General Auspicious Timings',
        ],
        image: '/images/service-muhurat.jpg',
        fallbackGradient: 'from-stone-800 to-amber-900',
        price: null,
        duration: null,
        consultationMethod: null,
        active: true,
        inquiryEnabled: true,
        displayOrder: 8,
    },
]

// Active services for homepage display (first 6)
export const HOMEPAGE_SERVICES = SERVICES.filter(s => s.active).slice(0, 6)

// Services for inquiry form dropdown (all active, inquiry-enabled)
export const INQUIRY_SERVICES = SERVICES.filter(s => s.active && s.inquiryEnabled)

export default SERVICES
