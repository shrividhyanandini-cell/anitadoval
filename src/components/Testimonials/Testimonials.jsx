import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { Play, Pause, Volume2, Star } from 'lucide-react'

const Testimonials = () => {
  const { isHindi } = useLanguage()
  const { documents: testimonials, loading } = useFirestore('testimonials')
  const [playingVideo, setPlayingVideo] = useState(null)

  const handleVideoPlay = (id) => {
    setPlayingVideo(playingVideo === id ? null : id)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-r from-primary-50 to-gold-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading testimonials...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-r from-primary-50 to-gold-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">
            {isHindi ? 'ग्राहकों की प्रतिक्रिया' : 'Client Testimonials'}
          </h2>
          <p className="text-lg text-white dark:text-gray-300 max-w-2xl mx-auto">
            {isHindi
              ? 'हमारे ग्राहकों की सफलता की कहानियाँ और अनुभव'
              : 'Success stories and experiences from our valued clients'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-200 dark:bg-gray-600">
                {testimonial.videoUrl ? (
                  <>
                    <video
                      className="w-full h-full object-cover"
                      poster={testimonial.thumbnail}
                      controls={playingVideo === testimonial.id}
                    >
                      <source src={testimonial.videoUrl} type="video/mp4" />
                    </video>
                    {!playingVideo && (
                      <button
                        onClick={() => handleVideoPlay(testimonial.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      >
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-primary-600 ml-1" />
                        </div>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-gold-500">
                    <Volume2 className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              {/* Testimonial Content */}
              <div className="p-6">
                <div className="flex items-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= testimonial.rating
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {testimonial.message}
                </p>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.clientName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {testimonial.clientName || 'Anonymous'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.service || 'Astrology Consultation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {isHindi ? 'अभी तक कोई प्रतिक्रिया नहीं' : 'No testimonials yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isHindi 
                ? 'पहली प्रतिक्रिया जोड़ने के लिए व्यवस्थापक से संपर्क करें'
                : 'Contact admin to add the first testimonial'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials