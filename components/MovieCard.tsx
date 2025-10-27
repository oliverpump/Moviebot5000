import React from 'react';
import { MovieSuggestion } from '../types';
import { FilmIcon } from './icons/FilmIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { PlayIcon } from './icons/PlayIcon';

interface MovieCardProps {
  movie: MovieSuggestion;
  children?: React.ReactNode;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, children }) => {
  const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title + ' ' + movie.year)}`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' ' + movie.year + ' trailer')}`;

  return (
    <div className="bg-gray-700 rounded-lg shadow-xl overflow-hidden border-2 border-transparent hover:border-cyan-400 hover:shadow-cyan-400/20 transition-all duration-300">
      <div className="relative">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-600 flex items-center justify-center">
            <FilmIcon className="w-16 h-16 text-gray-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{movie.title}</h3>
          <p className="text-sm text-gray-300">{movie.year} &bull; <span className="font-semibold text-fuchsia-400">{movie.genre}</span></p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4">{movie.synopsis}</p>
        
        <div className="flex items-center gap-3 mb-4 border-b border-gray-600 pb-4">
          <a href={imdbSearchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            <ExternalLinkIcon className="w-4 h-4" />
            <span>Info</span>
          </a>
          <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            <PlayIcon className="w-4 h-4" />
            <span>Trailer</span>
          </a>
        </div>

        {children}
      </div>
    </div>
  );
};