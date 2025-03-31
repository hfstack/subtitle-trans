const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 重定向已移至 middleware.ts 中处理
};

module.exports = withNextIntl(nextConfig); 