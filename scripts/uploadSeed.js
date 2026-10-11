import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore'
import fs from 'fs'

// Load .env
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

console.log('----------------------------------------------------')
console.log('Connecting to Firebase Project:', firebaseConfig.projectId)
console.log('----------------------------------------------------')

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Load Anita_Doval_Firebase_Content_Seed.json
const seedRaw = fs.readFileSync('Anita_Doval_Firebase_Content_Seed.json', 'utf-8')
const seed = JSON.parse(seedRaw)

async function runUpload() {
    // Clean up test document
    try {
        await deleteDoc(doc(db, 'services', 'test_connection'))
    } catch (e) { }

    const results = {
        services: 0,
        faqs: 0,
        blogs: 0,
        about: 0,
        errors: []
    }

    // 1. Upload Services
    if (Array.isArray(seed.services)) {
        console.log(`\n[SERVICES] Uploading ${seed.services.length} services...`)
        for (const item of seed.services) {
            try {
                const docRef = doc(db, 'services', item.id)
                const imageUrl = (typeof item.image === 'object' ? item.image?.url : item.image) || ''
                const imageAlt = (typeof item.image === 'object' ? item.image?.alt : item.imageAlt) || item.title

                const payload = {
                    id: item.id,
                    slug: item.slug || item.id,
                    title: item.title,
                    shortDescription: item.shortDescription || '',
                    detailedDescription: item.detailedDescription || item.description || '',
                    description: item.detailedDescription || item.description || '',
                    features: Array.isArray(item.features) ? item.features : [],
                    cardIcon: item.cardIcon || item.icon || 'star',
                    icon: item.cardIcon || item.icon || 'star',
                    image: imageUrl,
                    imageUrl: imageUrl,
                    imageAlt: imageAlt,
                    price: item.price || '',
                    duration: item.duration || '',
                    sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : 0,
                    enabled: item.enabled !== false,
                    status: item.status || 'draft',
                    updatedAt: new Date().toISOString()
                }

                await setDoc(docRef, payload, { merge: true })
                results.services++
                console.log(`  ✓ Uploaded Service: "${item.title}" (${item.id}) [status: ${payload.status}]`)
            } catch (err) {
                console.error(`  ✗ Error uploading service "${item.id}":`, err.message)
                results.errors.push(`Service ${item.id}: ${err.message}`)
            }
        }
    }

    // 2. Upload FAQs
    if (Array.isArray(seed.faqs)) {
        console.log(`\n[FAQS] Uploading ${seed.faqs.length} FAQs...`)
        for (const item of seed.faqs) {
            try {
                const docRef = doc(db, 'faqs', item.id)
                const payload = {
                    id: item.id,
                    slug: item.slug || item.id,
                    question: item.question,
                    answer: item.answer || '',
                    sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : 0,
                    enabled: item.enabled !== false,
                    status: item.status || 'draft',
                    updatedAt: new Date().toISOString()
                }

                await setDoc(docRef, payload, { merge: true })
                results.faqs++
                console.log(`  ✓ Uploaded FAQ: "${item.question.slice(0, 40)}..." (${item.id}) [status: ${payload.status}]`)
            } catch (err) {
                console.error(`  ✗ Error uploading FAQ "${item.id}":`, err.message)
                results.errors.push(`FAQ ${item.id}: ${err.message}`)
            }
        }
    }

    // 3. Upload Blogs
    if (Array.isArray(seed.blogs)) {
        console.log(`\n[BLOGS] Uploading ${seed.blogs.length} Blogs...`)
        for (const item of seed.blogs) {
            try {
                const docRef = doc(db, 'blogs', item.id)
                const imageUrl = (typeof item.featuredImage === 'object' ? item.featuredImage?.url : item.imageUrl) || ''
                const imageAlt = (typeof item.featuredImage === 'object' ? item.featuredImage?.alt : item.title) || item.title

                const payload = {
                    id: item.id,
                    slug: item.slug || item.id,
                    title: item.title,
                    excerpt: item.excerpt || '',
                    category: item.category || 'Astrology',
                    author: item.author || 'Anita Doval',
                    publishedAt: item.publishedAt || '',
                    readTimeMinutes: Number(item.readTimeMinutes) || 5,
                    featuredImage: {
                        url: imageUrl,
                        alt: imageAlt
                    },
                    imageUrl: imageUrl,
                    content: item.content || [],
                    seo: item.seo || {
                        metaTitle: `${item.title} | Anita Doval`,
                        metaDescription: item.excerpt || ''
                    },
                    status: item.status || 'draft',
                    enabled: item.enabled !== false,
                    updatedAt: new Date().toISOString()
                }

                await setDoc(docRef, payload, { merge: true })
                results.blogs++
                console.log(`  ✓ Uploaded Blog: "${item.title.slice(0, 40)}..." (${item.id}) [status: ${payload.status}]`)
            } catch (err) {
                console.error(`  ✗ Error uploading Blog "${item.id}":`, err.message)
                results.errors.push(`Blog ${item.id}: ${err.message}`)
            }
        }
    }

    // 4. Seed About Section config
    console.log(`\n[ABOUT SECTION] Ensuring about_section documents are seeded...`)
    try {
        const aboutConfigPayload = {
            eyebrow: 'ABOUT ANITA DOVAL',
            heading: 'Understanding the\nperson beyond the chart.',
            description: 'Anita Doval\'s journey has been shaped by years of study, practice and real-life experience. Her approach combines the wisdom of astrology and Vastu with a deep understanding of human nature and spiritual principles.',
            portrait: { url: '/images/post1.jpg', position: 'center center', alt: 'Anita Doval' },
            badge: {
                enabled: true,
                label: 'Years of',
                mainText: 'Guidance & Practice',
            },
            points: [
                { text: 'Holistic and practical approach', enabled: true },
                { text: 'Personalised consultations', enabled: true },
                { text: 'Guidance rooted in knowledge and experience', enabled: true }
            ],
            cta: {
                enabled: true,
                text: 'Book a Consultation',
                url: ''
            },
            quote: {
                enabled: true,
                text: 'Every chart tells\na story, but every\nperson\'s journey\nis unique.',
                decorationEnabled: true
            },
            sectionEnabled: true,
            status: 'draft',
            updatedAt: new Date().toISOString()
        }

        await setDoc(doc(db, 'about_section', 'about_config'), aboutConfigPayload, { merge: true })
        // Also sync to legacy path for safety
        await setDoc(doc(db, 'services', 'about_config'), aboutConfigPayload, { merge: true })
        results.about++
        console.log(`  ✓ Uploaded about_section/about_config [status: draft]`)
    } catch (err) {
        console.error(`  ✗ Error uploading about_section:`, err.message)
        results.errors.push(`About: ${err.message}`)
    }

    console.log('\n====================================================')
    console.log('UPLOAD COMPLETE SUMMARY:')
    console.log(`- Services Uploaded: ${results.services} / ${seed.services?.length || 0}`)
    console.log(`- FAQs Uploaded:     ${results.faqs} / ${seed.faqs?.length || 0}`)
    console.log(`- Blogs Uploaded:    ${results.blogs} / ${seed.blogs?.length || 0}`)
    console.log(`- About Configured:  ${results.about}`)
    console.log(`- Total Errors:      ${results.errors.length}`)
    console.log('====================================================')

    if (results.errors.length > 0) {
        console.error('Errors encountered:', results.errors)
        process.exit(1)
    } else {
        console.log('ALL RECORDS SUCCESSFULLY PUSHED TO FIREBASE!')
        process.exit(0)
    }
}

runUpload().catch(err => {
    console.error('Fatal upload error:', err)
    process.exit(1)
})
