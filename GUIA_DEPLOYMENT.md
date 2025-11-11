# 🚀 Guía: Conectar DevLokos a tu Dominio en GoDaddy

## Opción 1: Vercel (Recomendado - Más Fácil)

Vercel es la plataforma oficial de Next.js y ofrece deployment gratuito con SSL automático.

### Paso 1: Preparar el Proyecto

1. **Asegúrate de tener un repositorio Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Sube tu código a GitHub:**
   - Crea un repositorio en GitHub
   - Conecta tu repositorio local:
   ```bash
   git remote add origin https://github.com/tu-usuario/devlokos-landing.git
   git push -u origin main
   ```

### Paso 2: Desplegar en Vercel

1. **Crea una cuenta en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con tu cuenta de GitHub

2. **Importa tu proyecto:**
   - Click en "Add New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js

3. **Configura las Variables de Entorno:**
   En la configuración del proyecto, agrega estas variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=devlokos.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=devlokos
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=devlokos.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=458512617441
   NEXT_PUBLIC_FIREBASE_APP_ID=1:458512617441:web:9423dc5de210ad4f9c8ca0
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-X7DLGDN6HV
   FIREBASE_ADMIN_SDK_KEY=tu_json_string_del_admin_sdk
   YOUTUBE_API_KEY=tu_youtube_api_key (opcional, fallback)
   ```

4. **Deploy:**
   - Click en "Deploy"
   - Espera a que termine el deployment
   - Obtendrás una URL temporal: `tu-proyecto.vercel.app`

### Paso 3: Conectar tu Dominio de GoDaddy

1. **En Vercel:**
   - Ve a tu proyecto → Settings → Domains
   - Agrega tu dominio: `devlokos.com` (o el que tengas)
   - Vercel te dará instrucciones de DNS

2. **En GoDaddy (Panel de DNS):**
   - Ve a tu cuenta de GoDaddy
   - Selecciona tu dominio
   - Ve a "DNS" o "Zona DNS"
   - Agrega/modifica estos registros:

   **Para dominio principal (devlokos.com):**
   ```
   Tipo: A
   Nombre: @
   Valor: 76.76.21.21
   TTL: 3600
   ```

   **Para www (www.devlokos.com):**
   ```
   Tipo: CNAME
   Nombre: www
   Valor: cname.vercel-dns.com
   TTL: 3600
   ```

   **O si Vercel te da valores específicos, usa esos.**

3. **Espera la propagación DNS:**
   - Puede tardar de 5 minutos a 48 horas
   - Usualmente toma 1-2 horas
   - Puedes verificar con: [whatsmydns.net](https://www.whatsmydns.net)

4. **SSL Automático:**
   - Vercel configura SSL automáticamente
   - Tu sitio estará disponible en `https://devlokos.com`

---

## Opción 2: Netlify (Alternativa)

### Paso 1: Desplegar en Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Configura el build:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Agrega las variables de entorno
5. Deploy

### Paso 2: Conectar Dominio

1. En Netlify: Site settings → Domain management
2. Agrega tu dominio
3. Configura DNS en GoDaddy según las instrucciones de Netlify

---

## Opción 3: VPS/Server Propio (Avanzado)

Si prefieres tener control total, puedes usar un VPS:

### Requisitos:
- VPS con Node.js instalado
- Nginx como reverse proxy
- PM2 para gestionar procesos

### Pasos:

1. **Instala Node.js y PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clona tu repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/devlokos-landing.git
   cd devlokos-landing
   npm install
   ```

3. **Configura variables de entorno:**
   ```bash
   nano .env.local
   # Agrega tus variables aquí
   ```

4. **Build y start:**
   ```bash
   npm run build
   pm2 start npm --name "devlokos" -- start
   pm2 save
   pm2 startup
   ```

5. **Configura Nginx:**
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

6. **Configura SSL con Let's Encrypt:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d devlokos.com -d www.devlokos.com
   ```

7. **Configura DNS en GoDaddy:**
   ```
   Tipo: A
   Nombre: @
   Valor: [IP de tu VPS]
   TTL: 3600
   ```

---

## Configuración de DNS en GoDaddy (Detallado)

### Acceso al Panel DNS:

1. Inicia sesión en [GoDaddy.com](https://godaddy.com)
2. Ve a "Mis Productos"
3. Encuentra tu dominio y click en "DNS" o "Administrar DNS"

### Registros DNS Necesarios:

#### Para Vercel:
```
Tipo    Nombre    Valor                    TTL
A       @         76.76.21.21             3600
CNAME   www       cname.vercel-dns.com    3600
```

#### Para Netlify:
```
Tipo    Nombre    Valor                    TTL
A       @         [IP que te da Netlify]   3600
CNAME   www       [tu-sitio].netlify.app   3600
```

#### Para VPS:
```
Tipo    Nombre    Valor              TTL
A       @         [IP de tu VPS]    3600
A       www       [IP de tu VPS]    3600
```

---

## Verificación Post-Deployment

### Checklist:

- [ ] El sitio carga correctamente en `https://devlokos.com`
- [ ] SSL está activo (candado verde)
- [ ] `www.devlokos.com` redirige a `devlokos.com`
- [ ] Las variables de entorno están configuradas
- [ ] Firebase funciona correctamente
- [ ] Los episodios se cargan desde YouTube API
- [ ] Las imágenes se cargan correctamente

### Herramientas de Verificación:

- **DNS Propagation:** [whatsmydns.net](https://www.whatsmydns.net)
- **SSL Checker:** [sslshopper.com/ssl-checker](https://www.sslshopper.com/ssl-checker.html)
- **Page Speed:** [pagespeed.web.dev](https://pagespeed.web.dev)

---

## Troubleshooting

### Problema: El dominio no carga
- Verifica que los registros DNS estén correctos
- Espera más tiempo para la propagación DNS
- Verifica que el deployment en Vercel/Netlify esté activo

### Problema: SSL no funciona
- En Vercel/Netlify, SSL se configura automáticamente
- Espera unos minutos después de conectar el dominio
- Verifica que los registros DNS estén correctos

### Problema: Variables de entorno no funcionan
- Asegúrate de que las variables empiecen con `NEXT_PUBLIC_` para variables del cliente
- Reinicia el deployment después de agregar variables
- Verifica que no haya espacios extra en los valores

### Problema: Firebase no funciona
- Verifica que las credenciales estén correctas
- Asegúrate de que Firebase Admin SDK Key esté como JSON string
- Verifica que Remote Config tenga el `youtube_api_key` configurado

---

## Recomendaciones Finales

1. **Usa Vercel** - Es la opción más fácil y está optimizada para Next.js
2. **Habilita Analytics** - Vercel Analytics es gratuito y útil
3. **Configura Backups** - Asegúrate de tener tu código en GitHub
4. **Monitorea Performance** - Usa las herramientas de Vercel para optimizar
5. **Configura Redirects** - Asegúrate de que `www` redirija a dominio principal

---

## Archivos Necesarios para Deployment

Asegúrate de tener estos archivos en tu repositorio:

- ✅ `package.json` - Dependencias
- ✅ `next.config.ts` - Configuración de Next.js
- ✅ `.env.local` - NO subir a Git (usar variables de entorno en Vercel)
- ✅ `public/` - Assets estáticos
- ✅ `src/` - Código fuente

**IMPORTANTE:** NO subas `.env.local` a GitHub. Usa variables de entorno en la plataforma de deployment.

---

## Soporte Adicional

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **GoDaddy DNS Help:** [godaddy.com/help](https://www.godaddy.com/help)

---

**Última actualización:** Enero 2025

