import { getDatabase } from "@/lib/mongodb";
import { getAdminFromRequest } from "@/lib/auth";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized: Admin access required" });
  }

  const db = await getDatabase();
  const sessionsCol = db.collection("ai_chat_sessions");

  if (req.method === "GET") {
    try {
      const sessions = await sessionsCol.find({}).sort({ updatedAt: -1 }).limit(100).toArray();
      return res.status(200).json(sessions);
    } catch (error) {
      console.error("GET /api/ai/sessions error:", error);
      return res.status(500).json({ error: "Failed to fetch AI sessions" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Session ID required" });

      let query = { sessionId: id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { sessionId: id }] };
      }

      await sessionsCol.deleteOne(query);
      return res.status(200).json({ success: true, message: "Session deleted" });
    } catch (error) {
      console.error("DELETE /api/ai/sessions error:", error);
      return res.status(500).json({ error: "Failed to delete session" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
