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
    // ... resto del código
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
  
  // Redes sociales
  const redesContainer = document.getElementById('footer-redes');
  if (redesContainer && cfg.redes) {
    const iconos = {
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      youtube: '▶️',
      tiktok: '🎵'
    };
    redesContainer.innerHTML = Object.entries(cfg.redes).map(([red, url]) => `
      <li><a href="${url}" target="_blank" rel="noopener" aria-label="${red}">${iconos[red] || '🔗'} ${red.charAt(0).toUpperCase() + red.slice(1)}</a></li>
    `).join('');
  }
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
