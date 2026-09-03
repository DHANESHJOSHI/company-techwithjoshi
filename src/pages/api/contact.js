import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    const db = await getDatabase();
    const contacts = db.collection("contacts");

    if (req.method === "POST") {
      const { firstName, lastName, company, email, phone, message } = req.body;

      if (!firstName || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }

      const newInquiry = {
        name: `${firstName} ${lastName || ""}`.trim(),
        firstName,
        lastName: lastName || "",
        company: company || "N/A",
        email,
        phone: phone || "N/A",
        message,
        status: "unread",
        createdAt: new Date(),
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || null,
      };

      const result = await contacts.insertOne(newInquiry);
      return res.status(201).json({
        success: true,
        message: "Thank you! Your message has been received. We will contact you shortly.",
        id: result.insertedId,
      });
    }

    // Require admin session for GET, DELETE, and PATCH
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
    }

    if (req.method === "GET") {
      const allInquiries = await contacts.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(allInquiries);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Missing inquiry ID" });
      await contacts.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: "Inquiry deleted." });
    }

    if (req.method === "PATCH") {
      const { id, status } = req.body;
      if (!id) return res.status(400).json({ error: "Missing inquiry ID" });
      await contacts.updateOne({ _id: new ObjectId(id) }, { $set: { status: status || "read", updatedAt: new Date() } });
      return res.status(200).json({ success: true, message: "Status updated." });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API /api/contact error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
