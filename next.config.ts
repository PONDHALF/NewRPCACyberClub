import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module — keep it external so it is loaded from
  // node_modules at runtime instead of being bundled by the server compiler.
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    serverActions: {
      // Challenge uploads go through a Server Action; default cap is 1 MB.
      // Raise it above our 50 MB file limit, leaving room for multipart overhead.
      bodySizeLimit: "55mb",
    },
  },
};

export default nextConfig;
