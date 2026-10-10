import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'

const Blog = () => {
  const { isHindi } = useLanguage()
  const { documents: blogs, loading } = useFirestore('blogs')

  // Show only latest 3 blogs on home page
  const latestBlogs = blogs.slice(0, 3)

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content?.split(/\s+/).length || 0
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">Loading blogs...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {isHindi ? 'ज्ञान का भंडार' : 'Knowledge Hub'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {isHindi
              ? 'ज्योतिष, वास्तु और आध्यात्मिकता पर नवीनतम लेख और ब्लॉग'
              : 'Latest articles and blogs on astrology, vastu and spirituality'
            }
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <span>{isHindi ? 'सभी ब्लॉग देखें' : 'View All Blogs'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {/* Blog Image */}
              <div className="aspect-video bg-gray-200 dark:bg-gray-600 overflow-hidden">
                {blog.imageUrl ? (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AD</span>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getReadingTime(blog.content)}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {blog.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {blog.excerpt || blog.content?.substring(0, 150)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Anita Doval
                    </span>
                  </div>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                  >
                    <span>{isHindi ? 'पढ़ें' : 'Read More'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {latestBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {isHindi ? 'अभी तक कोई ब्लॉग नहीं' : 'No blogs yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isHindi 
                ? 'जल्द ही रोचक ब्लॉग पोस्ट आएंगे'
                : 'Interesting blog posts coming soon'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Blog