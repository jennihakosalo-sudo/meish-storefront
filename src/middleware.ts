import { defineMiddleware } from 'astro:middleware';

/**
 * Hatchling v1 — hide unfinished routes locally (pages stay in the repo).
 * Production uses vercel.json. Future public route (not live): /elements
 * “Explore the Elements”.
 */
const exact: Record<string, string> = {
  '/cart': '/',
  '/philosophy': '/about',
  '/style': '/',
  '/success': '/',
  '/shop': '/',
  '/services': '/contact',
  '/reserve': '/contact',
  '/for-business/meish-treasure': '/for-business',
};

function destination(path: string): string | null {
  if (exact[path]) return exact[path];
  if (path.startsWith('/universe')) return '/';
  if (path.startsWith('/shop/')) return '/';
  if (path.startsWith('/design/')) return '/';
  if (path.startsWith('/services/')) return '/contact';
  if (path.startsWith('/reserve/')) return '/contact';
  if (path.startsWith('/for-business/meish-treasure/')) return '/for-business';
  return null;
}

export const onRequest = defineMiddleware((context, next) => {
  const path = context.url.pathname.replace(/\/$/, '') || '/';
  const to = destination(path);
  if (to) return context.redirect(to, 302);
  return next();
});
