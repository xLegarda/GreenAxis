import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.56.1', 'localhost', '127.0.0.1'],
  poweredByHeader: false,
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    // Definimos el CSP cuidadosamente para NO romper Cloudinary ni EditorJS
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.cloudinary.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://*.unsplash.com;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      frame-src 'self' https://*.cloudinary.com;
      connect-src 'self' https://api.cloudinary.com https://*.cloudinary.com;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        // Encabezados de seguridad para TODAS las rutas
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        // Optimización para archivos multimedia (existente)
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
