import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf-8')
const env = {}
envFile.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const idx = trimmed.indexOf('=')
    if (idx !== -1) {
        env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim()
    }
})

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const newBlogs = [
    {
        id: 'vastu-for-workspaces',
        slug: 'vastu-for-workspaces',
        title: 'Vastu for Modern Workspaces: Optimizing Energy for Focus & Prosperity',
        category: 'Vastu',
        author: 'Anita Doval',
        publishedAt: '2025-01-20',
        readTimeMinutes: 6,
        excerpt: 'How subtle directional shifts, elemental desk placement, and non-demolition spatial corrections cultivate commercial success and reduced team stress.',
        imageUrl: '/images/post4.jpg',
        featuredImage: {
            url: '/images/post4.jpg',
            alt: 'Vastu for Modern Workspaces'
        },
        status: 'published',
        enabled: true,
        content: [
            {
                type: 'paragraph',
                text: 'Modern commercial life is fraught with continuous deadlines and high-pressure decision making. Often, fatigue is not merely psychological, but energetic—caused by disharmonious spatial arrangement and poor elemental alignment in the workplace.'
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Northern Quadrant: The Flow of Financial Opportunities'
            },
            {
                type: 'paragraph',
                text: 'In classical Vastu Shastra, the North direction is governed by Kubera, the custodian of abundance and liquidity. Ensuring that the northern perimeter of your workspace remains uncluttered, airy, and well-lit invites fresh prospects and eliminates commercial stagnation.'
            },
            {
                type: 'heading',
                level: 2,
                text: 'Executive Seating: The Earth Element (South-West)'
            },
            {
                type: 'paragraph',
                text: 'Founders, directors, and key decision-makers achieve maximum stability when seated facing North or East with a solid wall behind them in the South-West sector (Nairutya). This grounds authority and prevents reactive, hasty decisions.'
            }
        ]
    },
    {
        id: 'sound-frequencies-mantra-science',
        slug: 'sound-frequencies-mantra-science',
        title: 'The Science of Vedic Mantras: Acoustic Frequencies & Emotional Healing',
        category: 'Spirituality',
        author: 'Anita Doval',
        publishedAt: '2025-01-25',
        readTimeMinutes: 7,
        excerpt: 'Exploring the acoustic resonance of Beej mantras, brainwave synchronization, and how specific rhythmic intonations pacify anxiety and mental chatter.',
        imageUrl: '/images/post6.jpg',
        featuredImage: {
            url: '/images/post6.jpg',
            alt: 'Vedic Mantras Sound Frequencies'
        },
        status: 'published',
        enabled: true,
        content: [
            {
                type: 'paragraph',
                text: 'Vedic mantras were never primitive superstition; they were formulated by ancient Rishis as precise phonological instruments designed to modulate brain states through acoustic resonance and tongue contact with upper palate reflex points.'
            },
            {
                type: 'heading',
                level: 2,
                text: 'Vagus Nerve Stimulation Through Chanting'
            },
            {
                type: 'paragraph',
                text: 'Modern neurobiology demonstrates that sustained elongated vocalization—especially nasalized sounds like "Om" and the Beej syllables—activates the parasympathetic nervous system via auricular branches of the vagus nerve, immediately down-regulating cortisol.'
            },
            {
                type: 'heading',
                level: 2,
                text: 'Daily Japa Practice'
            },
            {
                type: 'paragraph',
                text: 'Practicing even 10 to 15 minutes of attentive repetition in the Brahma Muhurta creates an enduring shield of serenity throughout demanding workday hours.'
            }
        ]
    },
    {
        id: 'navagraha-emotional-wellness',
        slug: 'navagraha-emotional-wellness',
        title: 'Navagraha & Emotional Equilibrium: Planetary Cycles as Catalysts for Growth',
        category: 'Astrology',
        author: 'Anita Doval',
        publishedAt: '2025-01-28',
        readTimeMinutes: 5,
        excerpt: 'Understanding the cyclical nature of planetary Dashas not as external punishment, but as tailored developmental milestones for personal maturity.',
        imageUrl: '/images/post2.jpg',
        featuredImage: {
            url: '/images/post2.jpg',
            alt: 'Navagraha and Emotional Wellness'
        },
        status: 'published',
        enabled: true,
        content: [
            {
                type: 'paragraph',
                text: 'When life brings unexpected friction or sudden transitions, people often blame adverse planetary transits like Sade Sati or Rahu Mahadasha. In reality, planetary forces represent internal archetypes waiting to be integrated.'
            },
            {
                type: 'heading',
                level: 2,
                text: 'Saturn (Shani): The Teacher of Grounded Discipline'
            },
            {
                type: 'paragraph',
                text: 'Saturn never punishes for spite; Saturn demands that we discard superficial delusions, honor commitments, and build enduring foundations through patience, humility, and rigorous self-discipline.'
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Moon (Chandra): The Seat of Emotional Balance'
            },
            {
                type: 'paragraph',
                text: 'The Moon governs our mental peace, sensitivity, and instinctual reactions. When afflicted, mindfulness, hydration, and silver-water remedies restore equilibrium.'
            }
        ]
    }
]

async function addBlogs() {
    console.log('Adding 3 additional blogs to reach 12 published articles...')
    for (const blog of newBlogs) {
        await setDoc(doc(db, 'blogs', blog.id), blog, { merge: true })
        console.log(`✓ Added & published blog: ${blog.title}`)
    }
    console.log('Done!')
    process.exit(0)
}

addBlogs().catch(err => {
    console.error(err)
    process.exit(1)
})
