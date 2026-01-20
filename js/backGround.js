(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'99b6131b35008dd8',t:'MTc2MjYxNTQzOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();

const defaultConfig = {
  background_color: "#1A1A1A",
  particle_color: "#ffffff",
  line_color: "#ffffff"
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100;
const connectionDistance = 100;
const particleSpeed = 0.5;

/* -------------------------------------------------
   ⭐ Função corrigida: canvas agora fica em alta
      definição em qualquer tamanho de tela.
-------------------------------------------------- */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  // tamanho CSS (visível)
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  // tamanho REAL do canvas (alta resolução)
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  // reset antes de aplicar a nova escala (evita acumular)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

// -------------------------------------------------

class Particle {
  constructor() {
    // posição aleatória
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    // ângulo aleatório
    const angle = Math.random() * 2 * Math.PI;

    // velocidade variável
    const speed = particleSpeed * (0.5 + Math.random());

    // direção
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // tamanho da partícula
    this.radius = 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
    if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;

    this.x = Math.max(0, Math.min(window.innerWidth, this.x));
    this.y = Math.max(0, Math.min(window.innerHeight, this.y));
  }

  draw(config) {
    ctx.fillStyle = config.particle_color || defaultConfig.particle_color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function drawConnections(config) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = 1 - (distance / connectionDistance);
        ctx.strokeStyle = config.line_color || defaultConfig.line_color;
        ctx.globalAlpha = opacity * 0.5;
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

function animate(config) {
  ctx.fillStyle = config.background_color || defaultConfig.background_color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawConnections(config);

  particles.forEach(particle => {
    particle.update();
    particle.draw(config);
  });

  requestAnimationFrame(() => animate(config));
}

async function onConfigChange(config) {
  // animação já atualiza automaticamente
}

function mapToCapabilities(config) {
  return {
    recolorables: [
      {
        get: () => config.background_color || defaultConfig.background_color,
        set: (value) => {
          config.background_color = value;
          window.elementSdk.setConfig({ background_color: value });
        }
      },
      {
        get: () => config.particle_color || defaultConfig.particle_color,
        set: (value) => {
          config.particle_color = value;
          window.elementSdk.setConfig({ particle_color: value });
        }
      },
      {
        get: () => config.line_color || defaultConfig.line_color,
        set: (value) => {
          config.line_color = value;
          window.elementSdk.setConfig({ line_color: value });
        }
      }
    ],
    borderables: [],
    fontEditable: undefined,
    fontSizeable: undefined
  };
}

function mapToEditPanelValues(config) {
  return new Map();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initParticles();

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
