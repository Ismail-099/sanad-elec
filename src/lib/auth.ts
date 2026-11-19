import { NextRequest } from "next/server";
import { getDatabase } from "./store";

const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "sanad_elec_secure_vault_2026";

export function generateAdminToken(email: string): string {
  const timestamp = Date.now();
  const payload = `${email}:${timestamp}:${ADMIN_SECRET}`;
  return Buffer.from(payload).toString("base64url");
}

export async function verifyAdminSession(req: NextRequest): Promise<boolean> {
  // Check HTTP-only cookie or Authorization header
  const token =
    req.cookies.get("sanad_admin_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [email, timestampStr, secret] = decoded.split(":");

    if (secret !== ADMIN_SECRET) return false;

    // Verify session age (max 7 days)
    const timestamp = Number(timestampStr);
    if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return false;
    }

    const db = await getDatabase();
    return email?.toLowerCase().trim() === db.admin.email.toLowerCase().trim();
  } catch {
    return false;
  }
}
