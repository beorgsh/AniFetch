export interface AnimeSearchResult {
  id: number;
  title: string;
  poster: string;
  session: string;
  type?: string;
  episodes?: number;
  status?: string;
  season?: string;
  year?: number;
  score?: number;
  [key: string]: any;
}

export interface Episode {
  episode: string;
  session: string;
  snapshot: string;
  [key: string]: any;
}

export interface SeriesDetails {
  title: string;
  total: number;
  page: number;
  total_pages: number;
  next: boolean;
  episodes: Episode[];
  synopsis?: string;
  img?: string;
}

export interface DownloadLink {
  link: string;
  name: string; // The label provided by API (e.g., "SubsPlease 360p")
  [key: string]: any;
}

export type EpisodeLinksResponse = DownloadLink[];

export interface AiringAnime {
  id: number;
  anime_id: number;
  anime_title: string;
  anime_session: string;
  episode: number;
  snapshot: string;
  created_at: string;
  fansub?: string;
}

export interface AiringResponse {
  current_page: number;
  last_page: number;
  data: AiringAnime[];
  total: number;
  from: number;
  to: number;
}