// =========================================================
// GENERADOR AUTOMÁTICO DE MANIFEST.JSON
// Lee todos los archivos .md de /content/ y crea manifest.json en la raíz
// =========================================================

const fs = require('fs');
const path = require('path');

// Rutas corregidas: ahora guarda en la raíz del repo, no en /public
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_FILE = path.join(__dirname, '..', 'manifest.json'); 

const manifest = {
  noticias: [],
  locutores: [],
  programas: []
};

// Función para leer archivos .md de una carpeta
function leerSeccion(carpeta) {
  const ruta = path.join(CONTENT_DIR, carpeta);
  
  if (!fs.existsSync(ruta)) {
    console.log(`⚠️  No existe la carpeta: ${carpeta}`);
    return [];
  }
  
  const archivos = fs.readdirSync(ruta)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ archivo: f }));
  
  console.log(`✅ ${carpeta}: ${archivos.length} archivo(s)`);
  return archivos;
}

// Leer cada sección
manifest.noticias = leerSeccion('noticias');
manifest.locutores = leerSeccion('locutores');
manifest.programas = leerSeccion('programas');

// Guardar manifest.json en la raíz
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`\n🎉 manifest.json generado con éxito en: ${OUTPUT_FILE}`);
console.log(`   - Noticias: ${manifest.noticias.length}`);
console.log(`   - Locutores: ${manifest.locutores.length}`);
console.log(`   - Programas: ${manifest.programas.length}`);
