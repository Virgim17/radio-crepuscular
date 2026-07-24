// =========================================================
// GENERADOR AUTOMÁTICO DE MANIFEST.JSON
// Lee todos los archivos .md de /content/ y crea manifest.json
// =========================================================

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'manifest.json');

// Asegurar que existe la carpeta public
if (!fs.existsSync(path.join(__dirname, '..', 'public'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'public'));
}

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

// Guardar manifest.json
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`\n🎉 manifest.json generado con éxito en: ${OUTPUT_FILE}`);
console.log(`   - Noticias: ${manifest.noticias.length}`);
console.log(`   - Locutores: ${manifest.locutores.length}`);
console.log(`   - Programas: ${manifest.programas.length}`);
