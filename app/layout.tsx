import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import AppLoader from '@/components/AppLoader';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'FuelWise — Pelacak Konsumsi BBM',
  description: 'Aplikasi pelacak konsumsi bahan bakar real-time saat berkendara',
  metadataBase: new URL('https://fuelwise.anjas.id'),
  openGraph: {
    title: 'FuelWise — Pelacak Konsumsi BBM',
    description: 'Aplikasi pelacak konsumsi bahan bakar real-time saat berkendara',
    url: 'https://fuelwise.anjas.id',
    siteName: 'FuelWise',
    images: [
      {
        url: '/fuelwise.png',
        width: 512,
        height: 512,
        alt: 'FuelWise Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FuelWise — Pelacak Konsumsi BBM',
    description: 'Aplikasi pelacak konsumsi bahan bakar real-time saat berkendara',
    images: ['/fuelwise.png'],
  },
  manifest: '/manifest.json',
  applicationName: 'FuelWise',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FuelWise',
  },
  icons: {
    icon: '/fuelwise.png',
    apple: '/fuelwise.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B1120',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <AppLoader>{children}</AppLoader>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});});}`,
          }}
        />
      </body>
    </html>
  );
}
