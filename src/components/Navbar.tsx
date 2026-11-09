"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { categories } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

interface NavbarProps {
  solid?: boolean;
}

export default function Navbar({ solid }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isLightPage = pathname.startsWith("/product") || pathname.startsWith("/category");
  const { lang, setLang, t } = useLanguage();

  // Dynamic navbar theme based on scroll position and active page section:
  // - "transparent-white": At top of dark hero/banner (pure transparent, white text)
  // - "frosted-cream": When scrolling over light/cream page sections (background matches page, dark text)
  // - "frosted-dark": When scrolling over dark sections like Atmosphere, marquee, footer, or dark banner
  const [theme, setTheme] = useState<"transparent-white" | "frosted-cream" | "frosted-dark">(
    isLightPage ? "frosted-cream" : "transparent-white"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);

  // Handle safe back navigation
  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const updateNavbarTheme = () => {
      const scrollY = window.scrollY;

      // 1. Pages with solid cream background throughout (Product details, Category pages)
      if (isLightPage) {
        const footerEl = document.querySelector("footer, .footer-lumenne, #about");
        if (footerEl) {
          const rect = footerEl.getBoundingClientRect();
          if (rect.top <= 55) {
            setTheme("frosted-dark");
            return;
          }
        }
        setTheme("frosted-cream");
        return;
      }

      // 2. Query all dark-background elements across the page
      const darkElements = document.querySelectorAll(
        '#hero, .hero-lumenne, #atmosphere, .section-atmosphere, .marquee-strip, [data-theme="dark"], .page-dark-banner, footer, .footer-lumenne'
      );

      let isOverDark = false;
      const sampleY = 50; // Vertical sample line matching the center of the navbar

      for (let i = 0; i < darkElements.length; i++) {
        const rect = darkElements[i].getBoundingClientRect();
        if (rect.top <= sampleY && rect.bottom > sampleY) {
          isOverDark = true;
          break;
        }
      }

      if (isOverDark) {
        // At the very top of dark hero or dark banner -> pure clean transparent
        if (scrollY < 20) {
          setTheme("transparent-white");
        } else {
          // Scrolling inside dark section -> frosted dark luxury background
          setTheme("frosted-dark");
        }
      } else {
        // Over light/cream page content -> seamlessly matches the page cream background!
        setTheme("frosted-cream");
      }
    };

    updateNavbarTheme();
    window.addEventListener("scroll", updateNavbarTheme, { passive: true });
    window.addEventListener("resize", updateNavbarTheme);
    return () => {
      window.removeEventListener("scroll", updateNavbarTheme);
      window.removeEventListener("resize", updateNavbarTheme);
    };
  }, [pathname, isLightPage]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`navbar-lumenne theme-${theme}`}
        id="main-navbar"
      >
        {/* Brand Area with Logo */}
        <div className="nav-brand-area">
          <Link href="/" className="nav-logo" id="nav-brand-logo">
            SANAD ELEC
          </Link>
        </div>

        {/* Center Nav Links - Single Dedicated Pages */}
        <ul className="nav-links">
          {/* 0. ACCUEIL */}
          <li>
            <Link
              href="/"
              className={`nav-link-item ${isHome ? "active" : ""}`}
              id="nav-link-home"
            >
              {t("nav.home")}
            </Link>
          </li>

          {/* 1. SHOP */}
          <li>
            <Link
              href="/shop"
              className={`nav-link-item ${pathname === "/shop" ? "active" : ""}`}
              id="nav-link-shop"
            >
              {t("nav.shop")}
            </Link>
          </li>

          {/* 2. NEW ARRIVALS */}
          <li>
            <Link
              href="/new-arrivals"
              className={`nav-link-item ${pathname === "/new-arrivals" ? "active" : ""}`}
              id="nav-link-new-arrivals"
            >
              {t("nav.newArrivals")}
            </Link>
          </li>

          {/* 3. COLLECTIONS */}
          <li
            onMouseEnter={() => setCollectionsDropdown(true)}
            onMouseLeave={() => setCollectionsDropdown(false)}
            style={{ position: "relative" }}
          >
            <Link
              href="/collections"
              className={`nav-link-item ${pathname === "/collections" || pathname.startsWith("/category") ? "active" : ""}`}
              id="nav-link-collections"
            >
              {t("nav.collections")} <span className="nav-caret">⌄</span>
            </Link>

            {collectionsDropdown && (
              <div className="nav-dropdown-menu">
                <Link href="/collections" className="nav-dropdown-item" onClick={() => setCollectionsDropdown(false)}>
                  {t("nav.allCollections")}
                </Link>
                {categories.map((c) => (
                  <Link key={c.id} href={`/category/${c.id}`} className="nav-dropdown-item" onClick={() => setCollectionsDropdown(false)}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* 4. JOURNAL */}
          <li>
            <Link
              href="/journal"
              className={`nav-link-item ${pathname === "/journal" ? "active" : ""}`}
              id="nav-link-journal"
            >
              {t("nav.journal")}
            </Link>
          </li>

          {/* 5. ABOUT */}
          <li>
            <Link
              href="/about"
              className={`nav-link-item ${pathname === "/about" ? "active" : ""}`}
              id="nav-link-about"
            >
              {t("nav.about")}
            </Link>
          </li>
        </ul>

        {/* Right Action Icons */}
        <div className="nav-actions">
          {/* Search to Shop */}
          <Link href="/shop" className="nav-action-btn" aria-label={t("nav.search")} title={t("nav.search")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>

          {/* Account */}
          <Link href="/about" className="nav-action-btn nav-btn-hide-mobile" aria-label={t("nav.account")} title={t("nav.account")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* French & English Switcher (replaces wallet/bag icon) */}
          <div className="nav-lang-switcher" id="nav-lang-switcher" aria-label="Sélecteur de langue / Language Switcher">
            <button
              type="button"
              className={`nav-lang-btn ${lang === "fr" ? "active" : ""}`}
              onClick={() => setLang("fr")}
              title="Français"
              aria-label="Passer en français"
            >
              FR
            </button>
            <span className="nav-lang-sep">|</span>
            <button
              type="button"
              className={`nav-lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
              title="English"
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Mobile Burger Toggle */}
          <button
            className="navbar-burger"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            id="mobile-menu-burger"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Fleche Retour Positioned Directly Under the Navbar */}
      {!isHome && (
        <aside
          className={`subnav-back-bar theme-${theme}`}
          id="subnav-back-bar"
          aria-label="Navigation retour"
        >
          <button
            type="button"
            onClick={handleGoBack}
            className="subnav-back-btn"
            aria-label={t("nav.back")}
            title={t("nav.back")}
            id="subnav-back-button"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="subnav-back-arrow"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            <span className="subnav-back-text">{t("nav.back")}</span>
          </button>
        </aside>
      )}

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`} id="mobile-nav-drawer">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", letterSpacing: "0.2em", color: "#FFF" }}>
            SANAD ELEC
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        {/* Mobile Language Switcher */}
        <div className="mobile-drawer-lang-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 16px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "16px" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light-muted)" }}>
            Langue / Language :
          </span>
          <div className="nav-lang-switcher" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}>
            <button
              type="button"
              className={`nav-lang-btn ${lang === "fr" ? "active" : ""}`}
              onClick={() => setLang("fr")}
            >
              FR
            </button>
            <span className="nav-lang-sep">|</span>
            <button
              type="button"
              className={`nav-lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Link
            href="/"
            className={`mobile-nav-link ${isHome ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
            id="mobile-nav-link-home"
          >
            <span>{t("nav.home")}</span>
            <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{t("nav.mobileHome")}</span>
          </Link>
          <Link href="/shop" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            <span>{t("nav.shop")}</span>
            <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{t("nav.mobileShop")}</span>
          </Link>
          <Link href="/new-arrivals" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            <span>{t("nav.newArrivals")}</span>
            <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{t("nav.mobileNew")}</span>
          </Link>
          <Link href="/collections" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            <span>{t("nav.collections")}</span>
            <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{t("nav.mobileCollections")}</span>
          </Link>
          <Link href="/journal" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            <span>{t("nav.journal")}</span>
            <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{t("nav.mobileJournal")}</span>
          </Link>
          <Link href="/about" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            <span>{t("nav.about")}</span>
            <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{t("nav.mobileAbout")}</span>
          </Link>
        </nav>

        {/* Bottom Drawer Info */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-light-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {t("nav.tagline")}
          </p>
        </div>
      </div>
    </>
  );
}
