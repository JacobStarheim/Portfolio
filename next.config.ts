import type { NextConfig } from "next";
import path from "node:path";
import { createArtRevision } from "./src/build/art-revision";

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_ART_REVISION: createArtRevision(path.join(process.cwd(), "public/art")),
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
