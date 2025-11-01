
import React from 'react';
import { SHADOW_PRESETS } from '../constants';
import type { ShadowPreset } from '../types';

interface ShadowControlProps {
  currentShadow: string;
  onShadowChange: (shadowValue: string) => void;
}

const ShadowControl: React.FC<ShadowControlProps> = ({ currentShadow, onShadowChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SHADOW_PRESETS.map((preset: ShadowPreset) => (
        <button
          key={preset.name}
          onClick={() => onShadowChange(preset.value)}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentShadow === preset.value ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};

export default ShadowControl;
