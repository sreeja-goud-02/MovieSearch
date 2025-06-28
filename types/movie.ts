export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieState {
  movies: Movie[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  selectedMovie: MovieDetails | null;
  userRatings: Record<string, number>;
}

export type MovieAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED_MOVIE'; payload: MovieDetails | null }
  | { type: 'SET_USER_RATING'; payload: { movieId: string; rating: number } }
  | { type: 'LOAD_USER_RATINGS'; payload: Record<string, number> };