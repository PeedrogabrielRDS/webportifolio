(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement('script');
      d.innerHTML =
        "window.__CF$cv$params={r:'99b6131b35008dd8',t:'MTc2MjYxNTQzOC4wMDAwMDA='};" +
        "var a=document.createElement('script');" +
        "a.nonce='';" +
        "a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';" +
        "document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName('head')[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement('iframe');
    a.height = 1;
    a.width = 1;
    a.style.position = 'absolute';
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = 'none';
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    if ('loading' !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener('DOMContentLoaded', c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        'loading' !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
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
const particleCount = 100;
const connectionDistance = 100;
const particleSpeed = 0.5;

/* ============== CANVAS RESIZE (MOBILE SAFE) ============== */

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

/* ================= PARTICLE ================= */

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
    const speed = particleSpeed * (0.5 + Math.random());

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.radius = 3;
  }

  update() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= w) this.vx *= -1;
    if (this.y <= 0 || this.y >= h) this.vy *= -1;

    this.x = Math.max(0, Math.min(w, this.x));
    this.y = Math.max(0, Math.min(h, this.y));
  }

  draw(config) {
    ctx.fillStyle = config.particle_color || defaultConfig.particle_color;
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
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance) {
        ctx.strokeStyle = config.line_color || defaultConfig.line_color;
        ctx.globalAlpha = (1 - dist / connectionDistance) * 0.5;
        ctx.lineWidth = 1;

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
  ctx.fillStyle =
    config.background_color || defaultConfig.background_color;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  drawConnections(config);

  particles.forEach(p => {
    p.update();
    p.draw(config);
  });

  requestAnimationFrame(() => animate(config));
}

/* ================= SDK ================= */

async function onConfigChange(config) {}

function mapToCapabilities(config) {
  return {
    recolorables: [
      {
        get: () =>
          config.background_color || defaultConfig.background_color,
        set: value => {
          config.background_color = value;
          window.elementSdk.setConfig({ background_color: value });
        }
      },
      {
        get: () =>
          config.particle_color || defaultConfig.particle_color,
        set: value => {
          config.particle_color = value;
          window.elementSdk.setConfig({ particle_color: value });
        }
      },
      {
        get: () => config.line_color || defaultConfig.line_color,
        set: value => {
          config.line_color = value;
          window.elementSdk.setConfig({ line_color: value });
        }
      }
    ]
  };
}

function mapToEditPanelValues() {
  return new Map();
}

/* ================= BOOTSTRAP (MOBILE FIX) ================= */

function init() {
  resizeCanvas();
  initParticles();
}

window.addEventListener("load", init);
window.addEventListener("resize", init);
window.addEventListener("orientationchange", () => {
  setTimeout(init, 300);
});

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues
  });
  animate(window.elementSdk.config);
} else {
  animate(defaultConfig);
}
