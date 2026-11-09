import { NextRequest, NextResponse } from "next/server";
import { getDatabase, saveDatabase, AdminProduct } from "@/lib/store";

export async function GET() {
  try {
    const db = await getDatabase();
    return NextResponse.json({
      success: true,
      products: db.products,
      total: db.products.length,
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

    // Generate unique ID
    const baseSlug = (body.name || "nouveau-produit")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    let id = baseSlug;
    let counter = 1;
    while (db.products.some((p) => p.id === id)) {
      id = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProduct: AdminProduct = {
      id,
      name: body.name || "Nouveau Produit",
      nameEn: body.nameEn || undefined,
      description: body.description || "",
      descriptionEn: body.descriptionEn || undefined,
      price: Number(body.price) || 0,
      priceDisplay: body.priceDisplay || `${Number(body.price).toLocaleString("fr-FR")} MAD`,
      image: body.image || "/images/hero_lumenne.jpg",
      categoryId: body.categoryId || "eclairage-interieur",
      badge: body.badge || "",
      badgeEn: body.badgeEn || undefined,
      specs: Array.isArray(body.specs) ? body.specs : [],
      specsEn: Array.isArray(body.specsEn) ? body.specsEn : undefined,
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Produit ajouté avec succès.",
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID produit manquant." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Produit non trouvé." },
        { status: 404 }
      );
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
      if (!updates.priceDisplay) {
        updates.priceDisplay = `${updates.price.toLocaleString("fr-FR")} MAD`;
      }
    }

    db.products[index] = {
      ...db.products[index],
      ...updates,
    };

    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      product: db.products[index],
      message: "Produit mis à jour avec succès.",
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
        { success: false, message: "ID produit requis." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);

    if (db.products.length === initialLen) {
      return NextResponse.json(
        { success: false, message: "Produit introuvable." },
        { status: 404 }
      );
    }

    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: "Produit supprimé avec succès.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
