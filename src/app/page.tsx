"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  categories,
  products,
  templateCategories,
  WHATSAPP_NUMBER,
  getProductName,
  getProductBadge,
  getCategoryName,
  getCategoryDescription,
} from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, lang, whatsappNumber } = useLanguage();
  const [liveProducts, setLiveProducts] = useState(products);

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
          source: "homepage_bestsellers",
          notes: "Client a cliqué sur 'Commander via WhatsApp' depuis l'accueil.",
        }),
      }).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setLiveProducts(data.products);
        }
      })
      .catch((e) => console.error("Error loading live products:", e));
  }, []);

  // Filter bestsellers (first 4 products match the template)
  const bestSellers = liveProducts.slice(0, 4);

  return (
    <>
      <Navbar />

      <main>
        {/* ========================================================
            HERO SECTION: LIGHT, SHAPED
        ======================================================== */}
        <section className="hero-lumenne" id="hero" data-theme="dark">
          {/* Background Image & Overlay */}
          <Image
            src="/images/hero_lumenne.jpg"
            alt="Sanad Elec Sculptural Lighting Living Room"
            fill
            priority
            className="hero-bg-image"
          />
          <div className="hero-overlay" />

          {/* Main Hero Content */}
          <div className="hero-content">
            <p className="hero-tagline" style={{ whiteSpace: "pre-line" }}>
              {t("hero.tagline")}
            </p>

            <h1 className="hero-title">
              <span>{t("hero.title1")}</span>
              <span>{t("hero.title2")}</span>
            </h1>

            <p className="hero-subtitle">
              {t("hero.subtitle")}
            </p>

            <Link href="#all-categories" className="hero-cta-btn" id="hero-explore-btn">
              <span>{t("hero.explore")}</span>
              <span className="arrow">→</span>
            </Link>
          </div>

          {/* Hero Bottom Bar */}
          <div className="hero-bottom-bar">
            {/* Slider Controls */}
            <div className="hero-slider-pagination">
              <span className="active">01</span>
              <span className="hero-slider-dash"></span>
              <span>02</span>
              <span>03</span>
            </div>

            {/* Micro Quote */}
            <div className="hero-quote-micro">
              <p style={{ maxWidth: "220px", lineHeight: 1.4 }}>
                {t("hero.quote")}
              </p>
              <div className="line"></div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ALL 7 SANAD ELEC CATEGORIES SECTION (LES 7 UNIVERS)
        ======================================================== */}
        <section className="section-all-categories" id="all-categories">
          <div className="container">
            <div className="section-header-row">
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  {t("cat.tag")}
                </span>
                <h2 className="section-serif-title">{t("cat.title")}</h2>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  lang === "en"
                    ? "Hello SanadElec, I would like to receive the complete catalog."
                    : "Bonjour SanadElec, je souhaite recevoir le catalogue complet."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="section-view-all-link"
              >
                <span>{t("cat.whatsapp")}</span>
                <span>→</span>
              </a>
            </div>

            {/* Masonry / Cards Grid for the 7 categories */}
            <div className="categories-masonry-grid">
              {categories.map((cat, idx) => {
                const catName = getCategoryName(cat, lang);
                const catDesc = getCategoryDescription(cat, lang);
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    className={`category-full-card ${idx === 0 ? "featured" : ""}`}
                    id={`cat-card-${cat.id}`}
                  >
                    <Image
                      src={cat.image}
                      alt={catName}
                      fill
                      className="category-full-bg"
                    />
                    <div className="category-full-overlay" />

                    <div className="category-full-content">
                      <span className="category-full-badge">{cat.productCount} {t("cat.references")}</span>
                      <h3 className="category-full-title">{catName}</h3>
                      <p className="category-full-desc">{catDesc}</p>
                      <div className="category-full-link">
                        <span>{t("cat.discover")}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            CATEGORIES STRIP (Table Lamps, Floor, Sconces, Pendant)
        ======================================================== */}
        <section className="section-categories-strip" id="categories">
          <div className="container">
            <div className="categories-strip-grid">
              {templateCategories.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="category-strip-card"
                  id={`cat-strip-${item.id}`}
                >
                  <div className="category-strip-image-wrap">
                    <Image
                      src={item.image}
                      alt={lang === "en" && item.nameEn ? item.nameEn : item.name}
                      width={280}
                      height={280}
                      className="category-strip-image"
                    />
                  </div>
                  <div className="category-strip-title">
                    <span>{lang === "en" && item.nameEn ? item.nameEn : item.name}</span>
                    <span className="arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            ATMOSPHERE LIVES HERE SECTION
        ======================================================== */}
        <section className="section-atmosphere" id="atmosphere" data-theme="dark">
          <div className="container">
            <div className="atmosphere-grid">
              {/* Left Column */}
              <div className="atmosphere-left">
                <span className="atmosphere-overline">{t("atmosphere.overline")}</span>
                <h2 className="atmosphere-title">
                  <span>{t("atmosphere.title1")}</span>
                  <span>{t("atmosphere.title2")}</span>
                </h2>
                <p className="atmosphere-desc">
                  {t("atmosphere.desc")}
                </p>
                <Link href="#bestsellers" className="atmosphere-cta-btn" id="atmosphere-explore-btn">
                  <span>{t("atmosphere.cta")}</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Right Collage */}
              <div className="atmosphere-collage">
                {/* Main Large Image: Dining table with sculpted lamps */}
                <div className="collage-item-main">
                  <Image
                    src="/images/atmosphere_dining.jpg"
                    alt="Dining Room Warm Lighting"
                    fill
                    className="collage-img"
                  />
                </div>

                {/* Top Right: Living room boucle chair & lamp */}
                <div className="collage-item-top">
                  <Image
                    src="/images/atmosphere_living.jpg"
                    alt="Living Room Armchair Ambient Light"
                    fill
                    className="collage-img"
                  />
                </div>

                {/* Bottom Right: Bedroom sconce & quote */}
                <div className="collage-item-bottom">
                  <div className="collage-item-bottom-img">
                    <Image
                      src="/images/atmosphere_bedroom.jpg"
                      alt="Bedroom Wall Sconce"
                      fill
                      className="collage-img"
                    />
                  </div>

                  <div className="atmosphere-micro-quote">
                    <p style={{ maxWidth: "180px", lineHeight: 1.35 }}>
                      {t("atmosphere.quote")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            MARQUEE STRIP
        ======================================================== */}
        <div className="marquee-strip" id="marquee" data-theme="dark" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="marquee-item">
                SANAD ELEC <span className="marquee-star">★</span> {lang === "en" ? "SCULPTURAL LIGHTING" : "LUMINAIRES D'EXCEPTION"}
                <span className="marquee-star">★</span> {lang === "en" ? "HIGH-END ILLUMINATION" : "ÉCLAIRAGE HAUT DE GAMME"}
                <span className="marquee-star">★</span> {lang === "en" ? "MODERN LIVING" : "ESPACES DE VIE MODERNES"}
                <span className="marquee-star">★</span> {lang === "en" ? "INNOVATION & STYLE" : "INNOVATION & STYLE"}
              </span>
            ))}
          </div>
        </div>

        {/* ========================================================
            BEST SELLERS SECTION (EXACTLY ON TOP OF FOOTER)
        ======================================================== */}
        <section className="section-best-sellers" id="bestsellers">
          <div className="container">
            {/* Header Row */}
            <div className="section-header-row">
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  {t("bestsellers.tag")}
                </span>
                <h2 className="section-serif-title">{t("bestsellers.title")}</h2>
              </div>
              <Link href="/shop" className="section-view-all-link">
                <span>{t("bestsellers.viewAll")}</span>
                <span>→</span>
              </Link>
            </div>

            {/* 4 Cards Grid */}
            <div className="best-sellers-grid">
              {bestSellers.map((prod) => {
                const prodName = getProductName(prod, lang);
                const badgeText = getProductBadge(prod, lang);
                return (
                  <div key={prod.id} className="product-card-lumenne" id={`product-${prod.id}`}>
                    {/* Media */}
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

                      {/* Wishlist Heart */}
                      <button
                        className="product-wishlist-btn"
                        aria-label="Ajouter aux favoris"
                        title="Ajouter aux favoris"
                      >
                        ♡
                      </button>

                      {/* Quick WhatsApp Command Hover */}
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          lang === "en"
                            ? `Hello SanadElec, I would like to order: ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                            : `Bonjour SanadElec, je souhaite commander : ${prodName} (${prod.priceDisplay || prod.price + " MAD"})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLogWhatsAppOrder(prod, prodName)}
                        className="product-quick-order"
                      >
                        <span>💬</span> {t("bestsellers.orderWa")}
                      </a>
                    </div>

                    {/* Info */}
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
