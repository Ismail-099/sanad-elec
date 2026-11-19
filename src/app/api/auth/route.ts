import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/store";
import { generateAdminToken, verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const isValid = await verifyAdminSession(req);
    return NextResponse.json({
      authenticated: isValid,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = await getDatabase();

    const matchesEmail =
      email?.toLowerCase().trim() === db.admin.email.toLowerCase().trim();
    const matchesPassword = password === db.admin.password;

    if (matchesEmail && matchesPassword) {
      const token = generateAdminToken(db.admin.email);

      const response = NextResponse.json({
        success: true,
        token,
        user: {
          email: db.admin.email,
          role: "admin",
          store: db.settings.storeName,
        },
      });

      // Secure HTTP-Only Cookie
      response.cookies.set("sanad_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Email ou mot de passe incorrect." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Erreur de connexion" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Déconnexion réussie.",
  });

  // Clear session cookie
  response.cookies.delete("sanad_admin_token");
  return response;
}
