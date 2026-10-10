import React from 'react';

const AstroBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Stars background moving slowly */}
            <div className="absolute inset-0 w-[120%] h-[120%] -top-[10%] -left-[10%] animate-spin-slow-reverse origin-center">
                <img
                    src="/images/astro/starts.webp"
                    alt="Stars"
                    className="w-full h-full object-cover opacity-[0.25] mix-blend-color-burn"
                    style={{ filter: 'invert(1) grayscale(1) opacity(0.5)' }}
                    loading="lazy"
                />
            </div>

            {/* Chakra/Mandala rotating on the right */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] opacity-[0.35] transform translate-x-1/4">
                <img
                    src="/images/astro/chakra.webp"
                    alt="Astrology Chart"
                    className="w-full h-full object-contain animate-spin-slow"
                    style={{ filter: 'invert(1) brightness(0.6) sepia(1) hue-rotate(10deg) saturate(3)' }}
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default AstroBackground;
