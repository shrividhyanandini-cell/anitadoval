import { useState, useEffect } from 'react';

/**
 * A hook that takes a local background config object (with url, mobileUrl, tabletUrl, size, position, repeat, attachment)
 * and returns the correct inline CSS style object based on current window width.
 */
export const useResponsiveBackground = (bgConfig) => {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!bgConfig || (!bgConfig.url && !bgConfig.mobileUrl && !bgConfig.tabletUrl)) {
        return {};
    }

    let activeUrl = bgConfig.url;
    let activeSize = bgConfig.size || bgConfig.bgSize || 'cover';
    let activePosition = bgConfig.position || bgConfig.bgPosition || 'center';
    let activeRepeat = bgConfig.repeat || bgConfig.bgRepeat || 'no-repeat';
    let activeAttachment = bgConfig.attachment || bgConfig.bgAttachment || 'scroll';

    if (windowWidth <= 768 && bgConfig.mobileUrl) {
        activeUrl = bgConfig.mobileUrl;
        activeSize = bgConfig.mobileSize || bgConfig.mobileBgSize || 'cover';
        activePosition = bgConfig.mobilePosition || bgConfig.mobileBgPosition || 'center';
        activeRepeat = bgConfig.mobileRepeat || bgConfig.mobileBgRepeat || 'no-repeat';
        activeAttachment = bgConfig.mobileAttachment || bgConfig.mobileBgAttachment || activeAttachment;
    } else if (windowWidth <= 1024 && bgConfig.tabletUrl) {
        activeUrl = bgConfig.tabletUrl;
        activeSize = bgConfig.tabletSize || bgConfig.tabletBgSize || 'cover';
        activePosition = bgConfig.tabletPosition || bgConfig.tabletBgPosition || 'center';
        activeRepeat = bgConfig.tabletRepeat || bgConfig.tabletBgRepeat || 'no-repeat';
        activeAttachment = bgConfig.tabletAttachment || bgConfig.tabletBgAttachment || activeAttachment;
    }

    if (!activeUrl) return {};

    return {
        backgroundImage: `url(${activeUrl})`,
        backgroundSize: activeSize,
        backgroundPosition: activePosition,
        backgroundRepeat: activeRepeat,
        backgroundAttachment: activeAttachment
    };
};
