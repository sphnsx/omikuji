
import React from 'react';
import { AppState, OmikujiFortune, StallType } from '../types';
import { History, Volume2, VolumeX } from 'lucide-react';

interface UIOverlayProps {
  status: AppState;
  activeStall: StallType | null;
  currentFortune: OmikujiFortune | null;
  onConfirm: () => void;
  onReset: () => void;
  onToggleHistory: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  historyCount: number;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  status, currentFortune, onConfirm, onToggleHistory, isMuted, onToggleMute, historyCount
}) => {
  const isShowing = status === AppState.SHOWING;
  const isDissolving = status === AppState.DISSOLVING;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12 z-20">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col gap-3">
           <h1 className="text-2xl font-extralight text-cyan-50/80 tracking-[0.5em] uppercase">
              OMI<span className="font-bold">KUJI</span>
           </h1>
           <div className="h-[1px] w-16 bg-cyan-400/20 shadow-[0_0_10px_#22d3ee]" />
        </div>
        
        <div className="flex gap-10 items-center text-cyan-200/30">
          <button onClick={onToggleMute} className="hover:text-cyan-200 transition-colors p-2">
            {isMuted ? <VolumeX size={16} strokeWidth={1} /> : <Volume2 size={16} strokeWidth={1} />}
          </button>
          <button onClick={onToggleHistory} className="hover:text-cyan-200 transition-colors p-2">
            <History size={16} strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Prompt */}
      {status === AppState.SELECTING && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-cyan-400/10 text-[9px] tracking-[1.5em] animate-pulse uppercase font-light">
            觸摸幽光之柱以領受簽文
          </div>
        </div>
      )}

      {/* Fortune Result Overlay */}
      {(isShowing || isDissolving) && currentFortune && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#020205]/95 pointer-events-auto z-50 p-6 backdrop-blur-sm">
          <div className={`flex flex-col items-center w-full max-w-2xl ${isDissolving ? 'animate-dissolve' : ''}`}>
            
            <div className="bg-[#050508] border border-cyan-900/50 p-16 shadow-[0_0_100px_rgba(0,0,0,1)] animate-unfold relative overflow-hidden">
              {/* Subtle Noise/Grain on paper */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
              
              <div className="flex flex-row-reverse justify-between h-[55vh] gap-16 relative z-10">
                {/* Main Rank Section */}
                <div className="flex flex-col items-center border-l border-cyan-900/30 pl-10">
                  <div className="vertical-text text-5xl font-black text-cyan-50 mb-10 tracking-[0.2em] [text-shadow:0_0_20px_rgba(255,255,255,0.2)]">
                    {currentFortune.rank}
                  </div>
                  <div className="vertical-text text-lg font-light leading-relaxed text-cyan-100/80 max-h-[300px] overflow-hidden">
                    {currentFortune.summary}
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-row-reverse gap-8">
                  {[
                    { label: '前程', val: currentFortune.career },
                    { label: '智慧', val: currentFortune.academic },
                    { label: '緣分', val: currentFortune.love },
                    { label: '豐盛', val: currentFortune.finance }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="vertical-text text-[9px] text-cyan-400/40 mb-8 tracking-[0.5em] font-bold uppercase">
                        {item.label}
                      </span>
                      <span className="vertical-text text-[10px] text-cyan-50/60 leading-relaxed font-light">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divine Message */}
                <div className="flex flex-col items-center border-r border-cyan-900/30 pr-10 justify-center">
                  <span className="vertical-text italic text-cyan-400/20 text-[11px] leading-[2] tracking-widest">
                    「 {currentFortune.divineMessage} 」
                  </span>
                </div>
              </div>

              {/* Minimalist Signature Seal */}
              <div className="absolute bottom-16 right-16 w-10 h-10 border border-cyan-400/10 flex items-center justify-center text-[8px] text-cyan-400/20 vertical-text font-black uppercase tracking-tighter">
                Ethereal
              </div>
            </div>

            {!isDissolving && (
              <button 
                onClick={onConfirm}
                className="mt-20 px-24 py-5 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all tracking-[1.2em] font-light text-xs bg-black/40 uppercase"
              >
                領受此運
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Details */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="text-[8px] text-cyan-300/10 tracking-[0.4em] uppercase flex flex-col gap-2 font-mono">
          <span>COORDS: 35.689°N 139.692°E</span>
          <span>RESONATED_FORTUNES: {historyCount}</span>
        </div>
        <div className="w-24 h-[1px] bg-cyan-400/5" />
      </div>
    </div>
  );
};
