import type { NextConfig } from "next";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// At build time, read the service account file and inject as env var.
// This ensures Cloud Run has access to Firebase Admin credentials
// even though the JSON file is not deployed.
const saPath = resolve(process.cwd(), "firebase-service-account.json");
const serviceAccount =
  !process.env.FIREBASE_SERVICE_ACCOUNT && existsSync(saPath)
    ? readFileSync(saPath, "utf-8").replace(/\n/g, "")
    : undefined;

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  env: {
    ...(serviceAccount ? { FIREBASE_SERVICE_ACCOUNT: serviceAccount } : {}),
  },
};

export default nextConfig;
