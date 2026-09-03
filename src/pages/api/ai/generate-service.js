import { generateServiceDetails } from "@/lib/ai";
import { getAdminFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized: Admin access required" });
  }

  try {
    const { title, category } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: "Service title is required" });
    }

    const generated = await generateServiceDetails(title, category || "IT Solutions");
    return res.status(200).json({ success: true, service: generated });
  } catch (error) {
    console.error("AI Service Generation Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate service with AI" });
  }
}
