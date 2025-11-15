
import React, { useState } from 'react';
import type { Background, EditorAction, Gradient } from '../../types';
import { GRADIENT_PRESETS } from '../constants';
import ImageUploader from './ImageUploader';
import { UploadIcon } from './icons';
import GifSearch from './GifSearch';

interface BackgroundSelectorProps {
  background: Background;
  dispatch: React.Dispatch<EditorAction>;
  onUpload: (base64: string) => void;
}

type BackgroundTab = 'gradient' | 'image' | 'gif';

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ background, dispatch, onUpload }) => {
  const [backgroundTab, setBackgroundTab] = useState<BackgroundTab>('gradient');

  const handleBackgroundUpload = (base64: string) => {
    dispatch({ type: 'SET_BACKGROUND', payload: { type: 'image', value: base64 } });
  };

  const setGradient = (g: Gradient) => dispatch({ type: 'SET_BACKGROUND', payload: { type: 'gradient', value: g } });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-800 p-1">
        <button
          onClick={() => setBackgroundTab('gradient')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${backgroundTab === 'gradient' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
        >
          Gradient
        </button>
        <button
          onClick={() => setBackgroundTab('image')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${backgroundTab === 'image' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
        >
          Image
        </button>
        <button
          onClick={() => setBackgroundTab('gif')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${backgroundTab === 'gif' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
        >
          GIF
        </button>
      </div>

      <div>
        {backgroundTab === 'gradient' && (
          <div className="grid grid-cols-5 gap-2">
            {GRADIENT_PRESETS.map((g, index) => (
              <button
                key={index}
                className="aspect-square rounded-md transition-all duration-200"
                style={{ background: `linear-gradient(${g.angle}deg, ${g.start}, ${g.end})` }}
                onClick={() => setGradient(g)}
              />
            ))}
          </div>
        )}
        {backgroundTab === 'image' && (
          <ImageUploader onUpload={handleBackgroundUpload}>
            <button className="w-full flex flex-col items-center justify-center gap-2 p-6 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
              <UploadIcon className="w-6 h-6" />
              <span className="text-sm font-semibold">Upload Image</span>
            </button>
          </ImageUploader>
        )}
        {backgroundTab === 'gif' && <GifSearch dispatch={dispatch} />}
      </div>
    </div>
  );
};

export default BackgroundSelector;
