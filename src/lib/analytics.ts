/**
 * Analítica DevLokos Web - alineada con la app móvil.
 * Eventos en snake_case, parámetros truncados ~100 chars, sin datos sensibles.
 */

import { getAnalytics, logEvent as firebaseLogEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

const MAX_STRING_LENGTH = 100;

export function truncate(str: string | undefined, max = MAX_STRING_LENGTH): string {
  if (str == null || typeof str !== 'string') return '';
  const s = str.trim();
  return s.length <= max ? s : s.slice(0, max);
}

function getAnalyticsInstance() {
  if (typeof window === 'undefined') return null;
  return analytics ?? null;
}

export function logEvent(name: string, params?: Record<string, string | number | boolean>) {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  const safeParams = params
    ? Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, typeof v === 'string' ? truncate(v) : v])
      )
    : undefined;
  try {
    firebaseLogEvent(instance, name, safeParams);
  } catch {
    // ignore
  }
}

export function setUserProperty(name: string, value: string) {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  try {
    setUserProperties(instance, { [name]: truncate(value, 100) });
  } catch {
    // ignore
  }
}

// --- Ruta → módulo (para screen_view) ---
const ROUTE_TO_MODULE: Record<string, string> = {
  '/': 'home',
  '/podcast': 'podcast',
  '/tutoriales': 'tutorials',
  '/academia': 'academy',
  '/empresarial': 'enterprise',
  '/eventos': 'events',
};

export function getModuleForPath(pathname: string): string {
  return ROUTE_TO_MODULE[pathname] ?? 'home';
}

// --- App & navegación ---
export const analyticsEvents = {
  app_first_open() {
    logEvent('app_first_open');
  },
  app_open() {
    logEvent('app_open');
  },
  screen_view(screen_name: string, module: string) {
    logEvent('screen_view', { screen_name: truncate(screen_name), module });
  },

  // --- Podcast ---
  podcast_home_viewed() {
    logEvent('podcast_home_viewed');
  },
  podcast_discover_impression(episode_id: string, episode_title: string, season?: string) {
    logEvent('podcast_discover_impression', {
      episode_id: truncate(episode_id),
      episode_title: truncate(episode_title),
      ...(season ? { season: truncate(season) } : {}),
    });
  },
  podcast_episode_viewed(params: {
    episode_id: string;
    episode_title: string;
    season?: string;
    playlist_id?: string;
    source?: string;
  }) {
    logEvent('podcast_episode_viewed', {
      episode_id: truncate(params.episode_id),
      episode_title: truncate(params.episode_title),
      ...(params.season ? { season: truncate(params.season) } : {}),
      ...(params.playlist_id ? { playlist_id: truncate(params.playlist_id) } : {}),
      ...(params.source ? { source: truncate(params.source) } : {}),
    });
  },
  podcast_episode_played(episode_id: string, episode_title: string) {
    logEvent('podcast_episode_played', {
      episode_id: truncate(episode_id),
      episode_title: truncate(episode_title),
    });
  },
  podcast_episode_paused(episode_id: string) {
    logEvent('podcast_episode_paused', { episode_id: truncate(episode_id) });
  },
  podcast_episode_completed(episode_id: string) {
    logEvent('podcast_episode_completed', { episode_id: truncate(episode_id) });
  },
  podcast_episode_shared(episode_id: string, episode_title: string) {
    logEvent('podcast_episode_shared', {
      episode_id: truncate(episode_id),
      episode_title: truncate(episode_title),
    });
  },

  // --- Tutoriales ---
  tutorials_home_viewed() {
    logEvent('tutorials_home_viewed');
  },
  tutorial_playlist_selected(playlist_id: string, playlist_title: string) {
    logEvent('tutorial_playlist_selected', {
      playlist_id: truncate(playlist_id),
      playlist_title: truncate(playlist_title),
    });
  },
  tutorial_video_viewed(params: {
    video_id: string;
    video_title: string;
    playlist_id?: string;
    playlist_title?: string;
  }) {
    logEvent('tutorial_video_viewed', {
      video_id: truncate(params.video_id),
      video_title: truncate(params.video_title),
      ...(params.playlist_id ? { playlist_id: truncate(params.playlist_id) } : {}),
      ...(params.playlist_title ? { playlist_title: truncate(params.playlist_title) } : {}),
    });
  },
  tutorial_video_played(video_id: string, video_title: string) {
    logEvent('tutorial_video_played', {
      video_id: truncate(video_id),
      video_title: truncate(video_title),
    });
  },
  tutorial_video_completed(video_id: string) {
    logEvent('tutorial_video_completed', { video_id: truncate(video_id) });
  },
  tutorial_video_shared(video_id: string, video_title: string) {
    logEvent('tutorial_video_shared', {
      video_id: truncate(video_id),
      video_title: truncate(video_title),
    });
  },
  tutorial_searched(search_query: string, results_count: number) {
    logEvent('tutorial_searched', {
      search_query: truncate(search_query),
      results_count,
    });
  },

  // --- Academia ---
  academy_home_viewed() {
    logEvent('academy_home_viewed');
  },
  course_viewed(params: {
    course_id: string;
    course_title: string;
    level?: string;
    learning_paths?: string;
  }) {
    logEvent('course_viewed', {
      course_id: truncate(params.course_id),
      course_title: truncate(params.course_title),
      ...(params.level ? { level: truncate(params.level) } : {}),
      ...(params.learning_paths ? { learning_paths: truncate(params.learning_paths) } : {}),
    });
  },
  course_started(course_id: string, course_title: string) {
    logEvent('course_started', {
      course_id: truncate(course_id),
      course_title: truncate(course_title),
    });
  },
  course_completed(course_id: string, course_title: string) {
    logEvent('course_completed', {
      course_id: truncate(course_id),
      course_title: truncate(course_title),
    });
  },
  academy_whatsapp_clicked(course_title: string) {
    logEvent('academy_whatsapp_clicked', { course_title: truncate(course_title) });
  },

  // --- Empresarial ---
  enterprise_viewed() {
    logEvent('enterprise_viewed');
  },
  enterprise_process_interaction(service_type: string) {
    logEvent('enterprise_process_interaction', { service_type: truncate(service_type) });
  },
  enterprise_contact_started() {
    logEvent('enterprise_contact_started');
  },
  enterprise_contact_submitted(has_company: boolean) {
    logEvent('enterprise_contact_submitted', { has_company: has_company ? 'true' : 'false' });
  },

  // --- Eventos (presenciales) ---
  events_list_viewed() {
    logEvent('events_list_viewed');
  },
  event_viewed(params: {
    event_id: string;
    event_title: string;
    city?: string;
    has_registration_link: boolean;
  }) {
    logEvent('event_viewed', {
      event_id: truncate(params.event_id),
      event_title: truncate(params.event_title),
      ...(params.city ? { city: truncate(params.city) } : {}),
      has_registration_link: params.has_registration_link ? 'true' : 'false',
    });
  },
  event_register_clicked(event_id: string, event_title: string) {
    logEvent('event_register_clicked', {
      event_id: truncate(event_id),
      event_title: truncate(event_title),
    });
  },
  event_shared(event_id: string, event_title: string) {
    logEvent('event_shared', {
      event_id: truncate(event_id),
      event_title: truncate(event_title),
    });
  },

  // --- Búsqueda & UX ---
  search_performed(query: string, module: string, results_count: number) {
    logEvent('search_performed', {
      query: truncate(query),
      module,
      results_count,
    });
  },
  filter_applied(filter_type: string, filter_value: string, module: string) {
    logEvent('filter_applied', {
      filter_type: truncate(filter_type),
      filter_value: truncate(filter_value),
      module,
    });
  },
  learning_path_selected(learning_path: string, module: string) {
    logEvent('learning_path_selected', {
      learning_path: truncate(learning_path),
      module,
    });
  },
  playlist_chip_selected(playlist_id: string, playlist_title: string) {
    logEvent('playlist_chip_selected', {
      playlist_id: truncate(playlist_id),
      playlist_title: truncate(playlist_title),
    });
  },
  tab_selected(tab_name: string, tab_index: number) {
    logEvent('tab_selected', { tab_name: truncate(tab_name), tab_index });
  },
};
