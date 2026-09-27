/* ============================================================================
   AH PERFUMES — ANIMATIONS
   Baseline reveals use IntersectionObserver (always works).
   GSAP + ScrollTrigger add cinematic parallax/scrub ENHANCEMENTS when present.
   Everything degrades gracefully and respects prefers-reduced-motion.
   ============================================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Baseline reveal via IntersectionObserver ---------- */
  function initReveals() {
    const els = $$(
      "[data-reveal],[data-reveal-stagger],.reveal-line,[data-mask],[data-chapter]",
    );
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Hero intro sequence ---------- */
  function initHero() {
    const hero = $(".hero");
    if (hero) requestAnimationFrame(() => hero.classList.add("loaded"));
  }

  /* ---------- GSAP enhancements ---------- */
  function initGSAP() {
    if (!hasGSAP || reduce) return;
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Parallax drift on chapter bottles
    $$(".chapter").forEach((ch) => {
      const bottle = $(".chapter__bottle", ch);
      const index = $(".chapter__index", ch);
      if (bottle && window.ScrollTrigger) {
        gsap.fromTo(
          bottle,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: ch,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }
      if (index && window.ScrollTrigger) {
        gsap.fromTo(
          index,
          { yPercent: 14 },
          {
            yPercent: -14,
            ease: "none",
            scrollTrigger: {
              trigger: ch,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          },
        );
      }
    });

    // Packaging stack parallax
    const pbottle = $(".pack__stack .p-bottle");
    const pbox = $(".pack__stack .p-box");
    if (pbottle && pbox && window.ScrollTrigger) {
      gsap.fromTo(
        pbox,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".pack",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      gsap.fromTo(
        pbottle,
        { yPercent: 10 },
        {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".pack",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }

    // Intro figure subtle rise
    const fig = $(".intro__figure img");
    if (fig && window.ScrollTrigger) {
      gsap.fromTo(
        fig,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".intro",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }
  }

  /* ---------- Fragrance DNA stage activation ---------- */
  function initDNA() {
    const stages = $$(".dna__stage");
    const dna = $(".dna");
    if (!stages.length || !dna) return;

    const setActive = (i) =>
      stages.forEach((s, idx) => s.classList.toggle("active", idx <= i));

    if (reduce || !window.ScrollTrigger || !hasGSAP) {
      // simple: activate all when section is visible
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (e.isIntersecting) setActive(2);
            }),
          { threshold: 0.3 },
        );
        io.observe(dna);
      } else setActive(2);
      return;
    }

    window.ScrollTrigger.create({
      trigger: dna,
      start: "top 60%",
      end: "bottom 40%",
      onUpdate: (self) => {
        const p = self.progress;
        const i = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
        setActive(i);
        // notify the WebGL scene about the current stage
        document.dispatchEvent(
          new CustomEvent("ah:dna-stage", {
            detail: { stage: i, progress: p },
          }),
        );
      },
    });
  }

  /* ---------- boot after content is injected ---------- */
  function boot() {
    initHero();
    initReveals();
    initGSAP();
    initDNA();
    if (hasGSAP && window.ScrollTrigger) {
      // recalc after images load
      window.addEventListener("load", () => window.ScrollTrigger.refresh());
    }
  }

  // Boot immediately if content was already injected (deferred scripts run in
  // order, so interactions.js may have dispatched the event before we listened).
  if (window.__ahContentReady) boot();
  else document.addEventListener("ah:content-ready", boot);
})();
