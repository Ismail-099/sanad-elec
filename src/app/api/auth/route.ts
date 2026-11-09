import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = await getDatabase();

    if (
      email?.toLowerCase().trim() === db.admin.email.toLowerCase().trim() &&
      password === db.admin.password
    ) {
      return NextResponse.json({
        success: true,
        user: {
          email: db.admin.email,
          role: "admin",
          store: db.settings.storeName,
        },
      });
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
