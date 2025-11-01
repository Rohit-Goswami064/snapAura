

import React from 'react';
import { ArrowRightIcon, SnapAuraLogoIcon } from './icons';
import { placeholderVideoImage } from './placeholder';


interface LandingPageProps {
  onStart: () => void;
}

const Tag: React.FC<{icon: React.ReactNode, text: string}> = ({ icon, text }) => (
    <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1 text-sm text-gray-300 border border-gray-700">
        {icon}
        <span>{text}</span>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center py-5 border-b border-gray-800">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <SnapAuraLogoIcon className="w-8 h-8 text-white" />
            <span className="font-bold text-2xl tracking-tighter">SnapAura</span>
          </div>
          <button 
            onClick={onStart} 
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
            style={{background: 'linear-gradient(to right, #6366f1, #8b5cf6)'}}
          >
            Try for free <ArrowRightIcon className="w-4 h-4" />
          </button>
        </header>

        <main className="py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div className="flex flex-col items-start text-left space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-tight">
                Create Professional<br />
                <span className="text-indigo-400">Screenshots</span><br />
                in Seconds
              </h1>
              <p className="max-w-md text-lg text-gray-400">
                Transform your screenshots for X (Twitter), email marketing, memes, product intros, revenue reports, and ads. Create engaging visual content in seconds.
              </p>
              <button 
                onClick={onStart} 
                className="flex items-center gap-2.5 px-6 py-3 text-base font-semibold text-white rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                style={{background: 'linear-gradient(to right, #4f46e5, #7c3aed)'}}
                >
                Start Creating Now <ArrowRightIcon className="w-5 h-5" />
              </button>
              
              <div className="flex flex-wrap gap-3 pt-6">
                 <Tag icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>} text="X (Twitter)" />
                 <Tag icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path></svg>} text="Email Marketing" />
                 <Tag icon={<>😂</>} text="Memes" />
                 <Tag icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18V6h1v12H4zm3 0V6h1v12H7zm3 0V6h1v12h-1zm3 0V6h1v12h-1zm3 0V6h1v12h-1zm3 0V6h1v12h-1z"></path></svg>} text="Product Intro" />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
                <div className="relative w-full p-2 bg-white/5 border border-gray-800 rounded-xl shadow-2xl backdrop-blur-sm">
                    <div className="relative">
                        <img src={placeholderVideoImage} alt="SnapAura App Demo" className="rounded-lg w-full" />
                        <div 
                           className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg cursor-pointer group"
                           onClick={onStart}
                        >
                            <div className="w-16 h-16 bg-blue-600/80 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/50 transition-transform transform group-hover:scale-110">
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                            </div>
                        </div>
                         <div className="absolute bottom-4 left-4 text-white drop-shadow-lg pointer-events-none">
                            <p className="font-bold text-xl">SnapAura Demo Video</p>
                            <p className="text-gray-300 text-sm">See how easy it is to create professional screenshots</p>
                        </div>
                    </div>
                </div>
                 <div className="text-center">
                    <h3 className="font-bold text-xl tracking-tight">See SnapAura in Action</h3>
                    <p className="text-gray-400">Watch how easy it is to create professional screenshots in under 2 minutes</p>
                </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
