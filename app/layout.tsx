import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';        
import { Toaster } from '@/components/ui/sonner';
import { TanstackQueryProvider } from '@/components/providers/tanstackQueryProvider';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '~/hocein',
  description: 'Building neat web apps & configuring servers from scratch.',
  authors: [{ name: 'Lovable' }],
  openGraph: {
    title: '~/hocein',
    description: 'Building neat web apps & configuring servers from scratch.',
    type: 'website',
    images: [
      {
        url: 'https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/511bcd83-be0a-47c2-a74b-c73c62b672ef',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@Lovable',
    title: '~/hocein',
    description: 'Building neat web apps & configuring servers from scratch.',
    images: ['https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/511bcd83-be0a-47c2-a74b-c73c62b672ef'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} bg-background text-foreground antialiased`}
      >
        <TanstackQueryProvider>
          <ThemeProvider>
          {children}
          <Toaster position="bottom-right" theme="dark" />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}