import React, { useEffect, useState } from 'react';

const SectionMotionOverlay = ({ type = 'stars', intensity = 0.4 }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (type !== 'hero-cosmic') return;

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [type]);

    const isHero = type === 'hero-cosmic';
    const isAstrology = type === 'astrology-wheel';
    const isVastu = type === 'vastu-compass';
    const isSpiritual = type === 'spiritual-glow';

    // Use a very strong gold explicitly to avoid CSS variable resolution issues on different themes
    const strokeColor = "#A67828";

    // Note: Removed useReducedMotion so you can definitely see the animation 
    // even if your OS settings disable animations.

    return (
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true" style={{ opacity: intensity }}>

            {/* HERO COSMIC */}
            {isHero && (
                <div
                    className="absolute top-1/2 left-1/2 md:left-2/3 md:-translate-y-1/2"
                    style={{ transform: `translate3d(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px), 0)` }}
                >
                    <div className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] relative">
                        {/* Outer rotating wheel */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '60s', color: strokeColor }}>
                            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 3" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.1" />
                            <circle cx="50" cy="2" r="1.5" fill="currentColor" />
                            <circle cx="85" cy="85" r="0.8" fill="currentColor" />
                            <circle cx="15" cy="85" r="1" fill="currentColor" />
                        </svg>

                        {/* Inner reverse rotating wheel */}
                        <svg viewBox="0 0 100 100" className="absolute top-[10%] left-[10%] w-[80%] h-[80%] animate-spin-slow-reverse" style={{ animationDuration: '80s', color: strokeColor }}>
                            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="4 4" />
                            <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke="currentColor" strokeWidth="0.1" opacity="0.3" />
                            <circle cx="85" cy="50" r="2.5" fill="currentColor" className="opacity-80" />
                            <circle cx="15" cy="50" r="1.5" fill="currentColor" className="opacity-60" />
                        </svg>
                    </div>
                </div>
            )}

            {/* ASTROLOGY SVG WHEEL */}
            {isAstrology && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" style={{ animationDuration: '90s', color: strokeColor }}>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
                        <path d="M 50 5 L 60 20 L 75 15 L 85 30 L 70 45 L 80 60 L 65 75 L 50 90 L 35 75 L 20 60 L 30 45 L 15 30 L 25 15 L 40 20 Z" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.6" />
                        <circle cx="50" cy="5" r="1.5" fill="currentColor" />
                        <circle cx="85" cy="30" r="1" fill="currentColor" />
                    </svg>
                </div>
            )}

            {/* VASTU COMPASS */}
            {isVastu && (
                <div className="absolute top-[20%] right-[-10%] md:right-[10%] w-[500px] h-[500px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" style={{ animationDuration: '120s', color: strokeColor }}>
                        <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.3" />
                        <rect x="33.3" y="25" width="0.1" height="50" stroke="currentColor" strokeWidth="0.3" />
                        <rect x="66.6" y="25" width="0.1" height="50" stroke="currentColor" strokeWidth="0.3" />
                        <rect x="25" y="33.3" width="50" height="0.1" stroke="currentColor" strokeWidth="0.3" />
                        <rect x="25" y="66.6" width="50" height="0.1" stroke="currentColor" strokeWidth="0.3" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 4" />
                        <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="currentColor" strokeWidth="0.2" opacity="0.8" />
                        <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.8" />
                    </svg>
                </div>
            )}

            {/* SPIRITUAL GLOW */}
            {isSpiritual && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                    <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border opacity-60 animate-pulse-soft" style={{ animationDuration: '4s', borderColor: strokeColor }}></div>
                    <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border opacity-40 animate-pulse-soft" style={{ animationDuration: '3s', animationDelay: '1s', borderColor: strokeColor }}></div>
                    <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full opacity-20 blur-3xl animate-pulse-soft" style={{ animationDuration: '6s', backgroundColor: strokeColor }}></div>
                </div>
            )}

            {/* DEFAULT CONTINUOUS STARS */}
            {(type === 'stars' || type === 'blog') && (
                <div className="absolute inset-0 w-full h-full">
                    <svg className="w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="starPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <circle cx="10" cy="10" r="1.5" fill={strokeColor} className="animate-pulse-soft" style={{ animationDuration: '2s' }} />
                                <circle cx="45" cy="45" r="1" fill={strokeColor} opacity="0.8" />
                                <circle cx="80" cy="20" r="2" fill={strokeColor} className="animate-pulse-soft" style={{ animationDuration: '3s' }} />
                                <circle cx="30" cy="80" r="1" fill={strokeColor} opacity="0.6" />
                            </pattern>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#starPattern)" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default SectionMotionOverlay;
