/* ============================================================================
   AH PERFUMES — WebGL / Three.js
   Two lightweight scenes that SUPPORT the product story:
     1) Hero      : drifting golden fragrance dust, gentle mouse parallax
     2) Fragrance : particle cloud that reforms across Top → Heart → Base
   Fails safe: if WebGL is unavailable, canvases hide and the poster/CSS remain.
   Performance: fewer particles + capped pixel-ratio on small / low-power devices.
   ============================================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- WebGL capability check ---- */
  function webglOK() {
    try {
      const c = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  if (typeof window.THREE === "undefined" || !webglOK()) {
    document.body.classList.add("no-webgl");
    return; // graceful fallback — CSS/poster handle the visuals
  }

  const THREE = window.THREE;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  /* ---- soft round sprite for particles (canvas texture) ---- */
  function discTexture() {
    const s = 64,
      cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const ctx = cv.getContext("2d");
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,240,210,0.85)");
    g.addColorStop(1, "rgba(255,240,210,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const t = new THREE.CanvasTexture(cv);
    t.needsUpdate = true;
    return t;
  }
  const SPRITE = discTexture();

  /* =====================================================================
     SCENE 1 — HERO DUST
     ===================================================================== */
  function initHero() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(DPR);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 26;

    const COUNT = isMobile ? 420 : 1100;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const spread = 46;
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      speeds[i] = 0.006 + Math.random() * 0.02;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: isMobile ? 0.28 : 0.34,
      map: SPRITE,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0xd9b978),
      opacity: 0.85,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // a faint second layer, cooler + slower for depth
    const geo2 = geo.clone();
    const mat2 = mat.clone();
    mat2.color = new THREE.Color(0xffffff);
    mat2.opacity = 0.25;
    mat2.size = isMobile ? 0.16 : 0.2;
    const points2 = new THREE.Points(geo2, mat2);
    points2.position.z = -6;
    scene.add(points2);

    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    window.addEventListener(
      "pointermove",
      (e) => {
        tx = e.clientX / window.innerWidth - 0.5;
        ty = e.clientY / window.innerHeight - 0.5;
      },
      { passive: true },
    );

    function resize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    const pos = geo.attributes.position.array;
    let running = true,
      raf = 0;
    let t = 0;
    function tick() {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      t += 0.01;
      // gentle upward drift + recycle
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        pos[i * 3] += Math.sin(t + i) * 0.002;
        if (pos[i * 3 + 1] > spread / 2) pos[i * 3 + 1] = -spread / 2;
      }
      geo.attributes.position.needsUpdate = true;
      geo2.attributes.position.needsUpdate = true;

      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      points.rotation.y = mx * 0.5;
      points.rotation.x = my * 0.3;
      points2.rotation.y = mx * 0.3;
      camera.position.x = mx * 4;
      camera.position.y = -my * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    if (reduce) {
      renderer.render(scene, camera);
    } else tick();

    // pause when tab hidden / hero off-screen (perf)
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden && !reduce;
      if (running && !reduce) tick();
    });
    const heroEl = document.querySelector(".hero");
    if (heroEl && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            running = e.isIntersecting && !document.hidden && !reduce;
            if (running) tick();
          }),
        { threshold: 0 },
      );
      io.observe(heroEl);
    }

    requestAnimationFrame(() => canvas.classList.add("ready"));
  }

  /* =====================================================================
     SCENE 2 — FRAGRANCE DNA
     A single particle cloud with 3 target formations (top/heart/base).
     Scroll drives which formation it eases toward.
     ===================================================================== */
  function initDNA() {
    const canvas = document.getElementById("dna-canvas");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setPixelRatio(DPR);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 30;

    const COUNT = isMobile ? 500 : 1400;
    const cur = new Float32Array(COUNT * 3);
    // three target sets
    const targets = [
      new Float32Array(COUNT * 3),
      new Float32Array(COUNT * 3),
      new Float32Array(COUNT * 3),
    ];

    for (let i = 0; i < COUNT; i++) {
      // TOP — wide airy dome (spread high & light)
      let a = Math.random() * Math.PI * 2,
        r = 10 + Math.random() * 6;
      targets[0][i * 3] = Math.cos(a) * r;
      targets[0][i * 3 + 1] = 6 + Math.random() * 8;
      targets[0][i * 3 + 2] = Math.sin(a) * r * 0.6;
      // HEART — swirling sphere in the middle
      const u = Math.random(),
        v = Math.random();
      const th = u * Math.PI * 2,
        ph = Math.acos(2 * v - 1),
        rr = 8 + Math.random() * 2;
      targets[1][i * 3] = rr * Math.sin(ph) * Math.cos(th);
      targets[1][i * 3 + 1] = rr * Math.cos(ph) * 0.8;
      targets[1][i * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
      // BASE — dense grounded pool (low & broad)
      a = Math.random() * Math.PI * 2;
      r = Math.pow(Math.random(), 0.5) * 13;
      targets[2][i * 3] = Math.cos(a) * r;
      targets[2][i * 3 + 1] = -8 + Math.random() * 3;
      targets[2][i * 3 + 2] = Math.sin(a) * r;
      // start at heart-ish
      cur[i * 3] = targets[1][i * 3];
      cur[i * 3 + 1] = targets[1][i * 3 + 1];
      cur[i * 3 + 2] = targets[1][i * 3 + 2];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(cur, 3));
    const mat = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.26,
      map: SPRITE,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0xc8a86a),
      opacity: 0.9,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let stage = 1;
    document.addEventListener("ah:dna-stage", (e) => {
      stage = e.detail.stage;
      const cols = [0xe8d8b0, 0xc8a86a, 0xa5824a];
      mat.color = new THREE.Color(cols[stage] || 0xc8a86a);
    });

    function resize() {
      const w = canvas.clientWidth || canvas.offsetWidth || window.innerWidth;
      const h =
        canvas.clientHeight || canvas.offsetHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);

    const arr = geo.attributes.position.array;
    let running = false,
      raf = 0,
      t = 0;
    function tick() {
      raf = requestAnimationFrame(tick);
      t += 0.008;
      const tgt = targets[stage] || targets[1];
      const ease = reduce ? 1 : 0.045;
      for (let i = 0; i < COUNT * 3; i++) arr[i] += (tgt[i] - arr[i]) * ease;
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = t * (reduce ? 0 : 0.25);
      renderer.render(scene, camera);
      if (reduce) cancelAnimationFrame(raf);
    }

    resize();
    const dnaEl = document.querySelector(".dna");
    if (dnaEl && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting && !running) {
              running = true;
              tick();
            } else if (!e.isIntersecting) {
              running = false;
              cancelAnimationFrame(raf);
            }
          }),
        { threshold: 0 },
      );
      io.observe(dnaEl);
    } else {
      running = true;
      tick();
    }
  }

  function boot() {
    initHero();
    initDNA();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
