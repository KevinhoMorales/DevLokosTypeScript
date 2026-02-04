# Conexión de Tutoriales en DevLokos

La sección **Tutoriales** no usa Firestore. Usa la **YouTube Data API v3** para mostrar vídeos organizados por playlists del canal de YouTube.

## Fuente de configuración

**Firebase Remote Config** (o variables de entorno para web):

| Parámetro | Descripción |
|-----------|-------------|
| `youtube_api_key` | API Key de Google Cloud (YouTube Data API v3) |
| `youtube_tutorials_playlist_id` | ID de la playlist de tutoriales |
| `youtube_playlist_id` | Playlist principal del podcast (para excluirla) |
| `youtube_channel_id` | (Opcional) ID del canal de YouTube |

- Si `youtube_tutorials_playlist_id` está vacío, se usa la playlist principal (`youtube_playlist_id`) como fallback.
- Si no hay playlist configurada, se muestra el empty state: **"Tutoriales próximamente"**.

## Flujo de datos

### 1. Carga de playlists (chips)

**Obtener el `channelId`:**
- Desde Remote Config / env (`youtube_channel_id`), o
- Del primer vídeo de la playlist de tutoriales (`snippet.channelId`).  
  Si no hay `channelId`, se cargan primero los vídeos de la playlist de tutoriales para extraerlo.

**Llamar a `playlists.list`:**
- **Endpoint:** `GET https://www.googleapis.com/youtube/v3/playlists`
- **Parámetros:** `part=snippet,contentDetails`, `channelId`, `maxResults=50`, `key=API_KEY`

**Filtrar playlists:**
- Excluir la playlist principal del podcast (`youtube_playlist_id`).
- Excluir playlists cuyo título contenga **"bloques podcast"** o **"devlokos podcast"** (case insensitive).
- El resultado se muestra como chips horizontales (una playlist por chip).

### 2. Carga de vídeos por playlist

Al elegir un chip se usa el `playlistId` de esa playlist.

**Llamar a `playlistItems.list`:**
- **Endpoint:** `GET https://www.googleapis.com/youtube/v3/playlistItems`
- **Parámetros:** `part=snippet`, `playlistId`, `maxResults=50` (paginado), `key=API_KEY`

**Modelo Tutorial (UI):**
- `id` = `videoId`
- `videoId`, `title`, `description`, `thumbnailUrl`, `publishedAt`, `duration` (opcional)

### 3. Búsqueda

- Se hace **en memoria** sobre los vídeos ya cargados.
- Filtro: `tutorial.title.toLowerCase().includes(query.toLowerCase())`.
- No se hacen llamadas adicionales a la API.

## Endpoints de YouTube

| Acción | Endpoint | Parámetros principales |
|--------|----------|------------------------|
| Listar playlists | `/playlists` | `channelId`, `part=snippet,contentDetails` |
| Listar vídeos de playlist | `/playlistItems` | `playlistId`, `part=snippet` |

**Base URL:** `https://www.googleapis.com/youtube/v3`

## Estados de UI

- **Sin playlist configurada:** "Tutoriales próximamente".
- **Cargando:** spinner.
- **Error:** mensaje genérico + botón "Reintentar".
- **Sin resultados (búsqueda):** "No se encontraron tutoriales".
- **Playlist vacía:** "Esta playlist no tiene videos".

## Reproducción

- Clic en un tutorial → modal o reproductor embebido de YouTube (web).
- Se puede pasar el título de la playlist para mostrarlo en el detalle.

## Requisitos

- API Key con **YouTube Data API v3** habilitada.
- Playlist de tutoriales configurada (o playlist principal como fallback).
- `channelId` para listar playlists: desde Remote Config o del primer vídeo de la playlist.
