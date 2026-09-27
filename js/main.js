/* ============================================================================
   AH PERFUMES — MAIN / BOOTSTRAP
   Small coordinator: hero video fallback, image error guards, boot banner.
   Heavy lifting lives in interactions.js, animations.js, three-scene.js.
   ============================================================================ */
(function () {
  "use strict";

  /* Hero video: if it errors or can't play, ensure the poster stays visible.
     (No video file ships by default — see README to add hero-video.mp4.) */
  function initHeroVideo() {
    const video = document.getElementById("hero-video");
    if (!video) return;

    const showPosterOnly = () => {
      video.style.display = "none";
    };

    // If no <source> resolves, hide the video element (poster layer remains).
    video.addEventListener("error", showPosterOnly, true);
    const srcs = video.querySelectorAll("source");
    let anySrc = false;
    srcs.forEach((s) => {
      if (s.getAttribute("src")) anySrc = true;
    });
    if (!anySrc) {
      showPosterOnly();
      return;
    }

    // Respect reduced motion / save-data: don't autoplay heavy video.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) {
      showPosterOnly();
      return;
    }

    video.play?.().catch(showPosterOnly);
  }

  /* Guard: any broken product image fades gracefully instead of showing a
     broken-image icon (keeps the layout premium). */
  function guardImages() {
    document.addEventListener(
      "error",
      (e) => {
        const img = e.target;
        if (img && img.tagName === "IMG") {
          img.style.opacity = "0";
          img.setAttribute("data-broken", "true");
        }
      },
      true,
    );
  }

  function banner() {
    try {
      console.log("%cAH PERFUMES", "font:600 20px serif;color:#c8a86a");
      console.log(
        "%cPremium fragrances · Sargodha, Pakistan · Edit js/products.js to configure.",
        "color:#8a8781",
      );
    } catch (e) {}
  }

  function init() {
    guardImages();
    initHeroVideo();
    banner();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
