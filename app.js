// =========================================================
// RADIO CREPUSCULAR 99.5 FM — Lógica del sitio
// Este archivo lee los archivos .md y los muestra en pantalla
// =========================================================

// Esperamos a que el HTML esté cargado antes de hacer nada
document.addEventListener('DOMContentLoaded', () => {
  iniciar();
});

async function iniciar() {
  try {
    // 1. Cargar la lista de archivos (manifest.json)
    const manifest = await cargarJSON('/manifest.json');
    
    // 2. Cargar y mostrar cada sección
    await cargarYRenderizarSeccion('noticias', manifest.noticias || [], renderizarNoticia);
    await cargarYRenderizarSeccion('programas', manifest.programas || [], renderizarPrograma);
    await cargarYRenderizarSeccion('locutores', manifest.locutores || [], renderizarLocutor);
    
    // 3. Actualizar el año en el footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // 4. Activar el menú hamburguesa
    activarMenuMovil();
    
  } catch (error) {
    console.error('Error al iniciar el sitio:', error);
    mostrarErrorGlobal('No se pudo cargar el contenido. Revisa la consola para más detalles.');
  }
}

// =========================================================
// FUNCIONES AUXILIARES
// =========================================================

// Cargar un archivo JSON
async function cargarJSON(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${url}`);
  return await respuesta.json();
}

// Cargar un archivo de texto (para los .md)
async function cargarTexto(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${url}`);
  return await respuesta.text();
}

// Parsear el frontmatter (la parte YAML al inicio del archivo .md)
function parsearFrontmatter(contenido) {
  // Buscar el bloque entre --- al inicio
  const match = contenido.match(/^---\n([\s\S]*?)\n---/);
  
  if (!match) {
    return { data: {}, cuerpo: contenido };
  }
  
  const yamlTexto = match[1];
  const cuerpo = contenido.slice(match[0].length).trim();
  
  // Parsear YAML simple (solo campos básicos: clave: valor)
  const data = {};
  yamlTexto.split('\n').forEach(linea => {
    const match = linea.match(/^(\w+):\s*(.+)$/);
    if (match) {
      let [, clave, valor] = match;
      valor = valor.trim();
      
      // Si es una lista (empieza con [ y termina con ])
      if (valor.startsWith('[') && valor.endsWith(']')) {
        valor = valor.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      // Si es un string entre comillas
      else if (valor.startsWith('"') && valor.endsWith('"')) {
        valor = valor.slice(1, -1);
      }
      
      data[clave] = valor;
    }
  });
  
  return { data, cuerpo };
}

// Cargar todos los archivos de una sección y renderizarlos
async function cargarYRenderizarSeccion(nombreSeccion, archivos, funcionRender) {
  const contenedor = document.getElementById(`grid-${nombreSeccion}`);
  if (!contenedor) return;
  
  if (archivos.length === 0) {
    contenedor.innerHTML = `<p class="loading">Aún no hay ${nombreSeccion}.</p>`;
    return;
  }
  
  const resultados = [];
  
  for (const item of archivos) {
    try {
      const rutaArchivo = `/content/${nombreSeccion}/${item.archivo}`;
      const contenido = await cargarTexto(rutaArchivo);
      const { data, cuerpo } = parsearFrontmatter(contenido);
      
      // Convertir el cuerpo markdown a HTML
      const cuerpoHTML = marked.parse(cuerpo);
      
      resultados.push({
        slug: item.archivo.replace('.md', ''),
        data,
        cuerpoHTML
      });
    } catch (error) {
      console.error(`Error cargando ${item.archivo}:`, error);
    }
  }
  
  // Ordenar noticias por fecha (más reciente primero)
  if (nombreSeccion === 'noticias') {
    resultados.sort((a, b) => {
      const fechaA = new Date(a.data.fecha || 0);
      const fechaB = new Date(b.data.fecha || 0);
      return fechaB - fechaA;
    });
  }
  
  // Renderizar todo
  contenedor.innerHTML = resultados.map(funcionRender).join('');
}

// =========================================================
// FUNCIONES DE RENDERIZADO (cómo se ve cada card)
// =========================================================

function renderizarNoticia(item) {
  const { titulo, fecha, imagen } = item.data;
  const extracto = extraerExtracto(item.cuerpoHTML, 150);
  
  return `
    <article class="card-noticia">
      ${imagen ? `
        <div class="card-noticia__img">
          <img src="${imagen}" alt="${titulo}" loading="lazy" />
        </div>
      ` : ''}
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
    <article class="card-programa">
      ${imagen ? `
        <div class="card-programa__img">
          <img src="${imagen}" alt="${nombre}" loading="lazy" />
        </div>
      ` : ''}
      <div class="card-programa__info">
        <h3 class="card-programa__nombre">${nombre || 'Sin nombre'}</h3>
        ${horario ? `<p class="card-programa__horario">🕐 ${horario}</p>` : ''}
        ${diasArray.length > 0 ? `
          <div class="card-programa__dias">
            ${diasArray.map(dia => `<span class="card-programa__dia">${dia}</span>`).join('')}
          </div>
        ` : ''}
        <p class="card-programa__desc">${descripcion || ''}</p>
      </div>
    </article>
  `;
}

function renderizarLocutor(item) {
  const { nombre, foto, programa, bio } = item.data;
  
  return `
    <article class="card-locutor">
      ${foto ? `
        <div class="card-locutor__foto">
          <img src="${foto}" alt="${nombre}" loading="lazy" />
        </div>
      ` : ''}
      <h3 class="card-locutor__nombre">${nombre || 'Sin nombre'}</h3>
      ${programa ? `<p class="card-locutor__programa">${programa}</p>` : ''}
      <p class="card-locutor__bio">${bio || ''}</p>
    </article>
  `;
}

// =========================================================
// FUNCIONES UTILITARIAS
// =========================================================

// Extraer texto plano del HTML (para el extracto)
function extraerExtracto(html, maxLongitud) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const texto = div.textContent || div.innerText || '';
  return texto.length > maxLongitud 
    ? texto.substring(0, maxLongitud).trim() + '...'
    : texto.trim();
}

// Formatear fecha de YYYY-MM-DD a "8 de julio, 2026"
function formatearFecha(fechaStr) {
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  } catch {
    return fechaStr;
  }
}

// Activar menú hamburguesa en móvil
function activarMenuMovil() {
  const boton = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu-principal');
  
  if (!boton || !menu) return;
  
  boton.addEventListener('click', () => {
    const expandido = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', !expandido);
    menu.classList.toggle('is-open');
  });
  
  // Cerrar menú al hacer click en un enlace
  menu.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      boton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  });
}

// Mostrar error global
function mostrarErrorGlobal(mensaje) {
  const contenedor = document.querySelector('main');
  if (contenedor) {
    contenedor.innerHTML = `
      <div class="container">
        <div class="error">
          <h2>⚠️ Error</h2>
          <p>${mensaje}</p>
        </div>
      </div>
    `;
  }
}

// =========================================================
// REPRODUCTOR DE RADIO
// =========================================================

let audioElement = null;
let isPlaying = false;

function inicializarReproductor() {
  audioElement = document.getElementById('audio-stream');
  const btnPlay = document.getElementById('btn-play');
  const btnMute = document.getElementById('btn-mute');
  const volumeSlider = document.getElementById('volume-slider');
  const iconVolume = document.getElementById('icon-volume');
  const iconMute = document.getElementById('icon-mute');
  const player = document.getElementById('player');
  
  if (!audioElement || !btnPlay) return;
  
  // Mostrar reproductor
  player.classList.add('is-visible');
  document.body.classList.add('has-player');
  
  // Configurar volumen inicial
  audioElement.volume = 0.8;
  
  // Botón Play/Pause
  btnPlay.addEventListener('click', () => {
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
      btnPlay.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      btnPlay.setAttribute('aria-label', 'Reproducir');
    } else {
      audioElement.play().catch(error => {
        console.error('Error al reproducir:', error);
        alert('No se pudo conectar con el stream. Verifica tu conexión a internet.');
      });
      isPlaying = true;
      btnPlay.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      btnPlay.setAttribute('aria-label', 'Pausar');
    }
  });
  
  // Botón Mute/Unmute
  btnMute.addEventListener('click', () => {
    if (audioElement.muted) {
      audioElement.muted = false;
      volumeSlider.value = audioElement.volume * 100;
      iconVolume.style.display = 'block';
      iconMute.style.display = 'none';
    } else {
      audioElement.muted = true;
      volumeSlider.value = 0;
      iconVolume.style.display = 'none';
      iconMute.style.display = 'block';
    }
  });
  
  // Slider de volumen
  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value / 100;
    audioElement.volume = value;
    
    if (value === 0) {
      audioElement.muted = true;
      iconVolume.style.display = 'none';
      iconMute.style.display = 'block';
    } else {
      audioElement.muted = false;
      iconVolume.style.display = 'block';
      iconMute.style.display = 'none';
    }
  });
  
  // Si el stream se detiene por error
  audioElement.addEventListener('error', () => {
    console.error('Error en el stream de audio');
    isPlaying = false;
    btnPlay.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  });
}

// Llamar a inicializarReproductor() después de iniciar()
// Modifica la función iniciar() para que llame a esto:
const iniciarOriginal = iniciar;
async function iniciar() {
  await iniciarOriginal();
  inicializarReproductor();
}
