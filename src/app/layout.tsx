import type { Metadata, Viewport } from "next";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#151312",
};

export const metadata: Metadata = {
  title: "Sanad Elec | Éclairage Sculptural & Matériel Électrique Haut de Gamme",
  description:
    "Sanad Elec — Spécialiste en éclairage sculptural, luminaires contemporains et matériel électrique haut de gamme au Maroc. Systèmes LED, domotique et distribution électrique. Commande directe via WhatsApp.",
  keywords: "Sanad Elec, éclairage intérieur, luminaires design, table lamps, floor lamps, wall sconces, pendant lights, LED, domotique, matériel électrique, Maroc",
  openGraph: {
    title: "Sanad Elec | Sculptural Lighting & Electrical Solutions",
    description:
      "More than illumination. A statement for the spaces you live in. Découvrez nos collections exclusives.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LanguageProvider>
          {children}
          <WhatsAppFloatingButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
