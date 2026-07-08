// =========================================================
// RADIO CREPUSCULAR 99.5 FM — App principal
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  iniciar();
});

async function iniciar() {
  try {

    async function iniciar() {
  try {
    // 🖤 Aplicar modo luto PRIMERO
    aplicarModoLuto();

    // 1. Aplicar configuración a todo el sitio
    aplicarConfiguracion();
    
    // 2. Cargar contenido
    const manifest = await cargarJSON('/manifest.json');
    
    await cargarYRenderizarSeccion('noticias', manifest.noticias || [], renderizarNoticia);
    await cargarYRenderizarSeccion('programas', manifest.programas || [], renderizarPrograma);
    await cargarYRenderizarSeccion('locutores', manifest.locutores || [], renderizarLocutor);
    
    // 3. Footer año
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // 4. Menú móvil
    activarMenuMovil();
    
    // 5. Reproductor
    inicializarReproductor();

      // Alianzas
  const alianzasContainer = document.getElementById('footer-alianzas');
  if (alianzasContainer && cfg.alianzas) {
    alianzasContainer.innerHTML = cfg.alianzas.map(alianza => `
      <a href="${alianza.url}" target="_blank" rel="noopener" class="alianza__item" aria-label="${alianza.nombre}">
        <img src="${alianza.logo}" alt="${alianza.nombre}" class="alianza__logo" loading="lazy" />
      </a>
    `).join('');
  }
    
  } catch (error) {
    console.error('Error al iniciar:', error);
  }
}

// =========================================================
// CONFIGURACIÓN
// =========================================================
function aplicarConfiguracion() {
  const cfg = window.RADIO_CONFIG;
  if (!cfg) return;
  
  // Reproductor
  setText('player-nombre', cfg.nombre);
  setText('player-freq', cfg.frecuencia);
  setAttr('player-logo', 'src', cfg.logo);
  setAttr('player-logo', 'alt', cfg.nombre);
  
  // Header
  setText('header-nombre', cfg.nombre);
  setText('header-freq', cfg.frecuencia);
  setAttr('header-logo', 'src', cfg.logo);
  setAttr('header-logo', 'alt', cfg.nombre);
  
  // Hero
  setText('hero-slogan', cfg.slogan);
  setText('hero-sub', cfg.descripcion);
  
  // Footer
  setText('footer-nombre', cfg.nombre);
  setText('footer-slogan', cfg.slogan);
  setText('footer-direccion', '📍 ' + cfg.contacto.direccion);
  setText('footer-telefono', '📞 ' + cfg.contacto.telefono);
  setText('footer-email', '✉️ ' + cfg.contacto.email);
  setAttr('footer-logo', 'src', cfg.logo);
  setAttr('footer-logo', 'alt', cfg.nombre);
  
  // Redes sociales con logos SVG oficiales
  const redesContainer = document.getElementById('footer-redes');
  if (redesContainer && cfg.redes) {
    const iconosSVG = {
      facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
      twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
      youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
      tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
    };
    
    redesContainer.innerHTML = Object.entries(cfg.redes).map(([red, url]) => `
      <li>
        <a href="${url}" target="_blank" rel="noopener" class="social__icon" aria-label="${red}">
          ${iconosSVG[red] || '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>'}
        </a>
      </li>
    `).join('');
  }

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

// =========================================================
// CARGAR CONTENIDO
// =========================================================
async function cargarJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`No se pudo cargar ${url}`);
  return await r.json();
}
async function cargarTexto(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`No se pudo cargar ${url}`);
  return await r.text();
}

function parsearFrontmatter(contenido) {
  const match = contenido.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, cuerpo: contenido };
  
  const yamlTexto = match[1];
  const cuerpo = contenido.slice(match[0].length).trim();
  const data = {};
  
  yamlTexto.split('\n').forEach(linea => {
    const m = linea.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let [, clave, valor] = m;
      valor = valor.trim();
      if (valor.startsWith('[') && valor.endsWith(']')) {
        valor = valor.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      } else if (valor.startsWith('"') && valor.endsWith('"')) {
        valor = valor.slice(1, -1);
      }
      data[clave] = valor;
    }
  });
  
  return { data, cuerpo };
}

async function cargarYRenderizarSeccion(nombre, archivos, fnRender) {
  const contenedor = document.getElementById(`grid-${nombre}`);
  if (!contenedor) return;
  
  if (archivos.length === 0) {
    contenedor.innerHTML = `<p class="loading">Aún no hay ${nombre}.</p>`;
    return;
  }
  
  const resultados = [];
  for (const item of archivos) {
    try {
      const ruta = `/content/${nombre}/${item.archivo}`;
      const contenido = await cargarTexto(ruta);
      const { data, cuerpo } = parsearFrontmatter(contenido);
      const cuerpoHTML = marked.parse(cuerpo);
      resultados.push({
        slug: item.archivo.replace('.md', ''),
        data,
        cuerpoHTML
      });
    } catch (e) {
      console.error(`Error cargando ${item.archivo}:`, e);
    }
  }
  
  if (nombre === 'noticias') {
    resultados.sort((a, b) => new Date(b.data.fecha || 0) - new Date(a.data.fecha || 0));
  }
  
  contenedor.innerHTML = resultados.map(fnRender).join('');
}

// =========================================================
// RENDERIZADO
// =========================================================
function renderizarNoticia(item) {
  const { titulo, fecha, imagen } = item.data;
  const extracto = extraerExtracto(item.cuerpoHTML, 150);
  return `
    <article class="card-noticia glass-card">
      ${imagen ? `<div class="card-noticia__img"><img src="${imagen}" alt="${titulo}" loading="lazy" /></div>` : ''}
      <div class="card-noticia__body">
        ${fecha ? `<time class="card-noticia__fecha" datetime="${fecha}">${formatearFecha(fecha)}</time>` : ''}
        <h3 class="card-noticia__titulo">${titulo || 'Sin título'}</h3>
        <p class="card-noticia__extracto">${extracto}</p>
        <a href="/noticia/${item.slug}" class="card-noticia__link">Leer más →</a>
      </div>
    </article>
  `;
}

function renderizarPrograma(item) {
  const { nombre, horario, dias, descripcion, imagen } = item.data;
  const diasArray = Array.isArray(dias) ? dias : [];
  return `
    <article class="card-programa glass-card">
      ${imagen ? `<div class="card-programa__img"><img src="${imagen}" alt="${nombre}" loading="lazy" /></div>` : ''}
      <div class="card-programa__info">
        <h3 class="card-programa__nombre">${nombre || 'Sin nombre'}</h3>
        ${horario ? `<p class="card-programa__horario">🕐 ${horario}</p>` : ''}
        ${diasArray.length > 0 ? `<div class="card-programa__dias">${diasArray.map(d => `<span class="card-programa__dia">${d}</span>`).join('')}</div>` : ''}
        <p class="card-programa__desc">${descripcion || ''}</p>
      </div>
    </article>
  `;
}

function renderizarLocutor(item) {
  const { nombre, foto, programa, bio } = item.data;
  return `
    <article class="card-locutor glass-card">
      ${foto ? `<div class="card-locutor__foto"><img src="${foto}" alt="${nombre}" loading="lazy" /></div>` : ''}
      <h3 class="card-locutor__nombre">${nombre || 'Sin nombre'}</h3>
      ${programa ? `<p class="card-locutor__programa">${programa}</p>` : ''}
      <p class="card-locutor__bio">${bio || ''}</p>
    </article>
  `;
}

function extraerExtracto(html, max) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const t = div.textContent || '';
  return t.length > max ? t.substring(0, max).trim() + '...' : t.trim();
}

function formatearFecha(f) {
  try {
    return new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return f; }
}

function activarMenuMovil() {
  const btn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu-principal');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const exp = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !exp);
    menu.classList.toggle('is-open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  });
}

// =========================================================
// REPRODUCTOR
// =========================================================
let audioElement = null;
let isPlaying = false;

function inicializarReproductor() {
  const cfg = window.RADIO_CONFIG;
  if (!cfg) return;
  
  audioElement = document.getElementById('audio-stream');
  const btnPlay = document.getElementById('btn-play');
  const btnMute = document.getElementById('btn-mute');
  const volumeSlider = document.getElementById('volume-slider');
  const iconPlay = document.getElementById('icon-play');
  const heroPlay = document.getElementById('hero-play');
  
  if (!audioElement || !btnPlay) return;
  
  // Configurar URL del stream
  audioElement.src = cfg.streamUrl;
  audioElement.volume = 0.8;
  
  // Play/Pause
  btnPlay.addEventListener('click', togglePlay);
  if (heroPlay) {
    heroPlay.addEventListener('click', (e) => {
      e.preventDefault();
      togglePlay();
    });
  }
  
  // Mute
  btnMute.addEventListener('click', () => {
    audioElement.muted = !audioElement.muted;
    volumeSlider.value = audioElement.muted ? 0 : audioElement.volume * 100;
  });
  
  // Volumen
  volumeSlider.addEventListener('input', (e) => {
    const v = e.target.value / 100;
    audioElement.volume = v;
    audioElement.muted = v === 0;
  });
  
  // Error
  audioElement.addEventListener('error', () => {
    console.error('Error en el stream');
    isPlaying = false;
    btnPlay.classList.remove('playing');
    iconPlay.innerHTML = '<path d="M8 5v14l11-7z"/>';
  });
  
  function togglePlay() {
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
      btnPlay.classList.remove('playing');
      iconPlay.innerHTML = '<path d="M8 5v14l11-7z"/>';
      btnPlay.setAttribute('aria-label', 'Reproducir');
      if (heroPlay) heroPlay.textContent = '▶ Escuchar en vivo';
    } else {
      audioElement.play().catch(err => {
        console.error('Error al reproducir:', err);
        alert('No se pudo conectar con el stream. Verifica tu conexión.');
      });
      isPlaying = true;
      btnPlay.classList.add('playing');
      iconPlay.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      btnPlay.setAttribute('aria-label', 'Pausar');
      if (heroPlay) heroPlay.textContent = '⏸ Pausar transmisión';
    }
  }
}

// =========================================================
// 🖤 MODO LUTO
// =========================================================
function aplicarModoLuto() {
  const cfg = window.RADIO_CONFIG;
  if (!cfg || !cfg.modoLuto) return;
  
  const luto = cfg.modoLuto;
  
  // Verificar si está activo por fechas
  let debeActivarse = luto.activo;
  
  if (luto.fechaInicio && luto.fechaFin) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicio = new Date(luto.fechaInicio);
    const fin = new Date(luto.fechaFin);
    
    debeActivarse = hoy >= inicio && hoy <= fin;
  }
  
  if (debeActivarse) {
    document.body.classList.add('modo-luto');
    
    // Insertar banner de luto al inicio del body
    const banner = document.createElement('div');
    banner.className = 'luto-banner';
    banner.innerHTML = `
      <div class="luto-banner__text">
        <span class="luto-banner__candle">🕯️</span>
        <span>${luto.mensaje || 'En luto.'}</span>
        <span class="luto-banner__candle">🕯️</span>
      </div>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
  }
}

// Llamar esta función dentro de iniciar()
