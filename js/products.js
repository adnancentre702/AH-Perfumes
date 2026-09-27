/* ============================================================================
   AH PERFUMES — CENTRAL CONFIGURATION & PRODUCT DATA
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to update business information,
   prices, WhatsApp number, owners and product content.
   Everything else on the website reads from here.
   ============================================================================ */

/* ---------------------------------------------------------------------------
   1) BRAND CONFIGURATION
   Edit these values to match the real business details.
   --------------------------------------------------------------------------- */
const BRAND_CONFIG = {
  name: "AH Perfumes",
  tagline: "Wear your signature",
  location: "Sargodha, Pakistan",

  // Price shown across the whole site
  price: 2999,
  currency: "PKR", // displayed as "Rs." / "PKR"

  // Delivery — set `deliveryArea` to "" if nationwide is NOT confirmed
  freeDelivery: true,
  deliveryArea: "Across Pakistan", // e.g. "Across Pakistan" or leave "" for just "Free Home Delivery"

  // WhatsApp number in FULL international format, digits only, no "+" or spaces.
  // Pakistan example: 923001234567  (92 + number without leading 0)
  whatsappNumber: "923001481123",

  // Owners
  // Phone numbers should be in full international format for tel:/WhatsApp links.
  ownerOne: {
    name: "Abu-Bakar Zahoor",
    phone: "923001481123",
  },
  ownerTwo: {
    name: "Hamza Arshad",
    phone: "923437529009",
  },

  // Social links — leave "" to hide the icon. Do NOT invent accounts.
  social: {
    instagram: "https://www.instagram.com/perfumes_by_a.h",
    facebook: "", // e.g. "https://facebook.com/yourbrand"
    tiktok: "",
  },
};

/* ---------------------------------------------------------------------------
   2) PRODUCT DATA  — exactly four perfumes
   Each perfume maps to the supplied bottle + packaging images.

   NOTE ON FRAGRANCE NOTES:
   The note lists below are SAMPLE PLACEHOLDERS to demonstrate the layout.
   Replace them with the brand's real notes. A small on-page caption discloses
   this while `notesArePlaceholder` is true — set it to false once real notes
   are entered.
   --------------------------------------------------------------------------- */
const NOTES_ARE_PLACEHOLDER = true;

const PRODUCTS = [
  {
    id: "khumra",
    index: "01",
    name: "Khumra",
    type: "Eau de Parfum · Oriental Amber",
    accent: "#c9a35d", // per-product accent colour
    tone: "warm",
    short:
      "A golden, resinous signature — deep, warm and unmistakably magnetic.",
    description:
      "Khumra opens rich and radiant, a slow-burning amber wrapped in warmth. " +
      "It settles close to the skin and lingers into the evening — an intimate trail " +
      "made for those who prefer presence over noise.",
    notes: {
      top: ["Saffron", "Bergamot"],
      heart: ["Rose", "Oud"],
      base: ["Amber", "Musk"],
    },
    bottle: "assets/images/perfume-01-bottle",
    box: "assets/images/perfume-01-box",
    alt: "Khumra by AH Perfumes — amber fragrance in a clear glass bottle",
  },
  {
    id: "silver",
    index: "02",
    name: "Silver",
    type: "Eau de Parfum · Fresh Aromatic",
    accent: "#9aa6ad",
    tone: "cool",
    short:
      "Crisp, clean and modern — a bright metallic freshness that never fades quietly.",
    description:
      "Silver is clarity in a bottle: an airy, aromatic freshness with a cool, polished " +
      "edge. Effortless for daily wear, confident enough for anywhere the day takes you.",
    notes: {
      top: ["Marine Accord", "Mint"],
      heart: ["Lavender", "Geranium"],
      base: ["Cedarwood", "White Musk"],
    },
    bottle: "assets/images/perfume-02-bottle",
    box: "assets/images/perfume-02-box",
    alt: "Silver by AH Perfumes — fresh fragrance in a clear crystal bottle",
  },
  {
    id: "hillfiger",
    index: "03",
    name: "Hillfiger",
    type: "Eau de Parfum · Floral",
    accent: "#d9a7ad",
    tone: "soft",
    short:
      "Delicate rose-petal blush — a soft, romantic floral with lasting elegance.",
    description:
      "Hillfiger is tender and luminous — a blush-pink floral built around soft petals and " +
      "a gentle sweetness. Graceful, feminine and quietly memorable.",
    notes: {
      top: ["Pink Pepper", "Mandarin"],
      heart: ["Peony", "Jasmine"],
      base: ["Vanilla", "Sandalwood"],
    },
    bottle: "assets/images/perfume-03-bottle",
    box: "assets/images/perfume-03-box",
    alt: "Hillfiger by AH Perfumes — pink floral fragrance in a clear bottle",
  },
  {
    id: "wanted",
    index: "04",
    name: "Wanted",
    type: "Eau de Parfum · Woody Spicy",
    accent: "#b98a4e",
    tone: "warm",
    short:
      "Bold, spicy and warm — an assertive woody character with real staying power.",
    description:
      "Wanted is charismatic and daring: a warm, spiced woodiness that commands the room " +
      "without ever trying too hard. For the confident and the unforgettable.",
    notes: {
      top: ["Cardamom", "Lemon"],
      heart: ["Cinnamon", "Lavender"],
      base: ["Tonka Bean", "Leather"],
    },
    bottle: "assets/images/perfume-04-bottle",
    box: "assets/images/perfume-04-box",
    alt: "Wanted by AH Perfumes — warm woody fragrance in a clear bottle",
  },
];

/* ---------------------------------------------------------------------------
   3) HELPERS — derived strings & links (no need to edit)
   --------------------------------------------------------------------------- */
const AH = {
  /** "Rs. 2,999" */
  priceLabel() {
    return "Rs. " + BRAND_CONFIG.price.toLocaleString("en-PK");
  },
  /** "PKR 2,999" */
  priceLabelPKR() {
    return "PKR " + BRAND_CONFIG.price.toLocaleString("en-PK");
  },
  /** Delivery line, respecting confirmed area */
  deliveryLabel() {
    if (!BRAND_CONFIG.freeDelivery) return "";
    return BRAND_CONFIG.deliveryArea
      ? "Free Home Delivery " + BRAND_CONFIG.deliveryArea
      : "Free Home Delivery";
  },
  /** Build a wa.me link with a pre-filled, URL-encoded message */
  waLink(message) {
    const num = (BRAND_CONFIG.whatsappNumber || "").replace(/[^0-9]/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(message);
  },
  /** Order-a-specific-product message */
  waOrder(productName) {
    return this.waLink(
      `Hello ${BRAND_CONFIG.name}, I would like to order ${productName} for ${this.priceLabel()}. Please share the details.`,
    );
  },
  /** General enquiry message */
  waGeneral() {
    return this.waLink(
      `Hello ${BRAND_CONFIG.name}, I am interested in your perfumes. Please share the details.`,
    );
  },
  /** tel: link from a phone string */
  telLink(phone) {
    return "tel:+" + (phone || "").replace(/[^0-9]/g, "");
  },
  /** Pretty display for a Pakistani mobile: +92 3XX XXXXXXX */
  phoneDisplay(phone) {
    const d = (phone || "").replace(/[^0-9]/g, "");
    if (d.length === 12 && d.startsWith("92")) {
      return "+92 " + d.slice(2, 5) + " " + d.slice(5);
    }
    return "+" + d;
  },
  /** Direct WhatsApp chat with a specific number (owner) */
  waOwner(phone) {
    const num = (phone || "").replace(/[^0-9]/g, "");
    return (
      "https://wa.me/" +
      num +
      "?text=" +
      encodeURIComponent(
        `Hello, I'm interested in ${BRAND_CONFIG.name} perfumes.`,
      )
    );
  },
};

// Expose globally for the other scripts
window.BRAND_CONFIG = BRAND_CONFIG;
window.PRODUCTS = PRODUCTS;
window.NOTES_ARE_PLACEHOLDER = NOTES_ARE_PLACEHOLDER;
window.AH = AH;
