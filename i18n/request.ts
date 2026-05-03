import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'hi', 'gu', 'bn', 'mr', 'ta', 'te', 'pa'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  // Force HMR reload

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
