'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMovieContext } from '@/contexts/MovieContext';

interface StarRatingProps {
  movieId: string;
  initialRating?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ movieId, initialRating = 0, readonly = false, size = 'md' }: StarRatingProps) {
  const { state, dispatch } = useMovieContext();
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const currentRating = state.userRatings[movieId] || initialRating;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleRating = (rating: number) => {
    if (!readonly) {
      dispatch({
        type: 'SET_USER_RATING',
        payload: { movieId, rating }
      });
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredRating || currentRating);
        
        return (
          <motion.button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            whileHover={readonly ? {} : { scale: 1.1 }}
            whileTap={readonly ? {} : { scale: 0.95 }}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                isActive
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </motion.button>
        );
      })}
      
      {currentRating > 0 && (
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
          ({currentRating}/5)
        </span>
      )}
    </div>
  );
}