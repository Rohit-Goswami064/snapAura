import React, { useState } from 'react';
import type { EditorState, EditorAction, Gradient } from '../types';
import { GRADIENT_PRESETS } from '../constants';
import ImageUploader from './ImageUploader';
import GifSearch from './GifSearch';
import StickerGifSelector from './StickerGifSelector';
import { BackgroundIcon, StickerIcon, UploadIcon } from './icons';

interface LeftSidebarProps {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  onUpload: (base64: string) => void;
}

type MainTab = 'background' | 'sticker';
type BackgroundTab = 'gradient' | 'image' | 'gif';

const LeftSidebar: React.FC<LeftSidebarProps> = ({ state, dispatch, onUpload }) => {
  const [mainTab, setMainTab] = useState<MainTab>('background');
  const [backgroundTab, setBackgroundTab] = useState<BackgroundTab>('gradient');

  const handleBackgroundUpload = (base64: string) => {
    dispatch({ type: 'SET_BACKGROUND', payload: { type: 'image', value: base64 } });
  };

  const setGradient = (g: Gradient) => dispatch({ type: 'SET_BACKGROUND', payload: { type: 'gradient', value: g } });

  const renderBackgroundControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-800 p-1">
        <button
          onClick={() => setBackgroundTab('gradient')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${backgroundTab === 'gradient' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        >
          Gradient
        </button>
        <button
          onClick={() => setBackgroundTab('image')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${backgroundTab === 'image' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
        >
          Image
        </button>
        <button
          onClick={() => setBackgroundTab('gif')}
          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${backgroundTab === 'gif' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
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

  return (
    <aside className="w-80 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-6 shrink-0 custom-scrollbar overflow-y-auto">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-black p-1">
        <button
          onClick={() => setMainTab('background')}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${mainTab === 'background' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}
        >
          <BackgroundIcon />
          Background
        </button>
        <button
          onClick={() => setMainTab('sticker')}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${mainTab === 'sticker' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}
        >
          <StickerIcon />
          Sticker
        </button>
      </div>

      <div className="flex-grow">
        {mainTab === 'background' && renderBackgroundControls()}
        {mainTab === 'sticker' && <StickerGifSelector dispatch={dispatch} />}
      </div>
    </aside>
  );
};

export default LeftSidebar;