import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Award, Compass, BookOpen, Star, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react'
import { usePopup } from '../../context/PopupContext'
import { useFirestore } from '../../hooks/useFirestore'

const About = () => {
  const { openPopup } = usePopup()
  const { documents: blogs } = useFirestore('blogs')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const publishedBlogs = blogs
    .filter(b => b.enabled !== false && b.status !== 'archived')
    .slice(0, 3)

  const expertiseList = [
    {
      title: 'Vedic Kundli & Dasha Analysis',
      desc: 'In-depth birth chart interpretations synthesizing planetary strengths, Bhavas, and Nakshatra influences to illuminate life patterns and timings.',
      icon: Star
    },
    {
      title: 'Scientific Vastu Shastra',
      desc: 'Spatial and architectural energy assessment harmonizing the five cosmic elements (Panchamahabhutas) for homes, offices, and commercial spaces.',
      icon: Compass
    },
    {
      title: 'Sacred Mantra Upasana',
      desc: 'Guidance in traditional sound vibrations, Beej mantras, and japa discipline to balance challenging planetary alignments.',
      icon: Sparkles
    },
    {
      title: 'Numerology & Auspicious Timing',
      desc: 'Evaluating life path vibrations, name spelling alignment, and selecting auspicious Muhurtas for milestones and ventures.',
      icon: BookOpen
    },
    {
      title: 'Prashna Kundli (Horary)',
      desc: 'Astrological guidance for immediate, specific questions based on the celestial sky at the moment of the inquiry.',
      icon: ShieldCheck
    },
    {
      title: 'Mindfulness & Yogic Meditation',
      desc: 'Grounding techniques, breath regulation (Pranayama), and contemplative meditation routines tailored to individual temperament.',
      icon: Heart
    }
  ]

  const milestones = [
    {
      year: '20+ Years',
      title: 'Dedicated Practice & Study',
      description: 'Decades spent studying classical Vedic texts (Brihat Parashara, Jaimini, Varahamihira) alongside practical consulting.'
    },
    {
      year: '15,000+',
      title: 'Personal Consultations',
      description: 'Guidance provided to individuals, families, entrepreneurs, and students across India and over 12 countries globally.'
    },
    {
      year: '100+',
      title: 'Vastu Harmonizations',
      description: 'Successful non-demolition Vastu remedies implemented for residences, retail spaces, and corporate environments.'
    },
    {
      year: '100%',
      title: 'Strict Client Confidentiality',
      description: 'A sacrosanct commitment to private, dignified, and empathetic consultations without fear-mongering or fatalism.'
    }
  ]

  return (
    <div className="bg-[#FAF9F5] min-h-screen pt-[90px] md:pt-[130px] pb-24 selection:bg-[var(--gold-500)] selection:text-white">
      <div className="container max-w-[1200px] mx-auto px-4 md:px-8">

        {/* 1. Header & Introduction */}
        <div className="max-w-[800px] mb-12 md:mb-16">
          <p className="font-sans font-semibold text-[13px] md:text-[14px] uppercase tracking-[0.2em] text-[var(--gold-600)] mb-3">
            ABOUT ANITA DOVAL
          </p>
          <h1 className="font-serif text-[36px] sm:text-[46px] md:text-[56px] leading-[1.08] text-[var(--charcoal-900)] mb-5">
            A Journey of Knowledge, <br className="hidden sm:block" />
            <span className="italic font-medium text-[var(--gold-600)]">Heritage & Spiritual Guidance.</span>
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] leading-relaxed text-[var(--charcoal-600)] font-normal">
            Anita Doval's life work bridges ancient astrological heritage, spatial energy science, and compassionate human guidance. Her approach moves beyond prediction, offering practical clarity for life's meaningful crossroads.
          </p>
        </div>

        {/* 2. Biography & Images Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20 md:mb-28">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(45,35,20,0.12)] border border-[#E7DCCB]">
              <img
                src="/images/post1.jpg"
                alt="Anita Doval — Astrologer and Vastuvid"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-sm">
                <p className="font-serif font-bold text-lg text-[var(--charcoal-900)]">Anita Doval</p>
                <p className="font-sans text-xs uppercase tracking-wider text-[var(--gold-600)] font-semibold">Vedic Astrologer · Vastuvid · Spiritual Guide</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-[var(--charcoal-700)] text-[15px] md:text-[16px] leading-[1.8] font-sans">
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--charcoal-900)] font-semibold leading-tight">
              Understanding the Person Beyond the Chart
            </h2>
            <p>
              Anita Doval found her calling through a lifelong dedication to classical Indian philosophy and the cosmic disciplines of Jyotishya and Vastu Shastra. Rather than viewing astrology as rigid superstition, she approaches it as a sophisticated map of human psychology, karmic tendencies, and natural rhythms.
            </p>
            <p>
              Over two decades of research and practice, Anita Ma'am has worked with thousands of seekers—from corporate professionals seeking career orientation, to families desiring domestic peace, to individuals seeking inner stillness through mantra and meditation.
            </p>
            <p>
              Every consultation is anchored in honesty, clarity, and respect. No fear tactics or fatalistic forecasts; only grounded, empowering perspectives that allow individuals to make informed, spiritually aligned choices.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openPopup()}
                className="btn btn-primary px-7 py-3 text-[14px] shadow-md flex items-center gap-2"
              >
                <span>Request Consultation</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Stats / Years of Experience Strip */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--border-warm)] shadow-sm mb-20 md:mb-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[var(--border-warm)]">
            {milestones.map((item, idx) => (
              <div key={idx} className={`pt-4 md:pt-0 ${idx > 0 ? 'md:px-6' : 'md:pr-6'}`}>
                <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--gold-600)] mb-2">
                  {item.year}
                </p>
                <p className="font-sans font-bold text-[14px] text-[var(--charcoal-900)] mb-1">
                  {item.title}
                </p>
                <p className="font-sans text-[12px] text-[var(--charcoal-500)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Philosophy: The Synthesis of Astrology, Spirituality & Science */}
        <div className="bg-[#FAF7F0] rounded-3xl p-8 md:p-14 border border-[#EBE3D5] mb-20 md:mb-28">
          <div className="max-w-[760px] mx-auto text-center mb-10">
            <span className="inline-block px-3.5 py-1 bg-[var(--gold-100)] text-[var(--gold-700)] text-[12px] font-bold uppercase tracking-widest rounded-full mb-3">
              OUR GUIDING PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--charcoal-900)] font-semibold mb-4 leading-tight">
              Where Astrology, Spirituality & Science Converge
            </h2>
            <p className="font-sans text-[15px] md:text-[16px] text-[var(--charcoal-600)] leading-relaxed">
              We believe ancient spiritual sciences were never separate from natural laws. Just as ocean tides respond to lunar gravitational pull, human electromagnetic fields and consciousness resonate with cosmic rhythms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-[var(--border-warm)] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[var(--gold-50)] text-[var(--gold-600)] flex items-center justify-center mb-4">
                <Star size={20} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[var(--charcoal-900)] mb-2">Astrology as a Map</h3>
              <p className="text-[13.5px] text-[var(--charcoal-600)] leading-relaxed">
                A birth chart is not a prison of fate, but a celestial blueprint indicating your strengths, vulnerabilities, and favorable windows of opportunity.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[var(--border-warm)] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[var(--gold-50)] text-[var(--gold-600)] flex items-center justify-center mb-4">
                <Compass size={20} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[var(--charcoal-900)] mb-2">Vastu as Energy Flow</h3>
              <p className="text-[13.5px] text-[var(--charcoal-600)] leading-relaxed">
                Magnetic orientations, solar trajectories, and natural air currents directly influence stress levels, biological health, and mental productivity.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[var(--border-warm)] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[var(--gold-50)] text-[var(--gold-600)] flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[var(--charcoal-900)] mb-2">Spiritual Self-Mastery</h3>
              <p className="text-[13.5px] text-[var(--charcoal-600)] leading-relaxed">
                True remedies involve conscious action, sound vibration (mantras), emotional purification, and peaceful meditation routines.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Areas of Core Expertise */}
        <div className="mb-20 md:mb-28">
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <p className="font-sans font-semibold text-[13px] uppercase tracking-[0.2em] text-[var(--gold-600)] mb-2">
              AREAS OF SPECIALIZATION
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--charcoal-900)] font-semibold">
              Core Disciplines & Guidance Expertise
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertiseList.map((item, idx) => {
              const IconComp = item.icon
              return (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-[var(--border-warm)] shadow-xs hover:border-[var(--gold-400)] transition-all hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-full bg-[var(--gold-50)] text-[var(--gold-600)] flex items-center justify-center mb-4 border border-[var(--gold-200)]/60">
                    <IconComp size={22} strokeWidth={1.6} />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-[var(--charcoal-900)] mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[13.5px] leading-relaxed text-[var(--charcoal-600)]">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 6. Thought Leadership / Selected Articles */}
        {publishedBlogs.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <p className="font-sans font-semibold text-[13px] uppercase tracking-[0.2em] text-[var(--gold-600)] mb-2">
                  THOUGHT LEADERSHIP
                </p>
                <h2 className="font-serif text-3xl text-[var(--charcoal-900)] font-semibold">
                  Articles & Insights by Anita Ma’am
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-[14px] font-semibold text-[var(--gold-600)] hover:text-[var(--gold-700)] flex items-center gap-1.5"
              >
                <span>View all articles</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {publishedBlogs.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug || post.id}`}
                  className="group bg-white rounded-2xl border border-[var(--border-warm)] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                    <img
                      src={post.featuredImage?.url || post.imageUrl || '/images/post1.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-600)] mb-2">
                      {post.category || 'Astrology'}
                    </span>
                    <h3 className="font-serif font-semibold text-[17px] text-[var(--charcoal-900)] mb-2 group-hover:text-[var(--gold-600)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[13px] text-[var(--charcoal-500)] line-clamp-2 mt-auto">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default About