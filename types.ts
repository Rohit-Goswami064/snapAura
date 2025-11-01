export type BackgroundType = 'gradient' | 'image' | 'video' | 'color' | 'gif';

export interface Gradient {
  start: string;
  end: string;
  angle: number;
}

export interface Background {
  type: BackgroundType;
  value: string | Gradient;
}

export interface TextOverlay {
  id: number;
  text: string;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textShadow: string;
}

export interface EmojiOverlay {
  id: number;
  emoji: string;
  size: number;
  position: { x: number; y: number };
}

export interface GifOverlay {
  id: number;
  url: string;
  width: number;
  position: { x: number; y: number };
}

export interface ShadowPreset {
  name: string;
  value: string;
}

export interface GradientPreset {
  name:string;
  gradient: Gradient;
}

export interface BrowserFrame {
  type: string;
  name: string;
  classNames: {
    header: string;
    body: string;
  };
}

export interface User {
  name: string;
  email: string;
  picture: string;
}

export interface EditorState {
  screenshot?: string;
  imageDimensions: { width: number; height: number };
  background: Background;
  padding: number;
  cornerRadius: number;
  shadow: string;
  textOverlays: TextOverlay[];
  emojiOverlays: EmojiOverlay[];
  gifOverlays: GifOverlay[];
  frame: BrowserFrame;
  user: User | null;
}

export type EditorAction =
  | { type: 'SET_SCREENSHOT'; payload: string }
  | { type: 'SET_IMAGE_DIMENSIONS'; payload: { width: number; height: number } }
  | { type: 'SET_BACKGROUND'; payload: Background }
  | { type: 'SET_PADDING'; payload: number }
  | { type: 'SET_CORNER_RADIUS'; payload: number }
  | { type: 'SET_SHADOW'; payload: string }
  | { type: 'ADD_TEXT_OVERLAY' }
  | { type: 'UPDATE_TEXT_OVERLAY'; payload: TextOverlay }
  | { type: 'REMOVE_TEXT_OVERLAY'; payload: number }
  | { type: 'RESET_STATE' }
  | { type: 'ADD_EMOJI_OVERLAY'; payload: string }
  | { type: 'UPDATE_EMOJI_OVERLAY'; payload: EmojiOverlay }
  | { type: 'REMOVE_EMOJI_OVERLAY'; payload: number }
  | { type: 'ADD_GIF_OVERLAY'; payload: string }
  | { type: 'UPDATE_GIF_OVERLAY'; payload: GifOverlay }
  | { type: 'REMOVE_GIF_OVERLAY'; payload: number }
  | { type: 'SET_FRAME'; payload: BrowserFrame }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };