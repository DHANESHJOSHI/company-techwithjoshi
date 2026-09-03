import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const teamCol = db.collection("team");

    if (req.method === "GET") {
      const team = await teamCol.find({}).sort({ order: 1 }).toArray();
      return res.status(200).json(team);
    }

    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "POST") {
      const newMember = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await teamCol.insertOne(newMember);
      return res.status(201).json({ success: true, id: result.insertedId });
    }

    if (req.method === "PUT") {
      const { _id, id, ...updateData } = req.body;
      const query = _id ? { _id: new ObjectId(_id) } : { id };
      await teamCol.updateOne(query, { $set: { ...updateData, updatedAt: new Date() } });
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      try {
        await teamCol.deleteOne({ _id: new ObjectId(id) });
      } catch {
        await teamCol.deleteOne({ id });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/team error:", error);
    return res.status(500).json({ error: error.message });
  }
}
