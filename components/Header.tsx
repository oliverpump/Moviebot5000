import React from 'react';
import { FilmIcon } from './icons/FilmIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <FilmIcon className="w-8 h-8 text-cyan-400 mr-3" />
        <h1 className="font-bungee text-2xl font-bold text-white tracking-wider text-glow-cyan">
          Movie Night Planner
        </h1>
      </div>
    </header>
  );
};
