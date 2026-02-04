import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: true, // process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // @ts-expect-error - eslint config is valid but types might be outdated
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
};

// export default withPWA(nextConfig);
export default nextConfig;
