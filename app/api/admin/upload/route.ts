import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Enhanced validation
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Invalid file format" },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Generate a unique filename to prevent conflicts
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `product-${timestamp}-${randomString}.${fileExtension}`;

    console.log(
      `Uploading file: ${fileName}, Size: ${file.size} bytes, Type: ${file.type}`
    );

    // Upload to Vercel Blob with error handling
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false, // We're already adding our own unique identifier
    });

    console.log(`File uploaded successfully: ${blob.url}`);

    return NextResponse.json({
      url: blob.url,
      filename: fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error uploading to Blob:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to upload file";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Handle specific Vercel Blob errors
      if (error.message.includes("rate limit")) {
        errorMessage = "Upload rate limit exceeded. Please try again later.";
      } else if (error.message.includes("quota")) {
        errorMessage = "Storage quota exceeded. Please contact support.";
      } else if (error.message.includes("network")) {
        errorMessage =
          "Network error occurred. Please check your connection and try again.";
      }
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
