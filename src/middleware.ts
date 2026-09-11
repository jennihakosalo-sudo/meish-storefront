import { defineMiddleware } from 'astro:middleware';

/**
 * Hide unfinished routes locally (pages stay in the repo).
 * Production uses vercel.json. /elements is reserved — not public yet.
 */
const exact: Record<string, string> = {
  '/cart': '/',
  '/philosophy': '/about',
  '/style': '/',
  '/success': '/',
  '/shop': '/',
  '/services': '/for-business',
  '/reserve': '/for-business',
  '/contact': '/',
  '/elements': '/',
  '/fit-check': '/',
  '/for-business/meish-treasure': '/for-business',
};

function destination(path: string): string | null {
  if (exact[path]) return exact[path];
  if (path.startsWith('/universe')) return '/';
  if (path.startsWith('/shop/')) return '/';
  if (path.startsWith('/design/')) return '/';
  if (path.startsWith('/services/')) return '/for-business';
  if (path.startsWith('/reserve/')) return '/for-business';
  if (path.startsWith('/for-business/meish-treasure/')) return '/for-business';
  return null;
}

export const onRequest = defineMiddleware((context, next) => {
  const path = context.url.pathname.replace(/\/$/, '') || '/';
  const to = destination(path);
  if (to) return context.redirect(to, 302);
  return next();
});
