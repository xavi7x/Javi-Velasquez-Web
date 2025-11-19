import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import './globals.css';
import { AvailabilityStatus } from '@/components/shared/AvailabilityStatus';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Velásquez Digital',
  description: 'Portafolio de Tecnólogo Creativo y Diseñador',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="dark" enableSystem={false} attribute="class">
          <FirebaseClientProvider>
            {children}
            <AvailabilityStatus />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
