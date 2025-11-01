import React, { useState } from 'react';
import type { EditorAction } from '../types';
import { EMOJI_DATA } from '../constants';
import { SearchIcon } from './icons';

interface EmojiStickerSelectorProps {
  dispatch: React.Dispatch<EditorAction>;
}

const EmojiStickerSelector: React.FC<EmojiStickerSelectorProps> = ({ dispatch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSelect = (emoji: string) => {
    dispatch({ type: 'ADD_EMOJI_OVERLAY', payload: emoji });
  };

  const filteredEmojis = EMOJI_DATA.filter(emojiData => {
    const query = searchQuery.toLowerCase();
    if (!query) return true; // Show all if query is empty
    return (
      emojiData.emoji.includes(query) ||
      emojiData.name.toLowerCase().includes(query) ||
      emojiData.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-3">
        <div className="relative">
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-4 w-4 text-gray-400" />
            </span>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emojis..."
                className="w-full bg-gray-700 text-white p-2 pl-9 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {filteredEmojis.map((emojiData) => (
            <button
              key={emojiData.emoji}
              onClick={() => handleSelect(emojiData.emoji)}
              className="text-2xl p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Add ${emojiData.name} emoji`}
              title={emojiData.name}
            >
              {emojiData.emoji}
            </button>
          ))}
          {filteredEmojis.length === 0 && (
            <p className="col-span-6 text-center text-sm text-gray-400 py-4">No emojis found.</p>
          )}
        </div>
    </div>
  );
};

export default EmojiStickerSelector;
