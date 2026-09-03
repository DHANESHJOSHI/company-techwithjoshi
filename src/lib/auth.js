import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "TWJ_SECURE_JWT_SECRET_2026_AGY_SUPER_KEY_736";
const JWT_EXPIRES_IN = "7d";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getAdminFromRequest(req) {
  let token = null;

  // 1. Check cookies
  if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  // 2. Check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.substring(7);
  }

  if (!token) return null;
  return verifyToken(token);
}
