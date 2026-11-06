// Lee todos los archivos .json de la carpeta "content" y la configuración,
// y los junta en un solo archivo: datos.json (lo que lee la página web).
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');

function leer(ruta) {
  return JSON.parse(fs.readFileSync(ruta, 'utf8'));
}

function carpeta(nombre) {
  const dir = path.join(raiz, 'content', nombre);
  if (!fs.existsSync(dir)) return [];
  const lista = [];
  for (const archivo of fs.readdirSync(dir)) {
    if (!archivo.endsWith('.json')) continue;
    try {
      const dato = leer(path.join(dir, archivo));
      dato.id = archivo.replace(/\.json$/, '');
      lista.push(dato);
    } catch (e) {
      console.warn('Aviso: se omitió ' + archivo + ' porque tiene un error: ' + e.message);
    }
  }
  return lista;
}

const datos = {
  sitio: leer(path.join(raiz, 'config', 'sitio.json')),
  noticias: carpeta('noticias'),
  programas: carpeta('programas'),
  locutores: carpeta('locutores'),
  alianzas: carpeta('alianzas')
};

fs.writeFileSync(path.join(raiz, 'datos.json'), JSON.stringify(datos, null, 2));
console.log('datos.json listo -> noticias: ' + datos.noticias.length +
  ', programas: ' + datos.programas.length +
  ', locutores: ' + datos.locutores.length +
  ', alianzas: ' + datos.alianzas.length);
