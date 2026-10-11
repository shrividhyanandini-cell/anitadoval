import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
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

async function verify() {
    console.log('Verifying Firestore collections in project:', env.VITE_FIREBASE_PROJECT_ID)

    const collections = ['services', 'faqs', 'blogs', 'about_section']
    for (const col of collections) {
        const snap = await getDocs(collection(db, col))
        console.log(`- ${col}: ${snap.size} documents found`)
        snap.forEach(doc => {
            const data = doc.data()
            console.log(`    • ID: ${doc.id} | Title/Question: "${data.title || data.question || doc.id}" | Status: ${data.status || 'N/A'}`)
        })
    }
}

verify().then(() => process.exit(0)).catch(err => {
    console.error(err)
    process.exit(1)
})
