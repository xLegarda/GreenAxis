import { db } from './db'

/**
 * Represents a reference to a media file in the database
 */
export interface MediaReference {
  table: string
  id: string
  field: string
  displayName: string
  url: string
}

/**
 * Extracts media URLs from EditorJS blocks JSON string
 * Scans for image, videoLocal, and audioLocal blocks
 * 
 * @param blocks - JSON string containing EditorJS blocks
 * @returns Array of media URLs found in the blocks
 */
export function extractMediaFromEditorJS(blocks: string): string[] {
  if (!blocks || blocks.trim() === '') {
    return []
  }

  try {
    const parsed = JSON.parse(blocks)
    const urls: string[] = []

    if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
      return []
    }

    for (const block of parsed.blocks) {
      // Image blocks: data.file.url
      if (block.type === 'image' && block.data?.file?.url) {
        urls.push(block.data.file.url)
      }
      
      // Video blocks: data.url
      if (block.type === 'videoLocal' && block.data?.url) {
        urls.push(block.data.url)
      }
      
      // Audio blocks: data.url
      if (block.type === 'audioLocal' && block.data?.url) {
        urls.push(block.data.url)
      }
    }

    return urls
  } catch (error) {
    console.error('Error parsing EditorJS blocks:', error)
    return []
  }
}

/**
 * Finds all references to a media URL across the database
 * Scans PlatformConfig, News, CarouselSlide, LegalPage, and AboutPage tables
 * 
 * @param url - The media URL to search for
 * @returns Array of MediaReference objects indicating where the URL is used
 */
export async function findMediaReferences(url: string): Promise<MediaReference[]> {
  if (!url || url.trim() === '') {
    return []
  }

  const references: MediaReference[] = []

  try {
    // Scan PlatformConfig
    const configs = await db.platformConfig.findMany()
    for (const config of configs) {
      const fields = [
        { key: 'logoUrl', value: config.logoUrl, label: 'Logo' },
        { key: 'faviconUrl', value: config.faviconUrl, label: 'Favicon' },
        { key: 'aboutImageUrl', value: config.aboutImageUrl, label: 'About Image' },
      ]

      for (const field of fields) {
        if (field.value === url) {
          references.push({
            table: 'PlatformConfig',
            id: config.id,
            field: field.key,
            displayName: `Platform Config - ${field.label}`,
            url: url,
          })
        }
      }
    }

    // Scan News
    const newsItems = await db.news.findMany()
    for (const news of newsItems) {
      // Check imageUrl field
      if (news.imageUrl === url) {
        references.push({
          table: 'News',
          id: news.id,
          field: 'imageUrl',
          displayName: `News - ${news.title}`,
          url: url,
        })
      }

      // Check EditorJS blocks
      if (news.blocks) {
        const blockUrls = extractMediaFromEditorJS(news.blocks)
        if (blockUrls.includes(url)) {
          references.push({
            table: 'News',
            id: news.id,
            field: 'blocks',
            displayName: `News Content - ${news.title}`,
            url: url,
          })
        }
      }
    }

    // Scan CarouselSlide
    const slides = await db.carouselSlide.findMany()
    for (const slide of slides) {
      if (slide.imageUrl === url) {
        references.push({
          table: 'CarouselSlide',
          id: slide.id,
          field: 'imageUrl',
          displayName: `Carousel - ${slide.title || 'Untitled Slide'}`,
          url: url,
        })
      }
    }

    // Scan LegalPage
    const legalPages = await db.legalPage.findMany()
    for (const page of legalPages) {
      if (page.blocks) {
        const blockUrls = extractMediaFromEditorJS(page.blocks)
        if (blockUrls.includes(url)) {
          references.push({
            table: 'LegalPage',
            id: page.id,
            field: 'blocks',
            displayName: `Legal Page - ${page.title}`,
            url: url,
          })
        }
      }
    }

    // Scan AboutPage
    const aboutPages = await db.aboutPage.findMany()
    for (const page of aboutPages) {
      const fields = [
        { key: 'heroImageUrl', value: page.heroImageUrl, label: 'Hero Image' },
        { key: 'historyImageUrl', value: page.historyImageUrl, label: 'History Image' },
      ]

      for (const field of fields) {
        if (field.value === url) {
          references.push({
            table: 'AboutPage',
            id: page.id,
            field: field.key,
            displayName: `About Page - ${field.label}`,
            url: url,
          })
        }
      }
    }

    return references
  } catch (error) {
    console.error('Error finding media references:', error)
    throw error
  }
}

/**
 * Updates all references to a media URL with a new URL
 * Used when files are deleted or replaced
 * 
 * @param oldUrl - The current media URL to replace
 * @param newUrl - The new URL to use (typically empty string for deletions)
 */
export async function updateMediaReferences(
  oldUrl: string,
  newUrl: string
): Promise<void> {
  if (!oldUrl || oldUrl.trim() === '') {
    return
  }

  try {
    // Update PlatformConfig
    const configs = await db.platformConfig.findMany()
    for (const config of configs) {
      const updates: any = {}

      if (config.logoUrl === oldUrl) updates.logoUrl = newUrl
      if (config.faviconUrl === oldUrl) updates.faviconUrl = newUrl
      if (config.aboutImageUrl === oldUrl) updates.aboutImageUrl = newUrl

      if (Object.keys(updates).length > 0) {
        await db.platformConfig.update({
          where: { id: config.id },
          data: updates,
        })
      }
    }

    // Update News
    const newsItems = await db.news.findMany()
    for (const news of newsItems) {
      const updates: any = {}

      if (news.imageUrl === oldUrl) {
        updates.imageUrl = newUrl
      }

      // Update EditorJS blocks
      if (news.blocks) {
        const blockUrls = extractMediaFromEditorJS(news.blocks)
        if (blockUrls.includes(oldUrl)) {
          try {
            const parsed = JSON.parse(news.blocks)
            let modified = false

            for (const block of parsed.blocks) {
              if (block.type === 'image' && block.data?.file?.url === oldUrl) {
                block.data.file.url = newUrl
                modified = true
              }
              if (block.type === 'videoLocal' && block.data?.url === oldUrl) {
                block.data.url = newUrl
                modified = true
              }
              if (block.type === 'audioLocal' && block.data?.url === oldUrl) {
                block.data.url = newUrl
                modified = true
              }
            }

            if (modified) {
              updates.blocks = JSON.stringify(parsed)
            }
          } catch (error) {
            console.error('Error updating EditorJS blocks in News:', error)
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        await db.news.update({
          where: { id: news.id },
          data: updates,
        })
      }
    }

    // Update CarouselSlide
    const slides = await db.carouselSlide.findMany()
    for (const slide of slides) {
      if (slide.imageUrl === oldUrl) {
        await db.carouselSlide.update({
          where: { id: slide.id },
          data: { imageUrl: newUrl },
        })
      }
    }

    // Update LegalPage
    const legalPages = await db.legalPage.findMany()
    for (const page of legalPages) {
      if (page.blocks) {
        const blockUrls = extractMediaFromEditorJS(page.blocks)
        if (blockUrls.includes(oldUrl)) {
          try {
            const parsed = JSON.parse(page.blocks)
            let modified = false

            for (const block of parsed.blocks) {
              if (block.type === 'image' && block.data?.file?.url === oldUrl) {
                block.data.file.url = newUrl
                modified = true
              }
              if (block.type === 'videoLocal' && block.data?.url === oldUrl) {
                block.data.url = newUrl
                modified = true
              }
              if (block.type === 'audioLocal' && block.data?.url === oldUrl) {
                block.data.url = newUrl
                modified = true
              }
            }

            if (modified) {
              await db.legalPage.update({
                where: { id: page.id },
                data: { blocks: JSON.stringify(parsed) },
              })
            }
          } catch (error) {
            console.error('Error updating EditorJS blocks in LegalPage:', error)
          }
        }
      }
    }

    // Update AboutPage
    const aboutPages = await db.aboutPage.findMany()
    for (const page of aboutPages) {
      const updates: any = {}

      if (page.heroImageUrl === oldUrl) updates.heroImageUrl = newUrl
      if (page.historyImageUrl === oldUrl) updates.historyImageUrl = newUrl

      if (Object.keys(updates).length > 0) {
        await db.aboutPage.update({
          where: { id: page.id },
          data: updates,
        })
      }
    }
  } catch (error) {
    console.error('Error updating media references:', error)
    throw error
  }
}
