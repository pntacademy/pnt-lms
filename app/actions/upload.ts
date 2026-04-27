"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";
import { auth } from "@/auth";

export async function getUploadPresignedUrl(fileName: string, contentType: string) {
  // 1. Verify the user is authenticated
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  if (!bucketName) {
    return { error: "Cloudflare R2 Bucket Name is not configured" };
  }

  // 2. Create a unique file key
  // Format: userId/timestamp-filename
  const timestamp = Date.now();
  // Strip out any weird characters from filename just to be safe
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `${session.user.id}/${timestamp}-${safeFileName}`;

  try {
    // 3. Create the PutObject command
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    // 4. Generate the presigned URL (expires in 15 minutes = 900 seconds)
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    // 5. Construct the final public URL where the file will live
    // (Assuming the bucket isn't public, they'll need a GET presigned URL later to view it, 
    // or you can configure a custom domain on the R2 bucket for public access).
    // For now, we return the objectKey so we can save it in the database.
    return { 
        success: true, 
        presignedUrl, 
        objectKey 
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return { error: "Failed to generate upload URL" };
  }
}
