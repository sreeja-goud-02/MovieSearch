'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Film } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useMovieContext } from '@/contexts/MovieContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MoviesPage() {
  const { state } = useMovieContext();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Film className="h-16 w-16 text-red-600 mx-auto mb-4" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-red-600 to-slate-900 dark:from-slate-100 dark:via-red-400 dark:to-slate-100 bg-clip-text text-transparent mb-4">
          Discover Amazing Movies
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Search through thousands of movies and discover your next favorite film
        </p>
        
        <SearchBar />
      </motion.section>

      {/* Content Section */}
      <section>
        <AnimatePresence mode="wait">
          {state.loading && <LoadingSpinner />}
          
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {!state.loading && !state.error && state.movies.length === 0 && state.searchQuery.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="text-slate-400 dark:text-slate-600 mb-4">
                <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No movies found
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Try searching for a different movie title
              </p>
            </motion.div>
          )}
          
          {!state.loading && state.movies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Search Results ({state.movies.length} movies)
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Found movies for "{state.searchQuery}"
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {state.movies.map((movie, index) => (
                  <MovieCard key={movie.imdbID} movie={movie} index={index} />
                ))}
              </div>
            </motion.div>
          )}
          
          {!state.loading && state.movies.length === 0 && state.searchQuery.length < 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="text-slate-400 dark:text-slate-600 mb-4">
                <Film className="h-20 w-20 mx-auto mb-6 opacity-30" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Start Your Movie Journey
              </h3>
              <p className="text-slate-500 dark:text-slate-500 text-lg">
                Search for any movie to get started
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}