
import React from 'react';
import { AppState } from '../types';

interface PixelOmikujiProps {
  status: AppState;
  onClick: () => void;
}

export const PixelOmikuji: React.FC<PixelOmikujiProps> = ({ status, onClick }) => {
  const isShaking = status === AppState.SHAKING;
  const isDrawing = status === AppState.DRAWING || status === AppState.SHOWING;
  const isDissolving = status === AppState.DISSOLVING;

  return (
    <div className="relative flex flex-col items-center group">
      {/* The Slip (Animated) */}
      <div 
        className={`absolute bottom-full left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-0
          ${isDrawing ? 'translate-y-[-40px] opacity-100' : 'translate-y-[40px] opacity-0'}
          ${isDissolving ? 'scale-0 opacity-0' : ''}
        `}
      >
        <div className="w-6 h-24 bg-[#fef3c7] border-4 border-black relative flex flex-col items-center py-2">
          <div className="w-1 h-16 bg-black opacity-20" />
        </div>
      </div>

      {/* The Cylinder */}
      <div 
        onClick={onClick}
        className={`relative z-10 cursor-pointer transition-transform
          ${isShaking ? 'animate-pixel-shake' : 'hover:scale-105 active:scale-95'}
          ${isDissolving ? 'opacity-50 grayscale' : ''}
        `}
      >
        {/* Main body */}
        <div className="w-16 h-28 bg-[#d4a373] border-4 border-black relative flex flex-col">
          {/* Top cap */}
          <div className="absolute top-0 w-full h-2 bg-black opacity-30" />
          {/* Decorative lines */}
          <div className="mt-auto w-full h-4 bg-black opacity-10" />
        </div>
        
        {/* Labels (Pixel character simulated) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-10 bg-black/20" />
        </div>
      </div>

      {/* Shadow */}
      <div className="w-20 h-4 bg-black/30 rounded-full mt-2 blur-sm scale-y-50" />
    </div>
  );
};
