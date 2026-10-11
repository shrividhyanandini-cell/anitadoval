import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { renderBlogContent, getBlogExcerpt } from '../../utils/blogAdapter'
import { Calendar, Clock, User, ArrowLeft, Share2, Tag, BookOpen } from 'lucide-react'
import Loading from '../../components/UI/Loading'

const BlogDetailPage = () => {
    const { slug } = useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [recentPosts, setRecentPosts] = useState([])

    useEffect(() => {
        window.scrollTo(0, 0)

        const fetchPost = async () => {
            try {
                setLoading(true)
                setError(null)

                let postData = null

                // 1. First try querying by slug
                const qSlug = query(collection(db, 'blogs'), where('slug', '==', slug))
                const snapSlug = await getDocs(qSlug)

                if (!snapSlug.empty) {
                    const docSnap = snapSlug.docs[0]
                    postData = { id: docSnap.id, ...docSnap.data() }
                } else {
                    // 2. Try fetching by doc ID
                    try {
                        const directDoc = await getDoc(doc(db, 'blogs', slug))
                        if (directDoc.exists()) {
                            postData = { id: directDoc.id, ...directDoc.data() }
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                if (!postData) {
                    setError('Blog post not found.')
                } else {
                    setBlog(postData)
                    // Set document title and SEO if available
                    if (postData.seo?.metaTitle || postData.title) {
                        document.title = `${postData.seo?.metaTitle || postData.title} | Anita Doval Astrologer`
                    }
                }

                // Fetch recent published posts for recommendation
                const recentQuery = query(collection(db, 'blogs'), where('status', '==', 'published'))
                const recentSnap = await getDocs(recentQuery)
                const recents = []
                recentSnap.forEach(d => {
                    const data = d.data()
                    if (d.id !== slug && data.slug !== slug && data.enabled !== false) {
                        recents.push({ id: d.id, ...data })
                    }
                })
                setRecentPosts(recents.slice(0, 3))

            } catch (err) {
                console.error("Error fetching blog detail:", err)
                setError("Unable to load article.")
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchPost()
        }
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center py-24">
                <Loading type="spinner" text="Loading article..." />
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-[#E9E4DC]">
                    <BookOpen className="w-12 h-12 text-[#A67828] mx-auto mb-4" />
                    <h2 className="text-2xl font-serif text-[#231F1C] mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-6 text-sm">The article you are looking for may have been moved or is currently in draft.</p>
                    <Link to="/blog" className="btn btn-primary inline-flex items-center gap-2">
                        <ArrowLeft size={16} /> Return to Articles
                    </Link>
                </div>
            </div>
        )
    }

    const imageSrc = blog.featuredImage?.url || blog.imageUrl
    const imageAlt = blog.featuredImage?.alt || blog.title
    const authorName = blog.author || 'Anita Doval'
    const readTime = blog.readTimeMinutes ? `${blog.readTimeMinutes} min read` : '5 min read'

    let formattedDate = 'Recent'
    if (blog.publishedAt) {
        try {
            formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch (e) { }
    } else if (blog.createdAt?.toDate) {
        formattedDate = blog.createdAt.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <article className="min-h-screen bg-[#FAF9F5] pb-24 selection:bg-[var(--gold-500)] selection:text-white">
            {/* Header Section */}
            <div className="bg-[#FAF9F5] border-b border-[#E9E4DC] pt-12 pb-14">
                <div className="container max-w-[860px] px-4 md:px-6">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#8C7A58] hover:text-[#A67828] mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} /> All Articles
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {blog.category && (
                            <span className="bg-[#382E25] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                {blog.category}
                            </span>
                        )}
                        {blog.status === 'draft' && (
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                Draft Preview
                            </span>
                        )}
                    </div>

                    <h1 className="font-serif text-3xl md:text-5xl text-[#231F1C] leading-tight md:leading-[1.15] mb-6 font-normal">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="text-lg md:text-xl text-[#6B6B6B] leading-relaxed font-light mb-8">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E9E4DC] text-sm text-[#736B5E]">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 font-medium">
                                <User size={16} className="text-[#A67828]" />
                                {authorName}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#A67828]" />
                                {formattedDate}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={16} className="text-[#A67828]" />
                                {readTime}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {imageSrc && (
                <div className="container max-w-[960px] px-4 md:px-6 -mt-4 mb-12">
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-[#E9E4DC] bg-stone-100">
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="container max-w-[800px] px-4 md:px-6">
                <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_4px_24px_rgba(35,31,28,0.03)] border border-[#E9E4DC]">
                    {renderBlogContent(blog.content)}
                </div>

                {/* Author Card & Footer */}
                <div className="mt-12 p-8 bg-[#FAF6EE] rounded-2xl border border-[#E7DDCE] flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#A67828] text-white flex items-center justify-center text-2xl font-serif font-bold shrink-0">
                        AD
                    </div>
                    <div>
                        <h4 className="font-serif text-lg font-bold text-[#231F1C] mb-1">About Anita Doval</h4>
                        <p className="text-sm text-[#6E665D] leading-relaxed">
                            With over 15 years of dedicated practice in Vedic astrology, Vastu Shastra, and spiritual counseling, Anita Doval guides individuals and businesses towards clarity, balance, and purposeful living.
                        </p>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link
                        to="/blog"
                        className="btn btn-outline inline-flex items-center gap-2 px-8 py-3"
                    >
                        <ArrowLeft size={16} /> View All Articles
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default BlogDetailPage
