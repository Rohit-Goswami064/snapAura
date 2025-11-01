
import React from 'react';

interface CornerRadiusSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const CornerRadiusSlider: React.FC<CornerRadiusSliderProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="cornerRadius" className="text-xs text-gray-400 flex justify-between items-center mb-1">
        <span>Corner Radius</span>
        <span>{value}px</span>
      </label>
      <input
        id="cornerRadius"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default CornerRadiusSlider;
