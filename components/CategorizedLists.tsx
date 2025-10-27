import React from 'react';
import { MovieSuggestion } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface CategorizedListsProps {
  watchlist: MovieSuggestion[];
  maybes: MovieSuggestion[];
  vetoed: MovieSuggestion[];
  onMarkAsWatched: (movie: MovieSuggestion) => void;
  onRemove: (title: string) => void;
}

export const CategorizedLists: React.FC<CategorizedListsProps> = ({ watchlist, maybes, vetoed, onMarkAsWatched, onRemove }) => {

  const MovieListItem = ({ movie, showWatchedButton }: { movie: MovieSuggestion, showWatchedButton: boolean }) => (
    <li className="group flex items-center gap-3 bg-gray-700 p-2 rounded-md relative">
      <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-10 h-14 object-cover rounded flex-shrink-0" />
      <div className="flex-grow overflow-hidden">
        <p className="font-semibold truncate">{movie.title}</p>
        <p className="text-sm text-gray-400">{movie.year}</p>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 pl-2">
         {showWatchedButton && (
            <button 
                onClick={() => onMarkAsWatched(movie)}
                title="Mark as Watched"
                className="p-1 text-green-400 hover:text-green-300">
                <CheckCircleIcon className="w-5 h-5" />
            </button>
         )}
        <button 
            onClick={() => onRemove(movie.title)}
            title="Remove from list"
            className="p-1 text-red-400 hover:text-red-300">
            <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <h3 className="font-bungee text-xl mb-4 text-center">Voting Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-bold text-green-400 flex items-center gap-2 mb-3">
            <CheckCircleIcon className="w-6 h-6" /> Top Picks
          </h4>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {watchlist.length > 0 ? watchlist.map(m => <MovieListItem key={m.title} movie={m} showWatchedButton={true} />) : <p className="text-sm text-gray-500">No top picks yet.</p>}
          </ul>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-3">
            <QuestionMarkIcon className="w-6 h-6" /> Possibilities
          </h4>
           <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {maybes.length > 0 ? maybes.map(m => <MovieListItem key={m.title} movie={m} showWatchedButton={true} />) : <p className="text-sm text-gray-500">No maybes yet.</p>}
          </ul>
        </div>
         <div className="bg-gray-900/50 p-4 rounded-lg">
          <h4 className="font-bold text-red-400 flex items-center gap-2 mb-3">
            <ThumbsDownIcon className="w-6 h-6" /> Vetoed
          </h4>
           <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {vetoed.length > 0 ? vetoed.map(m => <MovieListItem key={m.title} movie={m} showWatchedButton={false} />) : <p className="text-sm text-gray-500">No vetoes yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};
