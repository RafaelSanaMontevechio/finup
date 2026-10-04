import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  env: {
    // A versão vem do package.json; o commit é preenchido pela Vercel no build.
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
    NEXT_PUBLIC_APP_COMMIT: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "",
  },
};

export default nextConfig;
