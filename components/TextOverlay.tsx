import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TextOverlay as TextOverlayType, EditorAction } from '../types';
import { DeleteIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, BoldIcon, ItalicIcon } from './icons';

interface TextOverlayProps {
  textOverlay: TextOverlayType;
  dispatch: React.Dispatch<EditorAction>;
}

const TEXT_SHADOW_PRESETS = [
  { name: 'None', value: 'none' },
  { name: 'Soft', value: '0 2px 4px rgba(0,0,0,0.5)' },
  { name: 'Hard', value: '2px 2px 0px rgba(0,0,0,0.75)' },
  { name: 'Glow', value: '0 0 10px rgba(255,255,255,0.5)' },
];


const TextOverlay: React.FC<TextOverlayProps> = ({ textOverlay, dispatch }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(textOverlay.position);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Fix: Cast event target to HTMLElement to safely access the 'closest' method.
    const target = e.target as HTMLElement;
    if (target instanceof HTMLInputElement || target.closest('button') || (target instanceof HTMLParagraphElement && target.isContentEditable)) {
      return;
    }
    
    setIsDragging(true);
    const elemRect = elementRef.current!.getBoundingClientRect();
    dragStartOffset.current = {
      x: e.clientX - elemRect.left,
      y: e.clientY - elemRect.top,
    };
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
       const parentRect = elementRef.current?.parentElement?.getBoundingClientRect();
       if (!parentRect) return;

      setPosition({
        x: e.clientX - parentRect.left - dragStartOffset.current.x,
        y: e.clientY - parentRect.top - dragStartOffset.current.y,
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, position } });
    }
  }, [isDragging, dispatch, textOverlay, position]);
  
  const handleTextChange = (e: React.FocusEvent<HTMLParagraphElement>) => {
    dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, text: e.currentTarget.textContent || '' } });
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, color: e.target.value, position } });
  };
  
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, fontSize: parseInt(e.target.value, 10), position } });
  };

    const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
        dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, textAlign: align, position } });
    };

    const toggleBold = () => {
        const newWeight = textOverlay.fontWeight === 'bold' ? 'normal' : 'bold';
        dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, fontWeight: newWeight, position } });
    };

    const toggleItalic = () => {
        const newStyle = textOverlay.fontStyle === 'italic' ? 'normal' : 'italic';
        dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, fontStyle: newStyle, position } });
    };

    const handleShadowChange = (shadow: string) => {
        dispatch({ type: 'UPDATE_TEXT_OVERLAY', payload: { ...textOverlay, textShadow: shadow, position } });
    };


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  useEffect(() => {
    if (!isDragging) {
        setPosition(textOverlay.position);
    }
  }, [textOverlay.position, isDragging]);

  return (
    <div
      ref={elementRef}
      className="absolute z-20 group"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="relative"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:flex group-focus-within:flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <input type="color" value={textOverlay.color} onChange={handleColorChange} className="w-7 h-7 bg-transparent border-none cursor-pointer" />
                <input type="number" value={textOverlay.fontSize} onChange={handleFontSizeChange} className="w-16 bg-gray-700 text-white p-1 rounded-md text-sm" />
                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <button title="Align Left" onClick={() => handleTextAlignChange('left')} className={`p-1 rounded ${textOverlay.textAlign === 'left' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}><AlignLeftIcon /></button>
                <button title="Align Center" onClick={() => handleTextAlignChange('center')} className={`p-1 rounded ${textOverlay.textAlign === 'center' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}><AlignCenterIcon /></button>
                <button title="Align Right" onClick={() => handleTextAlignChange('right')} className={`p-1 rounded ${textOverlay.textAlign === 'right' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}><AlignRightIcon /></button>
                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <button title="Bold" onClick={toggleBold} className={`p-1 rounded ${textOverlay.fontWeight === 'bold' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}><BoldIcon /></button>
                <button title="Italic" onClick={toggleItalic} className={`p-1 rounded ${textOverlay.fontStyle === 'italic' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}><ItalicIcon /></button>
                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <button title="Delete" onClick={() => dispatch({type: 'REMOVE_TEXT_OVERLAY', payload: textOverlay.id})} className="p-1 hover:bg-gray-700 rounded">
                    <DeleteIcon />
                </button>
            </div>
            <div className="flex items-center gap-1 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <span className="text-xs text-gray-400 mr-1">Shadow:</span>
                 {TEXT_SHADOW_PRESETS.map(preset => (
                    <button 
                        key={preset.name}
                        onClick={() => handleShadowChange(preset.value)} 
                        className={`px-2 py-1 text-xs rounded transition-colors ${textOverlay.textShadow === preset.value ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {preset.name}
                    </button>
                 ))}
            </div>
        </div>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTextChange}
          className="p-2 outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          style={{
            color: textOverlay.color,
            fontSize: `${textOverlay.fontSize}px`,
            textShadow: textOverlay.textShadow,
            textAlign: textOverlay.textAlign,
            fontWeight: textOverlay.fontWeight,
            fontStyle: textOverlay.fontStyle,
            minWidth: '150px',
          }}
        >
          {textOverlay.text}
        </p>
      </div>
    </div>
  );
};

export default TextOverlay;