import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://evento.so/**"),
      new URL("https://api.evento.so/**"),
    ],
  },
};

export default nextConfig;
