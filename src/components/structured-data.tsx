/**
 * Componente para agregar datos estructurados (JSON-LD) para SEO
 * Ayuda a Google a entender mejor el contenido del sitio
 */

interface StructuredDataProps {
  type: 'organization' | 'website' | 'article' | 'service'
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema: any = {}

  switch (type) {
    case 'organization':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        address: data.address ? {
          '@type': 'PostalAddress',
          streetAddress: data.address.street,
          addressLocality: data.address.city,
          addressRegion: data.address.region,
          addressCountry: 'CO',
        } : undefined,
        contactPoint: data.phone || data.email ? {
          '@type': 'ContactPoint',
          telephone: data.phone,
          email: data.email,
          contactType: 'customer service',
          availableLanguage: 'Spanish',
        } : undefined,
        sameAs: data.socialLinks?.filter(Boolean) || [],
      }
      break

    case 'website':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name,
        url: data.url,
        description: data.description,
        inLanguage: 'es-CO',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${data.url}/noticias?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }
      break

    case 'article':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.publishedAt,
        dateModified: data.updatedAt,
        author: {
          '@type': data.authorType || 'Organization',
          name: data.author,
        },
        publisher: {
          '@type': 'Organization',
          name: data.publisherName,
          logo: {
            '@type': 'ImageObject',
            url: data.publisherLogo,
          },
        },
      }
      break

    case 'service':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: data.providerName,
          url: data.providerUrl,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Colombia',
        },
        serviceType: data.serviceType || 'Environmental Services',
      }
      break
  }

  // Limpiar valores undefined
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}
