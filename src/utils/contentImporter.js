import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import seedData from '../data/seedData'

/**
 * Repeatable, idempotent content seed / upsert engine.
 * Ensures:
 * 1. Stable document IDs (no duplicates on re-run)
 * 2. status="draft" preserved as per editorial guidelines
 * 3. Graceful handling of empty/optional fields
 * 4. Detailed audit log for admin review
 */
export const runContentImport = async (customJson = null) => {
    const dataToImport = customJson || seedData
    const logs = []
    const stats = {
        services: { created: 0, updated: 0, total: 0 },
        faqs: { created: 0, updated: 0, total: 0 },
        blogs: { created: 0, updated: 0, total: 0 },
        testimonials: { created: 0, updated: 0, total: 0 },
        errors: []
    }

    logs.push(`Starting import session for ${dataToImport.project?.name || 'Anita Doval Website'}...`)

    // 1. SERVICES COLLECTION
    if (Array.isArray(dataToImport.services)) {
        logs.push(`Processing ${dataToImport.services.length} services...`)
        for (const item of dataToImport.services) {
            try {
                if (!item.id || !item.title) {
                    throw new Error(`Invalid service record missing id or title: ${JSON.stringify(item)}`)
                }

                const docRef = doc(db, 'services', item.id)
                const existingSnap = await getDoc(docRef)
                const isNew = !existingSnap.exists()

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
                    updatedAt: new Date()
                }

                if (isNew) {
                    payload.createdAt = new Date()
                }

                await setDoc(docRef, payload, { merge: true })

                if (isNew) {
                    stats.services.created++
                    logs.push(`[SERVICES] Created: "${item.title}" (ID: ${item.id}, Status: ${payload.status})`)
                } else {
                    stats.services.updated++
                    logs.push(`[SERVICES] Updated: "${item.title}" (ID: ${item.id})`)
                }
                stats.services.total++
            } catch (err) {
                stats.errors.push(`[SERVICES ERROR] ${err.message}`)
                logs.push(`[SERVICES ERROR] ${err.message}`)
            }
        }
    }

    // 2. FAQS COLLECTION
    if (Array.isArray(dataToImport.faqs)) {
        logs.push(`Processing ${dataToImport.faqs.length} FAQs...`)
        for (const item of dataToImport.faqs) {
            try {
                if (!item.id || !item.question) {
                    throw new Error(`Invalid FAQ record missing id or question: ${JSON.stringify(item)}`)
                }

                const docRef = doc(db, 'faqs', item.id)
                const existingSnap = await getDoc(docRef)
                const isNew = !existingSnap.exists()

                const payload = {
                    id: item.id,
                    slug: item.slug || item.id,
                    question: item.question,
                    answer: item.answer || '',
                    sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : 0,
                    enabled: item.enabled !== false,
                    status: item.status || 'draft',
                    updatedAt: new Date()
                }

                if (isNew) {
                    payload.createdAt = new Date()
                }

                await setDoc(docRef, payload, { merge: true })

                if (isNew) {
                    stats.faqs.created++
                    logs.push(`[FAQS] Created: "${item.question.slice(0, 30)}..." (ID: ${item.id}, Status: ${payload.status})`)
                } else {
                    stats.faqs.updated++
                    logs.push(`[FAQS] Updated: "${item.question.slice(0, 30)}..." (ID: ${item.id})`)
                }
                stats.faqs.total++
            } catch (err) {
                stats.errors.push(`[FAQS ERROR] ${err.message}`)
                logs.push(`[FAQS ERROR] ${err.message}`)
            }
        }
    }

    // 3. BLOGS COLLECTION
    if (Array.isArray(dataToImport.blogs)) {
        logs.push(`Processing ${dataToImport.blogs.length} Blogs...`)
        for (const item of dataToImport.blogs) {
            try {
                if (!item.id || !item.title) {
                    throw new Error(`Invalid blog record missing id or title: ${JSON.stringify(item)}`)
                }

                const docRef = doc(db, 'blogs', item.id)
                const existingSnap = await getDoc(docRef)
                const isNew = !existingSnap.exists()

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
                    updatedAt: new Date()
                }

                if (isNew) {
                    payload.createdAt = new Date()
                }

                await setDoc(docRef, payload, { merge: true })

                if (isNew) {
                    stats.blogs.created++
                    logs.push(`[BLOGS] Created: "${item.title}" (ID: ${item.id}, Status: ${payload.status})`)
                } else {
                    stats.blogs.updated++
                    logs.push(`[BLOGS] Updated: "${item.title}" (ID: ${item.id})`)
                }
                stats.blogs.total++
            } catch (err) {
                stats.errors.push(`[BLOGS ERROR] ${err.message}`)
                logs.push(`[BLOGS ERROR] ${err.message}`)
            }
        }
    }

    // 4. TESTIMONIALS COLLECTION
    if (Array.isArray(dataToImport.testimonials) && dataToImport.testimonials.length > 0) {
        logs.push(`Processing ${dataToImport.testimonials.length} testimonials...`)
        for (const item of dataToImport.testimonials) {
            try {
                const docId = item.id || `testimonial-${Date.now()}`
                const docRef = doc(db, 'testimonials', docId)
                const existingSnap = await getDoc(docRef)
                const isNew = !existingSnap.exists()

                const payload = {
                    id: docId,
                    clientName: item.clientName || 'Client',
                    message: item.message || '',
                    rating: Number(item.rating) || 5,
                    service: item.service || 'astrology',
                    videoUrl: item.videoUrl || '',
                    thumbnail: item.thumbnail || '',
                    status: item.status || 'draft',
                    enabled: item.enabled !== false,
                    updatedAt: new Date()
                }

                if (isNew) payload.createdAt = new Date()

                await setDoc(docRef, payload, { merge: true })
                if (isNew) stats.testimonials.created++
                else stats.testimonials.updated++
                stats.testimonials.total++
            } catch (err) {
                stats.errors.push(`[TESTIMONIALS ERROR] ${err.message}`)
            }
        }
    } else {
        logs.push(`[TESTIMONIALS] Collection is intentionally empty in seed data. No synthetic reviews created.`)
    }

    logs.push(`Import completed. Services: ${stats.services.total}, FAQs: ${stats.faqs.total}, Blogs: ${stats.blogs.total}, Testimonials: ${stats.testimonials.total}. Errors: ${stats.errors.length}`)

    return {
        success: stats.errors.length === 0,
        stats,
        logs
    }
}
