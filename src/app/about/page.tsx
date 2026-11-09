"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WHATSAPP_NUMBER } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t, lang, whatsappNumber } = useLanguage();

  return (
    <>
      <Navbar solid={true} />

      <main style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", paddingBottom: "120px" }}>
        {/* Banner */}
        <section className="page-dark-banner" data-theme="dark">
          <div className="container">
            <span className="page-banner-tag">
              {t("about.tag")}
            </span>
            <h1 className="page-banner-title">
              {t("about.title")}
            </h1>
            <p className="page-banner-desc">
              {t("about.desc")}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section style={{ padding: "clamp(48px, 8vw, 80px) 0", borderBottom: "1px solid var(--border-cream)" }}>
          <div className="container">
            <div className="about-story-grid">
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  NOTRE MISSION
                </span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.85rem, 5vw, 2.8rem)", fontWeight: 400, color: "var(--text-dark)", lineHeight: 1.15, marginBottom: "20px" }}>
                  Donner une âme aux espaces grâce à la lumière.
                </h2>
                <p style={{ color: "#4A4741", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "16px" }}>
                  Chez <strong>SanadElec</strong>, nous croyons qu&apos;un luminaire ne sert pas simplement à éclairer : il sculpte les volumes, sublime les matières nobles et orchestre l&apos;atmosphère de votre quotidien.
                </p>
                <p style={{ color: "#4A4741", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "28px" }}>
                  À travers nos collections exclusives, nous marions la pureté des lignes organiques à la rigueur de l&apos;ingénierie électrique : laiton massif, verre opalin soufflé bouche, LED haute performance sans scintillement et composants certifiés NF/CE.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Link
                    href="/shop"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "14px 24px",
                      backgroundColor: "var(--text-dark)",
                      color: "#FFFFFF",
                      fontSize: "0.76rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      minHeight: "46px",
                    }}
                  >
                    <span>DÉCOUVRIR LA BOUTIQUE</span>
                    <span>→</span>
                  </Link>

                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "14px 24px",
                      border: "1px solid var(--text-dark)",
                      color: "var(--text-dark)",
                      fontSize: "0.76rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      minHeight: "46px",
                    }}
                  >
                    <span>💬 WHATSAPP DIRECT</span>
                  </a>
                </div>
              </div>

              {/* Story Visual */}
              <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", backgroundColor: "var(--bg-cream-card)", borderRadius: "4px" }}>
                <Image
                  src="/images/atmosphere_dining.jpg"
                  alt="Atelier SanadElec"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Figures */}
        <section style={{ padding: "clamp(48px, 8vw, 70px) 0", backgroundColor: "#151312", color: "#FFFFFF" }}>
          <div className="container">
            <div className="about-stats-grid">
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 7vw, 3.5rem)", color: "var(--gold)", fontWeight: 400 }}>15+</div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-light-muted)", marginTop: "6px" }}>
                  Années d&apos;expertise
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 7vw, 3.5rem)", color: "var(--gold)", fontWeight: 400 }}>10 000+</div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-light-muted)", marginTop: "6px" }}>
                  Projets illuminés
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 7vw, 3.5rem)", color: "var(--gold)", fontWeight: 400 }}>7</div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-light-muted)", marginTop: "6px" }}>
                  Pôles d&apos;expertise
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 7vw, 3.5rem)", color: "var(--gold)", fontWeight: 400 }}>100%</div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-light-muted)", marginTop: "6px" }}>
                  Normes certifiées NF/CE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values & Showroom Section */}
        <section style={{ padding: "100px 0" }}>
          <div className="container">
            <div className="section-header-row">
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  POURQUOI SANAD ELEC
                </span>
                <h2 className="section-serif-title" style={{ fontSize: "2.4rem" }}>
                  LES 3 ENGAGEMENTS
                </h2>
              </div>
            </div>

            <div className="about-values-grid">
              <div style={{ backgroundColor: "var(--bg-cream-card)", padding: "40px 32px", borderRadius: "2px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "16px" }}>✨</div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", marginBottom: "12px" }}>
                  Design Sculptural Exclusif
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  Des silhouettes intemporelles sélectionnées auprès des meilleurs ateliers pour valoriser villas, résidences et espaces commerciaux.
                </p>
              </div>

              <div style={{ backgroundColor: "var(--bg-cream-card)", padding: "40px 32px", borderRadius: "2px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⚡</div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", marginBottom: "12px" }}>
                  Sécurité Électrique Certifiée
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  Tous nos matériels, coffrets et alimentations répondent rigoureusement aux normes européennes et marocaines en vigueur.
                </p>
              </div>

              <div style={{ backgroundColor: "var(--bg-cream-card)", padding: "40px 32px", borderRadius: "2px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "16px" }}>💬</div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", marginBottom: "12px" }}>
                  Commande Rapide WhatsApp
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  Un contact direct et personnalisé avec un conseiller dédié pour vos devis, conseils d&apos;installation et suivi de livraison partout au Maroc.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
