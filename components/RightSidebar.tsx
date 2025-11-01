import React, { useState } from 'react';
import type { EditorState, EditorAction, ShadowPreset } from '../types';
import { SHADOW_PRESETS } from '../constants';
import { ImageEditorIcon, BorderIcon, FrameIcon, ResetIcon } from './icons';
import BrowserFrameSelector from './BrowserFrameSelector';

interface RightSidebarProps {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const Slider: React.FC<{label: string, value: number, min: number, max: number, onChange: (value: number) => void}> = 
({ label, value, min, max, onChange }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <span className="text-sm text-gray-500">{value}px</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb:bg-white range-thumb:w-4 range-thumb:h-4 range-thumb:rounded-full"
            style={{
                background: `linear-gradient(to right, #4f46e5 ${value / max * 100}%, #374151 ${value / max * 100}%)`
            }}
        />
    </div>
);


const RightSidebar: React.FC<RightSidebarProps> = ({ state, dispatch }) => {
  const [activeTab, setActiveTab] = useState<'border' | 'frame'>('border');
  
  return (
    <aside className="w-80 bg-gray-900 border-l border-gray-800 p-4 flex flex-col gap-6 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-md font-semibold text-gray-200 bg-gray-800 px-3 py-1.5 rounded-lg">
            <ImageEditorIcon />
            <span>Image Editor</span>
        </div>
        <button onClick={() => dispatch({type: 'RESET_STATE'})} className="p-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md" title="Reset Styles">
            <ResetIcon />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-black p-1">
        <button
          onClick={() => setActiveTab('border')}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'border' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}
        >
          <BorderIcon />
          Border
        </button>
        <button
          onClick={() => setActiveTab('frame')}
          className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'frame' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50'}`}
        >
          <FrameIcon />
          Frame
        </button>
      </div>
      
      {activeTab === 'border' && (
        <div className="space-y-6">
            <Slider label="Padding" value={state.padding} min={0} max={200} onChange={(v) => dispatch({ type: 'SET_PADDING', payload: v })} />
            <Slider label="Corner Radius" value={state.cornerRadius} min={0} max={100} onChange={(v) => dispatch({ type: 'SET_CORNER_RADIUS', payload: v })} />
             <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Shadow</h3>
                <div className="grid grid-cols-2 gap-2">
                    {SHADOW_PRESETS.map((preset: ShadowPreset) => (
                        <button
                        key={preset.name}
                        onClick={() => dispatch({ type: 'SET_SHADOW', payload: preset.value })}
                        className={`px-3 py-2 text-sm rounded-md transition-colors border-2 ${
                            state.shadow === preset.value ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                        }`}
                        >
                        {preset.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
      
      {activeTab === 'frame' && (
        <BrowserFrameSelector 
            currentFrame={state.frame} 
            onFrameChange={(frame) => dispatch({ type: 'SET_FRAME', payload: frame })}
        />
      )}

      <div className="mt-auto">
        <button className="w-full px-3 py-2 text-sm font-semibold rounded-md bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
            Detect Emails
            <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">Soon</span>
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;