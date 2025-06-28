'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMovieContext } from '@/contexts/MovieContext';
import { searchMovies } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar() {
  const { state, dispatch } = useMovieContext();
  const [inputValue, setInputValue] = useState(state.searchQuery);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        dispatch({ type: 'SET_MOVIES', payload: [] });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const data = await searchMovies(query);
        if (data.Response === 'True') {
          dispatch({ type: 'SET_MOVIES', payload: data.Search });
        } else {
          dispatch({ type: 'SET_ERROR', payload: data.Error || 'No movies found' });
          dispatch({ type: 'SET_MOVIES', payload: [] });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Search failed' });
        dispatch({ type: 'SET_MOVIES', payload: [] });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: inputValue });
    debouncedSearch(inputValue);
  }, [inputValue, dispatch, debouncedSearch]);

  const clearSearch = () => {
    setInputValue('');
    dispatch({ type: 'SET_MOVIES', payload: [] });
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <motion.div 
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for movies..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 pr-10 h-12 text-base bg-white/10 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-red-500 focus:ring-red-500 dark:bg-slate-800/50"
        />
        <AnimatePresence>
          {inputValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {state.loading && (
        <motion.div 
          className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Searching...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}