import { getDatabase } from "@/lib/mongodb";
import { comparePassword, hashPassword, signToken } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { usernameOrEmail, identifier, username, email, password } = req.body || {};
    const loginUser = usernameOrEmail || identifier || username || email;

    if (!loginUser || !password) {
      return res.status(400).json({ error: "Username/Email and Password are required" });
    }

    const db = await getDatabase();
    const adminsCollection = db.collection("admins");

    // Ensure admin-twj exists with fluidislive2024
    const adminTwj = await adminsCollection.findOne({ username: "admin-twj" });
    if (!adminTwj) {
      const defaultPasswordHash = hashPassword("fluidislive2024");
      await adminsCollection.insertOne({
        username: "admin-twj",
        email: "work@techwithjoshi.in",
        name: "TechWithJoshi Super Admin",
        password: defaultPasswordHash,
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }


    const trimmedIdentifier = loginUser.trim();

    // Look for matching admin by username or email (case-insensitive)
    const admin = await adminsCollection.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${trimmedIdentifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } },
        { email: { $regex: new RegExp(`^${trimmedIdentifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } }
      ]
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const tokenPayload = {
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      name: admin.name || "Dhanesh Joshi",
      role: admin.role || "superadmin",
    };

    const token = signToken(tokenPayload);

    // Set cookie (7 days expiry)
    res.setHeader(
      "Set-Cookie",
      `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      token,
      user: tokenPayload,
    });
  } catch (error) {
    console.error("Auth login error:", error);
    return res.status(500).json({ error: "Internal server error during authentication" });
  }
}
