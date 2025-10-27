import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserSelector } from './components/UserSelector';
import { WatchedList } from './components/WatchedList';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { WatchedMovie, MovieSuggestion, Vote } from './types';
import { getMovieSuggestions, getMovieSuggestionDetails } from './services/geminiService';

const App: React.FC = () => {
  const [users, setUsers] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'Dana']);
  const [currentUser, setCurrentUser] = useState<string>('Alice');

  // State persistence logic
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>(() => loadFromStorage('watchedMovies', []));
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>(() => loadFromStorage('suggestions', []));
  const [watchlist, setWatchlist] = useState<MovieSuggestion[]>(() => loadFromStorage('watchlist', []));
  const [maybeList, setMaybeList] = useState<MovieSuggestion[]>(() => loadFromStorage('maybeList', []));
  const [noThanksList, setNoThanksList] = useState<MovieSuggestion[]>(() => loadFromStorage('noThanksList', []));
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies)), [watchedMovies]);
  useEffect(() => localStorage.setItem('suggestions', JSON.stringify(suggestions)), [suggestions]);
  useEffect(() => localStorage.setItem('watchlist', JSON.stringify(watchlist)), [watchlist]);
  useEffect(() => localStorage.setItem('maybeList', JSON.stringify(maybeList)), [maybeList]);
  useEffect(() => localStorage.setItem('noThanksList', JSON.stringify(noThanksList)), [noThanksList]);

  const handleAddUser = (name: string) => {
    if (name && !users.includes(name)) {
      setUsers([...users, name]);
    }
  };

  const handleRemoveUser = (name: string) => {
    if (users.length <= 1) return;
    setUsers(users.filter(u => u !== name));
    if (currentUser === name) {
      setCurrentUser(users.find(u => u !== name) || '');
    }
  };

  const handleAddWatchedMovie = (movie: WatchedMovie) => {
    if (!watchedMovies.some(m => m.id === movie.id)) {
      setWatchedMovies(prev => [movie, ...prev]);
    }
  };

  const handleRemoveWatchedMovie = (id: string) => {
    setWatchedMovies(watchedMovies.filter(m => m.id !== id));
  };

  const handleUpdateRating = (id: string, rating: number | null) => {
    setWatchedMovies(watchedMovies.map(m => m.id === id ? { ...m, rating } : m));
  };

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allConsidered = [...suggestions, ...watchlist, ...maybeList, ...noThanksList];
      const newSuggestions = await getMovieSuggestions(watchedMovies, noThanksList, allConsidered);
      const suggestionsWithVotes = newSuggestions.map(s => ({
        ...s,
        votes: users.reduce((acc, user) => ({ ...acc, [user]: null }), {} as Record<string, Vote>)
      }));
      setSuggestions(prev => [...prev, ...suggestionsWithVotes]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAddSuggestion = async (title: string) => {
    const movieDetails = await getMovieSuggestionDetails(title);
    if (movieDetails) {
        const newSuggestion: MovieSuggestion = {
            ...movieDetails,
            votes: users.reduce((acc, user) => ({ ...acc, [user]: null }), {} as Record<string, Vote>)
        };

        const allTitles = new Set([
            ...suggestions.map(s => s.title.toLowerCase()), 
            ...watchlist.map(s => s.title.toLowerCase()), 
            ...maybeList.map(s => s.title.toLowerCase()), 
            ...noThanksList.map(s => s.title.toLowerCase()), 
            ...watchedMovies.map(s => s.title.toLowerCase())
        ]);

        if (!allTitles.has(newSuggestion.title.toLowerCase())) {
             setSuggestions(prev => [...prev, newSuggestion]);
        } else {
            throw new Error(`"${newSuggestion.title}" is already on one of the lists.`);
        }
    } else {
        throw new Error(`Could not find details for "${title}".`);
    }
  };
  
  const handleVote = (title: string, vote: Vote) => {
    const updatedSuggestions = suggestions.map(s =>
      s.title === title
        ? { ...s, votes: { ...s.votes, [currentUser]: vote } }
        : s
    );

    const votedMovie = updatedSuggestions.find(s => s.title === title);
    if (!votedMovie) return;

    const allVotesIn = users.every(user => votedMovie.votes[user] !== null);

    if (allVotesIn) {
      const voteCounts = { yes: 0, maybe: 0, no: 0 };
      for (const userVote of Object.values(votedMovie.votes)) {
        if (userVote) voteCounts[userVote]++;
      }

      let category: 'yes' | 'maybe' | 'no' = 'no';
      if (voteCounts.yes > voteCounts.maybe && voteCounts.yes > voteCounts.no) {
        category = 'yes';
      } else if (voteCounts.maybe > voteCounts.yes && voteCounts.maybe > voteCounts.no) {
        category = 'maybe';
      } else if (voteCounts.no > voteCounts.yes && voteCounts.no > voteCounts.maybe) {
        category = 'no';
      } else { // Handle ties with precedence: yes > maybe > no
        if (voteCounts.yes >= voteCounts.maybe && voteCounts.yes >= voteCounts.no) {
          category = 'yes';
        } else if (voteCounts.maybe >= voteCounts.no) {
          category = 'maybe';
        } else {
          category = 'no';
        }
      }

      if (category === 'yes') {
        setWatchlist(prev => [votedMovie, ...prev]);
      } else if (category === 'maybe') {
        setMaybeList(prev => [votedMovie, ...prev]);
      } else {
        setNoThanksList(prev => [votedMovie, ...prev]);
      }
      setSuggestions(updatedSuggestions.filter(s => s.title !== title));
    } else {
      setSuggestions(updatedSuggestions);
    }
  };

  const handleClearSuggestions = () => {
    setSuggestions([]);
  };

  const handleMarkAsWatched = (movie: MovieSuggestion) => {
    handleAddWatchedMovie({ id: `${movie.title}-${movie.year}`, title: movie.title, year: movie.year, rating: null });
    setWatchlist(prev => prev.filter(m => m.title !== movie.title));
    setMaybeList(prev => prev.filter(m => m.title !== movie.title));
  };

  const handleRemoveFromCategorized = (title: string) => {
    setWatchlist(prev => prev.filter(m => m.title !== title));
    setMaybeList(prev => prev.filter(m => m.title !== title));
    setNoThanksList(prev => prev.filter(m => m.title !== title));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <UserSelector
          users={users}
          currentUser={currentUser}
          onSetCurrentUser={setCurrentUser}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
        />
        <div className="grid grid-cols-1 gap-8 mt-8">
          <SuggestionsPanel
            suggestions={suggestions}
            watchlist={watchlist}
            maybeList={maybeList}
            noThanksList={noThanksList}
            users={users}
            currentUser={currentUser}
            onGetSuggestions={handleGetSuggestions}
            onUserAddSuggestion={handleUserAddSuggestion}
            onVote={handleVote}
            isLoading={isLoading}
            error={error}
            onClearSuggestions={handleClearSuggestions}
            onMarkAsWatched={handleMarkAsWatched}
            onRemoveFromCategorized={handleRemoveFromCategorized}
          />
          <WatchedList
            watchedMovies={watchedMovies}
            onAddMovie={handleAddWatchedMovie}
            onRemoveMovie={handleRemoveWatchedMovie}
            onUpdateRating={handleUpdateRating}
          />
        </div>
      </main>
    </div>
  );
};

export default App;