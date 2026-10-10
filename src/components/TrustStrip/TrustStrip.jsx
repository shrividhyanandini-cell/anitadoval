import React from 'react'
import { Link } from 'react-router-dom'
import { Award, Compass, Heart, Users } from 'lucide-react'

const TrustStrip = () => {
    return (
        <section className="border-y border-[var(--border-warm)] bg-white">
            <div className="container overflow-hidden">
                <div className="flex flex-wrap lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-warm)] text-center">

                    <div className="w-full sm:w-1/2 lg:w-1/4 py-6 px-4 hover:bg-[var(--cream-50)] transition-colors">
                        <h3 className="font-serif font-medium text-[var(--charcoal-800)] text-lg mb-1">Astrology</h3>
                        <p className="text-[var(--charcoal-500)] text-sm">Deep Birth Chart Analysis</p>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-1/4 py-6 px-4 hover:bg-[var(--cream-50)] transition-colors">
                        <h3 className="font-serif font-medium text-[var(--charcoal-800)] text-lg mb-1">Vastu</h3>
                        <p className="text-[var(--charcoal-500)] text-sm">Scientific Space Harmonisation</p>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-1/4 py-6 px-4 hover:bg-[var(--cream-50)] transition-colors">
                        <h3 className="font-serif font-medium text-[var(--charcoal-800)] text-lg mb-1">Expertise</h3>
                        <p className="text-[var(--charcoal-500)] text-sm">Decades of Genuine Experience</p>
                    </div>

                    <div className="w-full sm:w-1/2 lg:w-1/4 py-6 px-4 hover:bg-[var(--cream-50)] transition-colors">
                        <h3 className="font-serif font-medium text-[var(--charcoal-800)] text-lg mb-1">Approach</h3>
                        <p className="text-[var(--charcoal-500)] text-sm">Thoughtful Personal Guidance</p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default TrustStrip
