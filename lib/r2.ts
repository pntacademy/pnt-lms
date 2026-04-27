import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

// Only throw in production or when explicitly trying to use it to prevent build crashes
if (process.env.NODE_ENV === "production" && (!accountId || !accessKeyId || !secretAccessKey)) {
  console.warn("WARNING: Missing Cloudflare R2 environment variables. File uploads will fail.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId || 'dummy-account-id'}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || 'dummy-access-key',
    secretAccessKey: secretAccessKey || 'dummy-secret-key',
  },
});
