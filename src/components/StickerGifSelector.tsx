import React, { useState, useEffect, useCallback } from 'react';
import type { EditorAction } from '../../types';
import { GIPHY_API_KEY } from '../constants';
import { SearchIcon } from './icons';
import EmojiStickerSelector from './EmojiStickerSelector';

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface StickerGifSelectorProps {
  dispatch: React.Dispatch<EditorAction>;
}

interface GiphyResult {
  id: string;
  images: {
    fixed_width: {
      url: string;
      webp: string;
    };
  };
  title: string;
}

const GiphyPane: React.FC<{ dispatch: React.Dispatch<EditorAction> }> = ({ dispatch }) => {
  const [query, setQuery] = useState('Trending stickers');
  const [results, setResults] = useState<GiphyResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 500);

  const fetchGifs = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    let url = '';
    const endpoint = searchQuery ? 'search' : 'trending';
    const queryParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';

    url = `https://api.giphy.com/v1/stickers/${endpoint}?api_key=${GIPHY_API_KEY}${queryParam}&limit=24&offset=0&rating=g`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch from Giphy.');
      }
      const json = await response.json();
      setResults(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGifs(debouncedQuery);
  }, [debouncedQuery, fetchGifs]);

  const handleSelect = (url: string) => {
    dispatch({ type: 'ADD_GIF_OVERLAY', payload: url });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-4 w-4 text-gray-400" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stickers..."
          className="w-full bg-gray-700 text-white p-2 pl-9 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {isLoading && <p className="text-center text-gray-400 py-4">Loading stickers...</p>}
      {error && <p className="text-center text-red-400 py-4">{error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-3 gap-2 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-1">
          {results.map((result) => (
            <button key={result.id} onClick={() => handleSelect(result.images.fixed_width.url)} className="aspect-square bg-gray-800 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-2 ring-offset-gray-900 p-1">
              <img src={result.images.fixed_width.webp} alt={result.title} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


const StickerGifSelector: React.FC<StickerGifSelectorProps> = ({ dispatch }) => {
  const [activeTab, setActiveTab] = useState<'gifs' | 'emoji'>('gifs');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-800 p-1">
        <button
          onClick={() => setActiveTab('gifs')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'gifs' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
        >
          GIFs & Stickers
        </button>
        <button
          onClick={() => setActiveTab('emoji')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'emoji' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
        >
          Emoji
        </button>
      </div>
      {activeTab === 'gifs' && <GiphyPane dispatch={dispatch} />}
      {activeTab === 'emoji' && <EmojiStickerSelector dispatch={dispatch} />}
    </div>
  );
}

export default StickerGifSelector;
