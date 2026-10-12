import React from 'react';

export const DEFAULT_STYLE_CONFIG = {
    bgType: 'color', // 'color', 'image', 'gradient'
    bgColor: '#ffffff',
    gradientColors: { start: '#FBF8F1', end: '#FFFFFF', direction: '180deg' },
    bgImage: {
        url: '',
        size: 'cover', // cover, contain, auto
        position: 'center',
        repeat: 'no-repeat',
        attachment: 'scroll', // scroll, fixed, local
    },
    overlay: {
        enabled: false,
        color: '#000000',
        opacity: 0.5
    },
    textTheme: 'dark' // 'dark' (black text) or 'light' (white text)
}

/**
 * Converts a styleConfig object from Firebase into a React inline style object
 */
export const getSectionStyle = (styleConfig, windowWidth = 1200) => {
    if (!styleConfig) return {}

    const styles = {}

    const hasImgUrl = Boolean(styleConfig.bgImage?.url || styleConfig.bgImage?.mobileUrl || styleConfig.bgImage?.tabletUrl)
    const isImageMode = styleConfig.bgType === 'image' || hasImgUrl

    if (isImageMode && hasImgUrl) {
        let activeUrl = styleConfig.bgImage.url || '';
        let activeSize = styleConfig.bgImage.size || styleConfig.bgImage.bgSize || 'cover';
        let activePosition = styleConfig.bgImage.position || styleConfig.bgImage.bgPosition || 'center';
        let activeRepeat = styleConfig.bgImage.repeat || styleConfig.bgImage.bgRepeat || 'no-repeat';
        let activeAttachment = styleConfig.bgImage.attachment || styleConfig.bgImage.bgAttachment || 'scroll';

        if (windowWidth <= 768 && styleConfig.bgImage.mobileUrl) {
            activeUrl = styleConfig.bgImage.mobileUrl;
            activeSize = styleConfig.bgImage.mobileSize || styleConfig.bgImage.mobileBgSize || 'cover';
            activePosition = styleConfig.bgImage.mobilePosition || styleConfig.bgImage.mobileBgPosition || 'center';
            activeRepeat = styleConfig.bgImage.mobileRepeat || styleConfig.bgImage.mobileBgRepeat || 'no-repeat';
            activeAttachment = styleConfig.bgImage.mobileAttachment || styleConfig.bgImage.mobileBgAttachment || activeAttachment;
        } else if (windowWidth <= 1024 && styleConfig.bgImage.tabletUrl) {
            activeUrl = styleConfig.bgImage.tabletUrl;
            activeSize = styleConfig.bgImage.tabletSize || styleConfig.bgImage.tabletBgSize || 'cover';
            activePosition = styleConfig.bgImage.tabletPosition || styleConfig.bgImage.tabletBgPosition || 'center';
            activeRepeat = styleConfig.bgImage.tabletRepeat || styleConfig.bgImage.tabletBgRepeat || 'no-repeat';
            activeAttachment = styleConfig.bgImage.tabletAttachment || styleConfig.bgImage.tabletBgAttachment || activeAttachment;
        }

        if (activeUrl) {
            styles.backgroundImage = `url(${activeUrl})`
            styles.backgroundSize = activeSize || 'cover'
            styles.backgroundPosition = activePosition || 'center'
            styles.backgroundRepeat = activeRepeat || 'no-repeat'
            styles.backgroundAttachment = activeAttachment || 'scroll'
        }
    } else if (styleConfig.bgType === 'gradient') {
        styles.background = `linear-gradient(${styleConfig.gradientColors?.direction || '180deg'}, ${styleConfig.gradientColors?.start || '#ffffff'}, ${styleConfig.gradientColors?.end || '#ffffff'})`
    } else if (styleConfig.bgType === 'color' || styleConfig.bgColor) {
        styles.backgroundColor = styleConfig.bgColor || '#ffffff'
    }

    return styles
}

/**
 * Returns the class names needed for the text theme (dark/light)
 */
export const getTextThemeClass = (styleConfig) => {
    if (!styleConfig) return 'text-gray-900' // default dark text
    return styleConfig.textTheme === 'light' ? 'text-white drop-shadow-md' : 'text-gray-900'
}

/**
 * Returns a React component for the overlay if enabled
 */
export const renderOverlay = (styleConfig) => {
    if (!styleConfig || !styleConfig.overlay?.enabled || styleConfig.bgType !== 'image') return null;

    return (
        <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
                backgroundColor: styleConfig.overlay.color || '#000000',
                opacity: styleConfig.overlay.opacity || 0.5
            }}
        ></div>
    )
}
