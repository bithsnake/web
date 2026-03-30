import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const repoBasePath = "/web";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProduction ? repoBasePath : "",
  assetPrefix: isProduction ? `${repoBasePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
