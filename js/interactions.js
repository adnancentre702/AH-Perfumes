/* ============================================================================
   AH PERFUMES — INTERACTIONS
   - Injects config-driven content (prices, delivery, WhatsApp links, owners)
   - Renders the 4 perfume chapters + collection overview from PRODUCTS
   - Navigation: scroll state, mobile overlay menu, smooth anchor scroll
   ============================================================================ */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* WhatsApp inline SVG (reused) */
  const WA_ICON =
    '<svg class="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';

  /* ---------- 1) Config-driven text & links ---------- */
  function applyConfig() {
    const c = window.BRAND_CONFIG;

    // price labels
    $$("[data-price]").forEach(
      (el) => (el.textContent = window.AH.priceLabel()),
    );
    // delivery labels
    $$("[data-delivery]").forEach(
      (el) => (el.textContent = window.AH.deliveryLabel()),
    );
    // location
    $$("[data-location]").forEach((el) => (el.textContent = c.location));
    // year
    $$("[data-year]").forEach(
      (el) => (el.textContent = new Date().getFullYear()),
    );
    // brand name
    $$("[data-brand]").forEach((el) => (el.textContent = c.name));

    // general WhatsApp links (buttons that order-in-general)
    $$("[data-wa-general]").forEach((a) => (a.href = window.AH.waGeneral()));

    // floating button
    const fab = $(".wa-float");
    if (fab) fab.href = window.AH.waGeneral();

    // Ensure every WhatsApp button has the icon (static buttons in HTML omit it)
    $$(".btn-wa").forEach((btn) => {
      if (!btn.querySelector("svg"))
        btn.insertAdjacentHTML("afterbegin", WA_ICON);
    });
  }

  /* ---------- 2) Render perfume chapters ---------- */
  function chapterMarkup(p, i) {
    const dark = i % 2 === 0; // alternate dark / light backgrounds
    const themeClass = dark ? "dark on-dark" : "light on-light";
    const notesRow = (label, arr) =>
      `<div class="notes__row">
         <span class="notes__label">${label}</span>
         <div class="notes__chips">${arr.map((n) => `<span class="notes__chip">${n}</span>`).join("")}</div>
       </div>`;

    const caption = window.NOTES_ARE_PLACEHOLDER
      ? `<p class="notes__caption">Sample notes shown — editable in <code>js/products.js</code>.</p>`
      : "";

    return `
    <section class="chapter section-pad ${themeClass}" id="perfume-${p.id}"
             style="--pcol:${p.accent};--pglow:${hexToGlow(p.accent)}" data-chapter>
      <div class="container">
        <div class="chapter__grid">
          <div class="chapter__visual">
            <span class="chapter__index" aria-hidden="true">${p.index}</span>
            <span class="chapter__glow" aria-hidden="true"></span>
            <picture>
              <source srcset="${p.bottle}.webp" type="image/webp">
              <img class="chapter__bottle" src="${p.bottle}.jpg" alt="${p.alt}"
                   width="900" height="1150" loading="lazy" decoding="async">
            </picture>
            <picture>
              <source srcset="${p.box}.webp" type="image/webp">
              <img class="chapter__box" src="${p.box}.jpg"
                   alt="${p.name} luxury gift packaging by AH Perfumes"
                   width="900" height="1150" loading="lazy" decoding="async">
            </picture>
          </div>

          <div class="chapter__body" data-reveal>
            <div class="chapter__eyebrow">
              <span class="chapter__num">${p.index}</span>
              <span class="chapter__type">${p.type}</span>
            </div>
            <h2 class="chapter__name">${p.name}</h2>
            <p class="chapter__desc">${p.description}</p>

            <div class="notes" aria-label="Fragrance notes for ${p.name}">
              ${notesRow("Top", p.notes.top)}
              ${notesRow("Heart", p.notes.heart)}
              ${notesRow("Base", p.notes.base)}
            </div>
            ${caption}

            <div class="chapter__price">
              <span class="amt">${window.AH.priceLabel()}</span>
              <span class="del">${window.AH.deliveryLabel()}</span>
            </div>

            <div class="chapter__actions">
              <a class="btn btn-wa" href="${window.AH.waOrder(p.name + " (" + p.type.split("·")[0].trim() + ")")}"
                 target="_blank" rel="noopener" aria-label="Order ${p.name} on WhatsApp">
                ${WA_ICON}<span>Order on WhatsApp</span>
              </a>
              <a class="btn btn-ghost" href="#collection">Discover</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderChapters() {
    const mount = $("#chapters");
    if (!mount) return;
    mount.innerHTML = window.PRODUCTS.map(chapterMarkup).join("");
  }

  /* ---------- 3) Render collection overview cards ---------- */
  function renderOverview() {
    const grid = $("#overview-grid");
    if (!grid) return;
    grid.innerHTML = window.PRODUCTS.map(
      (p) => `
      <a class="ov-card" href="#perfume-${p.id}" data-reveal aria-label="View ${p.name}">
        <span class="ov-card__num">${p.index}</span>
        <div class="ov-card__media">
          <picture>
            <source srcset="${p.bottle}.webp" type="image/webp">
            <img src="${p.bottle}.jpg" alt="${p.alt}" loading="lazy" decoding="async"
                 width="900" height="1150">
          </picture>
        </div>
        <div class="ov-card__body">
          <span class="ov-card__name">${p.name}</span>
          <span class="ov-card__type">${p.type}</span>
          <div class="ov-card__foot">
            <span class="ov-card__price">${window.AH.priceLabel()}</span>
            <span class="ov-card__go">View →</span>
          </div>
        </div>
      </a>`,
    ).join("");
  }

  /* ---------- 4) Render owners ---------- */
  function renderOwners() {
    const mount = $("#owners");
    if (!mount) return;
    const c = window.BRAND_CONFIG;
    const card = (role, o) => `
      <div class="owner" data-reveal>
        <span class="owner__role">${role}</span>
        <span class="owner__name">${o.name}</span>
        <span class="owner__phone"><a href="${window.AH.telLink(o.phone)}">${window.AH.phoneDisplay(o.phone)}</a></span>
        <div class="owner__links">
          <a href="${window.AH.telLink(o.phone)}" aria-label="Call ${role}">
            <svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4.9c0-.5.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>
            Call
          </a>
          <a href="${window.AH.waOwner(o.phone)}" target="_blank" rel="noopener" aria-label="WhatsApp ${role}">
            ${WA_ICON.replace('class="wa-ico"', "")} WhatsApp
          </a>
        </div>
      </div>`;
    mount.innerHTML =
      card("Owner 01", c.ownerOne) + card("Owner 02", c.ownerTwo);
  }

  /* Social SVG icons */
  const SOCIAL_ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.9.07s-3.63 0-4.9-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.22 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5 0-4.75.07-.9.04-1.38.19-1.7.31-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.32-.27.8-.31 1.7C3.4 8.5 3.4 8.85 3.4 12s0 3.5.07 4.75c.04.9.19 1.38.31 1.7.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.12.8.27 1.7.31 1.25.06 1.6.07 4.75.07s3.5 0 4.75-.07c.9-.04 1.38-.19 1.7-.31.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.32.27-.8.31-1.7.06-1.25.07-1.6.07-4.75s0-3.5-.07-4.75c-.04-.9-.19-1.38-.31-1.7a2.85 2.85 0 00-.69-1.06 2.85 2.85 0 00-1.06-.69c-.32-.12-.8-.27-1.7-.31C15.5 4 15.15 4 12 4zm0 3.06A4.94 4.94 0 1112 17a4.94 4.94 0 010-9.88zm0 1.8a3.14 3.14 0 100 6.28 3.14 3.14 0 000-6.28zm5.14-.88a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.4c-1.2.1-2.4-.2-3.5-.8v5.9a5.6 5.6 0 11-5.6-5.6c.3 0 .6 0 .9.06v2.5a3.1 3.1 0 102.2 2.98V3h2.6z"/></svg>',
  };

  /* ---------- 5) Render social links (only if provided) ---------- */
  function renderSocial() {
    const s = window.BRAND_CONFIG.social;
    const link = (key, label) =>
      s[key]
        ? `<a class="social-link" href="${s[key]}" target="_blank" rel="noopener" aria-label="${label}">${SOCIAL_ICONS[key]}<span>${label}</span></a>`
        : "";
    const items = [
      link("instagram", "Instagram"),
      link("facebook", "Facebook"),
      link("tiktok", "TikTok"),
    ].filter(Boolean);
    const html = items.length
      ? items.join("")
      : '<span class="muted">Social links coming soon</span>';

    // footer
    const foot = $("#social-links");
    if (foot) foot.innerHTML = html;
    // contact section
    const contact = $("#contact-social");
    if (contact) contact.innerHTML = items.length ? items.join("") : "";
  }

  /* ---------- 6) Navigation behaviour ---------- */
  function initNav() {
    const nav = $(".nav");
    const burger = $(".nav__burger");
    const overlay = $(".menu-overlay");
    let lastY = 0;

    // scroll state (background + hide on scroll down)
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      if (!document.body.classList.contains("menu-open")) {
        nav.classList.toggle("hidden-up", y > lastY && y > 400);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // mobile menu toggle
    const toggle = (open) => {
      const isOpen = open ?? !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", isOpen);
      document.body.classList.toggle("noscroll", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    };
    burger?.addEventListener("click", () => toggle());
    $$(".menu-overlay a").forEach((a) =>
      a.addEventListener("click", () => toggle(false)),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggle(false);
    });

    // smooth scroll for in-page anchors (respect reduced motion)
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- helpers ---------- */
  function hexToGlow(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16),
      g = parseInt(h.substring(2, 4), 16),
      b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},0.34)`;
  }

  /* ---------- boot ---------- */
  function init() {
    renderChapters();
    renderOverview();
    renderOwners();
    renderSocial();
    applyConfig();
    initNav();
    // let other modules know DOM content is ready (flag guards against listeners
    // that register *after* this synchronous dispatch, since all scripts are deferred)
    window.__ahContentReady = true;
    document.dispatchEvent(new CustomEvent("ah:content-ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
