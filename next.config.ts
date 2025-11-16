import withNextIntl from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {};

export default withNextIntl("./i18n.ts")(
  withBundleAnalyzer(nextConfig)
);
