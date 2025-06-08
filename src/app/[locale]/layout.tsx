import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const robotoSans = Roboto({
  variable: '--font-roboto-sans',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Web banking pet',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
        <NextIntlClientProvider>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
