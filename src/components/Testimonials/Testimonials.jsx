import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useFirestore } from '../../hooks/useFirestore'
import { Play, Star, MapPin, Calendar, Sparkles } from 'lucide-react'

const Testimonials = () => {
  const { isHindi } = useLanguage()
  const { documents: testimonials, loading } = useFirestore('testimonials')
  const [playingVideo, setPlayingVideo] = useState(null)

  // Filter strictly published and enabled testimonials
  const publishedTestimonials = testimonials
    .filter(t => t.enabled !== false && t.status === 'published')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  const handleVideoPlay = (id) => {
    setPlayingVideo(playingVideo === id ? null : id)
  }

  if (loading) {
    return (
      <section className="py-20 bg-[#FAF9F5]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-[#8C7A58]">Loading testimonials...</div>
          </div>
        </div>
      </section>
    )
  }

  // If no published testimonials exist, do not render an empty section
  if (publishedTestimonials.length === 0) {
    return null
  }

  return (
    <section id="testimonials" className="py-24 bg-[#FAF9F5] border-y border-[#E9E4DC]">
      <div className="container max-w-[1240px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="eyebrow uppercase font-semibold text-[13px] tracking-widest text-[#A67828] mb-3">
            {isHindi ? 'विश्वास और अनुभव' : 'CLIENT EXPERIENCES & BLESSINGS'}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#231F1C] mb-4">
            {isHindi ? 'ग्राहकों की प्रतिक्रिया' : 'Words of Trust & Clarity'}
          </h2>
          <p className="text-[#6B6B6B] text-base leading-relaxed">
            {isHindi
              ? 'हमारे ग्राहकों की सफलता की कहानियाँ और व्यक्तिगत अनुभव'
              : 'Authentic reflections from seekers who found direction and peace through our consultations.'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedTestimonials.map((testimonial) => {
            const quote = testimonial.quote || testimonial.message || ''
            const service = testimonial.serviceTaken || testimonial.service || 'Astrology Consultation'
            const rating = Number(testimonial.rating) || 5
            const location = testimonial.location || ''
            const date = testimonial.date || ''

            return (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(35,31,28,0.04)] border border-[#E9E4DC] p-8 flex flex-col justify-between hover:shadow-[0_12px_32px_rgba(35,31,28,0.08)] transition-all duration-300"
              >
                <div>
                  {/* Video if present */}
                  {testimonial.videoUrl && (
                    <div className="relative aspect-video bg-stone-100 rounded-xl overflow-hidden mb-6 border border-[#E9E4DC]">
                      <video
                        className="w-full h-full object-cover"
                        poster={testimonial.thumbnail}
                        controls={playingVideo === testimonial.id}
                      >
                        <source src={testimonial.videoUrl} type="video/mp4" />
                      </video>
                      {playingVideo !== testimonial.id && (
                        <button
                          onClick={() => handleVideoPlay(testimonial.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-[#A67828] ml-0.5" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mb-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-gray-200'
                          }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[#3A352F] text-[15px] leading-relaxed mb-6 font-light italic">
                    "{quote}"
                  </p>
                </div>

                {/* Client Info Footer */}
                <div className="pt-6 border-t border-[#F2EDE4] flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 bg-[#FAF4E8] border border-[#E7DDCE] text-[#A67828] rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0">
                      {testimonial.clientName?.charAt(0) || 'C'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-semibold text-[#231F1C] text-sm truncate">
                        {testimonial.clientName || 'Valued Client'}
                      </h4>
                      <p className="text-xs text-[#8C7A58] truncate">
                        {service}
                      </p>
                    </div>
                  </div>

                  {(location || date) && (
                    <div className="text-right text-[11px] text-stone-600 shrink-0">
                      {location && <p className="flex items-center justify-end gap-1"><MapPin size={10} /> {location}</p>}
                      {date && <p className="mt-0.5">{date}</p>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Testimonials