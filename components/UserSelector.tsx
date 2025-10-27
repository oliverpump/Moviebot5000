import React, { useState } from 'react';
import { AddIcon } from './icons/AddIcon';
import { TrashIcon } from './icons/TrashIcon';

interface UserSelectorProps {
  users: string[];
  currentUser: string;
  onSetCurrentUser: (user: string) => void;
  onAddUser: (user: string) => void;
  onRemoveUser: (user: string) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUser, onSetCurrentUser, onAddUser, onRemoveUser }) => {
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      onAddUser(newUserName.trim());
      setNewUserName('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Who's Voting?</h2>
      <div className="flex flex-wrap items-center gap-2">
        {users.map(user => (
          <div key={user} className="flex items-center">
            <button
              onClick={() => onSetCurrentUser(user)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentUser === user ? 'bg-fuchsia-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {user}
            </button>
            {users.length > 1 && (
              <button onClick={() => onRemoveUser(user)} className="ml-1 p-1 rounded-full text-gray-400 hover:text-white hover:bg-red-500">
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <form onSubmit={handleAddUser} className="flex items-center gap-2">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Add new user..."
            className="bg-gray-700 border border-gray-600 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <button type="submit" className="p-2 bg-fuchsia-500 rounded-full hover:bg-fuchsia-600">
            <AddIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
