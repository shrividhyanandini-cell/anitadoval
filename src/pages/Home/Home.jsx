import React from 'react'

import Hero from '../../components/Hero/Hero'
import TrustStrip from '../../components/TrustStrip/TrustStrip'
import AboutPreview from '../../components/AboutPreview/AboutPreview'
import Philosophy from '../../components/Philosophy/Philosophy'
import ServicesCarousel from '../../components/ServicesCarousel/ServicesCarousel'
import ConsultationProcess from '../../components/ConsultationProcess/ConsultationProcess'
import DigitalBrochures from '../../components/DigitalBrochures/DigitalBrochures'
import VideoLibrarySection from '../../components/VideoLibrary/VideoLibrarySection'
import BlogPreview from '../../components/BlogPreview/BlogPreview'
import FAQSection from '../../components/FAQ/FAQSection'
import CTASection from '../../components/CTASection/CTASection'

const Home = () => {
  return (
    <>
      <Hero />
      <AboutPreview />
      <Philosophy />
      <ServicesCarousel />
      <ConsultationProcess />
      <DigitalBrochures />
      <VideoLibrarySection />
      <BlogPreview />
      <FAQSection />
      <CTASection />
    </>
  )
}

export default Home