import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["engine", "sim", "data"],
};

export default nextConfig;
