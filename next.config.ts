const withNextIntl = require("next-intl/plugin")("./i18n.ts");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));