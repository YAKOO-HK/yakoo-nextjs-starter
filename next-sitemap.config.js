/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  exclude: [
    // exclude all image routes
    '/*.png',
    '/*.jpg',
    '/*.gif',
    // exclude all admin routes
    '/admin',
    '/admin/*',
    // exclude all api routes
    '/api/*',
    // exclude all protected routes
    '/account/*',
    // exclude reset-password route
    '/reset-password',
  ],
};
