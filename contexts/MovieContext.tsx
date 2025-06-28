'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MovieState, MovieAction } from '@/types/movie';

const initialState: MovieState = {
  movies: [],
  searchQuery: '',
  loading: false,
  error: null,
  selectedMovie: null,
  userRatings: {},
};

function movieReducer(state: MovieState, action: MovieAction): MovieState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, error: null };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SELECTED_MOVIE':
      return { ...state, selectedMovie: action.payload };
    case 'SET_USER_RATING':
      const newRatings = {
        ...state.userRatings,
        [action.payload.movieId]: action.payload.rating,
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('movieRatings', JSON.stringify(newRatings));
      }
      return { ...state, userRatings: newRatings };
    case 'LOAD_USER_RATINGS':
      return { ...state, userRatings: action.payload };
    default:
      return state;
  }
}

const MovieContext = createContext<{
  state: MovieState;
  dispatch: React.Dispatch<MovieAction>;
} | null>(null);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  useEffect(() => {
    // Load user ratings from localStorage
    if (typeof window !== 'undefined') {
      const savedRatings = localStorage.getItem('movieRatings');
      if (savedRatings) {
        try {
          const ratings = JSON.parse(savedRatings);
          dispatch({ type: 'LOAD_USER_RATINGS', payload: ratings });
        } catch (error) {
          console.error('Error loading saved ratings:', error);
        }
      }
    }
  }, []);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}