import React from 'react'
import { Link } from 'react-router-dom'
import { useFirestore } from '../../hooks/useFirestore'
import { useTheme } from '../../hooks/useTheme'
import Loading from '../UI/Loading'
import AstroBackground from '../UI/AstroBackground'
import SectionMotionOverlay from '../UI/SectionMotionOverlay'

const BlogPreview = () => {
    const { sectionStyle, textClass, overlayElement } = useTheme('articles')
    const { documents: blogs, loading } = useFirestore('blogs')

    const publishedBlogs = blogs.filter(b => b.enabled !== false && b.status === 'published')

    if (!loading && publishedBlogs.length === 0) {
        return null
    }

    return (
        <section className={`section-pad relative bg-[#FAF9F5]`} style={sectionStyle}>
            {overlayElement && overlayElement}

            {/* Astrology Decorations */}
            <SectionMotionOverlay type="blog" intensity={0.15} />

            <div className={`container max-w-[1240px] relative z-10 block`}>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <p className={`uppercase font-semibold tracking-[0.2em] text-[14px] mb-3 ${textClass.includes('white') ? 'text-[#e0e0e0]' : 'text-[#8C7A58]'}`}>
                            INSIGHTS • ARTICLES • GUIDANCE
                        </p>
                        <h2 className={`font-serif text-[28px] md:text-[34px] leading-tight mb-2 ${textClass.includes('white') ? 'text-white' : 'text-[#231F1C]'}`}>
                            Explore • Learn • Understand
                        </h2>
                        <p className={`text-[15px] font-light ${textClass.includes('white') ? 'text-[#d6d6d6]' : 'text-[#6b6b6b]'}`}>
                            Articles and insights on astrology, Vastu, spirituality and related topics.
                        </p>
                    </div>
                    <Link to="/blog" className="hidden md:inline-flex items-center justify-center h-[42px] px-6 border border-[#E9E4DC] rounded-md text-[14px] font-medium text-[#231F1C] hover:border-[#8C7A58] hover:text-[#8C7A58] transition-colors shrink-0 bg-white shadow-sm">
                        View All Articles &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20"><Loading type="spinner" /></div>
                ) : publishedBlogs.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No articles available yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-4">
                        {publishedBlogs.slice(0, 3).map((post) => {
                            let dateStr = 'Recent'
                            if (post.publishedAt) {
                                try {
                                    dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                } catch (e) { }
                            } else if (post.createdAt?.toDate) {
                                dateStr = post.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            }

                            const readTime = post.readTimeMinutes ? `${post.readTimeMinutes} MIN READ` : '5 MIN READ'
                            const imageSrc = post.featuredImage?.url || post.imageUrl
                            const imageAlt = post.featuredImage?.alt || post.title
                            const authorName = post.author || 'Anita Doval'

                            return (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.slug || post.id}`}
                                    className="group flex flex-col w-full bg-white rounded-xl shadow-[0_2px_15px_rgba(35,31,28,0.03)] border border-[#E9E4DC] overflow-hidden hover:shadow-[0_10px_30px_rgba(35,31,28,0.08)] transition-all duration-500"
                                >
                                    <div className="relative w-full aspect-[4/3] bg-[#f4f4f4] overflow-hidden">
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-[#382E25] text-white text-[14px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                                                {post.category || 'ARTICLE'}
                                            </span>
                                        </div>
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={imageAlt}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#f0ebd8]"></div>
                                        )}
                                    </div>
                                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-[#999] text-[14px] font-medium tracking-wide uppercase mb-4">
                                            <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {dateStr}</span>
                                            <span className="w-1 h-1 rounded-full bg-[#E9E4DC]"></span>
                                            <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {readTime}</span>
                                        </div>
                                        <h3 className="font-serif text-[20px] md:text-[22px] leading-snug text-[#231F1C] mb-4 group-hover:text-[#8C7A58] transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-[14px] text-[#6b6b6b] leading-relaxed mb-6 font-light line-clamp-3 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-5 border-t border-[#f0f0f0]">
                                            <span className="text-[14px] font-semibold text-[#231F1C]">{authorName}</span>
                                            <span className="text-[14px] font-bold tracking-widest uppercase text-[#8C7A58] flex items-center gap-2 group-hover:gap-3 transition-all">Read Story &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Link to="/blog" className="inline-block w-full border border-[#E9E4DC] py-3 rounded-md text-[14px] font-medium text-[#231F1C] hover:bg-[#FAF9F5]">
                        View All Articles &rarr;
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BlogPreview
