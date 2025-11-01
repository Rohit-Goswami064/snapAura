

import React, { useState } from 'react';
import type { EditorState, EditorAction, Background, Gradient } from '../types';
import TextOverlay from './TextOverlay';
import EmojiOverlay from './EmojiOverlay';
import GifOverlay from './GifOverlay';
// FIX: Import SnapAuraLogoIcon to resolve missing component error.
import { ImagePlaceholderIcon, SnapAuraLogoIcon } from './icons';
import ImageUploader from './ImageUploader';

interface CanvasProps {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  onUpload: (base64: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ state, dispatch, onUpload }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedOverlay, setSelectedOverlay] = useState<{id: number, type: 'emoji' | 'gif'} | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        onUpload(readEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderBackground = (bg: Background) => {
    switch (bg.type) {
      case 'gradient':
        const g = bg.value as Gradient;
        return <div className="absolute inset-0" style={{ background: `linear-gradient(${g.angle}deg, ${g.start}, ${g.end})` }} />;
      case 'image':
      case 'gif':
        if (!bg.value) return null;
        return <img src={bg.value as string} alt="background" className="absolute inset-0 w-full h-full object-cover" />;
      case 'video':
        if (!bg.value) return null;
        return <video src={bg.value as string} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" />;
      case 'color':
        return <div className="absolute inset-0" style={{ backgroundColor: bg.value as string }} />;
      default:
        return null;
    }
  };

  const hasOverlays = state.textOverlays.length > 0 || state.emojiOverlays.length > 0 || state.gifOverlays.length > 0;
  const frameIsActive = state.frame.type !== 'none';

  const canvasContent = (
    <div 
        id="canvas-preview"
        className="relative"
        style={{
            padding: `${state.padding}px`,
        }}
        onClick={() => setSelectedOverlay(null)}
    >
        {renderBackground(state.background)}
        <div
            className="relative z-10 transition-all duration-300"
        >
            {state.screenshot ? (
            <div className="relative">
                <img
                    src={state.screenshot}
                    alt="User uploaded screenshot"
                    className="transition-all duration-300 block"
                    style={{
                    borderRadius: `${state.cornerRadius}px`,
                    maxWidth: 'min(550px, 100%)',
                    maxHeight: '400px',
                    }}
                />
                 <div className="absolute bottom-2 right-3 text-xs text-white/40 font-semibold pointer-events-none flex items-center gap-1">
                    <SnapAuraLogoIcon className="w-3 h-3"/>
                    Designed in SnapAura
                </div>
            </div>
            ) : (
            <ImageUploader onUpload={onUpload}>
                <div 
                    className={`w-[550px] max-w-full h-[380px] flex flex-col items-center justify-center bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 transition-colors cursor-pointer ${isDraggingOver ? 'border-indigo-500 bg-indigo-900/20' : ''}`}
                >
                    <div className="text-center p-6 bg-gray-800/80 shadow-lg rounded-2xl backdrop-blur-sm border border-gray-700">
                        <ImagePlaceholderIcon className="w-12 h-12 mx-auto text-gray-500" />
                        <p className="font-semibold mt-4 text-gray-300">Click to upload <span className="font-normal text-gray-400">or drag & drop</span></p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">PNG</span>
                            <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">JPG</span>
                            <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">GIF</span>
                        </div>
                    </div>
                </div>
            </ImageUploader>
            )}
        </div>
        {state.textOverlays.map((text) => (
            <TextOverlay
            key={text.id}
            textOverlay={text}
            dispatch={dispatch}
            />
        ))}
        {state.emojiOverlays.map((emoji) => (
            <EmojiOverlay
              key={emoji.id}
              emojiOverlay={emoji}
              dispatch={dispatch}
              isSelected={selectedOverlay?.id === emoji.id}
              onSelect={() => setSelectedOverlay({id: emoji.id, type: 'emoji'})}
            />
        ))}
        {state.gifOverlays.map((gif) => (
            <GifOverlay
              key={gif.id}
              gifOverlay={gif}
              dispatch={dispatch}
              isSelected={selectedOverlay?.id === gif.id}
              onSelect={() => setSelectedOverlay({id: gif.id, type: 'gif'})}
            />
        ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
        <div
        id="canvas-wrapper"
        className="relative flex items-center justify-center transition-all duration-300"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
        {frameIsActive ? (
            <div
                id="frame-export-wrapper"
                className="rounded-lg overflow-hidden border border-gray-800/50"
                style={{ filter: state.shadow }}
            >
                <div className={`h-8 flex items-center px-3 ${state.frame.classNames.header}`}>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className={state.frame.classNames.body}>
                    {canvasContent}
                </div>
            </div>
        ) : (
             <div style={{ filter: state.shadow }}>{canvasContent}</div>
        )}
        </div>
        {state.screenshot && !hasOverlays && (
            <p className="text-sm text-gray-500">No objects added yet</p>
        )}
    </div>
  );
};

export default Canvas;
