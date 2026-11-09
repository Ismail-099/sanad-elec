"use client";

import Link from "next/link";
import { categories, WHATSAPP_NUMBER } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t, lang, whatsappNumber } = useLanguage();

  return (
    <footer className="footer-lumenne" id="about" data-theme="dark">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col-brand">
            <div className="footer-brand-title">SANAD ELEC</div>
            <p className="footer-brand-desc">
              {t("footer.brandDesc")}
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                lang === "en"
                  ? "Hello SanadElec, I would like to get a personalized quote."
                  : "Bonjour SanadElec, je souhaite avoir un devis personnalisé."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-wa-btn"
              id="footer-wa-btn"
            >
              <span>💬</span> {t("footer.waDirect")}
            </a>
          </div>

          {/* Links wrapper for mobile 2-col layout */}
          <div className="footer-mobile-links-row">
            {/* Categories */}
            <div className="footer-col-links">
              <div className="footer-col-title">{t("footer.categories")}</div>
              <ul className="footer-links-list">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.id}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation */}
            <div className="footer-col-links">
              <div className="footer-col-title">{t("footer.navigation")}</div>
              <ul className="footer-links-list">
                <li><Link href="/">{t("nav.home")}</Link></li>
                <li><Link href="/shop">{t("nav.shop")}</Link></li>
                <li><Link href="/new-arrivals">{t("nav.newArrivals")}</Link></li>
                <li><Link href="/collections">{t("nav.collections")}</Link></li>
                <li><Link href="/journal">{t("nav.journal")}</Link></li>
                <li><Link href="/about">{t("nav.about")}</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-col-contact">
            <div className="footer-col-title">{t("footer.contact")}</div>
            <div className="footer-contact-items-wrap">
              <div className="footer-contact-item">
                <span>📍</span> {t("footer.showroom")}
              </div>
              <div className="footer-contact-item">
                <span>📞</span> +212 6 00 00 00 00
              </div>
              <div className="footer-contact-item">
                <span>✉️</span> contact@sanadelec.ma
              </div>
              <div className="footer-contact-item footer-hours-item">
                <span>⏱️</span> {t("footer.hours")}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="footer-bottom-row">
          <p>© {year} {t("footer.copy")}</p>
          <p className="footer-bottom-sub">{t("footer.sub")}</p>
        </div>
      </div>
    </footer>
  );
}
