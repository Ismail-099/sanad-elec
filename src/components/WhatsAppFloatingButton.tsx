"use client";

import { useWhatsApp } from "@/context/LanguageContext";

export default function WhatsAppFloatingButton() {
  const waNumber = useWhatsApp();
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Bonjour SanadElec, je souhaite un devis ou des renseignements sur vos luminaires."
  )}`;

  return (
    <aside aria-label="Assistance WhatsApp">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-floating-btn"
        id="wa-floating-btn"
        title="Discuter avec Sanad Elec sur WhatsApp"
        aria-label="Discuter avec Sanad Elec sur WhatsApp"
      >
        {/* Tooltip speech bubble */}
        <span className="wa-floating-tooltip">
          Besoin d&apos;aide ? <strong>WhatsApp</strong>
        </span>

        {/* Pulse ripple ring */}
        <span className="wa-floating-pulse" aria-hidden="true" />

        {/* Online Status Dot */}
        <span className="wa-floating-online-badge" title="En ligne" aria-hidden="true" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          className="wa-floating-icon"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.612.742 5.05 2.025 7.125L2.8 29.2l6.244-1.637A13.435 13.435 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5zm0 24.712c-2.225 0-4.312-.6-6.113-1.65l-.437-.25-4.5 1.175 1.2-4.387-.275-.438A11.134 11.134 0 0 1 4.788 16c0-6.188 5.025-11.212 11.212-11.212 6.188 0 11.213 5.024 11.213 11.212 0 6.188-5.025 11.212-11.213 11.212zm6.15-8.375c-.337-.175-2.012-.987-2.325-1.1s-.538-.175-.763.175-.875 1.1-1.075 1.325-.4.262-.738.087a9.345 9.345 0 0 1-2.75-1.7 10.3 10.3 0 0 1-1.9-2.363c-.2-.337-.025-.525.15-.688.15-.15.337-.4.5-.6s.225-.337.337-.562.063-.425-.025-.6-.762-1.838-1.05-2.513c-.275-.662-.562-.575-.762-.587l-.65-.013c-.225 0-.6.088-.913.425s-1.2 1.175-1.2 2.862 1.225 3.325 1.4 3.55 2.412 3.688 5.85 5.175c.813.35 1.45.563 1.95.725.825.263 1.575.225 2.163.138.662-.1 2.012-.825 2.3-1.625.287-.8.287-1.488.2-1.625-.088-.138-.325-.225-.663-.4z" />
        </svg>
      </a>
    </aside>
  );
}
