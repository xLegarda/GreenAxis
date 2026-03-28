import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsLoader } from "@/components/analytics-loader";
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
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: description,
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
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
