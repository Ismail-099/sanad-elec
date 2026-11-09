"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  categories,
  templateCategories,
  WHATSAPP_NUMBER,
  getCategoryName,
  getCategoryDescription,
} from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function CollectionsPage() {
  const { t, lang, whatsappNumber } = useLanguage();

  return (
    <>
      <Navbar solid={true} />

      <main style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", paddingBottom: "120px" }}>
        {/* Banner */}
        <section className="page-dark-banner" data-theme="dark">
          <div className="container">
            <span className="page-banner-tag">
              {t("collections.tag")}
            </span>
            <h1 className="page-banner-title">
              {t("collections.title")}
            </h1>
            <p className="page-banner-desc">
              {t("collections.desc")}
            </p>
          </div>
        </section>

        {/* 1. Signature Sculptural Types */}
        <section style={{ padding: "clamp(48px, 8vw, 80px) 0 clamp(36px, 6vw, 60px) 0", borderBottom: "1px solid var(--border-cream)" }}>
          <div className="container">
            <div className="section-header-row">
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  {t("collections.shapesTag")}
                </span>
                <h2 className="section-serif-title" style={{ fontSize: "2.4rem" }}>
                  {t("collections.shapesTitle")}
                </h2>
              </div>
            </div>

            <div className="categories-strip-grid">
              {templateCategories.map((item) => {
                const stripName = lang === "en" && item.nameEn ? item.nameEn : item.name;
                return (
                  <Link key={item.id} href={item.link} className="category-strip-card">
                    <div className="category-strip-image-wrap">
                      <Image
                        src={item.image}
                        alt={stripName}
                        width={280}
                        height={280}
                        className="category-strip-image"
                      />
                    </div>
                    <div className="category-strip-title">
                      <span>{stripName}</span>
                      <span className="arrow">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. The 7 Core Categories */}
        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <div className="section-header-row">
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  {t("collections.universTag")}
                </span>
                <h2 className="section-serif-title" style={{ fontSize: "2.4rem" }}>
                  {t("collections.universTitle")}
                </h2>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  lang === "en"
                    ? "Hello SanadElec, I would like to receive the PDF catalog of the 7 universes."
                    : "Bonjour SanadElec, je souhaite recevoir le catalogue PDF des 7 catégories."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="section-view-all-link"
              >
                <span>{t("cat.whatsapp")}</span>
                <span>→</span>
              </a>
            </div>

            <div className="categories-masonry-grid">
              {categories.map((cat, idx) => {
                const catName = getCategoryName(cat, lang);
                const catDesc = getCategoryDescription(cat, lang);
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    className={`category-full-card ${idx === 0 ? "featured" : ""}`}
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
      </main>

      <Footer />
    </>
  );
}
