"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  categories,
  products,
  WHATSAPP_NUMBER,
  getProductName,
  getProductBadge,
  getCategoryName,
} from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function ShopPage() {
  const { t, lang, whatsappNumber } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [productList, setProductList] = useState(products);

  // Load live products from database API so admin changes appear immediately
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch((e) => console.error("Error loading live products:", e));
  }, []);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return productList
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "all" || p.categoryId === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.descriptionEn && p.descriptionEn.toLowerCase().includes(q));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0; // featured
      });
  }, [productList, selectedCategory, searchQuery, sortBy]);

  const handleLogWhatsAppClick = (prod: (typeof products)[0]) => {
    try {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: prod.id,
          productName: prod.name,
          productImage: prod.image,
          price: prod.price,
          source: "shop_quick_order",
          notes: "Client a cliqué sur 'Commander via WhatsApp' depuis la boutique.",
        }),
      }).catch((e) => console.error("Error logging order:", e));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Navbar solid={true} />

      <main style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", paddingBottom: "120px" }}>
        {/* Page Banner */}
        <section className="page-dark-banner" data-theme="dark">
          <div className="container">
            <span className="page-banner-tag">
              {t("shop.tag")}
            </span>
            <h1 className="page-banner-title">
              {t("shop.title")}
            </h1>
            <p className="page-banner-desc">
              {t("shop.desc")}
            </p>
          </div>
        </section>

        {/* Filters & Search Bar */}
        <section style={{ padding: "clamp(24px, 5vw, 40px) 0", borderBottom: "1px solid var(--border-cream)" }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Category Pills - Mobile Swipeable Scroll */}
              <div className="shop-filter-scroll" style={{ width: "100%", maxWidth: "100%" }}>
                <button
                  onClick={() => setSelectedCategory("all")}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    backgroundColor: selectedCategory === "all" ? "var(--text-dark)" : "var(--bg-cream-card)",
                    color: selectedCategory === "all" ? "#FFFFFF" : "var(--text-dark)",
                    border: "1px solid transparent",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "var(--transition)",
                    minHeight: "38px",
                  }}
                >
                  {t("shop.all")} ({productList.length})
                </button>

                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    style={{
                      padding: "9px 18px",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      backgroundColor: selectedCategory === c.id ? "var(--text-dark)" : "var(--bg-cream-card)",
                      color: selectedCategory === c.id ? "#FFFFFF" : "var(--text-dark)",
                      border: "1px solid transparent",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      transition: "var(--transition)",
                      minHeight: "38px",
                    }}
                  >
                    {getCategoryName(c, lang)}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder={t("shop.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "11px 16px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-cream)",
                    backgroundColor: "#FFFFFF",
                    fontSize: "16px",
                    color: "var(--text-dark)",
                    flex: "1 1 200px",
                    outline: "none",
                    minHeight: "44px",
                  }}
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: "11px 16px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-cream)",
                    backgroundColor: "#FFFFFF",
                    fontSize: "16px",
                    color: "var(--text-dark)",
                    cursor: "pointer",
                    outline: "none",
                    minHeight: "44px",
                  }}
                >
                  <option value="featured">{t("shop.sortPopular")}</option>
                  <option value="price-asc">{t("shop.sortPriceAsc")}</option>
                  <option value="price-desc">{t("shop.sortPriceDesc")}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section style={{ padding: "60px 0" }}>
          <div className="container">
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                  {t("shop.notFound")} &quot;{searchQuery}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid var(--text-dark)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("shop.reset")}
                </button>
              </div>
            ) : (
              <div className="best-sellers-grid">
                {filteredProducts.map((prod) => {
                  const prodName = getProductName(prod, lang);
                  const badgeText = getProductBadge(prod, lang);
                  return (
                    <div key={prod.id} className="product-card-lumenne" id={`shop-item-${prod.id}`}>
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
                              ? `Hello SanadElec, I would like to order: ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                              : `Bonjour SanadElec, je souhaite commander : ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLogWhatsAppClick(prod)}
                          className="product-quick-order"
                        >
                          <span>💬</span> {t("shop.quickOrder")}
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
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
