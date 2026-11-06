# Guía de Radio Crepuscular 99.5 FM
### Para crear, publicar y administrar tu página web sin saber programar

Esta guía va de la mano con la carpeta `radio-crepuscular`, que ya contiene **todo el código completo**. No tienes que copiar ni pegar código: solo copiar archivos y hacer clic.

---

## 0. Qué hay dentro de la carpeta

```
radio-crepuscular/
├── index.html                  ← la página (estructura y pestañas)
├── css/estilos.css             ← colores, tipografías y diseño
├── js/app.js                   ← el cerebro: pestañas, reproductor, datos
├── datos.json                  ← se genera solo (resumen de todo el contenido)
├── config/sitio.json           ← datos generales: nombre, contacto, redes, fondo, transmisión
├── content/                    ← noticias, programas, locutores y alianzas (un archivo por cada uno)
├── assets/imagenes/            ← logo, fondo y fotos
│   └── subidas/                ← aquí caen las fotos que subas desde el panel
├── admin/                      ← panel del ADMINISTRADOR (tú): controla todo
├── operador/                   ← panel del OPERADOR: solo noticias, programas, locutores, alianzas
├── scripts/generar-datos.js    ← arma datos.json
├── .github/workflows/publicar.yml ← publica la página automáticamente
├── CNAME                       ← tu dominio (crepuscularfm.com.ve)
└── GUIA.md                     ← este documento
```

**Glosario rápido** (cada término, la primera vez):
- **Repositorio (repo):** la carpeta de tu proyecto guardada en GitHub, con historial de todos los cambios.
- **GitHub:** sitio web gratuito donde se guarda el repositorio. Además publica tu página (servicio **GitHub Pages**).
- **Commit:** "guardar una versión" de tus cambios con una nota (ej. "Nuevo logo").
- **Sync / Push:** enviar tus cambios de tu computadora a GitHub.
- **Stream (transmisión):** el enlace por el que sale tu audio en vivo desde Caster.fm.
- **JSON:** un tipo de archivo de texto donde se guardan datos ordenados. Los paneles los crean por ti; no tienes que abrirlos.
- **Panel (CMS):** una página con formularios para editar contenido sin tocar código. Usamos *Decap CMS*.
- **Navegador:** Chrome, Edge, Firefox, Safari.

---

## 1. Qué programas y cuentas necesitas (todo gratis)

| Qué | Para qué | Dónde |
|---|---|---|
| Cuenta de **GitHub** | Guardar y publicar la página | https://github.com (ya la tienes: `Virgim17`) |
| **Visual Studio Code** | Ver y copiar archivos | https://code.visualstudio.com |
| **Git** | Que VS Code pueda enviar cambios a GitHub | https://git-scm.com/downloads (instala con todo por defecto) |
| Extensión **Live Server** | Ver la página en tu computadora antes de publicar | Dentro de VS Code (paso 3) |
| Cuenta de **Caster.fm** | Tu transmisión | ya la tienes |
| *(Opcional)* **Node.js** | Solo si quieres previsualizar cambios hechos a mano en archivos | https://nodejs.org (versión LTS) |

---

## 2. Subir el sitio nuevo a tu repositorio

Tu repositorio actual es `Virgim17/radio-crepuscular`. Vamos a reemplazar su contenido.

**2.1 Descarga tu repositorio a la computadora**
1. Abre **Visual Studio Code**.
2. Presiona `Ctrl + Shift + P` (en Mac: `Cmd + Shift + P`). Se abre una barra arriba.
3. Escribe `Git: Clone` y presiona Enter.
4. Elige **Clone from GitHub**. Si pide iniciar sesión, haz clic en **Allow** y acepta en el navegador.
5. Elige `Virgim17/radio-crepuscular`.
6. Elige una carpeta de tu computadora (ej. *Documentos*) y presiona **Select as Repository Destination**.
7. Cuando pregunte "Would you like to open the cloned repository?", haz clic en **Open**.

**Deberías ver:** a la izquierda, en el *Explorador* (icono de dos hojas), los archivos del sitio anterior.

**2.2 Borrar lo viejo**
1. En el Explorador, selecciona **todos** los archivos y carpetas (haz clic en uno y presiona `Ctrl + A`).
2. Clic derecho → **Delete** → confirma.
   *(Esto no toca el historial en GitHub: la carpeta `.git` está oculta y se conserva.)*

**2.3 Copiar lo nuevo**
1. Descomprime `radio-crepuscular-nuevo.zip` (clic derecho → *Extraer todo*).
2. Abre la carpeta `radio-crepuscular` que sale y entra en ella.
3. Selecciona todo su contenido (`Ctrl + A`) y arrástralo al Explorador de VS Code.
4. Si pregunta por reemplazar o copiar, elige **Copy**.

> Si no ves la carpeta `.github` al abrirla en tu computadora, es normal: Windows/Mac ocultan lo que empieza con punto. Para verla en Windows: pestaña *Vista* → marcar *Elementos ocultos*. En Mac: `Cmd + Shift + .`. **Es indispensable que se copie**, porque contiene la publicación automática. En VS Code sí la verás.

**Deberías ver** en el Explorador: `.github`, `admin`, `assets`, `config`, `content`, `css`, `js`, `operador`, `scripts`, `CNAME`, `GUIA.md`, `datos.json`, `index.html`.

**2.4 Enviar a GitHub**
1. Clic en el icono de **Control de código fuente** (el de tres puntos conectados), a la izquierda.
2. En el cuadro "Message" escribe: `Sitio nuevo de Radio Crepuscular`.
3. Clic en **Commit** (si pregunta por *stage all changes*, responde **Yes**).
4. Clic en **Sync Changes** (o **Publish/Push**).

**Deberías ver:** el botón desaparece y, en github.com/Virgim17/radio-crepuscular, aparecen los archivos nuevos.

---

## 3. Publicar con tu dominio (crepuscularfm.com.ve)

1. Entra a github.com/Virgim17/radio-crepuscular → **Settings** (Configuración) → menú izquierdo **Pages**.
2. En **Build and deployment → Source** elige **GitHub Actions**. *(Esto es lo que usa el archivo `publicar.yml`.)*
3. En **Custom domain** escribe `crepuscularfm.com.ve` y presiona **Save**. Marca **Enforce HTTPS** cuando se habilite.
4. Ve a la pestaña **Actions** del repositorio: verás "Publicar sitio" con un círculo amarillo (trabajando) que pasa a verde ✔ en 1–2 minutos.
5. Abre https://crepuscularfm.com.ve/

**Cada vez que se guarde un cambio** (tuyo o desde el panel), esa publicación corre sola y la página se actualiza en 1–3 minutos.

Si el dominio ya funcionaba antes con GitHub Pages, no necesitas tocar el DNS. Si te aparece un aviso de DNS en Pages, revisa con tu proveedor del dominio que apunte a GitHub (instrucciones: docs.github.com → *Managing a custom domain for your GitHub Pages site*).

---

## 4. Probar en tu computadora antes de publicar (opcional)

1. En VS Code: `Ctrl + Shift + X` → busca **Live Server** (de Ritwick Dey) → **Install**.
2. Clic derecho sobre `index.html` → **Open with Live Server**.
3. Se abre el navegador con tu página.

El panel `/admin` **no** inicia sesión en modo local; úsalo siempre en el sitio publicado.

Si editaste archivos de `content/` o `config/` a mano y tienes Node.js instalado, ejecuta en la terminal de VS Code (`Ctrl + ñ`): `node scripts/generar-datos.js` para refrescar la vista previa.

---

## 5. El dato de Caster.fm y dónde va

Necesitas **un solo dato**: el **enlace de transmisión (stream URL)** de tu emisora. Ya me lo diste y está puesto:

```
https://sapircast.caster.fm:17635/drrua?token=464fd321efadc8d98f3027b5e94ad747
```

**Dónde se cambia (si algún día cambia):**
1. Entra a https://crepuscularfm.com.ve/admin/
2. Menú izquierdo → **Configuración del sitio** → **Datos generales de la radio**.
3. Campo **Enlace de transmisión de Caster.fm** → pega el nuevo enlace completo → arriba a la derecha **Publicar** (Publish) → **Publicar ahora**.

**Cómo comprobar que tu enlace funciona:** pégalo en la barra de direcciones del navegador; debe empezar a sonar la radio (o descargar audio). Si no suena, el problema está en Caster.fm (emisora apagada o enlace vencido), no en la página. Caster.fm te lo muestra en tu panel de control como enlace de la emisora (*stream URL*).

---

## 6. Cómo funciona el reproductor (explicado simple)

**¿Por qué no se interrumpe al cambiar de pestaña?**
La página es de **una sola hoja** (*Single Page App*): Inicio, Noticias, Programas, Locutores y Contactos son "capas" dentro de la misma página. Al tocar una pestaña **no se recarga nada**, solo se muestra otra capa. El reproductor está **fuera** de esas capas, fijo abajo, así que la radio sigue sonando y el reproductor se ve en todas. (Si cada pestaña fuera una página distinta, el navegador cortaría el audio en cada cambio.)

**¿Por qué no arranca solo siempre?**
Chrome, Safari, Firefox y Edge **bloquean el audio automático** para proteger a los visitantes de sonidos sorpresa. Por eso la página:
1. Intenta sonar apenas entra.
2. Si el navegador lo bloquea, el botón ▶ late y dice "Toca la pantalla para escuchar".
3. **Al primer toque, clic o tecla del visitante, en cualquier parte, la radio arranca.**

Es la mejor solución posible: ningún sitio puede saltarse ese bloqueo. En algunos navegadores, si el visitante ya escucha tu sitio seguido, sonará de inmediato.

**Además:**
- Suena **hasta que el visitante pulse pausa**. Si se cae la señal o el internet, **reintenta sola** cada 4 segundos. Si el visitante pausó, nunca se reinicia por su cuenta.
- Al darle ▶ de nuevo, entra siempre **en vivo** (no repite lo que quedó pausado).
- Control de volumen y silencio. **En iPhone** el volumen se controla con los botones físicos del teléfono (Apple no permite que las páginas lo cambien).
- En celulares aparecen los controles en la pantalla de bloqueo.

---

## 7. Cambiar la imagen de fondo (amanecer de Barquisimeto)

**Forma fácil (recomendada):**
1. Entra a https://crepuscularfm.com.ve/admin/
2. **Configuración del sitio** → **Datos generales de la radio**.
3. Campo **Imagen de fondo (amanecer)** → **Elegir otra imagen** → **Subir** → elige tu foto.
4. **Publicar** → **Publicar ahora**. En 1–3 minutos se ve en la página.

**Forma manual:** reemplaza el archivo `assets/imagenes/fondo-hero.jpg` por tu foto **con el mismo nombre**, y haz *Commit* + *Sync* (paso 2.4).

**Consejos para la foto:** horizontal, al menos 1600 píxeles de ancho, menos de 1 MB (puedes reducirla gratis en squoosh.app). La página le pone una capa oscura para que el texto se lea; la foto se ve más al inicio y se oscurece al bajar.

---

## 8. Administrar el contenido (sin tocar código)

### Entrar al panel
- **Tú (Administrador):** https://crepuscularfm.com.ve/admin/ → botón **Login with GitHub** → autoriza.
- **Operador:** https://crepuscularfm.com.ve/operador/

### Qué puedes editar como Administrador
En el menú izquierdo:
- **Noticias, Programas, Locutores, Alianzas:** *New* (nuevo), clic en un elemento para editar, y para borrar: dentro del elemento, botón **Delete** (borrar).
- **Configuración del sitio → Datos generales:** nombre, frecuencia, slogan, descripción, enlace de transmisión, logo, imagen de fondo, **datos de contacto** (dirección, teléfono, correo), **redes sociales** (agrega, quita o cambia enlaces), textos de las secciones y **modo luto**.

### Cómo guardar un cambio
Edita → arriba a la derecha **Publicar → Publicar ahora**. Se actualiza solo la página en 1–3 minutos.

### Reglas útiles
- **Noticias:** la página de Inicio muestra automáticamente las **3 más recientes** (por la fecha que pongas). La foto es obligatoria. Deja una línea en blanco entre párrafos.
- **Programas, Locutores y Alianzas:** el campo **Orden** decide quién sale primero (1 = primero).
- **Fotos de locutores:** mejor verticales (retrato), ~800×1000 px. **Logos de aliados:** cuadrados o con fondo blanco.
- **Peso de las fotos:** que cada una pese menos de 1 MB para que la página cargue rápido en celulares.
- **Reemplaza los ejemplos:** los 3 programas, 2 locutores y 4 alianzas que vienen son de ejemplo. Edítalos o bórralos. También cambia el teléfono (`+58 000 000 0000`) y revisa tus enlaces de redes en *Configuración*.
- **Las 3 noticias que ya tenías** quedaron migradas.

---

## 9. El Operador: crear, dar y quitar acceso, y proteger el panel

### Cómo funciona el "usuario y contraseña"
El acceso usa **cuentas de GitHub**: el *usuario y contraseña* del operador son los de **su propia cuenta de GitHub** (gratuita), y GitHub decide si tiene permiso. Es más seguro que inventar un sistema propio, pero significa que el operador necesita tener cuenta de GitHub.

### 9.1 Crear la cuenta del operador
1. Pídele a tu operador que cree una cuenta en https://github.com/signup (con su correo).
2. Recomiéndale activar la **verificación en dos pasos**: GitHub → Settings → Password and authentication → *Two-factor authentication*.
3. Pídele su **nombre de usuario** de GitHub.

### 9.2 Darle acceso
1. Tú: github.com/Virgim17/radio-crepuscular → **Settings** → **Collaborators** (o *Collaborators and teams*).
2. **Add people** → escribe su usuario → elige su cuenta → **Add to this repository**.
3. Si te pide un rol, elige **Write**.
4. El operador recibe un correo de invitación y debe **aceptarla**.
5. Desde entonces entra a https://crepuscularfm.com.ve/operador/ → **Login with GitHub**.

### 9.3 Quitarle el acceso
Mismo lugar: **Settings → Collaborators** → al lado de su nombre, el icono de papelera / **Remove**. Desde ese momento no puede entrar ni cambiar nada. Todo lo que publicó queda guardado en el historial.

### 9.4 Proteger el panel (muy recomendado: 2 minutos)
El panel del operador tiene solo 4 secciones y sus cambios quedan **"en revisión"** hasta que tú los apruebes. Para que eso sea **obligatorio** y no una simple costumbre:

1. github.com/Virgim17/radio-crepuscular → **Settings** → **Branches** (en versiones nuevas: **Rules → Rulesets → New branch ruleset**).
2. **Add branch protection rule** → en *Branch name pattern* escribe `main`.
3. Marca **Require a pull request before merging** y **Required approvals: 1**.
4. **Deja sin marcar** "Do not allow bypassing the above settings" (así tú, como dueño, sí puedes publicar).
5. **Create / Save**.

**Cómo es el día a día del operador:**
1. Entra a `/operador/`, crea o edita una noticia, programa, locutor o alianza (con foto) y pulsa **Guardar**. Queda en la columna **Borradores** (*Drafts*).
2. Lo mueve a **En revisión** (*In Review*) (arrastrando o con el menú *Estado*).
3. **Tú** recibes un correo de GitHub: entras a la pestaña **Pull requests** del repositorio, revisas, **Approve** → **Merge pull request**. En 1–3 minutos queda publicado.

*Si prefieres que el operador publique sin tu aprobación:* no actives el paso 9.4. (Mira los límites de seguridad abajo.)

---

## 10. Límites de seguridad (honestidad total)

Esta solución es gratuita y sencilla porque la página está en GitHub Pages (un sitio **estático**, sin servidor propio). Eso trae límites que debes conocer:

1. **El login es de GitHub, no propio.** Cualquiera puede *ver* la pantalla de `/admin/` o `/operador/`, pero sin una cuenta de GitHub con permiso en tu repositorio **no puede hacer nada**. Poner el panel en una dirección poco conocida no es seguridad; la seguridad real es el permiso de GitHub.
2. **La separación Administrador/Operador no es técnica por sí sola.** Un colaborador con permiso *Write* podría, con conocimientos técnicos, abrir `/admin/` o editar archivos directamente en GitHub y cambiar, por ejemplo, la configuración. **Mitigación:** la regla del paso 9.4 (nadie publica en `main` sin tu aprobación), más revisar los *Pull requests* antes de aprobar. Con esa regla, el operador **no puede** poner nada en vivo sin tu visto bueno.
3. **Todo es público.** El repositorio es público y lo que subas (fotos, textos, datos de contacto) lo puede ver cualquiera. **No subas** datos privados (cédulas, contraseñas, teléfonos personales).
4. **El enlace de Caster.fm es visible.** Para que la radio suene en el navegador, el enlace (con su token) tiene que estar en la página; cualquiera que sepa mirar el código lo puede copiar. Es inevitable en cualquier página con reproductor. **Mitigación:** si ves uso indebido, genera uno nuevo en Caster.fm (si tu plan lo permite) y cámbialo en el panel (paso 5).
5. **El botón "Delete" borra de la página, no de la historia.** El historial de GitHub conserva versiones anteriores: sirve para **recuperar** algo borrado por error, pero también significa que un dato sensible subido por error sigue en el historial.
6. **Tu cuenta de GitHub es la llave maestra.** Activa la verificación en dos pasos y no compartas tu contraseña. Revoca accesos (paso 9.3) cuando alguien deje la emisora.
7. **El panel depende de un servicio de inicio de sesión** (el que ya tienes en `decap-oauth-proxy.virgim17.workers.dev`). Si deja de funcionar, la **página pública sigue funcionando igual**; solo no podrías entrar al panel hasta repararlo (ver "Si algo falla").

---

## 11. Si algo falla

| Síntoma | Qué hacer |
|---|---|
| **No suena la radio** | 1) Toca cualquier parte de la página (puede ser el bloqueo del navegador). 2) Pega el enlace de transmisión en una pestaña nueva: si ahí tampoco suena, revisa Caster.fm. 3) Verifica que el enlace en el panel empiece con `https://`. |
| **Cambié algo y no se ve** | Espera 3 minutos y recarga con `Ctrl + F5`. En GitHub → pestaña **Actions**, revisa que la última ejecución tenga ✔ verde. Si tiene ✖ rojo, haz clic para ver el mensaje. |
| **El panel no deja entrar (Login with GitHub)** | Confirma que tu usuario tiene permiso en el repositorio. Si el error menciona "OAuth" o la ventana queda en blanco, el servicio de inicio de sesión (Cloudflare Worker) o su *OAuth App* en GitHub necesita revisión: en GitHub → Settings → Developer settings → OAuth Apps, el *Authorization callback URL* debe ser `https://decap-oauth-proxy.virgim17.workers.dev/callback`. |
| **El operador no puede guardar** | Revisa que haya aceptado la invitación de colaborador (correo de GitHub) y que su rol sea **Write**. |
| **Una foto no aparece** | Pesa demasiado o se subió con otro nombre: súbela de nuevo desde el panel. |
| **La página muestra "No se pudieron cargar los datos"** | Revisa que exista `datos.json` y que la última publicación en *Actions* haya salido en verde. |
| **Si tu repositorio no se llama `Virgim17/radio-crepuscular`** | Abre `admin/config.yml` y `operador/config.yml` en VS Code y cambia la línea `repo:` por el nombre real (`usuario/nombre`). |

---

## 12. Cambios rápidos de diseño (opcional)

- **Colores de toda la página:** abre `css/estilos.css`; al inicio, en la sección `:root`, están los colores con nombre (`--brasa`, `--oro`, `--noche`…). Cambia solo el código que empieza con `#` y guarda.
- **Logo:** reemplaza `assets/imagenes/logo.png` por el nuevo con el mismo nombre (o súbelo desde el panel). El logo aparece grande en la portada, pequeño en la cabecera y en el reproductor. Como tu logo tiene fondo blanco, se muestra sobre una placa blanca redondeada; si un día tienes uno con fondo transparente, también se verá bien.

¡Listo! Tu radio ya tiene página, reproductor, panel de administración y panel para tu operador.
