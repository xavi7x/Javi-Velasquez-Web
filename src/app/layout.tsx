import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import './globals.css';
import { AvailabilityStatus } from '@/components/shared/AvailabilityStatus';
import { FirebaseClientProvider } from '@/firebase';
import GoogleAnalytics from '@/components/shared/GoogleAnalytics';
import { GTM_ID } from '@/lib/gtag';
import { QuantumLoader } from '@/components/shared/QuantumLoader';

const title = 'Desarrollo Web Integral | Javier Velásquez';
const description = 'Transformo ideas en experiencias digitales. Desarrollo de páginas web, aplicaciones y tiendas online a medida. Escalables, rápidas y con un diseño impecable.';
const url = 'https://www.javivelasquez.com'; // Asume tu dominio final
const imageUrl = `${url}/og-image.png`; // Asume una imagen para redes sociales

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: ['desarrollo web', 'diseño web', 'nextjs', 'react', 'firebase', 'programador', 'freelance', 'aplicaciones web', 'ecommerce'],
  authors: [{ name: 'Javier Velásquez', url: url }],
  creator: 'Javier Velásquez',
  
  openGraph: {
    type: 'website',
    url: url,
    title: title,
    description: description,
    images: [{
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: 'Banner de Desarrollo Web Integral por Javier Velásquez',
    }],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [imageUrl],
    creator: '@javivelasquez', // Asume tu usuario de Twitter
  },

  metadataBase: new URL(url),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Suspense>
            <GoogleAnalytics gaId={GTM_ID} />
          </Suspense>
          <FirebaseClientProvider>
            <Suspense fallback={<QuantumLoader />}>
              {children}
            </Suspense>
            {/* Ahora que useCollection es seguro, podemos usar esto sin miedo */}
            <AvailabilityStatus />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}