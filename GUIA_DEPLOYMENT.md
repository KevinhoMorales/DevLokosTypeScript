# Guía de Deployment — DevLokos Hub Web

Instrucciones para desplegar el hub web DevLokos ([DevLokosTypeScript](https://github.com/KevinhoMorales/DevLokosTypeScript)) en producción.

**Última actualización:** Junio 2026

---

## Requisitos previos

- Repositorio en GitHub: `KevinhoMorales/DevLokosTypeScript`
- Proyecto Firebase `devlokos` configurado
- Dominio (ej. GoDaddy → `devlokos.com`)
- Credenciales listas (ver sección Variables de entorno)

---

## Variables de entorno

Configura estas variables en tu plataforma de deployment. Copia [`.env.example`](.env.example) como referencia.

### Firebase client (Analytics)

| Variable | Ejemplo | Obligatoria |
|----------|---------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` | Recomendada |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `devlokos.firebaseapp.com` | Opcional |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `devlokos` | Opcional |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `devlokos.firebasestorage.app` | Opcional |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `458512617441` | Opcional |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:458512617441:web:...` | Opcional |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-X7DLGDN6HV` | Opcional |

### Sitio

| Variable | Valor | Obligatoria |
|----------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://devlokos.com` | Recomendada |

### Firebase Admin (Firestore + Remote Config)

| Variable | Descripción | Obligatoria |
|----------|-------------|-------------|
| `FIREBASE_ADMIN_SDK_KEY` | JSON del service account (string) | Sí* |
| `FIREBASE_PROJECT_ID` | `devlokos` | Opcional |
| `FIREBASE_ENV` | `prod` o `dev` | Opcional (default: `prod`) |

\* Obligatoria para Academia, Eventos y Empresarial (datos Firestore).

**`FIREBASE_ENV`:** Define la ruta Firestore `{env}/{env}/courses` y `{env}/{env}/events`. Usa `prod` en producción para leer los mismos datos que la app móvil en release.

### YouTube

| Variable | Módulo | Obligatoria |
|----------|--------|-------------|
| `YOUTUBE_API_KEY` | Podcast, Tutoriales | Sí** |
| `YOUTUBE_PLAYLIST_ID` | Podcast | Recomendada |
| `YOUTUBE_CHANNEL_ID` | Tutoriales (chips) | Una de channel o tutorials playlist |
| `YOUTUBE_TUTORIALS_PLAYLIST_ID` | Tutoriales | Una de channel o tutorials playlist |

\** También puede venir de Remote Config (`youtube_api_key`).

### Web3Forms (formulario Empresarial)

| Variable | Uso | Obligatoria |
|----------|-----|-------------|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Envío desde navegador (recomendado) | Recomendada |
| `WEB3FORMS_ACCESS_KEY` | Envío desde servidor (alternativa) | Opcional |

### Remote Config (Firebase Console)

Parámetros alternativos a variables de entorno:

- `youtube_api_key`
- `youtube_playlist_id`
- `youtube_channel_id`
- `youtube_tutorials_playlist_id`
- `web_3_form`

---

## Assets estáticos requeridos

Antes del deploy, asegúrate de que existan en `public/`:

| Archivo | Uso |
|---------|-----|
| `logo.png` | Open Graph, Twitter Cards |
| `logo-transparent.png` | Logo en NavBar |
| `favicon.png` | Favicon del sitio |

Estos archivos pueden no estar en el repositorio. Agrégalos manualmente desde los assets de marca DevLokos antes de desplegar.

---

## Opción 1: Vercel (Recomendado)

Vercel es la plataforma oficial de Next.js con SSL automático.

### Paso 1: Preparar el repositorio

```bash
git clone https://github.com/KevinhoMorales/DevLokosTypeScript.git
cd DevLokosTypeScript
npm install
npm run build   # Verificar build local
```

### Paso 2: Importar en Vercel

1. Crea cuenta en [vercel.com](https://vercel.com) con GitHub
2. **Add New Project** → selecciona `DevLokosTypeScript`
3. Vercel detecta Next.js automáticamente
4. Agrega todas las variables de entorno (sección anterior)
5. **Deploy**

### Paso 3: Conectar dominio (GoDaddy)

1. Vercel → Settings → Domains → agrega `devlokos.com`
2. En GoDaddy DNS:

```
Tipo    Nombre    Valor                    TTL
A       @         76.76.21.21             3600
CNAME   www       cname.vercel-dns.com    3600
```

3. Espera propagación DNS (1–48 h, usualmente 1–2 h)
4. SSL se configura automáticamente

Verificar: [whatsmydns.net](https://www.whatsmydns.net)

---

## Opción 2: Netlify

Netlify soporta Next.js con el plugin oficial. **No uses `.next` como publish directory.**

### Configuración correcta

1. Conecta el repositorio en [netlify.com](https://netlify.com)
2. Netlify detecta Next.js y aplica el [Next.js Runtime](https://docs.netlify.com/frameworks/next-js/)
3. Build command: `npm run build` (automático)
4. **No configures** publish directory manualmente — el plugin lo gestiona
5. Agrega las variables de entorno
6. Deploy

### Dominio

1. Netlify → Domain management → agrega tu dominio
2. Configura DNS en GoDaddy según instrucciones de Netlify

---

## Opción 3: VPS (Avanzado)

### Requisitos

- VPS con Node.js 20+
- Nginx como reverse proxy
- PM2 para gestión de procesos

### Pasos

```bash
# Instalar Node.js y PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clonar y configurar
git clone https://github.com/KevinhoMorales/DevLokosTypeScript.git
cd DevLokosTypeScript
npm install
cp .env.example .env.local
# Editar .env.local

# Build y start
npm run build
pm2 start npm --name "devlokos" -- start
pm2 save
pm2 startup
```

### Nginx

```nginx
server {
    listen 80;
    server_name devlokos.com www.devlokos.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d devlokos.com -d www.devlokos.com
```

### DNS GoDaddy

```
Tipo    Nombre    Valor              TTL
A       @         [IP del VPS]      3600
A       www       [IP del VPS]      3600
```

---

## Verificación post-deployment

### Checklist general

- [ ] El sitio carga en `https://devlokos.com`
- [ ] SSL activo (candado verde)
- [ ] `www` redirige al dominio principal
- [ ] NavBar y Footer visibles en todas las rutas
- [ ] Assets (`logo.png`, favicon) cargan correctamente

### Checklist por módulo

- [ ] `/` o `/podcast` — episodios cargan desde `/api/episodes`
- [ ] `/tutoriales` — playlists y videos cargan
- [ ] `/academia` — cursos desde Firestore
- [ ] `/eventos` — eventos próximos/pasados
- [ ] `/empresarial` — servicios, portfolio y formulario de contacto
- [ ] Firebase Analytics registra page views

### Endpoints API a probar

```bash
curl https://devlokos.com/api/episodes
curl https://devlokos.com/api/courses
curl https://devlokos.com/api/events
curl https://devlokos.com/api/tutorials/playlists
curl https://devlokos.com/api/services
curl https://devlokos.com/api/portfolio
curl https://devlokos.com/api/contact/config
```

---

## Troubleshooting

### El dominio no carga

- Verifica registros DNS en GoDaddy
- Espera propagación DNS
- Confirma que el deployment está activo

### SSL no funciona

- En Vercel/Netlify, SSL es automático — espera unos minutos
- Verifica DNS con [sslshopper.com/ssl-checker](https://www.sslshopper.com/ssl-checker.html)

### Variables de entorno no funcionan

- Variables del cliente deben empezar con `NEXT_PUBLIC_`
- Reinicia/redeploy después de agregar variables
- Sin espacios extra en los valores
- `FIREBASE_ADMIN_SDK_KEY` debe ser JSON en una sola línea (escapar `\n` en private_key)

### Firebase / Firestore no responde

- Verifica `FIREBASE_ADMIN_SDK_KEY` y permisos del service account
- Confirma `FIREBASE_ENV=prod` si los datos están en `prod/prod/`
- Revisa reglas Firestore en Firebase Console

### YouTube API falla

- Verifica `YOUTUBE_API_KEY` o Remote Config `youtube_api_key`
- Confirma que YouTube Data API v3 está habilitada en Google Cloud
- Revisa cuotas de la API

### Formulario empresarial da error

- Usa `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` para envío desde cliente
- Si usas envío servidor (`WEB3FORMS_ACCESS_KEY`), requiere plan de pago + whitelist IP

### Imágenes / logo no aparecen

- Agrega `logo.png`, `logo-transparent.png`, `favicon.png` a `public/`
- Redeploy después de agregar assets

---

## Pendientes de SEO

- `public/robots.txt` referencia `https://devlokos.com/sitemap.xml`
- Implementar `src/app/sitemap.ts` o ajustar `robots.txt` (pendiente)

---

## Recomendaciones

1. **Usa Vercel** — optimizado para Next.js, deploy más simple
2. **No subas `.env.local`** a Git — usa variables en la plataforma
3. **Usa `FIREBASE_ENV=prod`** en producción para alinear con la app móvil
4. **Configura Remote Config** como fuente primaria de API keys
5. **Monitorea** con Vercel Analytics y Firebase Analytics

---

## Soporte

- [README.md](README.md) — Overview del proyecto
- [ESTRUCTURA_UI.md](ESTRUCTURA_UI.md) — Arquitectura UI
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/getting-started/deploying)
- [Netlify Next.js](https://docs.netlify.com/frameworks/next-js/)

**Repositorio:** [github.com/KevinhoMorales/DevLokosTypeScript](https://github.com/KevinhoMorales/DevLokosTypeScript)
