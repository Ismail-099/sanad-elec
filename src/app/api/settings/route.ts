import { NextRequest, NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/store";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const db = await getDatabase();
    return NextResponse.json({
      success: true,
      settings: {
        whatsappNumber: db.settings.whatsappNumber,
        storeName: db.settings.storeName,
        adminEmail: db.admin.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await verifyAdminSession(req))) {
      return NextResponse.json(
        { success: false, message: "Accès refusé. Authentification requise." },
        { status: 401 }
      );
    }

    const { whatsappNumber, newPassword, currentPassword } = await req.json();
    const db = await getDatabase();

    if (newPassword) {
      if (currentPassword !== db.admin.password) {
        return NextResponse.json(
          { success: false, message: "Mot de passe actuel incorrect." },
          { status: 400 }
        );
      }
      db.admin.password = newPassword;
    }

    if (whatsappNumber) {
      db.settings.whatsappNumber = whatsappNumber.replace(/[^0-9]/g, "");
    }

    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: "Paramètres mis à jour avec succès.",
      settings: {
        whatsappNumber: db.settings.whatsappNumber,
        storeName: db.settings.storeName,
        adminEmail: db.admin.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
