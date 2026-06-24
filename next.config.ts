import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma 7 driver-adapter client is generated locally; keep pg native deps
  // external from the server bundle so Turbopack does not try to inline them.
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
};

export default nextConfig;
