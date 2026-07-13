// =========================================================
// CONFIGURACIÓN CENTRALIZADA DE RADIO CREPUSCULAR
// =========================================================

window.RADIO_CONFIG = {
  // Información básica
  nombre: 'Radio Crepuscular',
  frecuencia: '99.5 FM',
  slogan: '☭ ¡Somos Las voces, Voces Combativas! ✊🚩',
  descripcion: 'La radio del pueblo, en el aire y en la lucha.',
  
  // Logo e imágenes
  logo: '/assets/imagenes/logo.png',
  
  // Stream de audio (¡Tu enlace actualizado!)
  streamUrl: 'https://uk2freenew.listen2myradio.com/live.mp3?typeportmount=s2_27223_stream_808865470',
  
  // Modo Luto (cambia 'activo' a true cuando lo necesites)
  modoLuto: {
    activo: false, 
    mensaje: 'En memoria de nuestro pueblo. Venezuela está de luto.',
    fechaInicio: '2026-07-08',
    fechaFin: '2026-07-15'
  },

  // Contacto (esto reemplazará lo que esté en el footer)
  contacto: {
    direccion: 'Caracas, Venezuela',
    telefono: '+58 000 000 0000',
    email: 'contacto@radiocrepuscular.fm'
  },
  
  // Redes sociales
  redes: {
    facebook: 'https://facebook.com/radiocrepuscular',
    instagram: 'https://instagram.com/radiocrepuscular',
    twitter: 'https://twitter.com/radiocrepuscular',
    youtube: 'https://youtube.com/@radiocrepuscular',
    tiktok: 'https://tiktok.com/@radiocrepuscular'
  },

  // Alianzas (logos en el footer)
  alianzas: [
    {
      nombre: 'Alianza Ejemplo 1',
      logo: '/assets/imagenes/alianza-1.png',
      url: 'https://ejemplo.com'
    },
    {
      nombre: 'Alianza Ejemplo 2',
      logo: '/assets/imagenes/alianza-2.png',
      url: 'https://ejemplo2.com'
    }
  ]
};
