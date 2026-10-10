import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { usePopup } from '../../context/PopupContext'

const SpiritualJourney = () => {
  const { isHindi } = useLanguage()
  const { openPopup } = usePopup()

  const practices = [
    {
      icon: "",
      title: isHindi ? 'ध्यान और मंत्र' : 'Meditation & Mantras',
      description: isHindi
        ? 'मंत्र उपासना और ध्यान के माध्यम से मानसिक शांति और आंतरिक शक्ति'
        : 'Mental peace and inner strength through mantra recitation and meditation'
    },
    {
      icon: "",
      title: isHindi ? 'योग साधना' : 'Yoga Practices',
      description: isHindi
        ? 'शारीरिक, मानसिक और आध्यात्मिक स्वास्थ्य के लिए योग की सही विधियाँ'
        : 'Correct yoga methods for physical, mental and spiritual well-being'
    },
    {
      icon: "",
      title: isHindi ? 'आध्यात्मिक ज्ञान' : 'Spiritual Knowledge',
      description: isHindi
        ? 'प्राचीन ग्रंथों और आधुनिक विज्ञान का समन्वय'
        : 'Integration of ancient scriptures and modern science'
    },
    {
      icon: "",
      title: isHindi ? 'आत्म-साक्षात्कार' : 'Self-Realization',
      description: isHindi
        ? 'अपने वास्तविक स्वरूप को जानने की यात्रा में मार्गदर्शन'
        : 'Guidance in the journey of knowing your true self'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-6">
              {isHindi ? 'आध्यात्मिक यात्रा' : 'Spiritual Journey'}
            </h2>
            <p className="text-lg text-white dark:text-gray-300 mb-8 leading-relaxed">
              {isHindi
                ? 'मंत्र जाप, हवन अनुष्ठान, ध्यान प्रथाओं और विभिन्न विज्ञानों के अध्ययन को आपके दैनिक जीवन में सकारात्मक रूप से एकीकृत करने के लिए मार्गदर्शन, आध्यात्मिक विकास और आत्म-साक्षात्कार के पथ को प्रकाशित करना।'
                : 'Guiding you on the positive integration of mantra recitation, havan rituals, meditation practices, and the study of various sciences into your daily life, illuminating the path to spiritual growth and self-realization.'
              }
            </p>

            <div className="space-y-4">
              {practices.map((practice, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="text-gold-600">
                      {practice.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white dark:text-white mb-2">
                      {practice.title}
                    </h3>
                    <p className="text-white dark:text-gray-300">
                      {practice.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl p-8 text-white text-center">
              <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {isHindi ? 'आध्यात्मिक परिवर्तन' : 'Spiritual Transformation'}
                </h3>
                <p className="mb-6 opacity-90 text-white">
                  {isHindi
                    ? 'योग और ध्यान के माध्यम से अपने जीवन को रूपांतरित करें। सकारात्मक परिवर्तन लाने और अपने भाग्य को बदलने के लिए इन आध्यात्मिक अनुशासनों का सही अभ्यास करने का मार्गदर्शन प्राप्त करें।'
                    : 'Transform your life through yoga and meditation. Receive guidance on how to correctly practice these spiritual disciplines to bring about positive change and alter your destiny.'
                  }
                </p>
                <button className="btn btn-primary bg-white text-[var(--gold-500)] hover:bg-[var(--cream-50)]" onClick={openPopup}>
                  {isHindi ? 'अभी शुरू करें' : 'Start Your Journey'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpiritualJourney