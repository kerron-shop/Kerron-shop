import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search, Heart, ShoppingBag, Scale, User, X, Menu, Star,
  ChevronRight, ChevronLeft, Plus, Minus, Trash2, Package,
  TrendingUp, Users, DollarSign, AlertTriangle, LayoutGrid,
  Facebook, Instagram, MessageCircle, ChevronDown, Check
} from "lucide-react";

/* ---------------------------------------------------------
   TOKENS
   bg-noir   #0B0B0D   fond profond
   bg-blanc  #FAFAF8   fond clair
   or        #C9A24B   accent premium
   or-fonce  #8B6F2E   hover / dark accent
   emeraude  #1F6F54   succès / stock ok / promo
   corail    #B5423A   alerte / stock faible
   gris      #6B6B6F   texte secondaire
--------------------------------------------------------- */

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap";

const CATEGORIES = [
  { id: "electronique", label: "Électronique", n: "01" },
  { id: "telephonie", label: "Téléphonie & Accessoires", n: "02" },
  { id: "beaute", label: "Beauté & Soins", n: "03" },
  { id: "montres", label: "Montres & Bijoux", n: "04" },
  { id: "mode", label: "Vêtements & Chaussures", n: "05" },
  { id: "maison", label: "Maison & Gadgets", n: "06" },
];

const seedProducts = [
  { id: 1, name: "Écouteurs Sans Fil ProSound X2", cat: "electronique", price: 18500, oldPrice: 24000, rating: 4.6, reviews: 128, stock: 34, tag: "Populaire", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600", variants: { Couleur: ["Noir", "Blanc"] }, desc: "Autonomie 30h, réduction de bruit active, résistance à l'eau IPX5. Idéal pour le sport et le quotidien." },
  { id: 2, name: "Montre Connectée Elyté Sport", cat: "montres", price: 27000, oldPrice: null, rating: 4.8, reviews: 92, stock: 12, tag: "Nouveau", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600", variants: { Couleur: ["Argent", "Noir", "Or rose"] }, desc: "Suivi cardiaque, GPS intégré, étanche 50m, écran AMOLED haute luminosité." },
  { id: 3, name: "Coque Renforcée MagSafe", cat: "telephonie", price: 5000, oldPrice: 7500, rating: 4.4, reviews: 210, stock: 87, tag: "Promo", img: "https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=600", variants: { Modèle: ["iPhone 14", "iPhone 15", "Samsung S23"] }, desc: "Protection militaire anti-choc, compatible chargement magnétique rapide." },
  { id: 4, name: "Sérum Éclat Vitamine C", cat: "beaute", price: 9500, oldPrice: null, rating: 4.7, reviews: 156, stock: 45, tag: "Recommandé", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600", variants: { Volume: ["30ml", "50ml"] }, desc: "Formule concentrée anti-tache, unifie le teint, texture légère non grasse." },
  { id: 5, name: "Sneakers Urban Flow", cat: "mode", price: 22000, oldPrice: 29000, rating: 4.5, reviews: 74, stock: 5, tag: "Stock faible", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600", variants: { Taille: ["40", "41", "42", "43", "44"] }, desc: "Semelle mousse réactive, tige respirante, design urbain premium." },
  { id: 6, name: "Lampe LED Ambiance RGB", cat: "maison", price: 12000, oldPrice: null, rating: 4.3, reviews: 61, stock: 60, tag: "Nouveau", img: "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=600", variants: { Taille: ["Petite", "Grande"] }, desc: "16 millions de couleurs, contrôle via application, synchronisation musicale." },
  { id: 7, name: "Chargeur Rapide 65W GaN", cat: "electronique", price: 11000, oldPrice: 14500, rating: 4.6, reviews: 99, stock: 3, tag: "Stock faible", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600", variants: { Prise: ["EU", "UK"] }, desc: "Charge 3 appareils simultanément, technologie GaN compacte et efficace." },
  { id: 8, name: "Sac à Main Cuir Signature", cat: "mode", price: 32000, oldPrice: null, rating: 4.9, reviews: 43, stock: 18, tag: "Populaire", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600", variants: { Couleur: ["Noir", "Camel", "Bordeaux"] }, desc: "Cuir véritable, doublure intérieure premium, fermoir doré signature." },
];

const REVIEWS = [
  { name: "Amina T.", rating: 5, text: "Livraison rapide à Yaoundé, produit conforme à la description." },
  { name: "Junior K.", rating: 4, text: "Bonne qualité pour le prix, je recommande la boutique." },
  { name: "Larissa N.", rating: 5, text: "Service client très réactif sur WhatsApp, top." },
];

const money = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

function useInjectFont() {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = FONT_LINK; l.rel = "stylesheet";
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);
}

function Stars({ value, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(value) ? "#C9A24B" : "none"} color="#C9A24B" strokeWidth={1.5} />
      ))}
    </div>
  );
}

function Badge({ children, tone = "gold" }) {
  const tones = {
    gold: { bg: "#C9A24B", fg: "#0B0B0D" },
    emerald: { bg: "#1F6F54", fg: "#FAFAF8" },
    danger: { bg: "#B5423A", fg: "#FAFAF8" },
  };
  const t = tones[tone];
  return (
    <span style={{ background: t.bg, color: t.fg, fontFamily: "Space Grotesk", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 3, letterSpacing: 0.4, textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function ProductCard({ p, onOpen, wishlist, toggleWish, compare, toggleCompare, addToCart }) {
  const [hover, setHover] = useState(false);
  const tagTone = p.tag === "Promo" ? "emerald" : p.tag === "Stock faible" ? "danger" : "gold";
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: "#fff", border: "1px solid #ECEAE4", borderRadius: 10, overflow: "hidden", position: "relative", transition: "transform .35s ease, box-shadow .35s ease", transform: hover ? "translateY(-6px)" : "none", boxShadow: hover ? "0 20px 40px rgba(11,11,13,.12)" : "0 1px 2px rgba(11,11,13,.04)", display: "flex", flexDirection: "column" }}
    >
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}><Badge tone={tagTone}>{p.tag}</Badge></div>
      <button onClick={() => toggleWish(p.id)} style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "rgba(250,250,248,.9)", border: "none", borderRadius: "50%", width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}>
        <Heart size={16} fill={wishlist.includes(p.id) ? "#B5423A" : "none"} color={wishlist.includes(p.id) ? "#B5423A" : "#0B0B0D"} />
      </button>
      <div onClick={() => onOpen(p)} style={{ cursor: "pointer", height: 210, overflow: "hidden", background: "#F4F2ED" }}>
        <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s ease", transform: hover ? "scale(1.06)" : "scale(1)" }} />
      </div>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: "#6B6B6F", textTransform: "uppercase", letterSpacing: 1 }}>
          {CATEGORIES.find((c) => c.id === p.cat)?.label}
        </span>
        <h3 onClick={() => onOpen(p)} style={{ cursor: "pointer", fontFamily: "Space Grotesk", fontSize: 15.5, fontWeight: 600, margin: 0, color: "#0B0B0D" }}>{p.name}</h3>
        <Stars value={p.rating} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
          <span style={{ fontFamily: "IBM Plex Mono", fontWeight: 500, fontSize: 16 }}>{money(p.price)}</span>
          {p.oldPrice && <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12.5, color: "#A3A19B", textDecoration: "line-through" }}>{money(p.oldPrice)}</span>}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={() => addToCart(p)} style={{ flex: 1, background: "#0B0B0D", color: "#FAFAF8", border: "none", borderRadius: 6, padding: "9px 0", fontFamily: "Space Grotesk", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <ShoppingBag size={14} /> Ajouter
          </button>
          <button onClick={() => toggleCompare(p.id)} title="Comparer" style={{ width: 38, border: `1px solid ${compare.includes(p.id) ? "#C9A24B" : "#ECEAE4"}`, background: compare.includes(p.id) ? "#FBF4E4" : "#fff", borderRadius: 6, cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Scale size={15} color={compare.includes(p.id) ? "#C9A24B" : "#0B0B0D"} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Drawer({ open, onClose, title, children, width = 400 }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,11,13,.45)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .3s", zIndex: 40 }} />
      <div style={{ position: "fixed", top: 0, right: 0, height: "100%", width, maxWidth: "90vw", background: "#FAFAF8", zIndex: 41, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .35s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column", boxShadow: "-10px 0 30px rgba(0,0,0,.15)" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #ECEAE4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "Space Grotesk", fontWeight: 600, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>{children}</div>
      </div>
    </>
  );
}

function CartDrawer({ open, onClose, cart, setCart, city, setCity }) {
  const zones = { "Yaoundé - Centre": 1000, "Yaoundé - Périphérie": 2000, "Autre ville": 4500 };
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = zones[city] || 0;
  const discount = applied === "KERRON10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;
  const upd = (id, d) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const rm = (id) => setCart((c) => c.filter((i) => i.id !== id));
  return (
    <Drawer open={open} onClose={onClose} title={`Panier (${cart.length})`}>
      {cart.length === 0 ? (
        <p style={{ color: "#6B6B6F", fontFamily: "Inter" }}>Votre panier est vide.</p>
      ) : (
        <>
          {cart.map((i) => (
            <div key={i.id} style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #ECEAE4" }}>
              <img src={i.img} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 13.5 }}>{i.name}</div>
                <div style={{ fontFamily: "IBM Plex Mono", fontSize: 13, marginTop: 2 }}>{money(i.price)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <button onClick={() => upd(i.id, -1)} style={{ border: "1px solid #ECEAE4", background: "#fff", width: 24, height: 24, borderRadius: 4, cursor: "pointer" }}><Minus size={12} /></button>
                  <span style={{ fontFamily: "IBM Plex Mono", fontSize: 13 }}>{i.qty}</span>
                  <button onClick={() => upd(i.id, 1)} style={{ border: "1px solid #ECEAE4", background: "#fff", width: 24, height: 24, borderRadius: 4, cursor: "pointer" }}><Plus size={12} /></button>
                  <button onClick={() => rm(i.id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={15} color="#B5423A" /></button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <label style={{ fontFamily: "Space Grotesk", fontSize: 12, fontWeight: 600 }}>Zone de livraison</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 6, border: "1px solid #ECEAE4", fontFamily: "Inter", marginBottom: 14 }}>
              <option value="">Sélectionner une zone</option>
              {Object.keys(zones).map((z) => <option key={z} value={z}>{z} — {money(zones[z])}</option>)}
            </select>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Code promo" style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ECEAE4", fontFamily: "Inter" }} />
              <button onClick={() => setApplied(coupon.toUpperCase() === "KERRON10" ? "KERRON10" : "invalid")} style={{ padding: "0 14px", borderRadius: 6, border: "none", background: "#0B0B0D", color: "#fff", fontFamily: "Space Grotesk", fontWeight: 600, cursor: "pointer" }}>OK</button>
            </div>
            {applied === "invalid" && <p style={{ color: "#B5423A", fontSize: 12.5 }}>Code invalide.</p>}
            {applied === "KERRON10" && <p style={{ color: "#1F6F54", fontSize: 12.5 }}>Coupon KERRON10 appliqué : -10%</p>}
            <div style={{ borderTop: "1px solid #ECEAE4", paddingTop: 12, fontFamily: "IBM Plex Mono", fontSize: 13.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Sous-total</span><span>{money(subtotal)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Livraison</span><span>{city ? money(shipping) : "—"}</span></div>
              {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#1F6F54" }}><span>Réduction</span><span>-{money(discount)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginTop: 8 }}><span>Total</span><span>{money(total)}</span></div>
            </div>
            <button style={{ width: "100%", marginTop: 16, background: "#C9A24B", color: "#0B0B0D", border: "none", borderRadius: 6, padding: "13px 0", fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Passer la commande — Paiement sécurisé
            </button>
          </div>
        </>
      )}
    </Drawer>
  );
}

function ProductModal({ p, onClose, addToCart, similar, onOpen }) {
  const [variant, setVariant] = useState({});
  const [zoom, setZoom] = useState(false);
  if (!p) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,11,13,.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, maxWidth: 920, width: "100%", maxHeight: "88vh", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="modal-grid">
        <div onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)} style={{ overflow: "hidden", background: "#F4F2ED", cursor: "zoom-in" }}>
          <img src={p.img} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s", transform: zoom ? "scale(1.4)" : "scale(1)" }} />
        </div>
        <div style={{ padding: 28 }}>
          <button onClick={onClose} style={{ float: "right", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
          <Badge>{p.tag}</Badge>
          <h2 style={{ fontFamily: "Space Grotesk", fontSize: 24, marginTop: 12, marginBottom: 6 }}>{p.name}</h2>
          <Stars value={p.rating} size={16} />
          <span style={{ fontFamily: "Inter", fontSize: 12.5, color: "#6B6B6F", marginLeft: 8 }}>{p.reviews} avis</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "14px 0" }}>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 22, fontWeight: 600 }}>{money(p.price)}</span>
            {p.oldPrice && <span style={{ fontFamily: "IBM Plex Mono", fontSize: 14, color: "#A3A19B", textDecoration: "line-through" }}>{money(p.oldPrice)}</span>}
          </div>
          <p style={{ fontFamily: "Inter", fontSize: 14, color: "#4A4A4D", lineHeight: 1.6 }}>{p.desc}</p>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: p.stock < 8 ? "#B5423A" : "#1F6F54", fontWeight: 600 }}>
            {p.stock < 8 ? `Plus que ${p.stock} en stock` : "En stock"}
          </p>
          {Object.entries(p.variants || {}).map(([k, opts]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 12.5, marginBottom: 6 }}>{k}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {opts.map((o) => (
                  <button key={o} onClick={() => setVariant((v) => ({ ...v, [k]: o }))} style={{ padding: "7px 13px", borderRadius: 6, border: `1px solid ${variant[k] === o ? "#0B0B0D" : "#ECEAE4"}`, background: variant[k] === o ? "#0B0B0D" : "#fff", color: variant[k] === o ? "#fff" : "#0B0B0D", fontFamily: "Inter", fontSize: 12.5, cursor: "pointer" }}>{o}</button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={() => addToCart(p)} style={{ flex: 1, background: "#0B0B0D", color: "#fff", border: "none", borderRadius: 7, padding: "13px 0", fontFamily: "Space Grotesk", fontWeight: 600, cursor: "pointer" }}>Ajouter au panier</button>
            <button onClick={() => addToCart(p)} style={{ flex: 1, background: "#C9A24B", color: "#0B0B0D", border: "none", borderRadius: 7, padding: "13px 0", fontFamily: "Space Grotesk", fontWeight: 700, cursor: "pointer" }}>Acheter maintenant</button>
          </div>
          <div style={{ marginTop: 26, borderTop: "1px solid #ECEAE4", paddingTop: 16 }}>
            <h4 style={{ fontFamily: "Space Grotesk", fontSize: 14 }}>Avis clients</h4>
            {REVIEWS.slice(0, 2).map((r, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 12.5, fontFamily: "Inter" }}>{r.name}</b><Stars value={r.rating} size={11} /></div>
                <p style={{ fontSize: 12.5, color: "#6B6B6F", margin: "2px 0" }}>{r.text}</p>
              </div>
            ))}
          </div>
          {similar.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <h4 style={{ fontFamily: "Space Grotesk", fontSize: 14, marginBottom: 10 }}>Produits similaires</h4>
              <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
                {similar.map((s) => (
                  <img key={s.id} onClick={() => onOpen(s)} src={s.img} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, cursor: "pointer" }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountModal({ onClose }) {
  const [tab, setTab] = useState("login");
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(11,11,13,.55)", zIndex: 50, display: "grid", placeItems: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width: 380, padding: 30, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
        <div style={{ display: "flex", gap: 20, marginBottom: 22, borderBottom: "1px solid #ECEAE4" }}>
          {["login", "register"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", padding: "0 0 12px", fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 14, cursor: "pointer", color: tab === t ? "#0B0B0D" : "#A3A19B", borderBottom: tab === t ? "2px solid #C9A24B" : "none" }}>
              {t === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>
        {tab === "register" && <input placeholder="Nom complet" style={{ width: "100%", padding: 11, marginBottom: 10, borderRadius: 6, border: "1px solid #ECEAE4" }} />}
        <input placeholder="Email ou téléphone" style={{ width: "100%", padding: 11, marginBottom: 10, borderRadius: 6, border: "1px solid #ECEAE4" }} />
        <input type="password" placeholder="Mot de passe" style={{ width: "100%", padding: 11, marginBottom: 16, borderRadius: 6, border: "1px solid #ECEAE4" }} />
        <button style={{ width: "100%", background: "#0B0B0D", color: "#fff", border: "none", borderRadius: 7, padding: 12, fontFamily: "Space Grotesk", fontWeight: 600, cursor: "pointer" }}>
          {tab === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
        <p style={{ fontSize: 11.5, color: "#A3A19B", textAlign: "center", marginTop: 14 }}>Démo — aucune donnée n'est envoyée à un serveur.</p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #ECEAE4", padding: "16px 0" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 14.5, color: "#0B0B0D" }}>{q}</span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
      </button>
      {open && <p style={{ fontFamily: "Inter", fontSize: 13.5, color: "#6B6B6F", marginTop: 10, lineHeight: 1.6 }}>{a}</p>}
    </div>
  );
}

/* ---------------- ADMIN ---------------- */
function AdminDashboard({ products, setProducts, onExit }) {
  const [tab, setTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const lowStock = products.filter((p) => p.stock < 8);
  const salesData = [420, 610, 380, 720, 900, 640, 830];
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const maxSale = Math.max(...salesData);

  const saveProduct = (p) => {
    setProducts((list) => (list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? p : x)) : [...list, { ...p, id: Date.now() }]));
    setEditing(null);
  };
  const removeProduct = (id) => setProducts((l) => l.filter((x) => x.id !== id));

  return (
    <div style={{ minHeight: "100vh", background: "#F4F2ED", fontFamily: "Inter" }}>
      <div style={{ background: "#0B0B0D", color: "#fff", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LayoutGrid size={20} color="#C9A24B" />
          <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 16 }}>KERRON SHOP — Admin</span>
        </div>
        <button onClick={onExit} style={{ background: "#C9A24B", border: "none", color: "#0B0B0D", padding: "9px 16px", borderRadius: 6, fontFamily: "Space Grotesk", fontWeight: 600, cursor: "pointer" }}>Retour boutique</button>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: 210, background: "#fff", minHeight: "calc(100vh - 60px)", padding: 18, borderRight: "1px solid #ECEAE4" }}>
          {[
            { id: "dashboard", label: "Tableau de bord", icon: TrendingUp },
            { id: "products", label: "Produits", icon: Package },
            { id: "orders", label: "Commandes", icon: ShoppingBag },
            { id: "customers", label: "Clients", icon: Users },
            { id: "promos", label: "Promotions", icon: DollarSign },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", marginBottom: 6, background: tab === t.id ? "#0B0B0D" : "transparent", color: tab === t.id ? "#fff" : "#0B0B0D", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "Space Grotesk", fontSize: 13.5, fontWeight: 600 }}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28 }}>
          {tab === "dashboard" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Ventes (7j)", value: "1 234 000 FCFA", icon: DollarSign },
                  { label: "Commandes", value: "58", icon: ShoppingBag },
                  { label: "Clients", value: "412", icon: Users },
                  { label: "Alertes stock", value: lowStock.length, icon: AlertTriangle },
                ].map((c, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 18, border: "1px solid #ECEAE4" }}>
                    <c.icon size={18} color="#C9A24B" />
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: 20, fontWeight: 600, marginTop: 10 }}>{c.value}</div>
                    <div style={{ fontSize: 12, color: "#6B6B6F", marginTop: 2 }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 10, padding: 22, border: "1px solid #ECEAE4", marginBottom: 20 }}>
                <h4 style={{ fontFamily: "Space Grotesk", marginTop: 0 }}>Ventes de la semaine</h4>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 140 }}>
                  {salesData.map((v, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: (v / maxSale) * 110, background: "linear-gradient(180deg,#C9A24B,#8B6F2E)", borderRadius: "4px 4px 0 0" }} />
                      <div style={{ fontSize: 11, color: "#6B6B6F", marginTop: 6 }}>{days[i]}</div>
                    </div>
                  ))}
                </div>
              </div>
              {lowStock.length > 0 && (
                <div style={{ background: "#FCEEEC", border: "1px solid #F0C7C0", borderRadius: 10, padding: 16 }}>
                  <b style={{ color: "#B5423A", fontFamily: "Space Grotesk", fontSize: 13.5 }}>⚠ Stock faible</b>
                  {lowStock.map((p) => <div key={p.id} style={{ fontSize: 13, marginTop: 6 }}>{p.name} — {p.stock} restants</div>)}
                </div>
              )}
            </>
          )}
          {tab === "products" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontFamily: "Space Grotesk", margin: 0 }}>Produits ({products.length})</h3>
                <button onClick={() => setEditing({ id: null, name: "", cat: "electronique", price: 0, stock: 0, img: "", tag: "Nouveau", rating: 5, reviews: 0, desc: "" })} style={{ background: "#0B0B0D", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontFamily: "Space Grotesk", fontWeight: 600, cursor: "pointer" }}>+ Ajouter un produit</button>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #ECEAE4", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: "#F4F2ED", textAlign: "left" }}>
                    <th style={{ padding: 12 }}>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th></th>
                  </tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={{ borderTop: "1px solid #ECEAE4" }}>
                        <td style={{ padding: 12, fontWeight: 600 }}>{p.name}</td>
                        <td>{CATEGORIES.find((c) => c.id === p.cat)?.label}</td>
                        <td style={{ fontFamily: "IBM Plex Mono" }}>{money(p.price)}</td>
                        <td style={{ color: p.stock < 8 ? "#B5423A" : "#1F6F54", fontWeight: 600 }}>{p.stock}</td>
                        <td>
                          <button onClick={() => setEditing(p)} style={{ marginRight: 8, background: "none", border: "1px solid #ECEAE4", borderRadius: 5, padding: "5px 10px", cursor: "pointer" }}>Modifier</button>
                          <button onClick={() => removeProduct(p.id)} style={{ background: "none", border: "1px solid #F0C7C0", color: "#B5423A", borderRadius: 5, padding: "5px 10px", cursor: "pointer" }}>Supprimer</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {editing && (
                <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "grid", placeItems: "center", zIndex: 60 }}>
                  <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: 24, borderRadius: 10, width: 380 }}>
                    <h4 style={{ fontFamily: "Space Grotesk", marginTop: 0 }}>{editing.id ? "Modifier le produit" : "Nouveau produit"}</h4>
                    {["name", "price", "stock", "img"].map((f) => (
                      <input key={f} placeholder={f} value={editing[f]} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} style={{ width: "100%", padding: 10, marginBottom: 8, borderRadius: 6, border: "1px solid #ECEAE4" }} />
                    ))}
                    <button onClick={() => saveProduct({ ...editing, price: +editing.price || 0, stock: +editing.stock || 0 })} style={{ width: "100%", background: "#0B0B0D", color: "#fff", border: "none", borderRadius: 7, padding: 11, fontFamily: "Space Grotesk", fontWeight: 600, cursor: "pointer" }}>Enregistrer</button>
                  </div>
                </div>
              )}
            </>
          )}
          {tab === "orders" && <p style={{ color: "#6B6B6F" }}>Module de gestion des commandes — données de démonstration, à connecter à votre système de paiement.</p>}
          {tab === "customers" && <p style={{ color: "#6B6B6F" }}>Module de gestion des clients — 412 comptes enregistrés (démo).</p>}
          {tab === "promos" && <p style={{ color: "#6B6B6F" }}>Code actif : <b>KERRON10</b> (-10% sur le panier).</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  useInjectFont();
  const [products, setProducts] = useState(seedProducts);
  const [view, setView] = useState("shop");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compare, setCompare] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [city, setCity] = useState("");
  const [toast, setToast] = useState("");
  const [legalModal, setLegalModal] = useState(null);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 2200); return () => clearTimeout(t); } }, [toast]);

  const addToCart = (p) => {
    setCart((c) => (c.some((i) => i.id === p.id) ? c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { ...p, qty: 1 }]));
    setToast(`${p.name} ajouté au panier`);
  };
  const toggleWish = (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const toggleCompare = (id) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));

  const filtered = useMemo(() => products.filter((p) =>
    (!activeCat || p.cat === activeCat) &&
    (p.name.toLowerCase().includes(query.toLowerCase()))
  ), [products, activeCat, query]);

  const popular = products.filter((p) => p.tag === "Populaire");
  const news = products.filter((p) => p.tag === "Nouveau");
  const promo = products.filter((p) => p.tag === "Promo" || p.oldPrice);
  const recommended = products.slice(0, 4);
  const similarFor = (p) => products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  if (view === "admin") return <AdminDashboard products={products} setProducts={setProducts} onExit={() => setView("shop")} />;

  return (
    <div style={{ fontFamily: "Inter", color: "#0B0B0D", background: "#FAFAF8" }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 860px) { .modal-grid { grid-template-columns: 1fr !important; } .cats-rail { flex-wrap: nowrap; overflow-x: auto; } }
        .grid-products { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 1024px) { .grid-products { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .grid-products { grid-template-columns: 1fr; } }
        ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-thumb { background: #D8D5CD; border-radius: 4px; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 30, background: "#FAFAF8", borderBottom: "1px solid #ECEAE4" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 22, letterSpacing: -0.5 }}>KERRON <span style={{ color: "#C9A24B" }}>SHOP</span></span>
          <div style={{ flex: 1, position: "relative", maxWidth: 520 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: 12 }} color="#A3A19B" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un produit, une marque…" style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 24, border: "1px solid #ECEAE4", fontFamily: "Inter", fontSize: 13.5, background: "#fff" }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
            {[
              { icon: User, action: () => setAccountOpen(true) },
              { icon: Scale, action: () => setCompareOpen(true), badge: compare.length },
              { icon: Heart, action: () => setWishOpen(true), badge: wishlist.length },
              { icon: ShoppingBag, action: () => setCartOpen(true), badge: cart.length },
            ].map((b, i) => (
              <button key={i} onClick={b.action} style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", border: "1px solid #ECEAE4", background: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
                <b.icon size={17} />
                {b.badge > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#C9A24B", color: "#0B0B0D", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 17, height: 17, display: "grid", placeItems: "center" }}>{b.badge}</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="cats-rail" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 14px", display: "flex", gap: 22 }}>
          <button onClick={() => setActiveCat(null)} style={{ whiteSpace: "nowrap", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Grotesk", fontSize: 12.5, fontWeight: 600, color: !activeCat ? "#C9A24B" : "#6B6B6F" }}>Tout voir</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ whiteSpace: "nowrap", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Grotesk", fontSize: 12.5, fontWeight: 600, color: activeCat === c.id ? "#C9A24B" : "#6B6B6F" }}>
              <span style={{ color: "#D8C48A", marginRight: 5 }}>{c.n}</span>{c.label}
            </button>
          ))}
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "#0B0B0D", color: "#FAFAF8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: "#C9A24B", letterSpacing: 2 }}>COMMERCE GÉNÉRAL — YAOUNDÉ</span>
            <h1 style={{ fontFamily: "Space Grotesk", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, lineHeight: 1.08, margin: "14px 0" }}>
              Tout ce qu'il vous faut,<br />livré à votre porte.
            </h1>
            <p style={{ fontFamily: "Inter", color: "#B8B6B0", fontSize: 15.5, maxWidth: 420, lineHeight: 1.6 }}>
              Électronique, mode, beauté, maison — une sélection premium à prix juste, avec livraison rapide dans tout Yaoundé.
            </p>
            <button onClick={() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })} style={{ marginTop: 22, background: "#C9A24B", color: "#0B0B0D", border: "none", borderRadius: 7, padding: "14px 26px", fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Découvrir la boutique
            </button>
          </div>
          <div style={{ flex: 1, minWidth: 280, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10 }} />
            <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10, marginTop: 24 }} />
            <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, marginTop: -24 }} />
            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <div id="catalogue" style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px" }}>
        {[
          { title: "Produits populaires", data: activeCat || query ? filtered : popular },
          !activeCat && !query && { title: "Nouveautés", data: news },
          !activeCat && !query && { title: "En promotion", data: promo },
        ].filter(Boolean).map((sec, i) => (
          <div key={i} style={{ marginBottom: 52 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Space Grotesk", fontSize: 24, margin: 0 }}>{sec.title}</h2>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: "#A3A19B" }}>{sec.data.length} article{sec.data.length > 1 ? "s" : ""}</span>
            </div>
            {sec.data.length === 0 ? (
              <p style={{ color: "#A3A19B", fontFamily: "Inter" }}>Aucun produit trouvé.</p>
            ) : (
              <div className="grid-products">
                {sec.data.map((p) => (
                  <ProductCard key={p.id} p={p} onOpen={setOpenProduct} wishlist={wishlist} toggleWish={toggleWish} compare={compare} toggleCompare={toggleCompare} addToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* RECOMMANDÉS + AVIS */}
      <section style={{ background: "#F4F2ED", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Space Grotesk", fontSize: 24, marginBottom: 20 }}>Ce que disent nos clients</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 20, border: "1px solid #ECEAE4" }}>
                <Stars value={r.rating} />
                <p style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4A4A4D", margin: "10px 0" }}>« {r.text} »</p>
                <b style={{ fontFamily: "Space Grotesk", fontSize: 12.5 }}>{r.name}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: "#0B0B0D", color: "#fff", padding: "48px 24px", textAlign: "center" }}>
        <h3 style={{ fontFamily: "Space Grotesk", fontSize: 22, marginBottom: 8 }}>Recevez nos offres en avant-première</h3>
        <p style={{ color: "#B8B6B0", fontSize: 13.5, marginBottom: 20 }}>Inscrivez-vous à la newsletter Kerron Shop.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <input placeholder="Votre email" style={{ padding: "12px 16px", borderRadius: 24, border: "none", minWidth: 260 }} />
          <button onClick={() => setToast("Merci pour votre inscription !")} style={{ background: "#C9A24B", color: "#0B0B0D", border: "none", borderRadius: 24, padding: "12px 24px", fontFamily: "Space Grotesk", fontWeight: 700, cursor: "pointer" }}>S'inscrire</button>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px" }}>
        <h2 style={{ fontFamily: "Space Grotesk", fontSize: 24, marginBottom: 20 }}>Questions fréquentes</h2>
        <FAQItem q="Quels sont les délais de livraison ?" a="24h à Yaoundé centre, 48h en périphérie, 3 à 5 jours pour les autres villes." />
        <FAQItem q="Quels moyens de paiement acceptez-vous ?" a="Mobile Money (Orange, MTN), paiement à la livraison, et carte bancaire." />
        <FAQItem q="Puis-je retourner un produit ?" a="Oui, sous 7 jours si le produit est non utilisé et dans son emballage d'origine." />
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0B0B0D", color: "#B8B6B0", padding: "48px 24px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 30, marginBottom: 30 }}>
          <div>
            <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 18, color: "#fff" }}>KERRON SHOP</span>
            <p style={{ fontSize: 12.5, marginTop: 10, lineHeight: 1.7 }}>Commerce général en ligne — Yaoundé, Cameroun.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <Facebook size={17} /> <Instagram size={17} /> <MessageCircle size={17} />
            </div>
          </div>
          <div>
            <b style={{ color: "#fff", fontFamily: "Space Grotesk", fontSize: 13.5 }}>Informations</b>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, fontSize: 12.5 }}>
              <button onClick={() => setLegalModal("retour")} style={{ background: "none", border: "none", color: "#B8B6B0", textAlign: "left", cursor: "pointer", padding: 0 }}>Politique de retour</button>
              <button onClick={() => setLegalModal("cgv")} style={{ background: "none", border: "none", color: "#B8B6B0", textAlign: "left", cursor: "pointer", padding: 0 }}>Conditions générales</button>
              <button onClick={() => setLegalModal("confidentialite")} style={{ background: "none", border: "none", color: "#B8B6B0", textAlign: "left", cursor: "pointer", padding: 0 }}>Politique de confidentialité</button>
            </div>
          </div>
          <div>
            <b style={{ color: "#fff", fontFamily: "Space Grotesk", fontSize: 13.5 }}>Contact</b>
            <p style={{ fontSize: 12.5, marginTop: 12, lineHeight: 1.8 }}>Yaoundé, Cameroun<br />+237 6XX XXX XXX<br />contact@kerronshop.cm</p>
          </div>
          <div>
            <b style={{ color: "#fff", fontFamily: "Space Grotesk", fontSize: 13.5 }}>Espace pro</b>
            <button onClick={() => setView("admin")} style={{ marginTop: 12, background: "none", border: "1px solid #3A3A3D", color: "#B8B6B0", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12.5 }}>Tableau de bord admin</button>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2A2A2D", paddingTop: 18, textAlign: "center", fontSize: 11.5 }}>© 2026 Kerron Shop. Tous droits réservés.</div>
      </footer>

      {/* WHATSAPP FLOTTANT */}
      <a href="https://wa.me/237600000000" target="_blank" rel="noreferrer" style={{ position: "fixed", bottom: 24, right: 24, background: "#25D366", width: 54, height: 54, borderRadius: "50%", display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(0,0,0,.25)", zIndex: 35 }}>
        <MessageCircle color="#fff" size={26} />
      </a>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#0B0B0D", color: "#fff", padding: "12px 20px", borderRadius: 8, fontFamily: "Space Grotesk", fontSize: 13, zIndex: 60, display: "flex", alignItems: "center", gap: 8 }}>
          <Check size={15} color="#C9A24B" /> {toast}
        </div>
      )}

      {/* DRAWERS & MODALS */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} city={city} setCity={setCity} />
      <Drawer open={wishOpen} onClose={() => setWishOpen(false)} title={`Liste de souhaits (${wishlist.length})`}>
        {products.filter((p) => wishlist.includes(p.id)).map((p) => (
          <div key={p.id} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #ECEAE4" }}>
            <img src={p.img} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 13 }}>{p.name}</div>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12.5 }}>{money(p.price)}</div>
            </div>
            <button onClick={() => addToCart(p)} style={{ background: "#0B0B0D", color: "#fff", border: "none", borderRadius: 5, padding: "0 10px", cursor: "pointer", fontSize: 11 }}>Ajouter</button>
          </div>
        ))}
        {wishlist.length === 0 && <p style={{ color: "#6B6B6F" }}>Aucun favori pour l'instant.</p>}
      </Drawer>
      <Drawer open={compareOpen} onClose={() => setCompareOpen(false)} title="Comparateur" width={520}>
        {compare.length === 0 ? <p style={{ color: "#6B6B6F" }}>Sélectionnez jusqu'à 3 produits à comparer.</p> : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${compare.length},1fr)`, gap: 12 }}>
            {products.filter((p) => compare.includes(p.id)).map((p) => (
              <div key={p.id} style={{ border: "1px solid #ECEAE4", borderRadius: 8, padding: 12 }}>
                <img src={p.img} style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 12.5, marginTop: 8 }}>{p.name}</div>
                <div style={{ fontFamily: "IBM Plex Mono", fontSize: 13, margin: "6px 0" }}>{money(p.price)}</div>
                <Stars value={p.rating} size={12} />
                <p style={{ fontSize: 11, color: "#6B6B6F", marginTop: 6 }}>Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        )}
      </Drawer>
      {openProduct && <ProductModal p={openProduct} onClose={() => setOpenProduct(null)} addToCart={addToCart} similar={similarFor(openProduct)} onOpen={setOpenProduct} />}
      {accountOpen && <AccountModal onClose={() => setAccountOpen(false)} />}
      {legalModal && (
        <div onClick={() => setLegalModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 55, display: "grid", placeItems: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, padding: 28, maxWidth: 480, maxHeight: "70vh", overflowY: "auto" }}>
            <h3 style={{ fontFamily: "Space Grotesk" }}>
              {legalModal === "retour" ? "Politique de retour" : legalModal === "cgv" ? "Conditions générales de vente" : "Politique de confidentialité"}
            </h3>
            <p style={{ fontFamily: "Inter", fontSize: 13.5, color: "#4A4A4D", lineHeight: 1.7 }}>
              Contenu de démonstration — à remplacer par vos conditions réelles avant la mise en ligne du site.
            </p>
            <button onClick={() => setLegalModal(null)} style={{ background: "#0B0B0D", color: "#fff", border: "none", borderRadius: 6, padding: "10px 18px", cursor: "pointer", fontFamily: "Space Grotesk" }}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
