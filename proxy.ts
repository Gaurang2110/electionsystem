import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en'
});

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|gu|en|bn|mr|ta|te|pa)/:path*']
};
