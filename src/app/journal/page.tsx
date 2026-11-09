"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WHATSAPP_NUMBER } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

const articles = [
  {
    id: "sculptural-lighting-modern-living",
    title: "Light, Shaped: Comment la lampe sculpturale redéfinit l'espace de vie",
    category: "DESIGN PHILOSOPHY",
    date: "Novembre 2026",
    readTime: "4 min de lecture",
    image: "/images/hero_lumenne.jpg",
    excerpt:
      "Bien plus qu'un simple objet fonctionnel, le luminaire moderne s'impose comme une œuvre d'art tridimensionnelle. Découverte de l'alliance entre formes organiques et lumière chaude.",
  },
  {
    id: "art-of-layering-lights",
    title: "L'art de superposer la lumière : Ambiance, Accent et Fonction",
    category: "GUIDE D'INTÉRIEUR",
    date: "Octobre 2026",
    readTime: "6 min de lecture",
    image: "/images/atmosphere_dining.jpg",
    excerpt:
      "Comment créer une sensation d'intimité sans zones d'ombre agressives ? Le secret des architectes réside dans la multiplication des sources lumineuses à différentes hauteurs.",
  },
  {
    id: "kelvin-temperature-guide",
    title: "2700K vs 3000K : Pourquoi la température de couleur change vos soirées",
    category: "TECHNIQUE & BIEN-ÊTRE",
    date: "Septembre 2026",
    readTime: "5 min de lecture",
    image: "/images/atmosphere_living.jpg",
    excerpt:
      "La lumière influence directement notre rythme circadien et notre perception de l'espace. Choisir le bon blanc chaud transforme une pièce froide en sanctuaire apaisant.",
  },
  {
    id: "outdoor-architectural-illumination",
    title: "Mettre en scène son jardin et sa façade au crépuscule",
    category: "EXTÉRIEUR & PAYSAGE",
    date: "Août 2026",
    readTime: "5 min de lecture",
    image: "/images/atmosphere_bedroom.jpg",
    excerpt:
      "Projecteurs rasants, balises solaires invisibles et appliques murales étanches : les règles d'or pour un extérieur féérique dès la tombée de la nuit.",
  },
];

export default function JournalPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar solid={true} />

      <main style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh", paddingBottom: "120px" }}>
        {/* Banner */}
        <section className="page-dark-banner" data-theme="dark">
          <div className="container">
            <span className="page-banner-tag">
              {t("journal.tag")}
            </span>
            <h1 className="page-banner-title">
              {t("journal.title")}
            </h1>
            <p className="page-banner-desc">
              {t("journal.desc")}
            </p>
          </div>
        </section>

        {/* Featured First Article */}
        <section style={{ padding: "clamp(48px, 8vw, 80px) 0 clamp(36px, 6vw, 60px) 0", borderBottom: "1px solid var(--border-cream)" }}>
          <div className="container">
            <div className="journal-featured-grid">
              <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", borderRadius: "2px" }}>
                <Image
                  src={articles[0].image}
                  alt={articles[0].title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div>
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  ★ ARTICLE À LA UNE · {articles[0].category}
                </span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--text-dark)", lineHeight: 1.2, marginBottom: "16px" }}>
                  {articles[0].title}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "24px" }}>
                  {articles[0].excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                  <span>{articles[0].date}</span>
                  <span>•</span>
                  <span>{articles[0].readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Articles Grid */}
        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <div className="journal-cards-grid">
              {articles.slice(1).map((art) => (
                <div key={art.id} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", backgroundColor: "var(--bg-cream-card)", marginBottom: "20px" }}>
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                    />
                  </div>

                  <span style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "8px" }}>
                    {art.category}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 400, color: "var(--text-dark)", lineHeight: 1.3, marginBottom: "12px" }}>
                    {art.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "16px", flexGrow: 1 }}>
                    {art.excerpt}
                  </p>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.1em", borderTop: "1px solid var(--border-cream)", paddingTop: "12px" }}>
                    {art.date} • {art.readTime}
                  </div>
                </div>
              ))}
            </div>

            {/* Consultation Banner */}
            <div
              style={{
                marginTop: "100px",
                backgroundColor: "#151312",
                color: "#FFFFFF",
                padding: "60px 48px",
                textAlign: "center",
                borderRadius: "4px",
              }}
            >
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 400, marginBottom: "16px" }}>
                Un projet d&apos;architecture ou d&apos;éclairage sur mesure ?
              </h3>
              <p style={{ color: "var(--text-light-muted)", maxWidth: "540px", margin: "0 auto 32px auto", fontSize: "0.95rem", lineHeight: 1.7 }}>
                Nos ingénieurs lumière et spécialistes matériel électrique vous accompagnent pour la sélection de vos luminaires et le calcul d&apos;implantation.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour SanadElec, j'ai lu votre Journal et souhaite des conseils pour mon projet d'éclairage.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="product-detail-wa-btn"
              >
                <span>💬</span> Prendre Rendez-vous WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
