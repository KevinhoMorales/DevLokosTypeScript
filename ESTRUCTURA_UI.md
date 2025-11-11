# 📐 Estructura UI del Proyecto DevLokos

## 🏗️ Arquitectura General

El proyecto está estructurado siguiendo el patrón de **Next.js App Router** con componentes modulares React. La estructura visual de la página sigue este orden jerárquico:

```
┌─────────────────────────────────────────┐
│           ROOT LAYOUT                    │
│    (layout.tsx - Configuración global)   │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         PAGE (page.tsx)                 │
│    Punto de entrada principal           │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  HEADER  │ │   BODY   │ │  FOOTER  │
│ (NavBar) │ │  (Main)  │ │ (Footer) │
└──────────┘ └──────────┘ └──────────┘
                    │
        ┌───────────┼───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐      ┌──────────────┐
│   HERO       │      │   PODCAST    │
│   SECTION    │      │   SECTION    │
└──────────────┘      └──────────────┘
```

---

## 📁 Estructura de Archivos

### 1. **Layout Principal** (`src/app/layout.tsx`)
**Propósito**: Configuración global de la aplicación

**Responsabilidades**:
- Define metadatos SEO (título, descripción, Open Graph, Twitter Cards)
- Configura fuentes globales (Eudoxus Sans)
- Establece el tema oscuro (`className="dark"`)
- Aplica estilos globales al `<body>`
- Incluye Material Symbols para iconos

**Código clave**:
```tsx
<html lang="es" className="dark">
  <body className="bg-background-dark text-white">
    {children}
  </body>
</html>
```

---

### 2. **Página Principal** (`src/app/page.tsx`)
**Propósito**: Orquesta todos los componentes de la UI

**Estructura**:
```tsx
<div> {/* Contenedor principal */}
  <NavBar />        {/* HEADER - Navegación fija */}
  <main>            {/* BODY - Contenido principal */}
    <HeroSection />     {/* Sección Hero */}
    <PodcastSection />  {/* Sección de Podcast */}
  </main>
  <Footer />        {/* FOOTER - Pie de página */}
</div>
```

**Características**:
- Contenedor con `min-h-screen` para altura mínima
- Centrado horizontal con `items-center`
- Incluye datos estructurados (JSON-LD) para SEO
- Sin `gap` entre secciones para control manual de espaciado

---

## 🎨 Componentes de UI

### 1. **HEADER - NavBar** (`src/components/NavBar.tsx`)

**Ubicación**: Fijo en la parte superior (`fixed top-0`)

**Características**:
- **Posición**: `fixed top-0 left-0 right-0 z-50`
- **Fondo**: Negro semitransparente con blur (`bg-black/80 backdrop-blur-sm`)
- **Contenido**:
  - Logo DevLokos (`logo-transparent.png`)
  - Botón "Suscribirse" (naranja, link a YouTube)
- **Responsive**: Menú hamburguesa en móvil

**Estructura**:
```
NavBar
├── Logo (izquierda)
└── Botón Suscribirse (derecha)
    └── Menú móvil (si está abierto)
```

**Padding**: `py-3` (reducido para ahorrar espacio vertical)

---

### 2. **BODY - Contenido Principal**

El body está dividido en dos secciones principales dentro de `<main>`:

#### 2.1 **Hero Section** (`src/components/HeroSection.tsx`)

**Propósito**: Primera impresión, presentación de la marca

**Características**:
- **Fondo**: Negro sólido (`bg-black`)
- **Contenido**:
  - Logo grande con padding superior (`pt-20`)
  - Título principal: "Bienvenido a DevLokos"
  - Dos párrafos descriptivos
- **Espaciado**: 
  - Padding vertical: `py-40 md:py-48 lg:py-56`
  - Margen superior: `mt-24` (para compensar NavBar fijo)
  - Margen inferior: `mb-20 md:mb-28 lg:mb-36`

**Estructura**:
```
HeroSection
├── Contenedor con fondo negro
│   ├── Logo (con pt-20)
│   └── Contenido
│       ├── H1: "Bienvenido a DevLokos"
│       └── H2: Descripción (2 párrafos)
```

---

#### 2.2 **Podcast Section** (`src/components/PodcastSection.tsx`)

**Propósito**: Mostrar los episodios del podcast con búsqueda y paginación

**Características**:
- **Fondo**: Negro sólido (`bg-black`)
- **Funcionalidades**:
  - Búsqueda por título o invitado (sin tildes)
  - Paginación (6 episodios por página)
  - Modal de YouTube al hacer clic
  - Skeleton loader mientras carga
- **Contenido**:
  - Título: "Conoce los últimos episodios"
  - Barra de búsqueda con efecto glow
  - Grid de episodios (responsive: 1/2/3 columnas)
  - Controles de paginación

**Espaciado**:
- Padding vertical: `py-40 md:py-48 lg:py-56`
- Margen entre título y búsqueda: `mb-14 md:mb-18`
- Margen entre búsqueda y grid: `mb-14 md:mb-18`
- Margen inferior del grid: `mb-24 md:mb-32 lg:mb-40`

**Estructura**:
```
PodcastSection
├── Header
│   ├── H1: "Conoce los últimos episodios"
│   └── Barra de búsqueda
├── Grid de Episodios (6 por página)
│   └── Card de Episodio
│       ├── Thumbnail (con play button overlay)
│       └── Contenido
│           ├── Nombre del invitado
│           ├── Título del episodio
│           └── Descripción
└── Paginación (si hay más de 6 episodios)
```

**Card de Episodio**:
- Padding interno: `p-12 md:p-16 lg:p-20`
- Márgenes entre elementos: `mb-6 md:mb-8` (título/invitado), `mb-10 md:mb-12` (descripción)

---

### 3. **FOOTER** (`src/components/Footer.tsx`)

**Propósito**: Información de contacto, redes sociales y legal

**Características**:
- **Fondo**: Negro con borde superior (`bg-black border-t border-gray-800`)
- **Layout**: Grid de 2 columnas en desktop (`md:grid-cols-2`)
- **Contenido**:
  - **Columna Izquierda (Brand)**:
    - Título "DevLokos"
    - Copyright "© 2025 DevLokos"
    - Links a Términos y Política de Privacidad (modales)
  - **Columna Derecha (Contacto)**:
    - Título "Contáctanos"
    - Descripción
    - Iconos de redes sociales (8 plataformas)
    - Email: info@devlokos.com

**Espaciado**:
- Margen superior: `mt-16 md:mt-24 lg:mt-32`
- Padding vertical: `py-40 md:py-48 lg:py-56`
- Gap entre columnas: `gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20`

**Modales**:
- `PrivacyPolicyModal`: Política de privacidad en español
- `TermsModal`: Términos y condiciones en español

**Estructura**:
```
Footer
├── Grid (2 columnas)
│   ├── Columna 1: Brand
│   │   ├── Título
│   │   ├── Copyright
│   │   └── Links legales
│   └── Columna 2: Contacto
│       ├── Título
│       ├── Descripción
│       ├── Redes sociales (8 iconos)
│       └── Email
└── Modales (PrivacyPolicyModal, TermsModal)
```

---

## 🎨 Sistema de Diseño

### Colores
- **Primario**: `#ff914d` (Naranja) - `bg-primary`, `text-primary`
- **Fondo**: `#000000` (Negro) - `bg-black`, `bg-background-dark`
- **Texto**: `#ffffff` (Blanco) - `text-white`
- **Grises**: Varios tonos para bordes y fondos secundarios

### Tipografía
- **Fuente Principal**: Eudoxus Sans (local, múltiples pesos)
- **Tamaños Responsivos**: 
  - Móvil: `text-4xl`, `text-base`
  - Desktop: `md:text-5xl`, `md:text-lg`

### Espaciado
- **Padding Horizontal**: `px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16`
- **Padding Vertical Secciones**: `py-40 md:py-48 lg:py-56`
- **Márgenes entre Secciones**: Variables según contexto

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 📱 Responsive Design

### Mobile First
- Grid de episodios: 1 columna en móvil
- NavBar: Menú hamburguesa en móvil
- Footer: Stack vertical en móvil, grid en desktop

### Centrado
- Todos los contenedores principales usan `max-w-7xl mx-auto`
- Contenido centrado con `flex justify-center items-center`
- Texto centrado con `text-center`

---

## 🔄 Flujo de Datos

### PodcastSection
1. **Carga inicial**: `useEffect` hace fetch a `/api/episodes`
2. **API Route**: `src/app/api/episodes/route.ts`
   - Obtiene API key de Firebase Remote Config
   - Consulta YouTube Data API
   - Retorna todos los episodios ordenados por fecha
3. **Filtrado**: Cliente filtra por búsqueda (título/invitado)
4. **Paginación**: Muestra 6 episodios por página
5. **Modal**: Al hacer clic, abre modal con iframe de YouTube

---

## 📦 Componentes Adicionales

### Modales
- **PrivacyPolicyModal**: Modal con scroll para política de privacidad
- **TermsModal**: Modal con scroll para términos y condiciones

**Características comunes**:
- Fondo oscuro con blur (`bg-black/90 backdrop-blur-sm`)
- Botón de cerrar (X) en esquina superior derecha
- Cierre con ESC o click fuera del modal
- Bloquea scroll del body cuando está abierto

---

## 🎯 Puntos Clave de la Estructura

1. **Modularidad**: Cada sección es un componente independiente
2. **Reutilización**: Componentes pueden usarse en otras páginas
3. **Mantenibilidad**: Fácil de modificar secciones individuales
4. **Performance**: Componentes client-side solo donde es necesario (`'use client'`)
5. **SEO**: Datos estructurados y metadatos en layout
6. **Accesibilidad**: Labels ARIA, navegación por teclado, contraste adecuado

---

## 🔍 Archivos Clave por Sección

```
src/
├── app/
│   ├── layout.tsx          # Configuración global
│   ├── page.tsx            # Orquestación de componentes
│   ├── globals.css         # Estilos globales
│   └── api/
│       └── episodes/
│           └── route.ts    # API para obtener episodios
└── components/
    ├── NavBar.tsx          # HEADER
    ├── HeroSection.tsx     # HERO
    ├── PodcastSection.tsx  # BODY (principal)
    ├── Footer.tsx          # FOOTER
    ├── PrivacyPolicyModal.tsx
    └── TermsModal.tsx
```

---

## 💡 Mejores Prácticas Implementadas

1. ✅ Separación de responsabilidades
2. ✅ Componentes reutilizables
3. ✅ Responsive design mobile-first
4. ✅ Accesibilidad básica
5. ✅ SEO optimizado
6. ✅ Performance (lazy loading, optimización de imágenes)
7. ✅ TypeScript para type safety
8. ✅ Código limpio y mantenible

---

## 🚀 Cómo Agregar una Nueva Sección

1. Crear componente en `src/components/NuevaSeccion.tsx`
2. Importar en `src/app/page.tsx`
3. Agregar dentro de `<main>` después de `<PodcastSection />`
4. Aplicar padding vertical consistente: `py-40 md:py-48 lg:py-56`
5. Usar contenedor con `max-w-7xl mx-auto` para centrado

Ejemplo:
```tsx
// En page.tsx
<main>
  <HeroSection />
  <PodcastSection />
  <NuevaSeccion />  {/* Nueva sección */}
  <Footer />
</main>
```

---

**Última actualización**: Enero 2025
**Versión del proyecto**: DevLokos Landing Page v1.0

