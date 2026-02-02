import { AnimeSearchResult, SeriesDetails, DownloadLink, AiringResponse } from '../types';

const BASE_URL = 'https://anime.apex-cloud.workers.dev';

export const searchAnime = async (query: string): Promise<AnimeSearchResult[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`${BASE_URL}/?method=search&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const json = await response.json();
    
    // Map the 'img' property from API to 'poster' property used in UI
    const mappedData = (json.data || []).map((item: any) => ({
      ...item,
      poster: item.img || item.poster // Ensure poster is populated
    }));

    return mappedData;
  } catch (error) {
    console.error("Failed to search anime:", error);
    return [];
  }
};

export const getSeriesDetails = async (session: string, page: number = 1): Promise<SeriesDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/?method=series&session=${session}&page=${page}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch series details:", error);
    return null;
  }
};

export const getEpisodeLinks = async (session: string, episodeId: string): Promise<DownloadLink[] | null> => {
  try {
    const response = await fetch(`${BASE_URL}/?method=episode&session=${session}&ep=${episodeId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch episode links:", error);
    return null;
  }
};

export const getAiringAnime = async (page: number = 1): Promise<AiringResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}/?method=airing&page=${page}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch airing anime:", error);
    try {
        const targetUrl = `https://animepahe.si/api?m=airing&page=${page}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const fallbackResponse = await fetch(proxyUrl);
        if (fallbackResponse.ok) {
            return await fallbackResponse.json();
        }
    } catch (fallbackError) {
        console.error("Fallback fetch failed:", fallbackError);
    }
    return null;
  }
};