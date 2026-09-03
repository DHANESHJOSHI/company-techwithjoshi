import { getDatabase } from "@/lib/mongodb";
import { getAdminFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const settingsCol = db.collection("settings");

    if (req.method === "GET") {
      const settings = await settingsCol.findOne({ id: "site_config" });
      return res.status(200).json(settings || {});
    }

    if (req.method === "PUT" || req.method === "POST") {
      const admin = getAdminFromRequest(req);
      if (!admin) {
        return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
      }

      const { _id, ...updateData } = req.body;
      await settingsCol.updateOne(
        { id: "site_config" },
        { $set: { ...updateData, updatedAt: new Date(), updatedBy: admin.username } },
        { upsert: true }
      );
      return res.status(200).json({ success: true, message: "Settings updated" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/settings error:", error);
    return res.status(500).json({ error: error.message });
  }
}
