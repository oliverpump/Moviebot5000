import React from 'react';
import { Vote } from '../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';

interface VotingPanelProps {
  onVote: (vote: Vote) => void;
}

export const VotingPanel: React.FC<VotingPanelProps> = ({ onVote }) => {
  return (
    <div className="flex justify-around items-center pt-4 border-t border-gray-600">
      <button
        onClick={() => onVote('no')}
        className="group flex flex-col items-center text-red-400 hover:text-red-300"
      >
        <ThumbsDownIcon className="w-10 h-10 p-2 rounded-full group-hover:bg-red-500/20 transition-colors" />
        <span className="text-xs font-semibold">No</span>
      </button>
      <button
        onClick={() => onVote('maybe')}
        className="group flex flex-col items-center text-yellow-400 hover:text-yellow-300"
      >
        <QuestionMarkIcon className="w-10 h-10 p-2 rounded-full group-hover:bg-yellow-500/20 transition-colors" />
        <span className="text-xs font-semibold">Maybe</span>
      </button>
      <button
        onClick={() => onVote('yes')}
        className="group flex flex-col items-center text-green-400 hover:text-green-300"
      >
        <ThumbsUpIcon className="w-10 h-10 p-2 rounded-full group-hover:bg-green-500/20 transition-colors" />
        <span className="text-xs font-semibold">Yes!</span>
      </button>
    </div>
  );
};
