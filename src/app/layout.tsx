import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Source_Sans_3 } from 'next/font/google';
import ViewportRedirect from './_components/ViewportRedirect/ViewportRedirect';

import './globals.css';

import type { Metadata } from 'next';

const interFont = Inter({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const sansFont = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Digital Finance',
  description:
    'The best investment tracking and portfolio management platform in the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${interFont.variable} ${sansFont.variable}`}>
      <body>
        <ClerkProvider>
          <ViewportRedirect />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
