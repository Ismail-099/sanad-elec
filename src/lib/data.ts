export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  priceDisplay?: string;
  image: string;
  categoryId: string;
  specs?: string[];
  specsEn?: string[];
  badge?: string;
  badgeEn?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  gradient: string;
  icon: string;
  productCount: number;
}

export const WHATSAPP_NUMBER = "212600000000"; // Replace with your WhatsApp number

export const templateCategories = [
  {
    id: "table-lamps",
    name: "LAMPES DE TABLE",
    nameEn: "TABLE LAMPS",
    image: "/images/cat_table_lamp.jpg",
    link: "/category/eclairage-interieur",
  },
  {
    id: "floor-lamps",
    name: "LAMPADAIRES",
    nameEn: "FLOOR LAMPS",
    image: "/images/cat_floor_lamp.jpg",
    link: "/category/eclairage-interieur",
  },
  {
    id: "wall-sconces",
    name: "APPLIQUES MURALES",
    nameEn: "WALL SCONCES",
    image: "/images/cat_wall_sconce.jpg",
    link: "/category/eclairage-interieur",
  },
  {
    id: "pendant-lights",
    name: "SUSPENSIONS",
    nameEn: "PENDANT LIGHTS",
    image: "/images/cat_pendant_light.jpg",
    link: "/category/eclairage-interieur",
  },
];

export const categories: Category[] = [
  {
    id: "eclairage-interieur",
    name: "Éclairage intérieur",
    nameEn: "Interior Lighting",
    description: "Luminaires et éclairages design pour sublimer vos espaces intérieurs",
    descriptionEn: "Designer lighting fixtures to illuminate and elevate your interior spaces",
    image: "/images/hero_lumenne.jpg",
    gradient: "from-amber-900 via-amber-700 to-yellow-600",
    icon: "🏠",
    productCount: 24,
  },
  {
    id: "eclairage-led",
    name: "Éclairage LED & systèmes lumineux",
    nameEn: "LED Lighting & Smart Systems",
    description: "Ruban LED, panneaux et systèmes intelligents haute performance",
    descriptionEn: "LED strips, panels and high-performance intelligent luminous systems",
    image: "/images/eclairage_led.jpg",
    gradient: "from-blue-900 via-cyan-700 to-blue-500",
    icon: "💡",
    productCount: 36,
  },
  {
    id: "eclairage-exterieur",
    name: "Éclairage extérieur",
    nameEn: "Outdoor Lighting",
    description: "Bornes, projecteurs et éclairages de façade pour l'extérieur",
    descriptionEn: "Bollards, floodlights and architectural facade fixtures for exterior landscapes",
    image: "/images/eclairage_exterieur.svg",
    gradient: "from-green-900 via-emerald-700 to-teal-600",
    icon: "🌿",
    productCount: 18,
  },
  {
    id: "eclairage-professionnel",
    name: "Éclairage professionnel",
    nameEn: "Professional Lighting",
    description: "Solutions d'éclairage industriel et commercial haute gamme",
    descriptionEn: "High-end commercial, architectural and industrial lighting solutions",
    image: "/images/eclairage_professionnel.svg",
    gradient: "from-gray-900 via-slate-700 to-gray-600",
    icon: "🏭",
    productCount: 22,
  },
  {
    id: "domotique-sonorisation",
    name: "Domotique & sonorisation",
    nameEn: "Smart Home & Sound Systems",
    description: "Maison connectée, automatisation et systèmes audio premium",
    descriptionEn: "Connected home automation, lighting scenes and premium acoustic systems",
    image: "/images/domotique_sonorisation.svg",
    gradient: "from-purple-900 via-violet-700 to-purple-600",
    icon: "🔊",
    productCount: 15,
  },
  {
    id: "materiel-electrique",
    name: "Matériel électrique",
    nameEn: "Electrical Equipment",
    description: "Câbles, prises, interrupteurs et accessoires électriques certifiés",
    descriptionEn: "Cables, sockets, luxury toggle switches and certified electrical fittings",
    image: "/images/materiel_electrique.svg",
    gradient: "from-orange-900 via-red-700 to-orange-600",
    icon: "⚡",
    productCount: 48,
  },
  {
    id: "coffrets-distribution",
    name: "Coffrets & distribution électrique",
    nameEn: "Distribution Boards & Enclosures",
    description: "Tableaux électriques, disjoncteurs et armoires de distribution",
    descriptionEn: "Electrical panels, modular circuit breakers and distribution cabinets",
    image: "/images/coffrets_distribution.svg",
    gradient: "from-zinc-900 via-neutral-700 to-zinc-600",
    icon: "🔌",
    productCount: 20,
  },
];

export const products: Product[] = [
  // 1. Astra Table Lamp
  {
    id: "astra-table-lamp",
    name: "Lampe de Table Astra",
    nameEn: "Astra Table Lamp",
    description: "Lampe à poser en laiton brossé aux lignes sculpturales douces. Crée une lumière enveloppante et feutrée pour tables d'appoint, bureaux et consoles.",
    descriptionEn: "Brushed brass table lamp with soft sculptural contours. Casts a warm and soothing ambient glow for side tables, desks, and consoles.",
    price: 2290,
    priceDisplay: "2 290 MAD",
    image: "/images/prod_astra_table.jpg",
    categoryId: "eclairage-interieur",
    badge: "Bestseller",
    badgeEn: "Best Seller",
    specs: ["Matière: Laiton massif brossé", "Hauteur: 38 cm", "Douille: E14 LED 5W incluse", "Variateur tactile 3 niveaux", "Finition dorée satinée"],
    specsEn: ["Material: Solid brushed brass", "Height: 38 cm", "Socket: E14 LED 5W included", "3-level touch dimmer", "Satin gold finish"],
  },
  // 2. Arc Floor Lamp
  {
    id: "arc-floor-lamp",
    name: "Lampadaire Arc Sculptural",
    nameEn: "Arc Sculptural Floor Lamp",
    description: "Lampadaire arc sculptural minimaliste avec socle lourd en marbre noir et abat-jour coupole orientable. Idéal pour lecture et salon contemporain.",
    descriptionEn: "Minimalist sculptural arch floor lamp with a heavy black marble base and adjustable dome shade. Ideal for reading and contemporary living rooms.",
    price: 3990,
    priceDisplay: "3 990 MAD",
    image: "/images/prod_arc_floor.jpg",
    categoryId: "eclairage-interieur",
    badge: "Signature",
    badgeEn: "Signature",
    specs: ["Matière: Acier noir mat & socle marbre", "Hauteur réglable: 180-210 cm", "Interrupteur au pied", "Ampoule E27 LED", "Angle de projection orientable"],
    specsEn: ["Material: Matte black steel & marble base", "Adjustable height: 180-210 cm", "Foot step switch", "E27 LED bulb", "Adjustable beam angle"],
  },
  // 3. Lume Wall Sconce
  {
    id: "lume-wall-sconce",
    name: "Applique Murale Lume",
    nameEn: "Lume Wall Sconce",
    description: "Applique murale à double globe en verre opalin soufflé monté sur patère circulaire en laiton vieilli. Diffusion omnidirectionnelle chaleureuse.",
    descriptionEn: "Dual-globe wall sconce in hand-blown opal glass mounted on an aged brass circular canopy. Warm omnidirectional diffusion.",
    price: 1890,
    priceDisplay: "1 890 MAD",
    image: "/images/prod_lume_sconce.jpg",
    categoryId: "eclairage-interieur",
    badge: "Coup de Cœur",
    badgeEn: "Curator's Pick",
    specs: ["Matière: Verre opalin soufflé & laiton", "Dimensions: 42 × 16 cm", "Double ampoule G9", "Compatible variateur mural", "Indice IP20"],
    specsEn: ["Material: Hand-blown opal glass & brass", "Dimensions: 42 × 16 cm", "Twin G9 bulbs", "Wall dimmer compatible", "Rating IP20"],
  },
  // 4. Orbis Pendant Light
  {
    id: "orbis-pendant-light",
    name: "Suspension Globe Orbis",
    nameEn: "Orbis Globe Pendant Light",
    description: "Suspension globe en verre teinté fumé avec douille en laiton brossé et ampoule à filament spiralé visible. Élégance intemporelle pour tables et îlots.",
    descriptionEn: "Smoked tinted glass globe pendant with brushed brass fitting and exposed spiral filament bulb. Timeless elegance for tables and kitchen islands.",
    price: 3490,
    priceDisplay: "3 490 MAD",
    image: "/images/prod_orbis_pendant.jpg",
    categoryId: "eclairage-interieur",
    badge: "Iconique",
    badgeEn: "Iconic",
    specs: ["Matière: Verre fumé soufflé & laiton", "Diamètre globe: 28 cm", "Câble textile tissé noir 200 cm", "Ampoule filament LED ambrée incluse", "Rosace assortie incluse"],
    specsEn: ["Material: Blown smoked glass & brass", "Globe diameter: 28 cm", "Woven black fabric cable 200 cm", "Amber LED filament bulb included", "Matching canopy included"],
  },

  // 5. Lustre Cristal Premium
  {
    id: "lustre-cristal-premium",
    name: "Lustre Cristal Premium",
    nameEn: "Premium Crystal Chandelier",
    description: "Lustre en cristal taillé à la main, design art déco moderne. Idéal pour salons et salles à manger haut de gamme. Éclairage chaud et sophistiqué.",
    descriptionEn: "Hand-cut crystal chandelier with a modern Art Deco design. Ideal for luxury living and dining spaces. Warm, sophisticated lighting.",
    price: 4500,
    priceDisplay: "4 500 MAD",
    image: "/images/hero_lumenne.jpg",
    categoryId: "eclairage-interieur",
    badge: "Haute Couture",
    badgeEn: "Haute Couture",
    specs: ["Matière: Cristal & métal doré", "Ampoules: E27 × 12", "Diamètre: 80 cm", "Puissance max: 480W", "Classe énergétique: A++"],
    specsEn: ["Material: Crystal & gold metal", "Bulbs: E27 × 12", "Diameter: 80 cm", "Max power: 480W", "Energy rating: A++"],
  },
  // 6. Plafonnier Design
  {
    id: "plafonnier-design",
    name: "Plafonnier Design Noir Mat",
    nameEn: "Matte Black Ceiling Fixture",
    description: "Plafonnier moderne au design épuré en métal noir mat. Compatible LED. Parfait pour chambres, couloirs et espaces modernes.",
    descriptionEn: "Clean-lined modern ceiling fixture in matte black metal. LED compatible. Perfect for bedrooms, hallways and modern spaces.",
    price: 890,
    priceDisplay: "890 MAD",
    image: "/images/cat_floor_lamp.jpg",
    categoryId: "eclairage-interieur",
    specs: ["Matière: Métal noir mat", "Douille: E27", "Diamètre: 45 cm", "Compatible LED", "IP20"],
    specsEn: ["Material: Matte black metal", "Socket: E27", "Diameter: 45 cm", "LED compatible", "IP20"],
  },
  // 7. Suspension Bois / Papier
  {
    id: "suspension-bois",
    name: "Suspension Sculpturale Vague",
    nameEn: "Wave Sculptural Pendant",
    description: "Suspension artisanale aux lignes ondulées en feutre et papier de riz texturé. Crée une ambiance douce, poétique et enveloppante.",
    descriptionEn: "Artisanal undulating pendant light crafted in felt and textured rice paper. Creates a gentle, poetic, and cozy ambiance.",
    price: 1250,
    priceDisplay: "1 250 MAD",
    image: "/images/cat_pendant_light.jpg",
    categoryId: "eclairage-interieur",
    badge: "Nouveau",
    badgeEn: "New",
    specs: ["Matière: Papier texturé & laiton", "Câble réglable: 150 cm", "Douille: E27", "Puissance max: 60W"],
    specsEn: ["Material: Textured paper & brass", "Adjustable cable: 150 cm", "Socket: E27", "Max power: 60W"],
  },
  // 8. Applique Murale Laiton
  {
    id: "applique-murale-led",
    name: "Applique Murale Laiton Circulaire",
    nameEn: "Circular Brass Wall Sconce",
    description: "Applique murale circulaire avec rétro-éclairage LED indirect. Halo lumineux doux créant une ombre portée artistique sur le mur.",
    descriptionEn: "Circular wall sconce with indirect LED backlighting. Soft luminous halo creating an artistic shadow on the wall.",
    price: 650,
    priceDisplay: "650 MAD",
    image: "/images/cat_wall_sconce.jpg",
    categoryId: "eclairage-interieur",
    specs: ["LED intégré: 12W", "Luminosité: 900lm", "Température: 2700K chaud", "IP44", "Durée de vie: 50 000h"],
    specsEn: ["Integrated LED: 12W", "Luminosity: 900lm", "Color temp: 2700K warm", "IP44", "Lifespan: 50,000h"],
  },

  // 9. Ruban LED
  {
    id: "ruban-led-rgb",
    name: "Ruban LED Architectural Pro 5m",
    nameEn: "Pro Architectural LED Strip 5m",
    description: "Ruban LED haute densité CRI 95+ pour corniches, plinthes et gorges lumineuses. Lumière homogène sans points visibles.",
    descriptionEn: "High-density CRI 95+ LED strip for coves, baseboards and architectural recesses. Dot-free seamless light.",
    price: 350,
    priceDisplay: "350 MAD",
    image: "/images/eclairage_led.jpg",
    categoryId: "eclairage-led",
    badge: "Smart Home",
    badgeEn: "Smart Home",
    specs: ["Longueur: 5 mètres", "Indice rendu couleurs CRI > 95", "Compatible WiFi/DALI", "24V DC", "IP65 étanche"],
    specsEn: ["Length: 5 meters", "Color rendering CRI > 95", "WiFi/DALI compatible", "24V DC", "IP65 waterproof"],
  },
  // 10. Dalle LED 60x60
  {
    id: "panneau-led-60x60",
    name: "Dalle LED Ciel Lumineux 60×60",
    nameEn: "Skyline LED Panel 60×60",
    description: "Dalle LED ultra-fine encastrable haute performance. Diffusion douce anti-éblouissement UGR < 19.",
    descriptionEn: "Ultra-thin high-performance recessed LED panel. Soft anti-glare diffusion UGR < 19.",
    price: 480,
    priceDisplay: "480 MAD",
    image: "/images/eclairage_led.jpg",
    categoryId: "eclairage-led",
    specs: ["Puissance: 40W", "Flux: 4000lm", "Température: 3000K-4000K", "IP44", "Classe A++"],
    specsEn: ["Power: 40W", "Output: 4000lm", "Color temp: 3000K-4000K", "IP44", "Energy class: A++"],
  },
  // 11. Spot LED
  {
    id: "spot-led-encastrable",
    name: "Spot LED Encastrable Sans Collerette",
    nameEn: "Trimless Recessed LED Spot",
    description: "Spot trimless encastrable plâtré dans le plafond pour une intégration invisible et un faisceau architectural précis.",
    descriptionEn: "Trimless recessed spotlight plastered into ceilings for invisible integration and precise architectural beam.",
    price: 145,
    priceDisplay: "145 MAD",
    image: "/images/eclairage_led.jpg",
    categoryId: "eclairage-led",
    specs: ["Puissance: 9W", "Flux: 900lm", "Angle: 36°", "Variateur DALI/Triac", "Finition: Blanc plâtre"],
    specsEn: ["Power: 9W", "Output: 900lm", "Beam angle: 36°", "DALI/Triac dimming", "Finish: White plaster"],
  },

  // 12. Projecteur LED Extérieur
  {
    id: "projecteur-led-exterieur",
    name: "Projecteur Architectural Extérieur 50W",
    nameEn: "50W Outdoor Architectural Floodlight",
    description: "Projecteur LED compact en fonte d'aluminium anodisé pour illumination de façades, oliviers et jardins paysagers.",
    descriptionEn: "Compact anodized cast aluminum LED floodlight for illuminating facades, olive trees, and landscape gardens.",
    price: 520,
    priceDisplay: "520 MAD",
    image: "/images/eclairage_exterieur.svg",
    categoryId: "eclairage-exterieur",
    badge: "Bestseller",
    badgeEn: "Best Seller",
    specs: ["Puissance: 50W", "Flux: 5200lm", "IP67 Étanche", "Verre trempé haute résistance", "Angle: 45°"],
    specsEn: ["Power: 50W", "Output: 5200lm", "IP67 Waterproof", "High-strength tempered glass", "Angle: 45°"],
  },
  // 13. Borne Jardin
  {
    id: "borne-jardin-solaire",
    name: "Borne de Jardin Graphite & Laiton",
    nameEn: "Graphite & Brass Garden Bollard",
    description: "Borne lumineuse d'allée minimaliste en aluminium sablé noir graphite avec diffuseur polycarbonate anti-vandale.",
    descriptionEn: "Minimalist garden walkway bollard in sandblasted graphite black aluminum with anti-vandal polycarbonate diffuser.",
    price: 380,
    priceDisplay: "380 MAD",
    image: "/images/eclairage_exterieur.svg",
    categoryId: "eclairage-exterieur",
    specs: ["Hauteur: 80 cm", "Indice IP65", "Ampoule E27 LED", "Finition graphite thermolaqué", "Ancrage inox"],
    specsEn: ["Height: 80 cm", "IP65 rated", "E27 LED bulb", "Powder-coated graphite finish", "Stainless steel anchor"],
  },

  // 14. Highbay LED
  {
    id: "highbay-led-200w",
    name: "Suspension Industrielle Highbay LED 200W",
    nameEn: "200W Highbay Industrial LED Pendant",
    description: "Luminaire industriel grande hauteur pour entrepôts, showrooms et espaces commerciaux. Rendement lumineux exceptionnel.",
    descriptionEn: "High-bay industrial fixture for warehouses, showrooms, and commercial venues. Outstanding luminous efficacy.",
    price: 1400,
    priceDisplay: "1 400 MAD",
    image: "/images/eclairage_professionnel.svg",
    categoryId: "eclairage-professionnel",
    badge: "Pro",
    badgeEn: "Pro",
    specs: ["Puissance: 200W", "Flux: 28 000lm", "IP65", "Driver MeanWell", "Garantie 5 ans"],
    specsEn: ["Power: 200W", "Output: 28,000lm", "IP65 rated", "MeanWell driver", "5-year warranty"],
  },
  // 15. Rail Magnétique
  {
    id: "rail-magnetique-modulaire",
    name: "Système Rail Magnétique 48V",
    nameEn: "48V Modular Magnetic Track System",
    description: "Rail profilé magnétique encastré ou suspendu avec modules spots, linéaires et suspensions clipsables instantanément.",
    descriptionEn: "Recessed or suspended magnetic profile track with instantly clickable spot, linear, and pendant modules.",
    price: 1850,
    priceDisplay: "1 850 MAD",
    image: "/images/eclairage_professionnel.svg",
    categoryId: "eclairage-professionnel",
    badge: "Architectural",
    badgeEn: "Architectural",
    specs: ["Tension basse 48V sécurisée", "Longueur: 2m modulaire", "Contrôle Bluetooth / Zigbee", "Finition noir mat", "Modules interchangeables"],
    specsEn: ["Safe low voltage 48V", "Length: 2m modular", "Bluetooth / Zigbee control", "Matte black finish", "Interchangeable modules"],
  },

  // 16. Centrale Domotique
  {
    id: "pack-domotique-lumiere",
    name: "Centrale Domotique Éclairage Smart",
    nameEn: "Smart Lighting Home Automation Hub",
    description: "Passerelle intelligente permettant de programmer scénarios lumineux, gradation au crépuscule et contrôle vocal.",
    descriptionEn: "Smart gateway enabling automated lighting scenes, dusk-to-dawn dimming, and voice control.",
    price: 950,
    priceDisplay: "950 MAD",
    image: "/images/domotique_sonorisation.svg",
    categoryId: "domotique-sonorisation",
    badge: "Connecté",
    badgeEn: "Connected",
    specs: ["Protocoles: Zigbee 3.0 & Matter", "Compatible Apple HomeKit, Alexa, Google", "Portée 100m", "App iOS / Android"],
    specsEn: ["Protocols: Zigbee 3.0 & Matter", "Works with Apple HomeKit, Alexa, Google", "Range 100m", "iOS / Android App"],
  },
  // 17. Enceinte Encastrable
  {
    id: "enceinte-connectee",
    name: "Enceinte Encastrable Plafond Hi-Fi",
    nameEn: "In-Ceiling Hi-Fi Architectural Speaker",
    description: "Haut-parleur encastré au plafond sans grille visible pour diffusion musicale multi-room haute fidélité.",
    descriptionEn: "Frameless in-ceiling speaker with invisible magnetic grille for high-fidelity multi-room audio.",
    price: 1650,
    priceDisplay: "1 650 MAD",
    image: "/images/domotique_sonorisation.svg",
    categoryId: "domotique-sonorisation",
    badge: "Audio Pro",
    badgeEn: "Audio Pro",
    specs: ["Puissance: 80W RMS", "Réponse: 45Hz - 22kHz", "Grille magnétique peignable", "Résistant humidité"],
    specsEn: ["Power: 80W RMS", "Frequency response: 45Hz - 22kHz", "Paintable magnetic grille", "Moisture resistant"],
  },

  // 18. Interrupteur Laiton
  {
    id: "interrupteur-va-vient",
    name: "Interrupteur Laiton Massif Brossé",
    nameEn: "Solid Brushed Brass Toggle Switch",
    description: "Appareillage électrique de luxe avec plaque en laiton massif usiné et levier à bascule rétro.",
    descriptionEn: "Luxury electrical switch with precision-machined solid brass faceplate and retro toggle lever.",
    price: 240,
    priceDisplay: "240 MAD",
    image: "/images/materiel_electrique.svg",
    categoryId: "materiel-electrique",
    badge: "Luxe",
    badgeEn: "Luxury",
    specs: ["Matière: Laiton massif brossé", "Courant: 10A / 250V", "Mécanisme silencieux haut de gamme", "Boîte d'encastrement standard"],
    specsEn: ["Material: Solid brushed brass", "Rating: 10A / 250V", "High-end silent mechanism", "Standard backbox fitting"],
  },
  // 19. Prise USB
  {
    id: "prise-usb-encastrable",
    name: "Prise Affleurante 2P+T & Double USB-C",
    nameEn: "Flush Outlet 2P+E & Dual USB-C",
    description: "Prise murale ultra-plate en verre trempé noir avec charge rapide Power Delivery 30W.",
    descriptionEn: "Ultra-slim wall outlet in black tempered glass with Power Delivery 30W fast charging.",
    price: 180,
    priceDisplay: "180 MAD",
    image: "/images/materiel_electrique.svg",
    categoryId: "materiel-electrique",
    badge: "Nouveau",
    badgeEn: "New",
    specs: ["Prise 16A terre", "USB-C PD 30W rapide", "Finition verre noir minéral", "Sécurité enfants"],
    specsEn: ["16A grounded socket", "Fast USB-C PD 30W", "Mineral black glass finish", "Child-safety shutters"],
  },

  // 20. Tableau Électrique
  {
    id: "tableau-electrique-12mod",
    name: "Tableau Électrique Design Encastré",
    nameEn: "Designer Recessed Distribution Panel",
    description: "Coffret de distribution encastré avec porte en verre fumé miroir sans charnières apparentes.",
    descriptionEn: "Recessed electrical distribution box with a concealed-hinge smoked mirrored glass door.",
    price: 890,
    priceDisplay: "890 MAD",
    image: "/images/coffrets_distribution.svg",
    categoryId: "coffrets-distribution",
    badge: "Design",
    badgeEn: "Design",
    specs: ["24 modules sur 2 rangées", "Porte miroir fumée affleurante", "Borniers automatiques Quick Connect", "Norme NF C 15-100"],
    specsEn: ["24 modules across 2 rows", "Flush smoked mirror door", "Quick Connect automatic terminals", "NF C 15-100 certified"],
  },
  // 21. Armoire Industrielle
  {
    id: "armoire-electrique-industrielle",
    name: "Armoire Distribution Modulaire IP65",
    nameEn: "IP65 Modular Industrial Distribution Cabinet",
    description: "Armoire de protection et distribution étanche pour villas et projets industriels exigeants.",
    descriptionEn: "Heavy-duty weatherproof protection and distribution cabinet for luxury villas and demanding projects.",
    price: 3200,
    priceDisplay: "3 200 MAD",
    image: "/images/coffrets_distribution.svg",
    categoryId: "coffrets-distribution",
    specs: ["Dimensions: 800×600×250mm", "Acier thermo-laqué anti-corrosion", "IP65 & IK10", "Serrure à clé"],
    specsEn: ["Dimensions: 800×600×250mm", "Corrosion-resistant powder-coated steel", "IP65 & IK10 rated", "Key lock"],
  },
];

// Helper functions for multilingual rendering
export function getProductName(product: Product, lang: string): string {
  if (lang === "en" && product.nameEn) return product.nameEn;
  return product.name;
}

export function getProductDescription(product: Product, lang: string): string {
  if (lang === "en" && product.descriptionEn) return product.descriptionEn;
  return product.description;
}

export function getProductSpecs(product: Product, lang: string): string[] {
  if (lang === "en" && product.specsEn && product.specsEn.length > 0) return product.specsEn;
  return product.specs || [];
}

export function getProductBadge(product: Product, lang: string): string | undefined {
  if (lang === "en" && product.badgeEn) return product.badgeEn;
  return product.badge;
}

export function getCategoryName(category: Category, lang: string): string {
  if (lang === "en" && category.nameEn) return category.nameEn;
  return category.name;
}

export function getCategoryDescription(category: Category, lang: string): string {
  if (lang === "en" && category.descriptionEn) return category.descriptionEn;
  return category.description;
}
