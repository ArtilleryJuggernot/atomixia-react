export function applySecurityHeaders(headers: Headers, pathname: string): void {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  if (pathname.startsWith('/_astro/')) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.startsWith('/api/')) {
    headers.set('Cache-Control', 'no-store');
  } else if (/\.(?:svg|png|jpe?g|webp|ico|woff2)$/.test(pathname)) {
    headers.set('Cache-Control', 'public, max-age=604800');
  } else {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }
}
