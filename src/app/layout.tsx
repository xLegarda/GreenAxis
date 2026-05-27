import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsLoader } from "@/components/analytics-loader";
import { StructuredData } from "@/components/structured-data";
import { db } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos dinámicos desde la base de datos
export async function generateMetadata(): Promise<Metadata> {
  let config = await db.platformConfig.findFirst()
  
  const siteName = config?.siteName || "Green Axis S.A.S."
  const description = config?.siteDescription || "Empresa líder en servicios ambientales en Colombia. Ofrecemos soluciones integrales para el manejo de residuos, consultoría ambiental y más."
  const favicon = config?.faviconUrl || "/favicon.png"
  const siteUrl = config?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/` : undefined
  
  return {
    title: {
      default: `${siteName} | Servicios Ambientales`,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: ["servicios ambientales", "medio ambiente", "Colombia", "residuos", "consultoría ambiental", "gestión ambiental"],
    authors: [{ name: siteName }],
    icons: {
      icon: [
        { url: favicon, sizes: "32x32" },
        { url: favicon, sizes: "64x64" },
      ],
      apple: favicon,
      shortcut: favicon,
    },
    openGraph: {
      title: siteName,
      description: description,
      type: "website",
      url: canonicalUrl,
      siteName: siteName,
      locale: 'es_CO',
      images: config?.logoUrl ? [{
        url: config.logoUrl,
        width: 1200,
        height: 630,
        alt: siteName,
      }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: description,
      images: config?.logoUrl ? [config.logoUrl] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener configuración para Schema.org
  const config = await db.platformConfig.findFirst()
  const siteUrl = config?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://greenaxis.com.co'
  const cleanSiteUrl = siteUrl.replace(/\/$/, '')

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Datos estructurados para SEO */}
        <StructuredData
          type="organization"
          data={{
            name: config?.siteName || 'Green Axis S.A.S.',
            url: cleanSiteUrl,
            logo: config?.logoUrl,
            description: config?.siteDescription,
            address: config?.companyAddress ? {
              street: config.companyAddress,
              city: 'Colombia',
              region: 'Colombia',
            } : undefined,
            phone: config?.companyPhone,
            email: config?.companyEmail,
            socialLinks: [
              config?.facebookUrl,
              config?.instagramUrl,
              config?.twitterUrl,
              config?.linkedinUrl,
              config?.youtubeUrl,
              config?.tiktokUrl,
            ],
          }}
        />
        <StructuredData
          type="website"
          data={{
            name: config?.siteName || 'Green Axis S.A.S.',
            url: cleanSiteUrl,
            description: config?.siteDescription,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsLoader />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
