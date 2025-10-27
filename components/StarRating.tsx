import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  rating: number | null;
  onRate: (rating: number | null) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(rating === star ? null : star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(null)}
          className="p-0.5"
        >
          <StarIcon
            className={`w-5 h-5 transition-colors ${
              (hoverRating || rating || 0) >= star ? 'text-fuchsia-400' : 'text-gray-500'
            }`}
          />
        </button>
      ))}
    </div>
  );
};
