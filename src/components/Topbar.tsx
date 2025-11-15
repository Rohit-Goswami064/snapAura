import React, { useState, useRef, useEffect } from 'react';
import type { EditorState, EditorAction } from '../../types';
import {
  SnapAuraLogoIcon,
  UndoIcon,
  RedoIcon,
  ExportIcon,
  TextIcon,
  ImageIcon,
  DimensionsIcon,
  LogoutIcon,
} from './icons';

interface TopbarProps {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  handleExport: () => void;
  handleLogout: () => void;
  onGoogleLoginSuccess: () => void;
  onGoogleLoginError: () => void;
  isLoading?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ state, dispatch, handleExport, handleLogout, onGoogleLoginSuccess, onGoogleLoginError, isLoading = false }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLoginClick = async () => {
    try {
      await onGoogleLoginSuccess();
    } catch (error) {
      onGoogleLoginError();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 h-16 shrink-0 z-20">
      <div className="flex items-center gap-2">
        <SnapAuraLogoIcon className="w-8 h-8 text-indigo-500" />
        <div className="flex items-center gap-1 ml-4">
          <button className="p-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <UndoIcon />
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <RedoIcon />
          </button>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center p-1 bg-black rounded-lg border border-gray-800">
        <div className="p-2 text-gray-400 hover:bg-gray-800 rounded-md hover:shadow-sm"><ImageIcon /></div>
        <div onClick={() => dispatch({ type: 'ADD_TEXT_OVERLAY' })} className="p-2 text-gray-400 hover:bg-gray-800 rounded-md hover:shadow-sm cursor-pointer"><TextIcon /></div>
      </div>

      <div className="flex items-center gap-3">
        {state.screenshot && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
            <DimensionsIcon className="w-4 h-4 text-gray-500" />
            <span>{state.imageDimensions.width || 0}</span>
            <span className="text-gray-600">&times;</span>
            <span>{state.imageDimensions.height || 0}</span>
          </div>
        )}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        >
          <ExportIcon />
          Export
        </button>

        {state.user ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 hover:bg-gray-800 rounded-full transition-all"
              title={state.user.name}
            >
              <img
                src={state.user.picture}
                alt={state.user.name}
                className="w-9 h-9 rounded-full border-2 border-gray-700 hover:border-indigo-500 transition-colors object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user?.name || 'User')}&background=4f46e5&color=fff&size=128`;
                }}
              />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-br from-indigo-900/30 to-gray-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={state.user.picture}
                      alt={state.user.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user?.name || 'User')}&background=4f46e5&color=fff&size=128`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{state.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{state.user.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <LogoutIcon />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="hidden md:block px-4 py-2 text-sm font-semibold text-indigo-400 bg-indigo-900/50 hover:bg-indigo-900/80 rounded-md transition-colors border border-indigo-800">
              Pro
            </button>
            <button
              onClick={handleLoginClick}
              disabled={isLoading}
              title="Login with Google"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: isLoading ? '#4b5563' : 'linear-gradient(to right, #4f46e5, #4338ca)' }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;
