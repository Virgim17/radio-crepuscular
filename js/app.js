/* ==========================================================
   RADIO CREPUSCULAR 99.5 FM — LÓGICA DE LA PÁGINA
   No necesitas editar este archivo. Todo el contenido se
   cambia desde el panel (/admin o /operador).
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Utilidades ---------- */
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  // Crea un elemento HTML de forma segura (el texto nunca se interpreta como código).
  function el(etiqueta, props) {
    var nodo = document.createElement(etiqueta);
    var hijos = Array.prototype.slice.call(arguments, 2);
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') nodo.className = v;
      else if (k === 'text') nodo.textContent = v;
      else if (k.indexOf('on') === 0) nodo.addEventListener(k.slice(2), v);
      else nodo.setAttribute(k, v === true ? '' : v);
    });
    hijos.forEach(function (h) {
      if (h === null || h === undefined || h === false) return;
      nodo.appendChild(h.nodeType ? h : document.createTextNode(String(h)));
    });
    return nodo;
  }

  // Solo permite enlaces http, https, mailto y tel.
  function enlaceSeguro(url) {
    url = String(url || '').trim();
    return /^(https?:|mailto:|tel:)/i.test(url) ? url : '';
  }

  function vaciar(nodo) { while (nodo.firstChild) nodo.removeChild(nodo.firstChild); }

  var DEFECTO = {
    nombre: 'Radio Crepuscular', frecuencia: '99.5 FM', slogan: '', descripcion: '',
    stream_url: '', logo: '/assets/imagenes/logo.png', fondo: '/assets/imagenes/fondo-hero.jpg',
    contacto: { direccion: '', telefono: '', email: '' }, redes: [],
    textos: {}, luto: { activo: false, mensaje: '' }
  };

  var datos = { sitio: DEFECTO, noticias: [], programas: [], locutores: [], alianzas: [] };

  /* ---------- Iconos ---------- */
  var ICONOS = {
    facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
    instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
    twitter: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
    tiktok: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
    whatsapp: '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 1 1 6.98 3.86zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.29z"/>',
    enlace: '<path d="M10.59 13.41a1 1 0 0 0 1.41 0l3.3-3.3a3 3 0 0 0-4.24-4.24l-1.4 1.4 1.41 1.42 1.4-1.41a1 1 0 0 1 1.42 1.41l-3.3 3.3a1 1 0 0 0 0 1.42zM13.41 10.59a1 1 0 0 0-1.41 0l-3.3 3.3a3 3 0 0 0 4.24 4.24l1.4-1.4-1.41-1.42-1.4 1.41a1 1 0 0 1-1.42-1.41l3.3-3.3a1 1 0 0 0 0-1.42z"/>',
    ubicacion: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>',
    telefono: '<path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z"/>',
    correo: '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>'
  };

  function icono(nombre) {
    var cont = el('span', { class: 'ico', 'aria-hidden': 'true' });
    cont.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor">' + (ICONOS[nombre] || ICONOS.enlace) + '</svg>';
    return cont;
  }

  /* ---------- Imágenes con respaldo ---------- */
  function imagen(src, alt, clase) {
    var logo = datos.sitio.logo || DEFECTO.logo;
    var img = el('img', { class: clase, alt: alt || '', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' });
    function ponerLogo() {
      img.classList.add('es-logo');
      img.src = logo;
    }
    img.addEventListener('error', function alFallar() {
      img.removeEventListener('error', alFallar);
      ponerLogo();
    });
    if (src) img.src = src; else ponerLogo();
    return img;
  }

  /* ---------- Fechas y textos ---------- */
  function fechaLarga(f) {
    var d = new Date(f);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function aTiempo(f) { var t = new Date(f).getTime(); return isNaN(t) ? 0 : t; }
  function resumen(texto) {
    var t = String(texto || '').replace(/\s+/g, ' ').trim();
    return t.length > 170 ? t.slice(0, 170).replace(/\s+\S*$/, '') + '…' : t;
  }
  function porOrden(a, b) {
    var oa = Number(a.orden) || 50, ob = Number(b.orden) || 50;
    if (oa !== ob) return oa - ob;
    return String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es');
  }

  /* ---------- Piezas de contenido ---------- */
  function vacio(texto) { return el('p', { class: 'vacio', text: texto }); }

  function tarjetaNoticia(n) {
    function abrir() { abrirNoticia(n); }
    return el('article', {
      class: 'noticia', tabindex: '0', role: 'button', 'aria-label': 'Leer la noticia: ' + (n.titulo || ''),
      onclick: abrir,
      onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } }
    },
      imagen(n.imagen, '', 'noticia__img'),
      el('div', { class: 'noticia__texto' },
        el('time', { datetime: n.fecha || '', text: fechaLarga(n.fecha) }),
        el('h3', { text: n.titulo || '' }),
        el('p', { text: resumen(n.cuerpo) })
      )
    );
  }

  function filaPrograma(p) {
    return el('article', { class: 'programa' },
      el('div', { class: 'programa__hora' }, p.horario || '', p.dias ? el('small', { text: p.dias }) : null),
      el('div', { class: 'programa__info' },
        el('h3', { text: p.nombre || '' }),
        el('p', { text: p.descripcion || '' })
      ),
      imagen(p.imagen, p.nombre || '', 'programa__img')
    );
  }

  function tarjetaVoz(l, i) {
    return el('article', { class: 'voz reveal', style: '--i:' + (i % 6) },
      imagen(l.foto, 'Foto de ' + (l.nombre || ''), 'voz__foto'),
      el('h3', { text: l.nombre || '' }),
      l.programa ? el('div', { class: 'voz__prog', text: l.programa }) : null,
      l.bio ? el('p', { text: l.bio }) : null
    );
  }

  function pieza(a) {
    var url = enlaceSeguro(a.url);
    var img = el('img', { src: a.logo || '', alt: a.nombre || 'Aliado', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' });
    return url
      ? el('a', { class: 'alianza', href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': a.nombre || 'Aliado' }, img)
      : el('div', { class: 'alianza', title: a.nombre || '' }, img);
  }

  function bloqueDatos() {
    var c = datos.sitio.contacto || {};
    var lista = el('ul', { class: 'datos' });
    if (c.direccion) lista.appendChild(el('li', {}, icono('ubicacion'), el('span', { text: c.direccion })));
    if (c.telefono) {
      var num = String(c.telefono).replace(/[^\d+]/g, '');
      lista.appendChild(el('li', {}, icono('telefono'), el('a', { href: 'tel:' + num, text: c.telefono })));
    }
    if (c.email) lista.appendChild(el('li', {}, icono('correo'), el('a', { href: 'mailto:' + c.email, text: c.email })));
    return lista;
  }

  function bloqueRedes() {
    var redes = datos.sitio.redes || [];
    var lista = el('ul', { class: 'redes' });
    redes.forEach(function (r) {
      var url = enlaceSeguro(r.url);
      if (!url) return;
      lista.appendChild(el('li', {},
        el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, icono(r.red), el('span', { text: r.red === 'twitter' ? 'X (Twitter)' : r.red }))
      ));
    });
    if (!lista.firstChild) return vacio('Pronto compartiremos nuestras redes.');
    return lista;
  }

  /* ---------- Ventana de noticia ---------- */
  var dlg = $('#dlg-noticia');
  function abrirNoticia(n) {
    var img = $('#dlg-img');
    img.classList.remove('es-logo');
    img.onerror = function () { img.onerror = null; img.classList.add('es-logo'); img.src = datos.sitio.logo || DEFECTO.logo; };
    img.referrerPolicy = 'no-referrer';
    img.src = n.imagen || datos.sitio.logo || DEFECTO.logo;
    img.alt = n.titulo || '';
    $('#dlg-fecha').textContent = fechaLarga(n.fecha);
    $('#dlg-titulo').textContent = n.titulo || '';
    var cont = $('#dlg-texto');
    vaciar(cont);
    String(n.cuerpo || '').split(/\n{2,}/).forEach(function (par) {
      if (par.trim()) cont.appendChild(el('p', { text: par.replace(/\s*\n\s*/g, ' ').trim() }));
    });
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.scrollTop = 0;
  }
  $('#dlg-cerrar').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  /* ---------- Dibujar todo el contenido ---------- */
  function rellenar(id, items, fabrica, textoVacio) {
    var cont = document.getElementById(id);
    if (!cont) return;
    vaciar(cont);
    if (!items.length) { cont.appendChild(vacio(textoVacio)); return; }
    items.forEach(function (it, i) { cont.appendChild(fabrica(it, i)); });
  }

  function dibujar() {
    var s = datos.sitio;
    var nombreCompleto = ((s.nombre || '') + ' ' + (s.frecuencia || '')).trim();
    var t = s.textos || {};

    document.title = nombreCompleto;
    $('#nom-cab').textContent = s.nombre || '';
    $('#frec-cab').textContent = s.frecuencia || '';
    $('#hero-titulo').textContent = nombreCompleto;
    $('#hero-slogan').textContent = s.slogan || '';
    $('#hero-desc').textContent = s.descripcion || '';
    $('#nom-rp').textContent = nombreCompleto;
    $('#pie-nombre').textContent = nombreCompleto;
    $('#anio').textContent = new Date().getFullYear();

    ['logo-cab', 'logo-hero', 'logo-rp'].forEach(function (id) { var i = document.getElementById(id); if (i && s.logo) i.src = s.logo; });
    if (s.fondo) document.getElementById('fondo').style.setProperty('--fondo-img', 'url("' + s.fondo.replace(/"/g, '%22') + '")');

    $$('[data-texto]').forEach(function (n) {
      var clave = n.getAttribute('data-texto');
      if (clave === 'alianzas-titulo') { if (t.alianzas) n.textContent = t.alianzas; }
      else n.textContent = t[clave] || '';
    });

    var noticias = datos.noticias.slice().sort(function (a, b) { return aTiempo(b.fecha) - aTiempo(a.fecha); });
    var programas = datos.programas.slice().sort(porOrden);
    var locutores = datos.locutores.slice().sort(porOrden);
    var alianzas = datos.alianzas.slice().sort(porOrden);

    rellenar('home-noticias', noticias.slice(0, 3), tarjetaNoticia, 'Muy pronto publicaremos nuestras primeras noticias.');
    rellenar('lista-noticias', noticias, tarjetaNoticia, 'Muy pronto publicaremos nuestras primeras noticias.');
    rellenar('home-programas', programas.slice(0, 6), filaPrograma, 'Estamos preparando la programación.');
    rellenar('lista-programas', programas, filaPrograma, 'Estamos preparando la programación.');
    rellenar('home-voces', locutores.slice(0, 8), tarjetaVoz, 'Pronto conocerás a nuestras voces.');
    rellenar('lista-locutores', locutores, tarjetaVoz, 'Pronto conocerás a nuestras voces.');

    $$('[data-slot="datos"]').forEach(function (n) { vaciar(n); n.appendChild(bloqueDatos()); });
    $$('[data-slot="redes"]').forEach(function (n) { vaciar(n); n.appendChild(bloqueRedes()); });
    $$('[data-slot="alianzas"]').forEach(function (n) {
      vaciar(n);
      if (!alianzas.length) n.appendChild(vacio('Pronto mostraremos a nuestros aliados.'));
      else alianzas.forEach(function (a) { n.appendChild(pieza(a)); });
    });

    var c = s.contacto || {};
    var botonCorreo = $('#boton-correo');
    if (c.email) botonCorreo.href = 'mailto:' + c.email; else botonCorreo.hidden = true;

    var luto = $('#luto');
    if (s.luto && s.luto.activo) {
      document.body.classList.add('modo-luto');
      luto.textContent = s.luto.mensaje || '';
      luto.hidden = false;
    } else {
      document.body.classList.remove('modo-luto');
      luto.hidden = true;
    }

    observarApariciones();
    prepararReproductor();
  }

  /* ---------- Aparición animada de los locutores ---------- */
  var observador = null;
  function observarApariciones() {
    var pendientes = $$('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) { pendientes.forEach(function (n) { n.classList.add('visible'); }); return; }
    if (!observador) {
      observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); observador.unobserve(e.target); }
        });
      }, { threshold: 0.15 });
    }
    pendientes.forEach(function (n) { observador.observe(n); });
  }

  /* ---------- Pestañas (la página nunca se recarga) ---------- */
  var VISTAS = ['inicio', 'noticias', 'programas', 'locutores', 'contactos'];
  var TITULOS = { inicio: 'Inicio', noticias: 'Noticias', programas: 'Programas', locutores: 'Locutores', contactos: 'Contactos' };

  function rutaActual() {
    var h = location.hash.replace(/^#\/?/, '').split('?')[0];
    return VISTAS.indexOf(h) >= 0 ? h : 'inicio';
  }
  function mostrarVista() {
    var v = rutaActual();
    $$('[data-vista]').forEach(function (s) { s.hidden = s.getAttribute('data-vista') !== v; });
    $$('#menu a').forEach(function (a) {
      var activa = a.getAttribute('data-ruta') === v;
      a.classList.toggle('activa', activa);
      if (activa) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var s = datos.sitio;
    document.title = TITULOS[v] + ' · ' + ((s.nombre || '') + ' ' + (s.frecuencia || '')).trim();
    cerrarMenu();
    window.scrollTo(0, 0);
    observarApariciones();
  }

  var burger = $('#burger'), menu = $('#menu');
  function cerrarMenu() {
    menu.classList.remove('abierto');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  window.addEventListener('hashchange', mostrarVista);

  /* ==========================================================
     REPRODUCTOR
     ========================================================== */
  var audio = $('#audio');
  var caja = $('#reproductor');
  var btnPlay = $('#rp-play');
  var btnMute = $('#rp-mute');
  var rango = $('#rp-vol');
  var textoEstado = $('#estado-rp');

  var urlStream = '';
  var pausadoPorUsuario = false;   // true = el visitante pulsó pausa: no se reinicia solo
  var temporizador = null;
  var armado = false;
  var preparado = false;

  var TEXTOS = {
    pausa: 'En vivo · pulsa ▶ para escuchar',
    cargando: 'Conectando…',
    sonando: 'Sonando en vivo',
    bloqueado: 'Toca la pantalla para escuchar',
    error: 'Sin señal, reintentando…'
  };

  function estado(e) {
    caja.setAttribute('data-estado', e);
    textoEstado.textContent = TEXTOS[e];
    btnPlay.setAttribute('aria-label', e === 'sonando' || e === 'cargando' ? 'Pausar' : 'Reproducir');
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = e === 'sonando' ? 'playing' : 'paused';
    }
  }

  function reproducir() {
    if (!urlStream) return;
    clearTimeout(temporizador);
    pausadoPorUsuario = false;
    estado('cargando');
    // Se vuelve a cargar la señal cada vez para entrar siempre "en vivo".
    audio.src = urlStream;
    var promesa = audio.play();
    if (promesa && promesa.catch) {
      promesa.catch(function (err) {
        if (err && err.name === 'NotAllowedError') {
          estado('bloqueado');
          armarPrimerToque();
        } else if (err && err.name === 'AbortError') {
          /* se interrumpió por una nueva orden: no hacer nada */
        } else {
          reintentar();
        }
      });
    }
  }

  function pausar() {
    pausadoPorUsuario = true;
    clearTimeout(temporizador);
    audio.pause();
    audio.removeAttribute('src');
    audio.load();       // corta la descarga para no gastar datos del visitante
    estado('pausa');
  }

  function reintentar() {
    if (pausadoPorUsuario) return;
    estado('error');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { if (!pausadoPorUsuario) reproducir(); }, 4000);
  }

  // Los navegadores bloquean el audio automático. Solución: al primer toque,
  // clic o tecla del visitante en cualquier parte de la página, arranca la radio.
  function armarPrimerToque() {
    if (armado) return;
    armado = true;
    var eventos = ['pointerup', 'click', 'keydown', 'touchend'];
    function alToque(ev) {
      eventos.forEach(function (n) { document.removeEventListener(n, alToque, true); });
      armado = false;
      if (ev.target && ev.target.closest && ev.target.closest('#reproductor')) return; // los botones del reproductor se encargan solos
      if (!pausadoPorUsuario && audio.paused) reproducir();
    }
    eventos.forEach(function (n) { document.addEventListener(n, alToque, true); });
  }

  function aplicarVolumen(valor) {
    var v = Math.max(0, Math.min(100, Number(valor) || 0));
    audio.volume = v / 100;
    rango.value = v;
    rango.style.setProperty('--v', v + '%');
    audio.muted = v === 0;
    btnMute.setAttribute('data-mudo', audio.muted ? 'true' : 'false');
    try { localStorage.setItem('crep-volumen', String(v)); } catch (e) { /* sin almacenamiento */ }
  }

  var volumenAntes = 80;
  btnMute.addEventListener('click', function () {
    if (audio.muted || Number(rango.value) === 0) aplicarVolumen(volumenAntes || 80);
    else { volumenAntes = Number(rango.value); aplicarVolumen(0); }
  });
  rango.addEventListener('input', function () { aplicarVolumen(rango.value); });

  btnPlay.addEventListener('click', function () {
    var e = caja.getAttribute('data-estado');
    if (e === 'sonando' || e === 'cargando') pausar(); else reproducir();
  });
  $('#hero-escuchar').addEventListener('click', function () {
    var e = caja.getAttribute('data-estado');
    if (e !== 'sonando' && e !== 'cargando') reproducir();
  });

  audio.addEventListener('playing', function () { estado('sonando'); });
  audio.addEventListener('waiting', function () { if (!pausadoPorUsuario && !audio.paused) estado('cargando'); });
  audio.addEventListener('error', function () { if (!pausadoPorUsuario && audio.getAttribute('src')) reintentar(); });
  audio.addEventListener('ended', function () { if (!pausadoPorUsuario) reintentar(); });
  audio.addEventListener('stalled', function () {
    // Si la señal se queda trabada 12 segundos, se reconecta.
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      if (!pausadoPorUsuario && audio.readyState < 3) reproducir();
    }, 12000);
  });
  window.addEventListener('online', function () { if (!pausadoPorUsuario && audio.paused) reproducir(); });

  function prepararReproductor() {
    var s = datos.sitio;
    var nuevaUrl = enlaceSeguro(s.stream_url);
    var cambio = nuevaUrl !== urlStream;
    urlStream = nuevaUrl;

    if ('mediaSession' in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'En vivo',
        artist: ((s.nombre || '') + ' ' + (s.frecuencia || '')).trim(),
        artwork: s.logo ? [{ src: s.logo, sizes: '500x500', type: 'image/png' }] : []
      });
      navigator.mediaSession.setActionHandler('play', reproducir);
      navigator.mediaSession.setActionHandler('pause', pausar);
    }

    if (!urlStream) { textoEstado.textContent = 'Transmisión no configurada'; return; }
    if (preparado && !cambio) return;
    preparado = true;

    var guardado = 80;
    try { var g = localStorage.getItem('crep-volumen'); if (g !== null) guardado = Number(g); } catch (e) { /* sin almacenamiento */ }
    volumenAntes = guardado || 80;
    aplicarVolumen(guardado);
    estado('pausa');

    // Intento automático al entrar.
    reproducir();
  }

  /* ---------- Arranque ---------- */
  function arrancar() {
    mostrarVista();
    fetch('/datos.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('No se pudo leer datos.json'); return r.json(); })
      .then(function (d) {
        datos = {
          sitio: Object.assign({}, DEFECTO, d.sitio || {}),
          noticias: d.noticias || [], programas: d.programas || [],
          locutores: d.locutores || [], alianzas: d.alianzas || []
        };
        dibujar();
        mostrarVista();
      })
      .catch(function (err) {
        console.error(err);
        dibujar();
        textoEstado.textContent = 'No se pudieron cargar los datos';
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
