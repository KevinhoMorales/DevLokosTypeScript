# DevLokos Landing Page

A modern, responsive landing page for DevLokos - a community for developers and tech creators in Latin America. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🚀 About the Project

DevLokos is a community platform that promotes learning, connection, and building in technology from Latin America. This landing page showcases the podcast episodes, community resources, and provides information about the DevLokos ecosystem.

## 🛠️ Technical Stack

### Core Technologies
- **Next.js 16.0.0** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

### Key Dependencies
- **Firebase Admin SDK 13.6.0** - Server-side Firebase integration
- **Firebase 12.5.0** - Client-side Firebase integration
- **ESLint 9** - Code linting and quality

### Development Tools
- **@types/node, @types/react, @types/react-dom** - TypeScript type definitions
- **eslint-config-next** - Next.js ESLint configuration

## 📁 Project Structure

```
DevLokosTypeScript/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── episodes/
│   │   │       └── route.ts          # API endpoint for fetching podcast episodes
│   │   ├── layout.tsx                 # Root layout with global configuration
│   │   ├── page.tsx                  # Main page component
│   │   ├── globals.css               # Global styles
│   │   └── font/                     # Custom Eudoxus Sans font files
│   ├── components/
│   │   ├── NavBar.tsx                # Navigation header component
│   │   ├── HeroSection.tsx           # Hero section with main CTA
│   │   ├── PodcastSection.tsx        # Podcast episodes listing
│   │   ├── Footer.tsx                # Footer with links and social media
│   │   ├── AcademySection.tsx        # Academy section component
│   │   ├── CommunitySection.tsx      # Community section component
│   │   ├── ContentSection.tsx        # Content section component
│   │   ├── EnterpriseSection.tsx     # Enterprise services section
│   │   ├── PrivacyPolicyModal.tsx    # Privacy policy modal
│   │   └── TermsModal.tsx            # Terms of service modal
│   ├── lib/
│   │   ├── firebase-admin.ts         # Firebase Admin SDK configuration
│   │   ├── firebase.ts               # Firebase client configuration
│   │   └── youtube.ts                # YouTube API integration utilities
│   └── hooks/
│       └── useScrollAnimation.ts     # Custom hook for scroll animations
├── public/                            # Static assets
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
└── package.json                       # Dependencies and scripts
```

## 🏗️ Architecture

### Frontend Architecture

The application follows the **Next.js App Router** pattern with a component-based architecture:

1. **Layout Layer** (`src/app/layout.tsx`)
   - Global configuration
   - SEO metadata (Open Graph, Twitter Cards)
   - Custom fonts (Eudoxus Sans)
   - Dark theme configuration
   - Structured data (JSON-LD) for SEO

2. **Page Layer** (`src/app/page.tsx`)
   - Main page orchestration
   - Component composition
   - Structured data injection

3. **Component Layer** (`src/components/`)
   - Reusable UI components
   - Client-side interactivity where needed
   - Responsive design with Tailwind CSS

### Backend Architecture

1. **API Routes** (`src/app/api/episodes/route.ts`)
   - RESTful API endpoint
   - Fetches podcast episodes from YouTube
   - Integrates with Firebase Remote Config for API keys
   - Error handling and fallback mechanisms

2. **Library Layer** (`src/lib/`)
   - **firebase-admin.ts**: Server-side Firebase Admin SDK initialization
     - Singleton pattern for app initialization
     - Remote Config integration for secure API key management
     - Environment variable fallbacks
   - **youtube.ts**: YouTube Data API v3 integration
     - Playlist video fetching with pagination
     - Video metadata extraction
     - Duration formatting (ISO 8601 to human-readable)
     - Automatic sorting by publication date

## 🔌 External Services Integration

### YouTube Data API v3
- **Purpose**: Fetch podcast episodes from YouTube playlist
- **Playlist ID**: `PLPXi7Vgl6Ak-Bm8Y2Xxhp1dwrzWT3AbjZ`
- **Features**:
  - Paginated requests (50 videos per page)
  - Video metadata extraction (title, description, thumbnail, duration)
  - Automatic sorting by publication date (newest first)

### Firebase
- **Firebase Admin SDK**: Server-side operations
  - Remote Config for API key management
  - Secure credential handling
- **Firebase Client SDK**: Client-side operations (if needed)

### API Key Management
The application uses a multi-tier fallback strategy for API keys:
1. **Primary**: Firebase Remote Config (`youtube_api_key` parameter)
2. **Fallback**: Environment variable (`YOUTUBE_API_KEY`)
3. **Error handling**: Descriptive error messages if both fail

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

Copia `.env.example` a `.env.local` y rellena los valores. Para la sección **Tutoriales** necesitas al menos:

- `YOUTUBE_API_KEY` – API Key de Google Cloud (YouTube Data API v3 habilitada).
- Uno de: `YOUTUBE_CHANNEL_ID`, `YOUTUBE_TUTORIALS_PLAYLIST_ID` o `YOUTUBE_PLAYLIST_ID` (playlist principal; si no hay playlist de tutoriales se usa esta y se muestran sus vídeos como chips).

Reinicia el servidor de desarrollo (`npm run dev`) después de cambiar variables de entorno.

```env
# Firebase Admin SDK (optional - for Remote Config)
FIREBASE_ADMIN_SDK_KEY='{"type":"service_account",...}'
FIREBASE_PROJECT_ID=devlokos

# YouTube (obligatorio para Podcast y Tutoriales)
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_PLAYLIST_ID=PLPXi7Vgl6Ak-Bm8Y2Xxhp1dwrzWT3AbjZ
# Opcional: canal o playlist de tutoriales
# YOUTUBE_CHANNEL_ID=UCxxxx
# YOUTUBE_TUTORIALS_PLAYLIST_ID=PLxxxx
```

### TypeScript Configuration
- **Path aliases**: `@/*` maps to `./src/*`
- **Strict mode**: Enabled for type safety
- **Module resolution**: Bundler (Next.js optimized)

### Tailwind CSS Configuration
- **Version**: 4.x
- **Custom fonts**: Eudoxus Sans (ExtraLight, Light, Regular, Medium, Bold, ExtraBold)
- **Dark mode**: Enabled by default
- **Responsive breakpoints**: Mobile-first approach

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build the application for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint to check code quality
```

## 🎨 Features

### UI Components
- **Responsive Navigation Bar**: Fixed header with logo and subscription button
- **Hero Section**: Welcome message and main call-to-action
- **Podcast Section**: 
  - Dynamic episode listing from YouTube
  - Search functionality
  - Episode cards with thumbnails, titles, descriptions, and metadata
  - Links to YouTube and Spotify
- **Footer**: Social media links, contact information, legal links

### Performance Optimizations
- **Image Optimization**: Next.js automatic image optimization
- **Font Optimization**: Custom font loading with `next/font/local`
- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Components loaded on demand

### SEO Features
- **Structured Data**: JSON-LD schema for Organization
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Semantic HTML**: Proper HTML5 semantic elements
- **Accessibility**: ARIA labels, keyboard navigation support

## 🔄 Data Flow

1. **Page Load**:
   - Client requests `/api/episodes`
   - API route fetches YouTube API key from Firebase Remote Config
   - YouTube API is called to fetch playlist videos
   - Episodes are formatted and returned as JSON
   - Frontend displays episodes in cards

2. **Search Functionality**:
   - Client-side filtering of episodes
   - Real-time search by title or guest name

## 🚀 Deployment

### Recommended Platforms
- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Alternative with good Next.js support
- **Self-hosted**: Node.js server with `npm run build && npm start`

### Environment Setup
Ensure all environment variables are configured in your deployment platform:
- Firebase Admin SDK credentials
- YouTube API Key (if not using Remote Config)

## 📝 Development Guidelines

### Adding New Components
1. Create component in `src/components/`
2. Use TypeScript interfaces for props
3. Add responsive Tailwind classes
4. Import and use in `src/app/page.tsx`

### API Modifications
- API routes are in `src/app/api/`
- Use TypeScript for type safety
- Implement proper error handling
- Add fallback mechanisms for external services

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use dark theme colors from `globals.css`

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For questions or suggestions, contact the DevLokos team.

---

**Last Updated**: January 2025  
**Version**: 0.1.0  
**Maintained by**: DevLokos Team
