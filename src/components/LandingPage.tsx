import React, { useState, useRef } from 'react';
import { SnapAuraLogoIcon } from './icons';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onStart();
  };

  const handleFileSelect = () => {
    onStart();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Gradient Blobs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/15 rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-1/4 w-[550px] h-[550px] bg-pink-500/15 rounded-full blur-[150px] translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <SnapAuraLogoIcon className="w-7 h-7 text-white" />
            <span className="font-bold text-xl">SnapAura</span>
          </div>
          <button 
            onClick={onStart}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors border border-gray-800"
          >
            Get Started
          </button>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Create <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">Beautiful Screenshots</span>
              <br />
              Designs Easily
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Create beautiful screenshot designs in seconds using AI. Unlimited downloads. 100% free to use. No Ads. No sign-up required.
            </p>
          </div>

          {/* Upload Area */}
          <div 
            className={`relative bg-gray-900/40 backdrop-blur-sm border-2 ${
              isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800'
            } border-dashed rounded-3xl p-12 md:p-20 mb-16 transition-all duration-300`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {/* Upload Icon */}
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-purple-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>

              {/* Upload Text */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drag and drop an image here
                </h3>
                <p className="text-gray-500 text-sm">
                  or click to select a file
                </p>
              </div>

              {/* Select Image Button */}
              <button
                onClick={handleFileSelect}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                Select Image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-1">100% Free Forever</h3>
                  <p className="text-gray-400 text-sm">No signup required</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-1">Unlimited Exports</h3>
                  <p className="text-gray-400 text-sm">High-quality PNG downloads</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-1">AI-Enhanced Results</h3>
                  <p className="text-gray-400 text-sm">Professional quality every time</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
