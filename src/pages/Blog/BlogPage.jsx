import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BLOG_CATEGORIES } from '../../data/blogs'
import { useFirestore } from '../../hooks/useFirestore'
import Loading from '../../components/UI/Loading'
import PageHeader from '../../components/UI/PageHeader'

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const { documents: blogs, loading } = useFirestore('blogs')

  // For search query parsing
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)

    // Handle search query string on load
    const params = new URLSearchParams(window.location.search)
    if (params.has('search')) {
      setSearchQuery(params.get('search').toLowerCase())
    }
  }, [])

  const filteredPosts = blogs.filter(post => {
    // Only published and enabled posts on public storefront
    if (post.enabled === false || post.status !== 'published') return false

    const matchesCategory = activeCategory === 'all' ||
      (post.category && post.category.toLowerCase() === activeCategory.toLowerCase())
    const matchesSearch = !searchQuery ||
      post.title?.toLowerCase().includes(searchQuery) ||
      post.excerpt?.toLowerCase().includes(searchQuery) ||
      (typeof post.content === 'string' && post.content.toLowerCase().includes(searchQuery))
    return matchesCategory && matchesSearch
  })

  const categories = Object.values(BLOG_CATEGORIES || {})

  // Fallback if BLOG_CATEGORIES is empty
  const availableCategories = categories.length > 0 ? categories : [
    { id: 'astrology', label: 'Astrology' },
    { id: 'vastu', label: 'Vastu' }
  ]

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-24 selection:bg-[var(--gold-500)] selection:text-white">

      <PageHeader
        pageId="blog"
        eyebrow="Insights • Articles • Guidance"
        title="Explore • Learn • Understand"
        description="Articles and insights on astrology, Vastu, spirituality and related topics. Discover our comprehensive editorial collection below."
      />

      {/* Smart Navbar / Category Filtering */}
      <div className="sticky top-[64px] lg:top-[76px] z-30 bg-[#FAF9F5]/90 backdrop-blur-xl border-y border-[#E9E4DC] py-4 mb-16">
        <div className="container max-w-[1240px] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x min-w-max pb-2 md:pb-0">
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); window.history.replaceState({}, '', '/blog') }}
              className={`px-5 py-2.5 rounded-full text-[14px] font-semibold tracking-wide uppercase transition-all snap-start ${activeCategory === 'all' && !searchQuery
                ? 'bg-[var(--charcoal-900)] text-white shadow-md'
                : 'bg-white border border-[#E9E4DC] text-[var(--charcoal-700)] hover:border-[var(--charcoal-400)]'
                }`}
            >
              All Stories
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery('') }}
                className={`px-5 py-2.5 rounded-full text-[14px] font-semibold tracking-wide uppercase transition-all snap-start ${activeCategory.toLowerCase() === cat.id.toLowerCase() && !searchQuery
                  ? 'bg-[var(--charcoal-900)] text-white shadow-md'
                  : 'bg-white border border-[#E9E4DC] text-[var(--charcoal-700)] hover:border-[var(--charcoal-400)]'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {searchQuery && (
            <div className="text-[14px] font-medium text-[var(--gold-600)] bg-[var(--gold-50)] px-4 py-2 rounded-full inline-flex md:mr-8 border border-[var(--gold-200)]">
              Results for: "{searchQuery}"
              <button onClick={() => { setSearchQuery(''); window.history.replaceState({}, '', '/blog') }} className="ml-3 text-[var(--charcoal-500)] hover:text-red-500">✕</button>
            </div>
          )}
        </div>
      </div>

      <section className="container max-w-[1240px]">
        {loading ? (
          <div className="flex justify-center p-20"><Loading type="spinner" /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#E9E4DC]">
            <p className="text-[var(--charcoal-500)]">No articles found for the selected category or search.</p>
            <button onClick={() => { setActiveCategory('all'); setSearchQuery('') }} className="mt-4 text-[var(--gold-600)] font-medium hover:underline">
              View All Articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map(post => {
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
                  <div className="relative w-full aspect-[16/10] bg-[#f4f4f4] overflow-hidden">
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
                    <h3 className="font-serif text-[20px] md:text-[22px] leading-snug text-[#231F1C] mb-4 group-hover:text-[var(--gold-600)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[14px] text-[#6b6b6b] leading-relaxed mb-6 font-light line-clamp-3 flex-1 text-ellipsis overflow-hidden">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-5 border-t border-[#f0f0f0]">
                      <span className="text-[14px] font-semibold text-[#231F1C]">{authorName}</span>
                      <span className="text-[14px] font-bold tracking-widest uppercase text-[var(--gold-600)] flex items-center gap-2 group-hover:gap-3 transition-all">Read Story &rarr;</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default BlogPage