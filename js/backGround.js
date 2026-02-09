(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'99b6131b35008dd8',t:'MTc2MjYxNTQzOC4wMDAwMDA='};" +
        "var a=document.createElement('script');" +
        "a.nonce='';" +
        "a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';" +
        "document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else document.addEventListener("DOMContentLoaded", c);
  }
})();

/* ================= CONFIG ================= */

const defaultConfig = {
  background_color: "#1A1A1A",
  particle_color: "#ffffff",
  line_color: "#ffffff"
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let particles = [];

/* ================= SCALE ================= */

function getScale() {
  const area = window.innerWidth * window.innerHeight;
  const base = 1920 * 1080;
  return Math.min(Math.max(area / base, 0.55), 1.1);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/* ================= CANVAS ================= */

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

/* ================= PARTICLE ================= */

let particleCount;
let particleRadius;
let particleSpeed;
let connectionDistance;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    this.x = Math.random() * w;
    this.y = Math.random() * h;

    const angle = Math.random() * Math.PI * 2;
    const speed = particleSpeed * (0.6 + Math.random() * 0.6);

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.radius = particleRadius;
  }

  update() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= w) this.vx *= -1;
    if (this.y <= 0 || this.y >= h) this.vy *= -1;
  }

  draw(config) {
    ctx.fillStyle = config.particle_color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ================= INIT ================= */

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

/* ================= CONNECTIONS ================= */

function drawConnections(config) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distSq = dx * dx + dy * dy;
      const maxDistSq = connectionDistance * connectionDistance;

      if (distSq < maxDistSq) {
        const alpha = 1 - distSq / maxDistSq;

        ctx.strokeStyle = config.line_color;
        ctx.globalAlpha = alpha * 0.35;
        ctx.lineWidth = 0.6; // 🔥 linha mais fina

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

/* ================= ANIMATION ================= */

function animate(config) {
  ctx.fillStyle = config.background_color;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  drawConnections(config);

  for (const p of particles) {
    p.update();
    p.draw(config);
  }

  requestAnimationFrame(() => animate(config));
}

/* ================= BOOT ================= */

function init() {
  resizeCanvas();

  const scale = getScale();

  particleCount = Math.floor(140 * scale);
  particleRadius = clamp(2.4 * scale, 2.4, 4);
  particleSpeed = clamp(0.55 * scale, 0.35, 0.8);

  // 🔥 distância reduzida
  connectionDistance = clamp(95 * scale, 70, 120);

  initParticles();
}

window.addEventListener("load", init);
window.addEventListener("resize", init);
window.addEventListener("orientationchange", () => setTimeout(init, 300));

/* ================= SDK ================= */

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange: () => {},
    mapToCapabilities: () => ({}),
    mapToEditPanelValues: () => new Map()
  });
  animate(window.elementSdk.config);
} else {
  animate(defaultConfig);
}
