
import React, { useState, useEffect, useCallback } from 'react';
import type { EditorAction } from '../../types';
import { GIPHY_API_KEY } from '../constants';
import { SearchIcon } from './icons';

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

interface GifSearchProps {
  dispatch: React.Dispatch<EditorAction>;
}

interface GiphyResult {
  id: string;
  images: {
    fixed_width: {
      url: string;
    };
  };
}

const GifSearch: React.FC<GifSearchProps> = ({ dispatch }) => {
  const [query, setQuery] = useState('Trending gifs');
  const [gifs, setGifs] = useState<GiphyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 500);

  const fetchGifs = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setGifs([]);
      return;
    };
    if (!GIPHY_API_KEY) {
      setError('Giphy API key is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=12&offset=0&rating=g&lang=en`);
      if (!response.ok) {
        throw new Error('Failed to fetch GIFs from Giphy.');
      }
      const json = await response.json();
      setGifs(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGifs(debouncedQuery);
  }, [debouncedQuery, fetchGifs]);

  // Fetch initial trending gifs
  useEffect(() => {
    fetchGifs('trending gifs');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSelectGif = (url: string) => {
    dispatch({ type: 'SET_BACKGROUND', payload: { type: 'gif', value: url } });
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
          placeholder="Search for GIFs..."
          className="w-full bg-gray-700 text-white p-2 pl-9 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {gifs.map((gif) => (
            <button key={gif.id} onClick={() => handleSelectGif(gif.images.fixed_width.url)} className="aspect-square bg-gray-700 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-2 ring-offset-gray-900">
              <img src={gif.images.fixed_width.url} alt="gif" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GifSearch;
