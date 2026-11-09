"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products, WHATSAPP_NUMBER, getProductName, getProductBadge } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function NewArrivalsPage() {
  const { t, lang, whatsappNumber } = useLanguage();
  const [allProducts, setAllProducts] = useState(products);

  const handleLogWhatsAppOrder = (prod: any, prodName: string) => {
    try {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: prod.id,
          productName: prodName,
          productImage: prod.image,
          price: prod.price,
          source: "new_arrivals_page",
          notes: "Client a cliqué sur 'Commander via WhatsApp' depuis les nouveautés.",
        }),
      }).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setAllProducts(data.products);
        }
      })
      .catch((e) => console.error("Error loading products:", e));
  }, []);

  // Select newest products and bestsellers
  const newArrivals = allProducts.filter(
    (p) => p.badge || ["astra-table-lamp", "arc-floor-lamp", "lume-wall-sconce", "orbis-pendant-light"].includes(p.id)
  );

  return (
    <>
      <Navbar solid={true} />

      <main style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", paddingBottom: "120px" }}>
        {/* Banner */}
        <section className="page-dark-banner" data-theme="dark">
          <div className="container">
            <span className="page-banner-tag">
              {t("new.tag")}
            </span>
            <h1 className="page-banner-title">
              {t("new.title")}
            </h1>
            <p className="page-banner-desc">
              {t("new.desc")}
            </p>
          </div>
        </section>

        {/* Highlight Grid */}
        <section style={{ padding: "clamp(48px, 8vw, 80px) 0" }}>
          <div className="container">
            <div className="section-header-row">
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  {t("new.subTag")}
                </span>
                <h2 className="section-serif-title" style={{ fontSize: "2.4rem" }}>
                  {t("new.subTitle")}
                </h2>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  lang === "en"
                    ? "Hello SanadElec, I would like to be informed of upcoming new arrivals."
                    : "Bonjour SanadElec, je souhaite être informé des prochaines nouveautés."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="section-view-all-link"
              >
                <span>{t("new.notifyWa")}</span>
                <span>→</span>
              </a>
            </div>

            <div className="best-sellers-grid">
              {newArrivals.map((prod) => {
                const prodName = getProductName(prod, lang);
                const badgeText = getProductBadge(prod, lang);
                return (
                  <div key={prod.id} className="product-card-lumenne" id={`new-arrival-${prod.id}`}>
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

                      <button className="product-wishlist-btn" aria-label="Favoris">
                        ♡
                      </button>

                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          lang === "en"
                            ? `Hello SanadElec, I would like to order this new arrival: ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                            : `Bonjour SanadElec, je souhaite commander la nouveauté : ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLogWhatsAppOrder(prod, prodName)}
                        className="product-quick-order"
                      >
                        <span>💬</span> {t("bestsellers.orderWa")}
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
