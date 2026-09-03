import fs from "fs";
import path from "path";
import { getAdminFromRequest } from "@/lib/auth";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "15mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized: Admin access required" });
  }

  try {
    const { data, name } = req.body;

    if (!data) {
      return res.status(400).json({ error: "No image data provided" });
    }

    const matches = data.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid image format. Must be base64 data URI" });
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];

    const allowedMimes = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/svg+xml": "svg",
    };

    if (!allowedMimes[mimeType]) {
      return res.status(400).json({ error: "Unsupported file type. Allowed: JPG, PNG, WEBP, GIF, SVG" });
    }

    const ext = allowedMimes[mimeType];
    const safeBaseName = (name || "upload")
      .toLowerCase()
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9_-]/g, "-")
      .substring(0, 32);

    const filename = `${safeBaseName}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
      mimeType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: error.message || "Internal server error during upload" });
  }
}
