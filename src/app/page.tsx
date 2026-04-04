import { PublicLayout } from '@/components/public-layout'
import { HeroCarousel } from '@/components/hero-carousel'
import { ServicesSection } from '@/components/services-section'
import { AboutSection } from '@/components/about-section'
import { NewsSection } from '@/components/news-section'
import { CTASection } from '@/components/cta-section'
import { SocialFeedSection } from '@/components/social-feed-section'
import { MapSection } from '@/components/map-section'
import { PortfolioDownloadSection } from '@/components/portfolio-download-section'
import { getCarouselSlides, getServices, getNews, getPlatformConfig } from '@/lib/actions'

export default async function HomePage() {
  const [slides, services, newsData, config] = await Promise.all([
    getCarouselSlides(),
    getServices(),
    getNews(1, 3),
    getPlatformConfig()
  ])

  return (
    <PublicLayout>
      {/* Hero Carousel */}
      <HeroCarousel slides={slides} />
      
      {/* Services Section */}
      <div className="animate-slide-down">
        <ServicesSection services={services} />
      </div>
      
      {/* About Section */}
      <div className="animate-slide-down">
        <AboutSection config={config} />
      </div>
      
      {/* News Section */}
      <div className="animate-slide-down">
        <NewsSection news={newsData.news} />
      </div>
      
      {/* Social Feed */}
      <SocialFeedSection config={config} />
      
      {/* Map Section */}
      <MapSection 
        address={config.companyAddress} 
        googleMapsEmbed={config.googleMapsEmbed}
        showSection={config.showMapSection}
      />
      
      {/* CTA Section */}
      <div className="animate-slide-down">
        <CTASection 
          companyPhone={config.companyPhone} 
          companyEmail={config.companyEmail}
        />
      </div>
    </PublicLayout>
  )
}

