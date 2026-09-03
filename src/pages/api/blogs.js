import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import fallbackBlogs from "@/data/blogData.json";
import { getAdminFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const blogsCol = db.collection("blogs");

    if (req.method === "GET") {
      let blogs = await blogsCol.find({}).sort({ date: -1 }).toArray();
      if (!blogs || blogs.length === 0) {
        blogs = fallbackBlogs;
      }
      return res.status(200).json(blogs);
    }

    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "POST") {
      const newPost = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await blogsCol.insertOne(newPost);
      return res.status(201).json({ success: true, id: result.insertedId });
    }

    if (req.method === "PUT") {
      const { _id, id, ...updateData } = req.body;
      const query = _id ? { _id: new ObjectId(_id) } : { id };
      await blogsCol.updateOne(query, { $set: { ...updateData, updatedAt: new Date() } });
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      try {
        await blogsCol.deleteOne({ _id: new ObjectId(id) });
      } catch {
        await blogsCol.deleteOne({ id: parseInt(id) || id });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/blogs error:", error);
    return res.status(500).json({ error: error.message });
  }
}
