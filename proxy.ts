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
  const response = intlMiddleware(request);
  
  // Strip port from redirects in production
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location');
    if (location && location.includes(':8080')) {
      const url = new URL(location);
      url.port = '';
      response.headers.set('location', url.toString());
    }
  }
  
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|gu|en|bn|mr|ta|te|pa)/:path*']
};
