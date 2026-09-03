import { getAdminFromRequest } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ authenticated: false, error: "Unauthorized access" });
  }

  return res.status(200).json({
    authenticated: true,
    user: admin,
  });
}
