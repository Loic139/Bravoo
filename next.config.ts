import type { NextConfig } from "next";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// At build time, read the service account JSON and inject via webpack DefinePlugin.
// During `firebase deploy`, `next build` runs locally where the file exists.
// The content is then baked into the server bundle for Cloud Run.
const saPath = resolve(process.cwd(), "firebase-service-account.json");
const saContent = existsSync(saPath) ? readFileSync(saPath, "utf-8") : null;

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  webpack: (config, { isServer, webpack }) => {
    if (isServer && saContent) {
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.FIREBASE_SERVICE_ACCOUNT": JSON.stringify(saContent),
        }),
      );
    }
    return config;
  },
};

export default nextConfig;
