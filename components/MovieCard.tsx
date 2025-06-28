'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calendar, Film } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/movies/${movie.imdbID}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="cursor-pointer"
      onClick={handleClick}
    >
      <Card className="group overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:border-red-500/50">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
            alt={movie.Title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-white text-xs font-medium">{movie.Type}</span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {movie.Title}
          </h3>
          
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-3 space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{movie.Year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Film className="h-4 w-4" />
              <span className="capitalize">{movie.Type}</span>
            </div>
          </div>
          
          <StarRating movieId={movie.imdbID} size="sm" />
        </CardContent>
      </Card>
    </motion.div>
  );
}