'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  Award,
  Globe,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/StarRating';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useMovieContext } from '@/contexts/MovieContext';
import { getMovieDetails } from '@/lib/api';
import { MovieDetails } from '@/types/movie';

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { dispatch } = useMovieContext();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid movie ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const movieData = await getMovieDetails(params.id);
        setMovie(movieData);
        dispatch({ type: 'SET_SELECTED_MOVIE', payload: movieData });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
          Movie Not Found
        </h3>
        <p className="text-slate-500 dark:text-slate-500 mb-6">
          {error || 'The movie you are looking for could not be found.'}
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
      </motion.div>

      {/* Movie Header */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Poster */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="relative aspect-[2/3]">
              <Image
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
                alt={movie.Title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>
          </Card>
        </div>

        {/* Movie Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {movie.Title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{movie.Year}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{movie.Runtime}</span>
              </div>
              <Badge variant="secondary">{movie.Rated}</Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.Genre.split(', ').map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Rating</h3>
              <StarRating movieId={movie.imdbID} size="lg" />
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">IMDb:</span>
                  <span>{movie.imdbRating}/10</span>
                </div>
                {movie.Metascore !== 'N/A' && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Metascore:</span>
                    <span>{movie.Metascore}/100</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plot */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Plot</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {movie.Plot}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Additional Details */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Cast & Crew */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Cast & Crew</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Director:</span>
                <p className="text-slate-600 dark:text-slate-400">{movie.Director}</p>
              </div>
              
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Writer:</span>
                <p className="text-slate-600 dark:text-slate-400">{movie.Writer}</p>
              </div>
              
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Actors:</span>
                <p className="text-slate-600 dark:text-slate-400">{movie.Actors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Production</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Country:</span>
                <p className="text-slate-600 dark:text-slate-400">{movie.Country}</p>
              </div>
              
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Language:</span>
                <p className="text-slate-600 dark:text-slate-400">{movie.Language}</p>
              </div>
              
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Released:</span>
                <p className="text-slate-600 dark:text-slate-400">{movie.Released}</p>
              </div>
              
              {movie.BoxOffice !== 'N/A' && (
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Box Office:</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{movie.BoxOffice}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Awards */}
      {movie.Awards !== 'N/A' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center space-x-2 mb-3">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Awards & Recognition</span>
              </h3>
              <p className="text-slate-700 dark:text-slate-300">{movie.Awards}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}