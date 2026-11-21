import type { NextConfig } from "next";
// The preview runs behind Arena's HTTPS proxy. Allow its development origin so
// the browser can load Next's live resources and hydrate interactive controls.
const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app", "127.0.0.1", "localhost"],
  async rewrites() {
    return [
      { source: "/assets/:path*", destination: "/api/archive/assets/:path*" },
      { source: "/library/:path*", destination: "/api/archive/library/:path*" },
      { source: "/logo.png", destination: "/api/archive/logo.png" },
      { source: "/icons/:path*", destination: "/api/archive/icons/:path*" },
      { source: "/manifest.json", destination: "/api/archive/manifest.json" },
    ];
  },
};
export default nextConfig;
