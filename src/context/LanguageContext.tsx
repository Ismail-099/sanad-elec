"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "fr" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  whatsappNumber: string;
}

const translations: Record<string, { fr: string; en: string }> = {
  // --- Navbar ---
  "nav.back": { fr: "Retour", en: "Back" },
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.shop": { fr: "Boutique", en: "Shop" },
  "nav.newArrivals": { fr: "Nouveautés", en: "New Arrivals" },
  "nav.collections": { fr: "Collections", en: "Collections" },
  "nav.allCollections": { fr: "Toutes les collections", en: "All Collections" },
  "nav.journal": { fr: "Journal", en: "Journal" },
  "nav.about": { fr: "À Propos", en: "About" },
  "nav.search": { fr: "Rechercher", en: "Search" },
  "nav.account": { fr: "À Propos & Contact", en: "About & Contact" },
  "nav.tagline": { fr: "Luminaires & Électricité Haut de Gamme", en: "High-End Lighting & Electrical Solutions" },
  "nav.mobileHome": { fr: "Page principale →", en: "Main page →" },
  "nav.mobileShop": { fr: "Tous les luminaires →", en: "All lighting fixtures →" },
  "nav.mobileNew": { fr: "Nouveautés →", en: "New releases →" },
  "nav.mobileCollections": { fr: "Les 7 Univers →", en: "The 7 Universes →" },
  "nav.mobileJournal": { fr: "Design & Conseils →", en: "Design & Ideas →" },
  "nav.mobileAbout": { fr: "La Maison SanadElec →", en: "The House of SanadElec →" },

  // --- Hero Section ---
  "hero.tagline": {
    fr: "LUMINAIRES SCULPTURAUX\nPOUR ESPACES MODERNES",
    en: "SCULPTURAL LIGHTING\nFOR MODERN LIVING",
  },
  "hero.title1": { fr: "LA LUMIÈRE,", en: "LIGHT," },
  "hero.title2": { fr: "SCULPTÉE", en: "SHAPED" },
  "hero.subtitle": {
    fr: "Bien plus qu'un éclairage. Une signature d'exception pour vos espaces de vie.",
    en: "More than illumination. A statement for the spaces you live in.",
  },
  "hero.explore": { fr: "EXPLORER LA COLLECTION", en: "EXPLORE COLLECTION" },
  "hero.quote": {
    fr: "LES ESPACES SE TRANSFORMENT SOUS UNE MEILLEURE LUMIÈRE",
    en: "SPACES FEEL DIFFERENT IN BETTER LIGHT",
  },

  // --- Categories Section ---
  "cat.tag": { fr: "CATALOGUE SANAD ELEC", en: "SANAD ELEC CATALOG" },
  "cat.title": { fr: "LES 7 UNIVERS", en: "THE 7 UNIVERSES" },
  "cat.whatsapp": { fr: "DEMANDER CATALOGUE WHATSAPP", en: "REQUEST WHATSAPP CATALOG" },
  "cat.references": { fr: "RÉFÉRENCES", en: "ITEMS" },
  "cat.discover": { fr: "DÉCOUVRIR LA SÉLECTION", en: "DISCOVER SELECTION" },

  // --- Atmosphere Section ---
  "atmosphere.overline": { fr: "INSPIRATION", en: "INSPIRE" },
  "atmosphere.title1": { fr: "L'ATMOSPHÈRE", en: "ATMOSPHERE" },
  "atmosphere.title2": { fr: "NAÎT ICI", en: "LIVES HERE" },
  "atmosphere.desc": {
    fr: "Des intérieurs d'exception. Des soirées apaisées. Découvrez la métamorphose de la lumière.",
    en: "Real homes. Softer evenings. Discover how light transforms everyday moments.",
  },
  "atmosphere.cta": { fr: "DÉCOUVRIR LES PIÈCES", en: "DISCOVER THE PIECES" },
  "atmosphere.quote": {
    fr: "DES ESPACES RAFFINÉS UNE LUMIÈRE SUBLIMÉE",
    en: "BEAUTIFUL SPACES BRIGHTER PEOPLE",
  },

  // --- Best Sellers Section ---
  "bestsellers.tag": { fr: "SÉLECTION EXCLUSIVE", en: "EXCLUSIVE SELECTION" },
  "bestsellers.title": { fr: "MEILLEURES VENTES", en: "BEST SELLERS" },
  "bestsellers.viewAll": { fr: "VOIR TOUTE LA BOUTIQUE", en: "VIEW FULL SHOP" },
  "bestsellers.orderWa": { fr: "Commander via WhatsApp", en: "Order via WhatsApp" },

  // --- Shop Page ---
  "shop.tag": { fr: "BOUTIQUE SANAD ELEC", en: "SANAD ELEC SHOP" },
  "shop.title": { fr: "TOUS LES LUMINAIRES", en: "SHOP ALL LIGHTING" },
  "shop.desc": {
    fr: "Découvrez notre collection complète de luminaires sculpturaux, systèmes LED, éclairage architectural et appareillages électriques haute qualité.",
    en: "Explore our complete collection of sculptural lighting, LED systems, architectural illumination, and premium electrical equipment.",
  },
  "shop.all": { fr: "Tous", en: "All" },
  "shop.searchPlaceholder": { fr: "Rechercher un luminaire...", en: "Search for lighting..." },
  "shop.sortPopular": { fr: "Populaires", en: "Featured" },
  "shop.sortPriceAsc": { fr: "Prix : Croissant", en: "Price: Low to High" },
  "shop.sortPriceDesc": { fr: "Prix : Décroissant", en: "Price: High to Low" },
  "shop.notFound": { fr: "Aucun luminaire trouvé pour", en: "No lighting found for" },
  "shop.reset": { fr: "Réinitialiser les filtres", en: "Reset filters" },
  "shop.quickOrder": { fr: "Commander via WhatsApp", en: "Order via WhatsApp" },

  // --- Collections Page ---
  "collections.tag": { fr: "PANORAMA DES UNIVERS", en: "OVERVIEW OF UNIVERSES" },
  "collections.title": { fr: "COLLECTIONS", en: "COLLECTIONS" },
  "collections.desc": {
    fr: "Explorez nos collections curatées : de l'éclairage d'ambiance d'intérieur jusqu'aux solutions de distribution électrique et domotique connectée.",
    en: "Explore our curated collections: from ambient interior lighting to electrical distribution and connected smart home solutions.",
  },
  "collections.shapesTag": { fr: "FORMES & SILHOUETTES", en: "SHAPES & SILHOUETTES" },
  "collections.shapesTitle": { fr: "LUMINAIRES SIGNATURE", en: "SIGNATURE LIGHTING" },
  "collections.universTag": { fr: "TOUS NOS DOMAINES D'EXPERTISE", en: "ALL AREAS OF EXPERTISE" },
  "collections.universTitle": { fr: "LES 7 UNIVERS SANAD ELEC", en: "THE 7 SANAD ELEC UNIVERSES" },

  // --- New Arrivals Page ---
  "new.tag": { fr: "ÉDITION LIMITÉE & RÉCENTES CRÉATIONS", en: "LIMITED EDITION & NEW DESIGNS" },
  "new.title": { fr: "NOUVEAUTÉS", en: "NEW ARRIVALS" },
  "new.desc": {
    fr: "Découvrez en avant-première nos dernières silhouettes lumineuses : lampes sculpturales en laiton, suspensions en papier texturé et systèmes LED architecturaux.",
    en: "Preview our newest luminous silhouettes: sculptural brass lamps, textured paper pendants, and architectural LED systems.",
  },
  "new.subTag": { fr: "SÉLECTION AUTOMNE / HIVER", en: "AUTUMN / WINTER SELECTION" },
  "new.subTitle": { fr: "DERNIÈRES PIÈCES DISPONIBLES", en: "LATEST PIECES AVAILABLE" },
  "new.notifyWa": { fr: "Être informé sur WhatsApp", en: "Get notified on WhatsApp" },

  // --- Journal Page ---
  "journal.tag": { fr: "DESIGN, ARCHITECTURE & LUMIÈRE", en: "DESIGN, ARCHITECTURE & LIGHT" },
  "journal.title": { fr: "LE JOURNAL", en: "THE JOURNAL" },
  "journal.desc": {
    fr: "Pensées sur le design, guides d'installation et réflexions pour sculpter l'ambiance de vos espaces de vie.",
    en: "Design thoughts, lighting guides, and ideas to sculpt the atmosphere of your living spaces.",
  },
  "journal.readTime": { fr: "min de lecture", en: "min read" },
  "journal.readMore": { fr: "Lire l'article", en: "Read article" },

  // --- About Page ---
  "about.tag": { fr: "MAISON SANAD ELEC", en: "HOUSE OF SANAD ELEC" },
  "about.title": { fr: "À PROPOS DE NOUS", en: "ABOUT US" },
  "about.desc": {
    fr: "Depuis plus de 15 ans, SanadElec façonne la lumière pour les plus beaux projets résidentiels, commerciaux et industriels au Maroc.",
    en: "For over 15 years, SanadElec has shaped light for the finest residential, commercial, and industrial projects in Morocco.",
  },
  "about.missionTag": { fr: "NOTRE MISSION", en: "OUR MISSION" },
  "about.missionTitle": { fr: "Donner une âme aux espaces grâce à la lumière.", en: "Giving spaces a soul through light." },
  "about.contactTitle": { fr: "CONTACT & SHOWROOM", en: "CONTACT & SHOWROOM" },
  "about.speakSpecialist": { fr: "Échangez avec nos spécialistes", en: "Speak with our specialists" },

  // --- Footer ---
  "footer.brandDesc": {
    fr: "L'art de sculpter la lumière pour des intérieurs d'exception. Votre partenaire éclairage et matériel électrique haut de gamme au Maroc.",
    en: "The art of shaping light for exceptional interiors. Your partner for high-end lighting and electrical equipment in Morocco.",
  },
  "footer.waDirect": { fr: "WhatsApp Direct", en: "Direct WhatsApp" },
  "footer.categories": { fr: "Catégories", en: "Categories" },
  "footer.navigation": { fr: "Navigation", en: "Navigation" },
  "footer.contact": { fr: "Contact", en: "Contact" },
  "footer.showroom": { fr: "Showroom Maroc", en: "Morocco Showroom" },
  "footer.hours": { fr: "Lun – Sam : 08h30 – 19h00", en: "Mon – Sat: 08:30 – 19:00" },
  "footer.copy": {
    fr: "SANAD ELEC — Luminaires Sculpturaux & Art de Vivre.",
    en: "SANAD ELEC — Sculptural Lighting & Modern Living.",
  },
  "footer.sub": {
    fr: "Design & Architecture • Éclairage & Électricité",
    en: "Design & Architecture • Lighting & Electricity",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
  whatsappNumber: "212600000000",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("fr");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("212600000000");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("sanad_lang") as Language | null;
      if (savedLang === "en" || savedLang === "fr") {
        setLangState(savedLang);
      }
    } catch {
      // ignore localStorage errors in strict modes
    }

    // Load dynamic WhatsApp number from settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("sanad_lang", newLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === "fr" ? "en" : "fr");
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry["fr"] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, whatsappNumber }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useWhatsApp() {
  const { whatsappNumber } = useContext(LanguageContext);
  return whatsappNumber || "212600000000";
}
