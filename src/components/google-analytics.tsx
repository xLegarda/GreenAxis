'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string | null
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId || measurementId.trim() === '') {
    return null
  }

  // Validar formato básico del ID (G-XXXXXXXXXX)
  const isValidFormat = /^G-[A-Z0-9]{10}$/.test(measurementId.trim())
  if (!isValidFormat) {
    console.warn('Google Analytics ID inválido. Formato esperado: G-XXXXXXXXXX')
    return null
  }

  const gaId = measurementId.trim()

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
