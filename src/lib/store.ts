import fs from "fs/promises";
import path from "path";
import os from "os";
import { products as initialProducts, categories as initialCategories, WHATSAPP_NUMBER as initialWa } from "./data";

export interface AdminProduct {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  priceDisplay?: string;
  image: string;
  categoryId: string;
  specs?: string[];
  specsEn?: string[];
  badge?: string;
  badgeEn?: string;
  createdAt?: string;
}

export interface AdminOrder {
  id: string;
  date: string;
  timestamp: number;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  priceFormatted: string;
  status: "whatsapp_initiated" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  source: string; // "whatsapp_button" | "manual"
}

export interface DatabaseSchema {
  admin: {
    email: string;
    password: string; // In production this would be hashed, plain/simple here for local admin
  };
  settings: {
    whatsappNumber: string;
    storeName: string;
    currency: string;
  };
  products: AdminProduct[];
  orders: AdminOrder[];
}

const LOCAL_DB_PATH = path.join(process.cwd(), "src", "data", "database.json");
const TMP_DB_PATH = path.join(os.tmpdir(), "sanad_database.json");

// In-memory cache across serverless function invocations
declare global {
  // eslint-disable-next-line no-var
  var __sanad_db_cache: DatabaseSchema | undefined;
}

// Initial mock orders to demonstrate the dashboard immediately
const initialOrders: AdminOrder[] = [
  {
    id: "CMD-2026-081",
    date: "03/11/2026 15:32",
    timestamp: Date.now() - 1000 * 60 * 45,
    productId: "astra-table-lamp",
    productName: "Astra Table Lamp",
    productImage: "/images/prod_astra_table.jpg",
    price: 229,
    priceFormatted: "229 MAD",
    status: "confirmed",
    customerName: "Karim Benjelloun",
    customerPhone: "+212 6 61 23 45 67",
    notes: "Demande de livraison sur Casablanca - Triangle d'Or",
    source: "whatsapp_button",
  },
  {
    id: "CMD-2026-080",
    date: "03/11/2026 14:15",
    timestamp: Date.now() - 1000 * 60 * 120,
    productId: "arc-floor-lamp",
    productName: "Arc Floor Lamp",
    productImage: "/images/prod_arc_floor.jpg",
    price: 399,
    priceFormatted: "399 MAD",
    status: "whatsapp_initiated",
    customerName: "Salma El Idrissi",
    customerPhone: "+212 6 62 98 76 54",
    notes: "Client a cliqué sur WhatsApp pour demander la disponibilité en stock",
    source: "whatsapp_button",
  },
  {
    id: "CMD-2026-079",
    date: "02/11/2026 18:40",
    timestamp: Date.now() - 1000 * 60 * 60 * 22,
    productId: "orbis-pendant-light",
    productName: "Orbis Pendant Light",
    productImage: "/images/prod_orbis_pendant.jpg",
    price: 349,
    priceFormatted: "349 MAD",
    status: "delivered",
    customerName: "Architecte Mehdi Tazi",
    customerPhone: "+212 6 63 11 22 33",
    notes: "Commande 3 unités pour projet de restaurant à Marrakech (Payé)",
    source: "whatsapp_button",
  },
  {
    id: "CMD-2026-078",
    date: "01/11/2026 11:10",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    productId: "lustre-cristal-premium",
    productName: "Lustre Cristal Premium",
    productImage: "/images/hero_lumenne.jpg",
    price: 4500,
    priceFormatted: "4 500 MAD",
    status: "shipped",
    customerName: "Villa Californie",
    customerPhone: "+212 6 64 55 66 77",
    notes: "Expédié par transporteur privé Sanad Elec avec installation",
    source: "whatsapp_button",
  },
];

function getDefaultData(): DatabaseSchema {
  return {
    admin: {
      email: "admin@sanadelec.ma",
      password: "admin123",
    },
    settings: {
      whatsappNumber: initialWa,
      storeName: "SANAD ELEC",
      currency: "MAD",
    },
    products: initialProducts.map((p) => ({
      ...p,
      createdAt: new Date().toISOString(),
    })),
    orders: initialOrders,
  };
}

export async function getDatabase(): Promise<DatabaseSchema> {
  if (globalThis.__sanad_db_cache) {
    return globalThis.__sanad_db_cache;
  }

  // 1. Try reading from TMP_DB_PATH (Vercel writable lambda storage)
  try {
    const rawTmp = await fs.readFile(TMP_DB_PATH, "utf-8");
    const parsed = JSON.parse(rawTmp);
    globalThis.__sanad_db_cache = parsed;
    return parsed;
  } catch {
    // TMP doesn't exist yet
  }

  // 2. Try reading from LOCAL_DB_PATH (bundled src/data/database.json)
  try {
    const rawLocal = await fs.readFile(LOCAL_DB_PATH, "utf-8");
    const parsed = JSON.parse(rawLocal);
    globalThis.__sanad_db_cache = parsed;
    return parsed;
  } catch {
    // Local DB not present or unreadable
  }

  // 3. Fallback to default initial data
  const defaultData = getDefaultData();
  globalThis.__sanad_db_cache = defaultData;

  // Best-effort write to tmp or local
  try {
    await fs.writeFile(TMP_DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
  } catch {
    // Ignore write errors in read-only setups
  }

  return defaultData;
}

export async function saveDatabase(data: DatabaseSchema): Promise<void> {
  globalThis.__sanad_db_cache = data;

  // Try writing to TMP_DB_PATH (works on Vercel and local)
  try {
    await fs.writeFile(TMP_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to tmp db:", err);
  }

  // Also try writing to local path if writable
  try {
    await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Expected on Vercel serverless read-only filesystem
  }
}

export async function getLiveProducts(): Promise<AdminProduct[]> {
  try {
    const db = await getDatabase();
    return db.products && db.products.length > 0 ? db.products : initialProducts;
  } catch {
    return initialProducts;
  }
}

export async function getLiveProductById(id: string): Promise<AdminProduct | undefined> {
  const prods = await getLiveProducts();
  return prods.find((p) => p.id === id);
}

export async function getLiveProductsByCategory(categoryId: string): Promise<AdminProduct[]> {
  const prods = await getLiveProducts();
  return prods.filter((p) => p.categoryId === categoryId);
}

export async function getLiveWhatsAppNumber(): Promise<string> {
  try {
    const db = await getDatabase();
    return db.settings?.whatsappNumber || initialWa;
  } catch {
    return initialWa;
  }
}
