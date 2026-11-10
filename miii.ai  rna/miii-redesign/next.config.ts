import type { NextConfig } from "next";
// The preview runs behind Arena's HTTPS proxy. Allow its development origin so
// the browser can load Next's live resources and hydrate interactive controls.
const nextConfig: NextConfig = { allowedDevOrigins: ["*.e2b.app", "127.0.0.1", "localhost"] };
export default nextConfig;
