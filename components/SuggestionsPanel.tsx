import React from 'react';
import { MovieSuggestion, Vote } from '../types';
import { MovieCard } from './MovieCard';
import { VotingPanel } from './VotingPanel';
import { CategorizedLists } from './CategorizedLists';
import { UserSuggestionForm } from './UserSuggestionForm';
import { LoaderIcon } from './icons/LoaderIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';

interface SuggestionsPanelProps {
  suggestions: MovieSuggestion[];
  watchlist: MovieSuggestion[];
  maybeList: MovieSuggestion[];
  noThanksList: MovieSuggestion[];
  users: string[];
  currentUser: string;
  onGetSuggestions: () => void;
  onUserAddSuggestion: (title: string) => Promise<void>;
  onVote: (title: string, vote: Vote) => void;
  isLoading: boolean;
  error: string | null;
  onClearSuggestions: () => void;
  onMarkAsWatched: (movie: MovieSuggestion) => void;
  onRemoveFromCategorized: (title: string) => void;
}

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  suggestions,
  watchlist,
  maybeList,
  noThanksList,
  users,
  currentUser,
  onGetSuggestions,
  onUserAddSuggestion,
  onVote,
  isLoading,
  error,
  onClearSuggestions,
  onMarkAsWatched,
  onRemoveFromCategorized,
}) => {
  const currentSuggestion = suggestions.find(s => s.votes[currentUser] === null);
  const totalCategorized = watchlist.length + maybeList.length + noThanksList.length;

  const getWaitingMessage = () => {
    if (!currentSuggestion || !users) return null;
    const waitingOn = users.filter(user => currentSuggestion.votes[user] === null && user !== currentUser);
    if (waitingOn.length > 0) {
      return `Waiting for ${waitingOn.join(', ')}...`
    }
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Movie Suggestions</h2>
        <div className="flex gap-2">
            <button
                onClick={onGetSuggestions}
                className="bg-cyan-600 px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center gap-2 disabled:bg-cyan-800 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <ThumbsUpIcon className="w-5 h-5" />}
                <span>Get Suggestions</span>
            </button>
             {suggestions.length > 0 && (
                <button
                    onClick={onClearSuggestions}
                    className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    Clear Pending Votes
                </button>
            )}
        </div>
      </div>
      
      <UserSuggestionForm onAddSuggestion={onUserAddSuggestion} />

      {error && <p className="text-red-400 text-center my-4">{error}</p>}
      
      {isLoading && suggestions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
            <LoaderIcon className="w-12 h-12 animate-spin text-cyan-400" />
            <p className="mt-4 text-gray-300">Summoning cinematic disasters...</p>
        </div>
      )}

      {currentSuggestion ? (
         <div className="mb-8">
            <h3 className="font-bungee text-2xl mt-4 mb-4 text-center text-glow-cyan">Time to Vote!</h3>
            <p className="text-center text-lg mb-4">Your turn, <span className="font-bold text-fuchsia-400">{currentUser}</span>!</p>
             <MovieCard movie={currentSuggestion}>
                 <VotingPanel onVote={(vote) => onVote(currentSuggestion.title, vote)} />
             </MovieCard>
         </div>
      ) : (
         !isLoading && suggestions.length > 0 && (
            <div className="text-center py-10 text-gray-300">
                <p>All votes are in from <span className="font-bold text-fuchsia-400">{currentUser}</span>!</p>
                <p className="text-sm mt-2">{getWaitingMessage()}</p>
            </div>
         )
      )}

      {suggestions.length === 0 && totalCategorized === 0 && !isLoading && (
        <div className="text-center py-10 text-gray-400">
            <p>Add your own suggestion or click "Get Suggestions" to find movies to watch!</p>
        </div>
      )}

      {(totalCategorized > 0 || suggestions.length > 0) && (
        <CategorizedLists 
            watchlist={watchlist}
            maybes={maybeList}
            vetoed={noThanksList}
            onMarkAsWatched={onMarkAsWatched}
            onRemove={onRemoveFromCategorized}
        />
      )}
    </div>
  );
};
