import React, { useState } from 'react';
import { LoaderIcon } from './icons/LoaderIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface UserSuggestionFormProps {
  onAddSuggestion: (title: string) => Promise<void>;
}

export const UserSuggestionForm: React.FC<UserSuggestionFormProps> = ({ onAddSuggestion }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await onAddSuggestion(title);
      setTitle('');
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

  return (
    <div className="border-y border-gray-700 py-4 mt-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="Got a suggestion? Add it here..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-fuchsia-500 px-4 py-2 rounded-md hover:bg-fuchsia-600 flex items-center justify-center disabled:bg-fuchsia-800 disabled:cursor-not-allowed" 
          disabled={isLoading || !title.trim()}
          title="Add Suggestion"
        >
          {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};
