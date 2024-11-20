/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function GET(req: NextRequest) {
  try {
    // Extract the file key from the query or request parameters (assuming it's passed as a query param)
    const { searchParams } = new URL(req.url);
    const fileKey = searchParams.get("key"); // Assuming the file key is passed as a query parameter "key"

    if (!fileKey) {
      return NextResponse.json({ error: "Missing file key" }, { status: 400 });
    }

    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json(
        { error: "Bucket name is missing" },
        { status: 500 },
      );
    }

    // Fetch the object from S3
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey, // Use the fileKey here
      }),
    );

    // Generate a signed URL for accessing the object
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      }),
      { expiresIn: 3600 },
    ); // The URL will be valid for 1 hour

    // Return the signed URL for access
    return NextResponse.json({
      success: true,
      signedUrl,
    });
  } catch (error) {
    console.error("Error fetching document from S3:", error);
    return NextResponse.json(
      { error: "Failed to fetch document from S3" },
      { status: 500 },
    );
  }
}
