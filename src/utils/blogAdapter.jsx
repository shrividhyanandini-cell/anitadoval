import React from 'react'

/**
 * Adapter for blog rich-text blocks and legacy string content.
 * Guarantees content blocks are rendered in order without dropping fields.
 */

export const renderBlogContentBlocks = (content) => {
    if (!content) return null


    if (Array.isArray(content)) {
        return content.map((block, idx) => {
            if (block.type === 'heading') {
                return (
                    <h3
                        key={idx}
                        className="font-serif text-[22px] md:text-[26px] font-semibold text-[#25221E] mt-8 mb-4 tracking-tight"
                    >
                        {block.text}
                    </h3>
                )
            }
            if (block.type === 'quote') {
                return (
                    <blockquote
                        key={idx}
                        className="border-l-4 border-[#B78325] pl-5 my-6 italic text-[#554D43] bg-[#FAF8F3] py-3 rounded-r-lg"
                    >
                        {block.text}
                    </blockquote>
                )
            }
            // default paragraph
            return (
                <p
                    key={idx}
                    className="text-[16px] md:text-[17px] text-[#4F473E] leading-[1.8] mb-6 font-light"
                >
                    {block.text}
                </p>
            )
        })
    }

    if (typeof content === 'string') {
        const paragraphs = content.split(/\n\s*\n/)
        return paragraphs.map((p, idx) => {
            const trimmed = p.trim()
            if (!trimmed) return null
            if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
                const headingText = trimmed.replace(/^#+\s*/, '')
                return (
                    <h3
                        key={idx}
                        className="font-serif text-[22px] md:text-[26px] font-semibold text-[#25221E] mt-8 mb-4 tracking-tight"
                    >
                        {headingText}
                    </h3>
                )
            }
            return (
                <p
                    key={idx}
                    className="text-[16px] md:text-[17px] text-[#4F473E] leading-[1.8] mb-6 font-light"
                >
                    {trimmed}
                </p>
            )
        })
    }

    return null
}

/**
 * Converts array of blocks to editable text format for textarea
 */
export const contentBlocksToText = (content) => {
    if (!content) return ''
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
        return content
            .map((b) => (b.type === 'heading' ? `### ${b.text}` : b.text))
            .join('\n\n')
    }
    return ''
}

/**
 * Converts textarea text into array of structured content blocks
 */
export const textToContentBlocks = (text) => {
    if (!text || typeof text !== 'string') return []
    const chunks = text.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean)
    return chunks.map((chunk) => {
        if (chunk.startsWith('### ') || chunk.startsWith('## ')) {
            return {
                type: 'heading',
                text: chunk.replace(/^#+\s*/, '')
            }
        }
        return {
            type: 'paragraph',
            text: chunk
        }
    })
}

/**
 * Normalize blog data so both seed schema and app schema are fully supported
 */
export const normalizeBlog = (raw) => {
    const rawImage = raw.featuredImage || raw.image
    let imageUrl = ''
    let imageAlt = raw.title || ''

    if (typeof rawImage === 'string') {
        imageUrl = rawImage
    } else if (typeof rawImage === 'object' && rawImage) {
        imageUrl = rawImage.url || ''
        imageAlt = rawImage.alt || raw.title || ''
    } else if (raw.imageUrl) {
        imageUrl = raw.imageUrl
    }

    return {
        id: raw.id,
        slug: raw.slug || raw.id,
        title: raw.title || '',
        excerpt: raw.excerpt || '',
        category: raw.category || 'Astrology',
        author: raw.author || 'Anita Doval',
        publishedAt: raw.publishedAt || '',
        readTimeMinutes: Number(raw.readTimeMinutes) || 5,
        featuredImage: {
            url: imageUrl,
            alt: imageAlt
        },
        imageUrl: imageUrl,
        content: raw.content || [],
        seo: raw.seo || {
            metaTitle: raw.title ? `${raw.title} | Anita Doval` : 'Anita Doval Blog',
            metaDescription: raw.excerpt || ''
        },
        status: raw.status || 'draft',
        enabled: raw.enabled !== false,
        createdAt: raw.createdAt || null,
        updatedAt: raw.updatedAt || null
    }
}

export const renderBlogContent = renderBlogContentBlocks

export const getBlogExcerpt = (blog, maxLen = 160) => {
    if (!blog) return ''
    if (blog.excerpt) return blog.excerpt
    if (typeof blog.content === 'string') return blog.content.slice(0, maxLen) + '...'
    if (Array.isArray(blog.content)) {
        const firstP = blog.content.find((b) => b.type === 'paragraph')
        if (firstP) return firstP.text.slice(0, maxLen) + '...'
    }
    return ''
}

