// =========================================================
// CONFIGURACIÓN CENTRALIZADA DE RADIO CREPUSCULAR
// Modifica estos valores para cambiar el sitio sin tocar el código
// =========================================================

window.RADIO_CONFIG = {
    // ============================================
  // 🖤 MODO LUTO
  // Para activar: pon modoLuto en true
  // Para fechas automáticas: pon fechaInicio y fechaFin
  // Si fechaFin ya pasó, se desactiva solo
  // ============================================
  modoLuto: {
    activo: true,  // ← Cambia a false para volver al diseño normal
    mensaje: 'En memoria de nuestro pueblo. Venezuela está de luto.',
    // Opcional: fechas automáticas (formato: 'YYYY-MM-DD')
    // Si pones null, queda activo hasta que cambies "activo" a false
    fechaInicio: '2026-07-08',
    fechaFin: '2026-07-15'  // ← Después de esta fecha, vuelve a la normalidad
  },
  // Información de la radio
  nombre: 'Radio Crepuscular',
  frecuencia: '99.5 FM',
  slogan: '☭ ¡Somos Las voces... Voces Combativas! ✊🚩',
  descripcion: 'La radio del pueblo, en el aire y en la lucha.',
  
  // Stream de audio (Shoutcast)
  streamUrl: 'http://88.150.230.110:27223/stream',
  
  // Logo e imágenes
  logo: '/assets/imagenes/logo.png',
  
  // Contacto
  contacto: {
    direccion: 'Bqto, Venezuela',
    telefono: '+58 000 000 0000',
    email: 'contacto@radiocrepuscular.fm',
    whatsapp: '+580000000000'
  },
  
  // Redes sociales
  redes: {
    facebook: 'https://facebook.com/radiocrepuscular',
    instagram: 'https://instagram.com/radiocrepuscular',
    twitter: 'https://twitter.com/radiocrepuscular',
    youtube: 'https://youtube.com/@radiocrepuscular',
    tiktok: 'https://tiktok.com/@radiocrepuscular'
  },

      // Alianzas y partners (logos en el footer)
  alianzas: [
    {
      nombre: 'Alianza 1',
      logo: '/assets/imagenes/alianza-1.png',
      url: 'https://ejemplo.com'
    },
    {
      nombre: 'Alianza 2',
      logo: '/assets/imagenes/alianza-2.png',
      url: 'https://ejemplo2.com'
    },
    {
      nombre: 'Alianza 3',
      logo: '/assets/imagenes/alianza-3.png',
      url: 'https://ejemplo3.com'
    }
  ],
  
  // Colores (puedes cambiarlos aquí)
  colores: {
    naranja: '#FF6B35',
    naranjaClaro: '#FF8C42',
    sol: '#FFD93D',
    purpura: '#6B2D5C',
    purpuraProfundo: '#3D1A46',
    azulNoche: '#1A1A2E',
    rojo: '#C1121F'
  }
};
