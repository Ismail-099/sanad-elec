
import { NextRequest, NextResponse } from "next/server";
import { getDatabase, saveDatabase, AdminOrder } from "@/lib/store";

export async function GET() {
  try {
    const db = await getDatabase();
    return NextResponse.json({
      success: true,
      orders: db.orders || [],
      total: db.orders?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();

    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString("fr-FR")} ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = `CMD-${now.getFullYear()}-${randomSuffix}`;

    const newOrder: AdminOrder = {
      id: orderId,
      date: dateFormatted,
      timestamp: Date.now(),
      productId: body.productId || "inconnu",
      productName: body.productName || "Commande Luminaire",
      productImage: body.productImage || "/images/hero_lumenne.jpg",
      price: Number(body.price) || 0,
      priceFormatted: body.priceFormatted || `${Number(body.price || 0).toLocaleString("fr-FR")} MAD`,
      status: "whatsapp_initiated",
      customerName: body.customerName || "Visiteur Web",
      customerPhone: body.customerPhone || "",
      notes: body.notes || "Client a cliqué sur 'Commander via WhatsApp'",
      source: body.source || "whatsapp_button",
    };

    if (!db.orders) db.orders = [];
    db.orders.unshift(newOrder);
    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: "Commande enregistrée avec succès.",
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
    const body = await req.json();
    const { id, status, notes, customerName, customerPhone } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID commande requis." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    if (!db.orders) db.orders = [];
    const index = db.orders.findIndex((o) => o.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Commande introuvable." },
        { status: 404 }
      );
    }

    if (status) db.orders[index].status = status;
    if (notes !== undefined) db.orders[index].notes = notes;
    if (customerName) db.orders[index].customerName = customerName;
    if (customerPhone) db.orders[index].customerPhone = customerPhone;

    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      order: db.orders[index],
      message: "Commande mise à jour.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID commande requis." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    if (!db.orders) db.orders = [];
    db.orders = db.orders.filter((o) => o.id !== id);
    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: "Commande supprimée.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
