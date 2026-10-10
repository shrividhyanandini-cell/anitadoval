import React, { useEffect } from 'react'

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white min-h-screen pt-[100px] md:pt-[140px] pb-24 selection:bg-[var(--gold-500)] selection:text-white">
      <div className="container max-w-[1100px] mx-auto px-4">

        {/* Massive Header Reference Style */}
        <h1 className="font-serif text-[2.8rem] md:text-[4.5rem] leading-[1.05] text-[#1a1a1a] mb-16 md:mb-24">
          A Journey of Knowledge <br className="hidden md:block" />
          <span className="italic font-medium text-[var(--charcoal-800)]">into Spiritual Guidance.</span>
        </h1>

        {/* 2 Column Content Layout */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">

          {/* Left: Image */}
          <div className="relative w-full rounded-[14px] overflow-hidden shadow-sm">
            <img
              src="/images/post1.jpg" // Using existing image
              alt="Anita Doval"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right: Typography */}
          <div className="space-y-6 text-[#4a4a4a] text-[15px] md:text-[16px] leading-[1.8] font-sans font-light">
            <p>
              Anita Doval is a distinguished astrologer and Vastu Shastra expert who found her profound connection to the stars and spatial energies through a lifetime of passionate study. Her journey began not merely as an academic pursuit, but as a deep-seated desire to understand the energetic patterns that shape human circumstances.
            </p>
            <p>
              From the intricate nuances of Vedic astrology, which map the potentials of the soul, to the structural harmony defined by ancient Vastu Shastra; from predicting life transitions to empowering clients across the globe, every consultation she provides carries a story of its own.
            </p>
            <p>
              What began as a personal fascination evolved into something more meaningful: a desire to bring the world's most captivating spiritual traditions together to help individuals navigate their careers, relationships, and well-being.
            </p>
            <p>
              We call it <span className="font-medium text-[#1a1a1a]">thoughtfully guided consultation</span>—insights that blend ancient heritage with contemporary understanding, designed to feel empowering, clear, and immensely practical.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default About