
import React from 'react';

interface PaddingSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const PaddingSlider: React.FC<PaddingSliderProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="padding" className="text-xs text-gray-400 flex justify-between items-center mb-1">
        <span>Padding</span>
        <span>{value}px</span>
      </label>
      <input
        id="padding"
        type="range"
        min="0"
        max="200"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default PaddingSlider;
