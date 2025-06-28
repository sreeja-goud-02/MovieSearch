import { SearchResponse, MovieDetails } from '@/types/movie';

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || 'b9bd48a6';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

export async function searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    const data: SearchResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search movies');
  }
}

export async function getMovieDetails(imdbID: string): Promise<MovieDetails> {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    const data: MovieDetails = await response.json();
    
    if (data.Response === 'False') {
      throw new Error('Movie not found');
    }
    
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get movie details');
  }
}