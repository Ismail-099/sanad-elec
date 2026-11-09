"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Product,
  Category,
  WHATSAPP_NUMBER,
  getProductName,
  getProductDescription,
  getProductSpecs,
  getProductBadge,
  getCategoryName,
} from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";

interface ProductDetailClientProps {
  product: Product;
  category?: Category;
  related: Product[];
}

export default function ProductDetailClient({
  product,
  category,
  related,
}: ProductDetailClientProps) {
  const { t, lang, whatsappNumber } = useLanguage();

  const productName = getProductName(product, lang);
  const productDescription = getProductDescription(product, lang);
  const productSpecs = getProductSpecs(product, lang);
  const productBadge = getProductBadge(product, lang);
  const categoryName = category ? getCategoryName(category, lang) : undefined;

  const isEn = lang === "en";

  return (
    <main className="product-detail-section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="product-breadcrumb">
          <Link href="/">{t("nav.home")}</Link>
          {category && (
            <>
              <span> / </span>
              <Link href={`/category/${category.id}`}>{categoryName}</Link>
            </>
          )}
          <span> / </span>
          <span style={{ color: "var(--text-dark)", fontWeight: 600 }}>{productName}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="product-detail-grid">
          {/* Gallery Media */}
          <div className="product-gallery-box">
            <Image
              src={product.image}
              alt={productName}
              fill
              priority
              className="product-gallery-img"
            />
          </div>

          {/* Info & WhatsApp CTA */}
          <div className="product-info-panel">
            {productBadge && (
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "8px" }}>
                ★ {productBadge}
              </span>
            )}

            <h1 className="product-detail-title">{productName}</h1>
            <div className="product-detail-price">
              {product.priceDisplay || `${product.price.toLocaleString(isEn ? "en-US" : "fr-FR")} MAD`}
            </div>

            <p className="product-detail-desc">{productDescription}</p>

            {/* Technical Specifications */}
            {productSpecs && productSpecs.length > 0 && (
              <div className="product-specs-card">
                <div className="product-specs-title">
                  {isEn ? "Technical Specifications" : "Caractéristiques Techniques"}
                </div>
                <ul className="product-specs-list">
                  {productSpecs.map((spec, i) => (
                    <li key={i}>
                      <span style={{ color: "var(--gold)" }}>◆</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Direct WhatsApp Action Button (Logs lead into Admin Dashboard) */}
            <WhatsAppOrderButton
              productId={product.id}
              productName={productName}
              productPrice={product.price}
              productImage={product.image}
              waNumber={whatsappNumber}
            >
              <span>💬</span> {isEn ? "Order via WhatsApp" : "Commander via WhatsApp"}
            </WhatsAppOrderButton>

            {/* Trust Badges */}
            <div
              className="product-trust-badges-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid var(--border-cream)",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--text-dark)", display: "block", marginBottom: "2px" }}>
                  {isEn ? "🚚 Fast Delivery" : "🚚 Livraison Rapide"}
                </strong>
                {isEn ? "Everywhere in Morocco with tracking" : "Partout au Maroc avec suivi"}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--text-dark)", display: "block", marginBottom: "2px" }}>
                  {isEn ? "🛡️ Certified Quality" : "🛡️ Garantie & Qualité"}
                </strong>
                {isEn ? "Tested to safety standards" : "Normes de sécurité certifiées"}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: "clamp(50px, 8vw, 100px)" }}>
            <div className="section-header-row">
              <h2 className="section-serif-title" style={{ fontSize: "2rem" }}>
                {isEn ? "YOU MAY ALSO LIKE" : "VOUS AIMEREZ AUSSI"}
              </h2>
              {category && (
                <Link href={`/category/${category.id}`} className="section-view-all-link">
                  <span>{isEn ? "VIEW CATEGORY" : "VOIR LA CATÉGORIE"}</span>
                  <span>→</span>
                </Link>
              )}
            </div>

            <div className="best-sellers-grid">
              {related.map((prod) => {
                const relName = getProductName(prod, lang);
                return (
                  <div key={prod.id} className="product-card-lumenne">
                    <div className="product-card-media">
                      <Link href={`/product/${prod.id}`}>
                        <Image
                          src={prod.image}
                          alt={relName}
                          width={400}
                          height={400}
                          className="product-card-img"
                        />
                      </Link>
                      <button className="product-wishlist-btn" aria-label="Favoris">♡</button>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          isEn
                            ? `Hello SanadElec, I would like to order: ${relName} (${prod.priceDisplay || prod.price + " MAD"})`
                            : `Bonjour SanadElec, je souhaite commander : ${relName} (${prod.priceDisplay || prod.price + " MAD"})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-quick-order"
                      >
                        <span>💬</span> {isEn ? "Order via WhatsApp" : "Commander WhatsApp"}
                      </a>
                    </div>
                    <Link href={`/product/${prod.id}`}>
                      <h3 className="product-card-title">{relName}</h3>
                    </Link>
                    <p className="product-card-price">
                      {prod.priceDisplay || `${prod.price} MAD`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
