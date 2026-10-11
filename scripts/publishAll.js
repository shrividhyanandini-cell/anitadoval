import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
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

const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
})

const db = getFirestore(app)

async function publishAll() {
    console.log('Publishing all documents in Firestore...')
    const collections = ['services', 'faqs', 'blogs', 'about_section']
    let updatedCount = 0

    for (const colName of collections) {
        const snap = await getDocs(collection(db, colName))
        console.log(`Processing collection: ${colName} (${snap.size} docs)`)
        for (const docSnap of snap.docs) {
            const data = docSnap.data()
            // Only update if it has status or if it's a content doc
            if (data.status !== 'published') {
                await updateDoc(doc(db, colName, docSnap.id), {
                    status: 'published',
                    enabled: true,
                    updatedAt: new Date().toISOString()
                })
                console.log(`  ✓ Published: [${colName}] ${docSnap.id}`)
                updatedCount++
            } else {
                console.log(`  - Already published: [${colName}] ${docSnap.id}`)
            }
        }
    }

    // Also update legacy services/about_config
    try {
        await updateDoc(doc(db, 'services', 'about_config'), {
            status: 'published',
            enabled: true,
            sectionEnabled: true
        })
        console.log('  ✓ Published legacy services/about_config')
    } catch (e) { }

    console.log(`Finished! Total updated to published: ${updatedCount}`)
}

publishAll().then(() => process.exit(0)).catch(err => {
    console.error(err)
    process.exit(1)
})
