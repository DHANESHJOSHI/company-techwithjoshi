import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAdminFromRequest, hashPassword, comparePassword } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized: Admin authorization required" });
  }

  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const db = await getDatabase();
    const adminsCol = db.collection("admins");

    const currentAdmin = await adminsCol.findOne({ _id: new ObjectId(admin.id) });
    if (!currentAdmin) {
      return res.status(404).json({ error: "Admin account not found" });
    }

    const updates = { updatedAt: new Date() };
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase().trim();

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password required to set new password" });
      }
      const isMatch = comparePassword(currentPassword, currentAdmin.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect current password" });
      }
      updates.password = hashPassword(newPassword);
    }

    await adminsCol.updateOne({ _id: new ObjectId(admin.id) }, { $set: updates });

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      user: {
        id: currentAdmin._id.toString(),
        username: currentAdmin.username,
        email: updates.email || currentAdmin.email,
        name: updates.name || currentAdmin.name,
        role: currentAdmin.role,
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ error: error.message });
  }
}
