"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface WhatsAppOrderButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  waNumber: string;
  className?: string;
  id?: string;
  children?: React.ReactNode;
}

export default function WhatsAppOrderButton({
  productId,
  productName,
  productPrice,
  productImage,
  waNumber,
  className = "product-detail-wa-btn",
  id = "product-page-wa-btn",
  children,
}: WhatsAppOrderButtonProps) {
  const [clicked, setClicked] = useState(false);
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked(true);

    // 1. Log lead / order automatically in the Admin Dashboard
    try {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          productImage,
          price: productPrice,
          source: "whatsapp_button",
          notes: isEn
            ? "Customer clicked 'Order via WhatsApp' from product page."
            : "Client a cliqué sur 'Commander via WhatsApp' depuis la fiche produit.",
        }),
      }).catch((err) => console.error("Error logging order:", err));
    } catch (e) {
      console.error(e);
    }

    // 2. Open WhatsApp in new tab
    const message = encodeURIComponent(
      isEn
        ? `Hello SanadElec,\n\nI would like to order the following product:\n- Product: ${productName}\n- Price: ${productPrice.toLocaleString("en-US")} MAD\n- Reference: #${productId}\n\nPlease confirm availability and delivery timeframe.`
        : `Bonjour SanadElec,\n\nJe souhaite commander le produit suivant :\n- Produit : ${productName}\n- Prix : ${productPrice.toLocaleString("fr-FR")} MAD\n- Référence : #${productId}\n\nMerci de me confirmer la disponibilité et le délai de livraison.`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${message}`;

    window.open(waUrl, "_blank", "noopener,noreferrer");

    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      id={id}
      type="button"
      style={{ cursor: "pointer", border: "none" }}
    >
      {children || (
        <>
          <span>💬</span> {clicked ? (isEn ? "Opening WhatsApp..." : "Ouverture WhatsApp...") : (isEn ? "Order via WhatsApp" : "Commander via WhatsApp")}
        </>
      )}
    </button>
  );
}
