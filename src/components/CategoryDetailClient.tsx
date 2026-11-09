"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Category,
  Product,
  WHATSAPP_NUMBER,
  getProductName,
  getProductBadge,
  getCategoryName,
  getCategoryDescription,
} from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryDetailClientProps {
  category: Category;
  catProducts: Product[];
}

export default function CategoryDetailClient({
  category,
  catProducts,
}: CategoryDetailClientProps) {
  const { t, lang, whatsappNumber } = useLanguage();

  const isEn = lang === "en";
  const catName = getCategoryName(category, lang);
  const catDescription = getCategoryDescription(category, lang);

  const handleLogOrder = (prod: Product, prodName: string) => {
    try {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: prod.id,
          productName: prodName,
          productImage: prod.image,
          price: prod.price,
          source: "category_page",
          notes: `Commande WhatsApp initiée depuis la catégorie ${catName}`,
        }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <main style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", paddingTop: "clamp(95px, 13vw, 135px)", paddingBottom: "clamp(50px, 8vw, 90px)" }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "0.76rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "24px", lineHeight: 1.4 }}>
          <Link href="/" style={{ color: "var(--text-muted)" }}>{t("nav.home")}</Link>
          <span>/</span>
          <span style={{ color: "var(--text-dark)", fontWeight: 600 }}>{catName}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "clamp(30px, 6vw, 48px)" }}>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
            {isEn ? "SANAD ELEC COLLECTION" : "COLLECTION SANAD ELEC"}
          </span>
          <h1 className="section-serif-title" style={{ marginBottom: "12px", fontSize: "clamp(1.85rem, 6.5vw, 3rem)" }}>
            {catName}
          </h1>
          <p style={{ maxWidth: "580px", color: "var(--text-muted)", fontSize: "clamp(0.92rem, 3.4vw, 1.02rem)", lineHeight: 1.65 }}>
            {catDescription}
          </p>
        </div>

        {/* Products Grid */}
        <div className="best-sellers-grid">
          {catProducts.map((prod) => {
            const prodName = getProductName(prod, lang);
            const badgeText = getProductBadge(prod, lang);
            return (
              <div key={prod.id} className="product-card-lumenne" id={`product-${prod.id}`}>
                <div className="product-card-media">
                  <Link href={`/product/${prod.id}`}>
                    <Image
                      src={prod.image}
                      alt={prodName}
                      width={400}
                      height={400}
                      className="product-card-img"
                    />
                  </Link>

                  {badgeText && (
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        backgroundColor: "rgba(21, 19, 18, 0.85)",
                        backdropFilter: "blur(4px)",
                        color: "var(--gold)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        padding: "6px 12px",
                        borderRadius: "2px",
                        fontWeight: 600,
                      }}
                    >
                      {badgeText}
                    </div>
                  )}

                  <button
                    className="product-wishlist-btn"
                    aria-label="Ajouter aux favoris"
                  >
                    ♡
                  </button>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      isEn
                        ? `Hello SanadElec, I would like to order: ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                        : `Bonjour SanadElec, je souhaite commander : ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLogOrder(prod, prodName)}
                    className="product-quick-order"
                  >
                    <span>💬</span> {isEn ? "Order via WhatsApp" : "Commander via WhatsApp"}
                  </a>
                </div>

                <Link href={`/product/${prod.id}`}>
                  <h3 className="product-card-title">{prodName}</h3>
                </Link>
                <p className="product-card-price">
                  {prod.priceDisplay || `${prod.price} MAD`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Back Link */}
        <div style={{ marginTop: "64px", textAlign: "center" }}>
          <Link
            href="/collections"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "14px 28px",
              border: "1px solid var(--text-dark)",
              color: "var(--text-dark)",
            }}
          >
            <span>←</span>
            <span>{isEn ? "BACK TO ALL COLLECTIONS" : "RETOUR À TOUTES LES COLLECTIONS"}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
