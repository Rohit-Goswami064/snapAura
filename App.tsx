import React, { useReducer, useCallback, useState, useEffect } from 'react';
import type { EditorState, EditorAction, User } from './types';
import { INITIAL_STATE } from './constants';
import Topbar from './components/Topbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Canvas from './components/Canvas';
import LandingPage from './components/LandingPage';

// Add `google` to the window object for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

function decodeJwtResponse(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_SCREENSHOT':
      return { ...state, screenshot: action.payload };
    case 'SET_IMAGE_DIMENSIONS':
      return { ...state, imageDimensions: action.payload };
    case 'SET_BACKGROUND':
      return { ...state, background: action.payload };
    case 'SET_PADDING':
      return { ...state, padding: action.payload };
    case 'SET_CORNER_RADIUS':
      return { ...state, cornerRadius: action.payload };
    case 'SET_SHADOW':
      return { ...state, shadow: action.payload };
    case 'SET_FRAME':
      return { ...state, frame: action.payload };
    case 'ADD_TEXT_OVERLAY':
      const newTextOverlay = {
        id: Date.now(),
        text: 'Editable Text',
        color: '#FFFFFF',
        fontSize: 48,
        position: { x: 100, y: 100 },
        textAlign: 'left' as const,
        fontWeight: 'bold' as const,
        fontStyle: 'normal' as const,
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      };
      return { ...state, textOverlays: [...state.textOverlays, newTextOverlay] };
    case 'UPDATE_TEXT_OVERLAY':
      return {
        ...state,
        textOverlays: state.textOverlays.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'REMOVE_TEXT_OVERLAY':
      return {
        ...state,
        textOverlays: state.textOverlays.filter(t => t.id !== action.payload)
      };
    case 'ADD_EMOJI_OVERLAY':
      const newEmojiOverlay = {
        id: Date.now(),
        emoji: action.payload,
        size: 80,
        position: { x: 150, y: 150 },
      };
      return { ...state, emojiOverlays: [...state.emojiOverlays, newEmojiOverlay] };
    case 'UPDATE_EMOJI_OVERLAY':
      return {
        ...state,
        emojiOverlays: state.emojiOverlays.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'REMOVE_EMOJI_OVERLAY':
      return {
        ...state,
        emojiOverlays: state.emojiOverlays.filter(e => e.id !== action.payload),
      };
    case 'ADD_GIF_OVERLAY':
      const newGifOverlay = {
        id: Date.now(),
        url: action.payload,
        width: 150,
        position: { x: 150, y: 150 },
      };
      return { ...state, gifOverlays: [...state.gifOverlays, newGifOverlay] };
    case 'UPDATE_GIF_OVERLAY':
      return {
        ...state,
        gifOverlays: state.gifOverlays.map((g) =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case 'REMOVE_GIF_OVERLAY':
      return {
        ...state,
        gifOverlays: state.gifOverlays.filter(g => g.id !== action.payload),
      };
    case 'RESET_STATE':
      return { ...INITIAL_STATE, screenshot: state.screenshot, imageDimensions: state.imageDimensions, user: state.user };
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(editorReducer, INITIAL_STATE);
  const [showEditor, setShowEditor] = useState(false);
  const [isGsiReady, setIsGsiReady] = useState(false);

  const handleLogin = useCallback((response: any) => {
    const userObject = decodeJwtResponse(response.credential);
    const user: User = {
      name: userObject.name,
      email: userObject.email,
      picture: userObject.picture,
    };
    dispatch({ type: 'LOGIN', payload: user });
  }, []);

  const handleLogout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  useEffect(() => {
    // Wait for Google Sign-In script to load
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (clientId && !clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleLogin,
            use_fedcm_for_prompt: false
          });
          setIsGsiReady(true);
        } else {
          console.warn('Google Sign-In is not configured. `process.env.GOOGLE_CLIENT_ID` is missing or is a placeholder.');
        }
      }
    };

    // Check if Google script is already loaded
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      // Wait for the script to load
      const checkGoogleScript = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(checkGoogleScript);
          initializeGoogleSignIn();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkGoogleScript);
        if (!window.google || !window.google.accounts) {
          console.error('Google Sign-In script failed to load. Please check your internet connection and ensure the Google Sign-In script is accessible.');
        }
      }, 10000);

      return () => {
        clearInterval(checkGoogleScript);
        clearTimeout(timeout);
      };
    }
  }, [handleLogin]);


  const handleExport = useCallback(async () => {
    const element = document.getElementById('canvas-wrapper');
    if (!element) return;

    // For export, we need to select the inner element if a frame is active
    // FIX: Cast to HTMLElement to access the .style property, as `querySelector` returns a generic Element.
    const exportElement = (element.querySelector('#frame-export-wrapper') || element) as HTMLElement;

    // Temporarily remove shadow for export to prevent cropping issues
    const originalFilter = exportElement.style.filter;
    exportElement.style.filter = 'none';

    // @ts-ignore
    const canvas = await html2canvas(exportElement, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: null, // Transparent background
      scale: 2, // Increase resolution
    });

    // Restore shadow
    exportElement.style.filter = originalFilter;

    const link = document.createElement('a');
    link.download = 'snapaura-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const handleSetScreenshot = useCallback((payload: string) => {
    dispatch({ type: 'SET_SCREENSHOT', payload });
    const img = new Image();
    img.onload = () => {
      dispatch({ type: 'SET_IMAGE_DIMENSIONS', payload: { width: img.width, height: img.height } });
    };
    img.src = payload;
  }, [dispatch]);


  if (!showEditor) {
    return <LandingPage onStart={() => setShowEditor(true)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Topbar
        state={state}
        dispatch={dispatch}
        handleExport={handleExport}
        handleLogout={handleLogout}
        isGsiReady={isGsiReady}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar state={state} dispatch={dispatch} onUpload={handleSetScreenshot} />
        <main className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto custom-scrollbar bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <Canvas state={state} dispatch={dispatch} onUpload={handleSetScreenshot} />
        </main>
        <RightSidebar state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}

export default App;
