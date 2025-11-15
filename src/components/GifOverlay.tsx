import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GifOverlay as GifOverlayType, EditorAction } from '../../types';
import { DeleteIcon } from './icons';

interface GifOverlayProps {
  gifOverlay: GifOverlayType;
  dispatch: React.Dispatch<EditorAction>;
  isSelected: boolean;
  onSelect: () => void;
}

const MIN_WIDTH = 50;

const GifOverlay: React.FC<GifOverlayProps> = ({ gifOverlay, dispatch, isSelected, onSelect }) => {
  const [mode, setMode] = useState<'idle' | 'drag' | 'resize'>('idle');
  const [localGif, setLocalGif] = useState(gifOverlay);

  const elementRef = useRef<HTMLDivElement>(null);
  const interactionStartRef = useRef<{
    x: number; y: number;
    posX: number; posY: number;
    width: number; height: number;
    handle: string;
  } | null>(null);

  useEffect(() => {
    setLocalGif(gifOverlay);
  }, [gifOverlay]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) {
      e.preventDefault();
      e.stopPropagation();
      setMode('drag');
      interactionStartRef.current = {
        x: e.clientX, y: e.clientY,
        posX: localGif.position.x, posY: localGif.position.y,
        width: 0, height: 0, handle: ''
      };
    }
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMode('resize');
    const rect = elementRef.current!.getBoundingClientRect();
    interactionStartRef.current = {
      x: e.clientX, y: e.clientY,
      posX: localGif.position.x, posY: localGif.position.y,
      width: rect.width, height: rect.height,
      handle,
    };
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'REMOVE_GIF_OVERLAY', payload: gifOverlay.id });
  };

  const handleInteractionMove = useCallback((e: MouseEvent) => {
    if (mode === 'idle' || !interactionStartRef.current) return;

    const dx = e.clientX - interactionStartRef.current.x;
    const dy = e.clientY - interactionStartRef.current.y;

    if (mode === 'drag') {
      const startX = interactionStartRef.current.posX;
      const startY = interactionStartRef.current.posY;
      setLocalGif(prev => ({
        ...prev,
        position: {
          x: startX + dx,
          y: startY + dy,
        }
      }));
    } else if (mode === 'resize') {
      const { handle, width: startWidth, height: startHeight, posX: startX, posY: startY } = interactionStartRef.current;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startX;
      let newY = startY;

      const aspectRatio = startWidth / startHeight;

      if (handle.includes('r')) newWidth = startWidth + dx;
      if (handle.includes('l')) newWidth = startWidth - dx;
      if (handle.includes('b')) newHeight = startHeight + dy;
      if (handle.includes('t')) newHeight = startHeight - dy;

      if (handle.length === 2) { // Corner resize
        const isLeft = handle.includes('l');
        const isTop = handle.includes('t');

        if (Math.abs(dx) > Math.abs(dy)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }

        if (isLeft) newX = startX + (startWidth - newWidth);
        if (isTop) newY = startY + (startHeight - newHeight);
      } else { // Edge resize
        newHeight = newWidth / aspectRatio; // Maintain ratio
      }

      if (newWidth >= MIN_WIDTH) {
        setLocalGif(prev => ({
          ...prev,
          width: newWidth,
          position: { x: newX, y: newY }
        }));
      }
    }
  }, [mode]);

  const handleInteractionEnd = useCallback(() => {
    if (mode !== 'idle') {
      dispatch({ type: 'UPDATE_GIF_OVERLAY', payload: { ...localGif } });
      setMode('idle');
      interactionStartRef.current = null;
    }
  }, [mode, dispatch, localGif]);

  useEffect(() => {
    window.addEventListener('mousemove', handleInteractionMove);
    window.addEventListener('mouseup', handleInteractionEnd);
    return () => {
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [handleInteractionMove, handleInteractionEnd]);

  const handles = ['tl', 'tr', 'bl', 'br'];
  const handleCursors: { [key: string]: string } = {
    tl: 'nwse-resize', tr: 'nesw-resize',
    bl: 'nesw-resize', br: 'nwse-resize',
  };

  return (
    <div
      ref={elementRef}
      className="absolute z-20"
      style={{
        left: localGif.position.x,
        top: localGif.position.y,
        width: `${localGif.width}px`,
        cursor: isSelected ? (mode === 'drag' ? 'grabbing' : 'grab') : 'default',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <img
        src={gifOverlay.url}
        alt="sticker"
        className="select-none pointer-events-none w-full h-auto"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}
      />
      {isSelected && (
        <>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <button title="Delete" onClick={handleDelete} className="p-1.5 bg-gray-800 border border-gray-700 rounded-full shadow-lg hover:bg-red-500/80 transition-colors">
              <DeleteIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="absolute inset-0 border-2 border-green-500 pointer-events-none" />
          {handles.map(handle => (
            <div
              key={handle}
              className="absolute w-3.5 h-3.5 bg-white border-2 border-green-500 rounded-full"
              style={{
                top: handle.includes('t') ? '-7px' : 'auto',
                bottom: handle.includes('b') ? '-7px' : 'auto',
                left: handle.includes('l') ? '-7px' : 'auto',
                right: handle.includes('r') ? '-7px' : 'auto',
                cursor: handleCursors[handle],
              }}
              onMouseDown={(e) => handleResizeStart(e, handle)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default GifOverlay;