"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";
import { AdminProduct, AdminOrder } from "@/lib/store";

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState("admin@sanadelec.ma");
  const [authPassword, setAuthPassword] = useState("admin123");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

  // Data
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("212600000000");
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter
  const [productSearch, setProductSearch] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Product Form Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [formName, setFormName] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDescriptionEn, setFormDescriptionEn] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("eclairage-interieur");
  const [formBadge, setFormBadge] = useState("");
  const [formBadgeEn, setFormBadgeEn] = useState("");
  const [formImage, setFormImage] = useState("/images/hero_lumenne.jpg");
  const [formSpecs, setFormSpecs] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  // Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Settings form
  const [settingsWa, setSettingsWa] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check initial login session securely via server
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchData();
          return;
        }
      } catch {
        // Session not active
      }
      setIsAuthenticated(false);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.message || "Identifiants incorrects.");
      }
    } catch {
      setLoginError("Impossible de se connecter au serveur.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      // Ignored
    }
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, ordRes, setRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/settings"),
      ]);
      const prodData = await prodRes.json();
      const ordData = await ordRes.json();
      const setData = await setRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (ordData.success) setOrders(ordData.orders);
      if (setData.success) {
        setWhatsappNumber(setData.settings.whatsappNumber);
        setSettingsWa(setData.settings.whatsappNumber);
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Image Upload handler from desktop
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setFormImage(data.url);
      } else {
        setFormError(data.message || "Erreur de téléversement de l'image.");
      }
    } catch {
      setFormError("Échec du téléversement de l'image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormNameEn("");
    setFormDescription("");
    setFormDescriptionEn("");
    setFormPrice("");
    setFormCategoryId("eclairage-interieur");
    setFormBadge("");
    setFormBadgeEn("");
    setFormImage("/images/hero_lumenne.jpg");
    setFormSpecs([]);
    setSpecInput("");
    setFormError("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormNameEn(p.nameEn || "");
    setFormDescription(p.description);
    setFormDescriptionEn(p.descriptionEn || "");
    setFormPrice(p.price.toString());
    setFormCategoryId(p.categoryId);
    setFormBadge(p.badge || "");
    setFormBadgeEn(p.badgeEn || "");
    setFormImage(p.image);
    setFormSpecs(p.specs || []);
    setSpecInput("");
    setFormError("");
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      setFormError("Veuillez renseigner le nom et le prix.");
      return;
    }

    setFormSaving(true);
    setFormError("");

    try {
      const payload = {
        name: formName.trim(),
        nameEn: formNameEn.trim() || editingProduct?.nameEn || undefined,
        description: formDescription.trim(),
        descriptionEn: formDescriptionEn.trim() || editingProduct?.descriptionEn || undefined,
        price: Number(formPrice),
        priceDisplay: `${Number(formPrice).toLocaleString("fr-FR")} MAD`,
        categoryId: formCategoryId,
        badge: formBadge.trim(),
        badgeEn: formBadgeEn.trim() || editingProduct?.badgeEn || undefined,
        image: formImage,
        specs: formSpecs,
        specsEn: editingProduct?.specsEn,
      };

      let res;
      if (editingProduct) {
        res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setIsProductModalOpen(false);
        fetchData();
      } else {
        setFormError(data.message || "Erreur d'enregistrement.");
      }
    } catch {
      setFormError("Erreur réseau lors de l'enregistrement.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Impossible de supprimer ce produit.");
      }
    } catch {
      alert("Erreur réseau lors de la suppression.");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: AdminOrder["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette commande de la liste ?")) return;
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        if (selectedOrder?.id === id) setSelectedOrder(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber: settingsWa,
          newPassword: newPass || undefined,
          currentPassword: currentPass || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMsg("Paramètres enregistrés avec succès !");
        setWhatsappNumber(data.settings.whatsappNumber);
        setCurrentPass("");
        setNewPass("");
      } else {
        setSettingsMsg("Erreur: " + data.message);
      }
    } catch {
      setSettingsMsg("Erreur de connexion.");
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCatFilter === "all" || p.categoryId === selectedCatFilter;
    const matchesQuery =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    const matchesQuery =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.productName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  // Statistics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== "cancelled" ? o.price : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "whatsapp_initiated" || o.status === "processing").length;

  // Helper for Order Status Display
  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "whatsapp_initiated":
        return { label: "WhatsApp Initié", bg: "#25D366", color: "#000" };
      case "confirmed":
        return { label: "Confirmé", bg: "#3B82F6", color: "#FFF" };
      case "processing":
        return { label: "En Préparation", bg: "#F59E0B", color: "#000" };
      case "shipped":
        return { label: "Expédié", bg: "#8B5CF6", color: "#FFF" };
      case "delivered":
        return { label: "Livré", bg: "#10B981", color: "#FFF" };
      case "cancelled":
        return { label: "Annulé", bg: "#EF4444", color: "#FFF" };
      default:
        return { label: status, bg: "#6B7280", color: "#FFF" };
    }
  };

  // ============================================================
  // 1. LOGIN SCREEN (If not authenticated)
  // ============================================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0D0B0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "var(--font-sans)",
      }}>
        <div style={{
          maxWidth: "440px",
          width: "100%",
          backgroundColor: "#181615",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          padding: "clamp(24px, 6vw, 40px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{
              fontSize: "0.72rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 600,
              display: "block",
              marginBottom: "8px",
            }}>
              PORTAIL D&apos;ADMINISTRATION PRIVÉ
            </span>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.9rem",
              letterSpacing: "0.15em",
              color: "#FFFFFF",
              textTransform: "uppercase",
              margin: 0,
            }}>
              SANAD ELEC
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.85rem", marginTop: "8px" }}>
              Gestion des luminaires, photos et commandes WhatsApp
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {loginError && (
              <div style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #EF4444",
                color: "#FCA5A5",
                padding: "10px 14px",
                borderRadius: "4px",
                fontSize: "0.85rem",
              }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "8px" }}>
                Email Administrateur
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "#11100E",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#FFFFFF",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "8px" }}>
                Mot de Passe
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "#11100E",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#FFFFFF",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                marginTop: "12px",
                padding: "14px",
                backgroundColor: "var(--gold)",
                color: "#11100E",
                border: "none",
                borderRadius: "4px",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: loginLoading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s ease",
              }}
            >
              {loginLoading ? "Connexion en cours..." : "Accéder au Tableau de Bord"}
            </button>

            {/* Helper credentials hint */}
            <div style={{
              marginTop: "12px",
              padding: "12px",
              backgroundColor: "rgba(200, 169, 126, 0.08)",
              border: "1px dashed rgba(200, 169, 126, 0.3)",
              borderRadius: "4px",
              fontSize: "0.78rem",
              color: "rgba(255, 255, 255, 0.65)",
              lineHeight: 1.6,
            }}>
              💡 <strong>Identifiants par défaut :</strong><br />
              Email : <code style={{ color: "var(--gold)" }}>admin@sanadelec.ma</code><br />
              Mot de passe : <code style={{ color: "var(--gold)" }}>admin123</code>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link href="/" style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.8rem", textDecoration: "none" }}>
                ← Retour au site public Sanad Elec
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. MAIN ADMIN DASHBOARD
  // ============================================================
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0E0C0B", color: "#FFFFFF", fontFamily: "var(--font-sans)" }}>
      {/* Top Navbar */}
      <header style={{
        backgroundColor: "#181615",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "14px clamp(12px, 3vw, 36px)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", letterSpacing: "0.15em", color: "#FFF" }}>
            SANAD ELEC <span style={{ fontSize: "0.65rem", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginLeft: "6px", border: "1px solid var(--gold)", padding: "2px 5px", borderRadius: "3px" }}>ADMIN</span>
          </div>

          {/* Right action links */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                color: "var(--gold)",
                fontSize: "0.8rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>🌐 Voir le site public</span>
              <span>↗</span>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "rgba(255, 255, 255, 0.8)",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Quick tab switchers with mobile swipe */}
        <nav className="shop-filter-scroll" style={{ display: "flex", gap: "8px", width: "100%", overflowX: "auto", paddingBottom: "4px" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              background: activeTab === "overview" ? "rgba(255, 255, 255, 0.12)" : "transparent",
              color: activeTab === "overview" ? "#FFF" : "rgba(255, 255, 255, 0.6)",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontWeight: 500,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            📊 Vue d&apos;ensemble
          </button>
          <button
            onClick={() => setActiveTab("products")}
            style={{
              background: activeTab === "products" ? "rgba(255, 255, 255, 0.12)" : "transparent",
              color: activeTab === "products" ? "#FFF" : "rgba(255, 255, 255, 0.6)",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontWeight: 500,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            📦 Produits ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              background: activeTab === "orders" ? "rgba(255, 255, 255, 0.12)" : "transparent",
              color: activeTab === "orders" ? "#FFF" : "rgba(255, 255, 255, 0.6)",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontWeight: 500,
              position: "relative",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            💬 Commandes WhatsApp ({orders.length})
            {pendingOrdersCount > 0 && (
              <span style={{
                marginLeft: "8px",
                backgroundColor: "#25D366",
                color: "#000",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "10px",
              }}>
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              background: activeTab === "settings" ? "rgba(255, 255, 255, 0.12)" : "transparent",
              color: activeTab === "settings" ? "#FFF" : "rgba(255, 255, 255, 0.6)",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontWeight: 500,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            ⚙️ Paramètres
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(20px, 4vw, 32px) clamp(12px, 3vw, 24px)" }}>
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "0 0 6px 0", fontWeight: 400 }}>
                  Tableau de Bord
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem", margin: 0 }}>
                  Statistiques et gestion de Sanad Elec en temps réel.
                </p>
              </div>

              <button
                onClick={openAddProductModal}
                style={{
                  backgroundColor: "var(--gold)",
                  color: "#11100E",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>＋</span> Ajouter un Produit
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              {/* Total Products */}
              <div style={{ backgroundColor: "#181615", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.5)" }}>
                  CATALOGUE PRODUITS
                </span>
                <div style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", margin: "12px 0 6px 0" }}>
                  {products.length}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--gold)" }}>
                  Dans 7 catégories actives
                </div>
              </div>

              {/* Total WhatsApp Commands */}
              <div style={{ backgroundColor: "#181615", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.5)" }}>
                  COMMANDES WHATSAPP
                </span>
                <div style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", margin: "12px 0 6px 0", color: "#25D366" }}>
                  {orders.length}
                </div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  {pendingOrdersCount} en attente / en cours
                </div>
              </div>

              {/* Total Revenue Estimate */}
              <div style={{ backgroundColor: "#181615", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.5)" }}>
                  VOLUME DE VENTES
                </span>
                <div style={{ fontSize: "2.4rem", fontFamily: "var(--font-serif)", margin: "12px 0 6px 0" }}>
                  {totalRevenue.toLocaleString("fr-FR")} MAD
                </div>
                <div style={{ fontSize: "0.82rem", color: "#10B981" }}>
                  Basé sur les commandes enregistrées
                </div>
              </div>

              {/* WhatsApp Config */}
              <div style={{ backgroundColor: "#181615", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.5)" }}>
                  WHATSAPP BUSINESS
                </span>
                <div style={{ fontSize: "1.4rem", fontFamily: "var(--font-mono)", margin: "14px 0 6px 0", color: "var(--gold)" }}>
                  +{whatsappNumber}
                </div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  Canal direct connecté
                </div>
              </div>
            </div>

            {/* Recent Orders List */}
            <div style={{ backgroundColor: "#181615", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", margin: 0, fontWeight: 400 }}>
                  Dernières Commandes WhatsApp
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "0.82rem" }}
                >
                  Voir toutes les commandes →
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "rgba(255, 255, 255, 0.5)" }}>
                      <th style={{ padding: "12px 16px" }}>Réf</th>
                      <th style={{ padding: "12px 16px" }}>Date</th>
                      <th style={{ padding: "12px 16px" }}>Produit</th>
                      <th style={{ padding: "12px 16px" }}>Montant</th>
                      <th style={{ padding: "12px 16px" }}>Client</th>
                      <th style={{ padding: "12px 16px" }}>Statut</th>
                      <th style={{ padding: "12px 16px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => {
                      const badge = getStatusBadge(ord.status);
                      return (
                        <tr key={ord.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", color: "var(--gold)" }}>
                            {ord.id}
                          </td>
                          <td style={{ padding: "14px 16px", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}>
                            {ord.date}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "36px", height: "36px", position: "relative", borderRadius: "4px", overflow: "hidden", backgroundColor: "#201E1C" }}>
                                <Image src={ord.productImage} alt={ord.productName} fill style={{ objectFit: "cover" }} />
                              </div>
                              <span style={{ fontWeight: 500 }}>{ord.productName}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                            {ord.priceFormatted}
                          </td>
                          <td style={{ padding: "14px 16px", color: "rgba(255, 255, 255, 0.8)" }}>
                            {ord.customerName || "Visiteur"}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}>
                              {badge.label}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                color: "#FFF",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.78rem",
                              }}
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "0 0 6px 0", fontWeight: 400 }}>
                  Gestion des Produits
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem", margin: 0 }}>
                  Ajoutez, modifiez vos luminaires et téléversez des photos depuis votre ordinateur.
                </p>
              </div>

              <button
                onClick={openAddProductModal}
                style={{
                  backgroundColor: "var(--gold)",
                  color: "#11100E",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>＋</span> Ajouter un Produit
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div style={{
              backgroundColor: "#181615",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}>
              {/* Search */}
              <input
                type="text"
                placeholder="Rechercher par nom, description ou réf..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{
                  flexGrow: 1,
                  minWidth: "260px",
                  padding: "10px 14px",
                  backgroundColor: "#11100E",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#FFF",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />

              {/* Category Filter */}
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#11100E",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#FFF",
                  fontSize: "0.9rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">Toutes les catégories ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Products Table */}
            <div style={{
              backgroundColor: "#181615",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              overflow: "hidden",
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0, 0, 0, 0.2)", color: "rgba(255, 255, 255, 0.5)" }}>
                      <th style={{ padding: "14px 16px" }}>Photo</th>
                      <th style={{ padding: "14px 16px" }}>Nom du Produit</th>
                      <th style={{ padding: "14px 16px" }}>Catégorie</th>
                      <th style={{ padding: "14px 16px" }}>Prix</th>
                      <th style={{ padding: "14px 16px" }}>Badge</th>
                      <th style={{ padding: "14px 16px" }}>Fiche</th>
                      <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => {
                      const catName = categories.find((c) => c.id === prod.categoryId)?.name || prod.categoryId;
                      return (
                        <tr key={prod.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          {/* Image Thumbnail */}
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{
                              width: "56px",
                              height: "56px",
                              position: "relative",
                              borderRadius: "6px",
                              overflow: "hidden",
                              backgroundColor: "#222",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}>
                              <Image src={prod.image} alt={prod.name} fill style={{ objectFit: "cover" }} />
                            </div>
                          </td>

                          {/* Name & Description */}
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#FFF", marginBottom: "4px" }}>
                              {prod.name}
                            </div>
                            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.78rem", maxWidth: "340px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {prod.description}
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: "12px 16px", color: "rgba(255, 255, 255, 0.75)", fontSize: "0.82rem" }}>
                            {catName}
                          </td>

                          {/* Price */}
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--gold)" }}>
                            {prod.priceDisplay || `${prod.price} MAD`}
                          </td>

                          {/* Badge */}
                          <td style={{ padding: "12px 16px" }}>
                            {prod.badge ? (
                              <span style={{
                                backgroundColor: "rgba(200, 169, 126, 0.15)",
                                border: "1px solid var(--gold)",
                                color: "var(--gold)",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                              }}>
                                {prod.badge}
                              </span>
                            ) : (
                              <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>—</span>
                            )}
                          </td>

                          {/* Public Page Link */}
                          <td style={{ padding: "12px 16px" }}>
                            <Link
                              href={`/product/${prod.id}`}
                              target="_blank"
                              style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.8rem", textDecoration: "none" }}
                            >
                              Voir ↗
                            </Link>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                              <button
                                onClick={() => openEditProductModal(prod)}
                                style={{
                                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                                  border: "1px solid rgba(255, 255, 255, 0.15)",
                                  color: "#FFF",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.78rem",
                                }}
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                style={{
                                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  color: "#F87171",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.78rem",
                                }}
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: WHATSAPP COMMANDS & ORDERS */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "0 0 6px 0", fontWeight: 400 }}>
                  Commandes & Leads WhatsApp
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem", margin: 0 }}>
                  Suivi de chaque commande initiée via le bouton WhatsApp de votre boutique.
                </p>
              </div>

              <div style={{
                backgroundColor: "rgba(37, 211, 102, 0.12)",
                border: "1px solid #25D366",
                borderRadius: "6px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.85rem",
                color: "#25D366",
              }}>
                <span>💬 WhatsApp Connecté :</span>
                <strong>+{whatsappNumber}</strong>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{
              backgroundColor: "#181615",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}>
              <input
                type="text"
                placeholder="Rechercher par référence, produit, ou client..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{
                  flexGrow: 1,
                  minWidth: "260px",
                  padding: "10px 14px",
                  backgroundColor: "#11100E",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#FFF",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#11100E",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#FFF",
                  fontSize: "0.9rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">Tous les statuts ({orders.length})</option>
                <option value="whatsapp_initiated">WhatsApp Initié</option>
                <option value="confirmed">Confirmé</option>
                <option value="processing">En Préparation</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            {/* Orders Table */}
            <div style={{
              backgroundColor: "#181615",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              overflow: "hidden",
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0, 0, 0, 0.2)", color: "rgba(255, 255, 255, 0.5)" }}>
                      <th style={{ padding: "14px 16px" }}>Réf. Commande</th>
                      <th style={{ padding: "14px 16px" }}>Date & Heure</th>
                      <th style={{ padding: "14px 16px" }}>Produit Demandé</th>
                      <th style={{ padding: "14px 16px" }}>Prix</th>
                      <th style={{ padding: "14px 16px" }}>Client</th>
                      <th style={{ padding: "14px 16px" }}>Statut Commande</th>
                      <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "rgba(255, 255, 255, 0.4)" }}>
                          Aucune commande ne correspond à votre recherche.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const badge = getStatusBadge(ord.status);
                        return (
                          <tr key={ord.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", color: "var(--gold)", fontWeight: 600 }}>
                              {ord.id}
                            </td>

                            <td style={{ padding: "14px 16px", color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}>
                              {ord.date}
                            </td>

                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "42px", height: "42px", position: "relative", borderRadius: "4px", overflow: "hidden", backgroundColor: "#222" }}>
                                  <Image src={ord.productImage} alt={ord.productName} fill style={{ objectFit: "cover" }} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{ord.productName}</div>
                                  <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)" }}>Réf: #{ord.productId}</div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                              {ord.priceFormatted}
                            </td>

                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ fontWeight: 500 }}>{ord.customerName || "Visiteur Web"}</div>
                              {ord.customerPhone && (
                                <div style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.5)" }}>{ord.customerPhone}</div>
                              )}
                            </td>

                            <td style={{ padding: "14px 16px" }}>
                              {/* Inline status selector */}
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as AdminOrder["status"])}
                                style={{
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                  border: "none",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.76rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  outline: "none",
                                }}
                              >
                                <option value="whatsapp_initiated" style={{ background: "#222", color: "#FFF" }}>WhatsApp Initié</option>
                                <option value="confirmed" style={{ background: "#222", color: "#FFF" }}>Confirmé</option>
                                <option value="processing" style={{ background: "#222", color: "#FFF" }}>En Préparation</option>
                                <option value="shipped" style={{ background: "#222", color: "#FFF" }}>Expédié</option>
                                <option value="delivered" style={{ background: "#222", color: "#FFF" }}>Livré</option>
                                <option value="cancelled" style={{ background: "#222", color: "#FFF" }}>Annulé</option>
                              </select>
                            </td>

                            <td style={{ padding: "14px 16px", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    color: "#FFF",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.78rem",
                                  }}
                                >
                                  Détails
                                </button>
                                <a
                                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour, concernant votre commande ${ord.id} (${ord.productName}) chez Sanad Elec.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    backgroundColor: "#25D366",
                                    color: "#000",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    fontWeight: 600,
                                    fontSize: "0.78rem",
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <span>💬</span> Relancer
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SETTINGS */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: "700px" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "0 0 6px 0", fontWeight: 400 }}>
              Paramètres
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem", marginBottom: "32px" }}>
              Configurez le numéro WhatsApp pour la réception des commandes et modifiez vos accès admin.
            </p>

            {settingsMsg && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "4px",
                marginBottom: "24px",
                backgroundColor: settingsMsg.startsWith("Erreur") ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                border: settingsMsg.startsWith("Erreur") ? "1px solid #EF4444" : "1px solid #10B981",
                color: settingsMsg.startsWith("Erreur") ? "#FCA5A5" : "#6EE7B7",
                fontSize: "0.88rem",
              }}>
                {settingsMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* WhatsApp Config */}
              <div style={{ backgroundColor: "#181615", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem" }}>Numéro WhatsApp Commercial</h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.5)", margin: "0 0 16px 0" }}>
                  Ce numéro recevra toutes les demandes de commande des clients sur le site.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>+</span>
                  <input
                    type="text"
                    value={settingsWa}
                    onChange={(e) => setSettingsWa(e.target.value)}
                    placeholder="212600000000"
                    style={{
                      flexGrow: 1,
                      padding: "10px 14px",
                      backgroundColor: "#11100E",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "4px",
                      color: "#FFF",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>

              {/* Password Change */}
              <div style={{ backgroundColor: "#181615", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem" }}>Sécurité & Mot de Passe Admin</h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.5)", margin: "0 0 16px 0" }}>
                  Laissez vide si vous ne souhaitez pas modifier le mot de passe actuel.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.6)", marginBottom: "6px" }}>
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="Mot de passe actuel"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "#11100E",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "4px",
                        color: "#FFF",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.6)", marginBottom: "6px" }}>
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "#11100E",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "4px",
                        color: "#FFF",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "var(--gold)",
                  color: "#11100E",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                Enregistrer les Paramètres
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: "20px",
        }}>
          <div style={{
            backgroundColor: "#181615",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            maxWidth: "750px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "32px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: 0, fontWeight: 400 }}>
                {editingProduct ? "Modifier le Produit" : "Nouveau Produit"}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255, 255, 255, 0.5)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid #EF4444", color: "#FCA5A5", padding: "10px 14px", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "20px" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* IMAGE UPLOAD FROM DESKTOP */}
              <div style={{
                border: "1px dashed rgba(200, 169, 126, 0.4)",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "rgba(200, 169, 126, 0.04)",
              }}>
                <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "12px" }}>
                  📷 Image du Produit (Importer depuis votre ordinateur)
                </label>

                <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                  {/* Current Preview */}
                  <div style={{
                    width: "110px",
                    height: "110px",
                    position: "relative",
                    borderRadius: "6px",
                    overflow: "hidden",
                    backgroundColor: "#11100E",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    flexShrink: 0,
                  }}>
                    <Image src={formImage} alt="Aperçu" fill style={{ objectFit: "cover" }} />
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", margin: "0 0 12px 0" }}>
                      Cliquez pour choisir une photo depuis votre bureau (JPG, PNG, WebP).
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      style={{ display: "none" }}
                    />

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        color: "#FFF",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        cursor: uploadingImage ? "not-allowed" : "pointer",
                      }}
                    >
                      {uploadingImage ? "Téléversement en cours..." : "📂 Choisir une photo sur mon PC"}
                    </button>

                    <div style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.4)", marginTop: "8px", fontFamily: "var(--font-mono)" }}>
                      Fichier actuel : {formImage}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "6px" }}>
                    Nom du Produit (FR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Suspension Opaline Dorée"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "#11100E",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "4px",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "6px" }}>
                    Prix (en MAD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="890"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "#11100E",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "4px",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              {/* English Name (Optional) */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold)", marginBottom: "6px" }}>
                  Product Name (EN - Traduction anglaise)
                </label>
                <input
                  type="text"
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  placeholder="Ex: Golden Opaline Pendant"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    backgroundColor: "#11100E",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    color: "#FFF",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              {/* Category & Badge */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "6px" }}>
                    Catégorie
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      backgroundColor: "#11100E",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "4px",
                      color: "#FFF",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "6px" }}>
                    Badge FR / EN (optionnel)
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="FR: Bestseller"
                      style={{
                        width: "100%",
                        padding: "10px 10px",
                        backgroundColor: "#11100E",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "4px",
                        color: "#FFF",
                        fontSize: "0.85rem",
                      }}
                    />
                    <input
                      type="text"
                      value={formBadgeEn}
                      onChange={(e) => setFormBadgeEn(e.target.value)}
                      placeholder="EN: Bestseller"
                      style={{
                        width: "100%",
                        padding: "10px 10px",
                        backgroundColor: "#11100E",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "4px",
                        color: "#FFF",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description FR & EN */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "6px" }}>
                  Description Détaillée (FR)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Décrivez les matériaux nobles, les finitions et l'ambiance lumineuse en français..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    backgroundColor: "#11100E",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    color: "#FFF",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    resize: "vertical",
                  }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold)", marginTop: "10px", marginBottom: "6px" }}>
                  Detailed Description (EN - Traduction anglaise)
                </label>
                <textarea
                  rows={3}
                  value={formDescriptionEn}
                  onChange={(e) => setFormDescriptionEn(e.target.value)}
                  placeholder="Describe noble materials, craftsmanship and lighting ambiance in English..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    backgroundColor: "#11100E",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "4px",
                    color: "#FFF",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Technical Specifications Tags */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", marginBottom: "6px" }}>
                  Spécifications Techniques
                </label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    placeholder="Ex: Laiton massif, E27 12W, IP44..."
                    style={{
                      flexGrow: 1,
                      padding: "8px 12px",
                      backgroundColor: "#11100E",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "4px",
                      color: "#FFF",
                      fontSize: "0.85rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (specInput.trim()) {
                        setFormSpecs([...formSpecs, specInput.trim()]);
                        setSpecInput("");
                      }
                    }}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#FFF",
                      padding: "8px 14px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Ajouter
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {formSpecs.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "#201E1C",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "0.78rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => setFormSpecs(formSpecs.filter((_, i) => i !== idx))}
                        style={{ background: "none", border: "none", color: "#F87171", cursor: "pointer", padding: 0 }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "rgba(255, 255, 255, 0.7)",
                    padding: "10px 18px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "#11100E",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: formSaving ? "not-allowed" : "pointer",
                  }}
                >
                  {formSaving ? "Enregistrement..." : editingProduct ? "Mettre à jour" : "Ajouter le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ORDER DETAILS */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: "20px",
        }}>
          <div style={{
            backgroundColor: "#181615",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "100%",
            padding: "32px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  FICHE COMMANDE WHATSAPP
                </span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: "4px 0 0 0" }}>
                  {selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: "none", border: "none", color: "rgba(255, 255, 255, 0.5)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", gap: "20px", alignItems: "center", padding: "16px", backgroundColor: "#11100E", borderRadius: "6px", marginBottom: "20px" }}>
              <div style={{ width: "70px", height: "70px", position: "relative", borderRadius: "4px", overflow: "hidden", backgroundColor: "#222" }}>
                <Image src={selectedOrder.productImage} alt={selectedOrder.productName} fill style={{ objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>{selectedOrder.productName}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--gold)", marginTop: "2px" }}>Prix : {selectedOrder.priceFormatted}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "2px" }}>Date : {selectedOrder.date}</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", fontSize: "0.88rem" }}>
              <div>
                <strong style={{ color: "rgba(255, 255, 255, 0.6)", display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Nom Client :</strong>
                <div>{selectedOrder.customerName || "Visiteur Boutique Web"}</div>
              </div>

              {selectedOrder.customerPhone && (
                <div>
                  <strong style={{ color: "rgba(255, 255, 255, 0.6)", display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Téléphone :</strong>
                  <div style={{ fontFamily: "var(--font-mono)" }}>{selectedOrder.customerPhone}</div>
                </div>
              )}

              <div>
                <strong style={{ color: "rgba(255, 255, 255, 0.6)", display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Statut Actuel :</strong>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as AdminOrder["status"])}
                  style={{
                    marginTop: "4px",
                    padding: "8px 12px",
                    backgroundColor: "#11100E",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "4px",
                    color: "#FFF",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="whatsapp_initiated">WhatsApp Initié</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="processing">En Préparation</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div>
                <strong style={{ color: "rgba(255, 255, 255, 0.6)", display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Notes & Détails :</strong>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: "4px 0 0 0", lineHeight: 1.6 }}>
                  {selectedOrder.notes || "Aucune note."}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#F87171",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                }}
              >
                🗑 Supprimer la commande
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour, nous faisons suite à votre commande ${selectedOrder.id} (${selectedOrder.productName}) chez Sanad Elec.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#25D366",
                    color: "#000",
                    padding: "10px 18px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>💬</span> Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
