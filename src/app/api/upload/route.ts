import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";

    // If running on Vercel serverless (where filesystem is read-only), return Base64 Data URL directly
    if (process.env.VERCEL) {
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName: file.name || "uploaded_image.jpg",
        size: file.size,
      });
    }

    // Otherwise, try saving to public/images for local development
    try {
      const originalName = file.name || "uploaded_image.jpg";
      const extension = path.extname(originalName) || ".jpg";
      const baseName = path.basename(originalName, extension)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_")
        .slice(0, 30);

      const uniqueFileName = `prod_${Date.now()}_${baseName}${extension}`;
      const uploadDir = path.join(process.cwd(), "public", "images");

      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueFileName);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/images/${uniqueFileName}`,
        fileName: uniqueFileName,
        size: file.size,
      });
    } catch {
      // Fallback to data URL if writing to disk failed
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName: file.name || "uploaded_image.jpg",
        size: file.size,
      });
    }
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Erreur lors de l'enregistrement de l'image" },
      { status: 500 }
    );
  }
}
