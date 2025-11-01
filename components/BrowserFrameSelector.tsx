import React from 'react';
import type { BrowserFrame } from '../types';
import { BROWSER_FRAMES } from '../constants';

interface BrowserFrameSelectorProps {
  currentFrame: BrowserFrame;
  onFrameChange: (frame: BrowserFrame) => void;
}

const BrowserFrameSelector: React.FC<BrowserFrameSelectorProps> = ({ currentFrame, onFrameChange }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-300">Browser Frames</h3>
                <div className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full font-semibold">{BROWSER_FRAMES.length - 1}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {BROWSER_FRAMES.map((frame) => (
                    <button 
                        key={frame.type} 
                        title={frame.name}
                        onClick={() => onFrameChange(frame)}
                        className={`relative aspect-[16/10] rounded-lg p-1 border-2 transition-colors ${currentFrame.type === frame.type ? 'border-indigo-500' : 'border-gray-800 hover:border-gray-700'}`}
                    >
                        {frame.type === 'none' ? (
                            <div className="w-full h-full flex items-center justify-center">
                               <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                        ) : (
                            <div className="w-full h-full rounded-md overflow-hidden flex flex-col bg-gray-700">
                                <div className={`h-1/4 ${frame.classNames.header} flex-shrink-0`}>
                                    <div className="flex items-center gap-0.5 p-1">
                                        <div className="w-1 h-1 rounded-full bg-red-500/70"></div>
                                        <div className="w-1 h-1 rounded-full bg-yellow-400/70"></div>
                                        <div className="w-1 h-1 rounded-full bg-green-500/70"></div>
                                    </div>
                                </div>
                                <div className={`flex-grow ${frame.classNames.body}`}></div>
                            </div>
                        )}
                         <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">{frame.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BrowserFrameSelector;
