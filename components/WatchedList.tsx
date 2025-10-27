import React, { useState } from 'react';
import { WatchedMovie } from '../types';
import { findMovieInfo } from '../services/geminiService';
import { StarRating } from './StarRating';
import { AddIcon } from './icons/AddIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface WatchedListProps {
  watchedMovies: WatchedMovie[];
  onAddMovie: (movie: WatchedMovie) => void;
  onRemoveMovie: (id: string) => void;
  onUpdateRating: (id: string, rating: number | null) => void;
}

export const WatchedList: React.FC<WatchedListProps> = ({ watchedMovies, onAddMovie, onRemoveMovie, onUpdateRating }) => {
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieTitle.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const movieInfo = await findMovieInfo(newMovieTitle);
      if (movieInfo) {
        onAddMovie({
          id: `${movieInfo.title}-${movieInfo.year}`,
          title: movieInfo.title,
          year: movieInfo.year,
          rating: null,
        });
        setNewMovieTitle('');
      } else {
        setError(`Could not find a movie titled "${newMovieTitle}". Please check the spelling.`);
      }
    } catch (err) {
      setError("An error occurred while searching for the movie.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Watched Movies</h2>
      <form onSubmit={handleAddMovie} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newMovieTitle}
          onChange={(e) => setNewMovieTitle(e.target.value)}
          placeholder="Add a movie you've watched..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isLoading}
        />
        <button type="submit" className="bg-cyan-500 px-4 py-2 rounded-md hover:bg-cyan-600 flex items-center justify-center disabled:bg-cyan-800 disabled:cursor-not-allowed" disabled={isLoading}>
          {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <AddIcon className="w-5 h-5" />}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {watchedMovies.length > 0 ? (
          watchedMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-700 p-3 rounded-md flex items-center justify-between">
              <div>
                <p className="font-medium">{movie.title}</p>
                <p className="text-sm text-gray-400">{movie.year}</p>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={movie.rating} onRate={(rating) => onUpdateRating(movie.id, rating)} />
                <button onClick={() => onRemoveMovie(movie.id)} className="p-1 text-gray-400 hover:text-white">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">Add some movies to get started!</p>
        )}
      </div>
    </div>
  );
};
