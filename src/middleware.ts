import { defineMiddleware } from 'astro:middleware';
import { applySecurityHeaders } from './lib/headers';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  applySecurityHeaders(response.headers, context.url.pathname);
  return response;
});
