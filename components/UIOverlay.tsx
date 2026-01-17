
import React from 'react';
import { AppState, OmikujiFortune, StallType } from '../types';
import { Smartphone } from 'lucide-react';

interface UIOverlayProps {
  status: AppState;
  activeStall: StallType | null;
  currentFortune: OmikujiFortune | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ status, activeStall, currentFortune, onConfirm, onCancel }) => {
  const isInteracting = status === AppState.INTERACTING;
  const isShowing = status === AppState.SHOWING || status === AppState.DISSOLVING;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {isInteracting && (
        <div className="pointer-events-auto bg-black/90 backdrop-blur-3xl p-6 sm:p-10 flex flex-col items-center border border-white/5 shadow-2xl animate-unfold w-[90vw] max-w-xs">
          <div className="mb-3 text-[8px] text-white/20 tracking-[0.6em] uppercase">Omikuji Prayer</div>
          
          <div className="flex flex-col items-center gap-3 mb-8">
            <Smartphone className="w-8 h-8 text-white/30 animate-wiggle" />
            <h2 className="text-lg sm:text-xl font-serif italic tracking-[0.2em] sm:tracking-[0.4em] text-white/95 text-center whitespace-nowrap">
              「 搖晃手機抽籤 」
            </h2>
            <p className="text-[9px] text-white/30 tracking-[0.15em] whitespace-nowrap">或者點擊下方按鈕領取</p>
          </div>

          <button 
            onClick={onConfirm}
            className="whitespace-nowrap px-6 py-2 border border-white/10 text-white/80 hover:bg-white/5 tracking-[0.3em] text-[11px] transition-all hover:border-white/30 active:scale-95 shadow-sm"
          >
            手動領受
          </button>
          
          <button onClick={onCancel} className="mt-6 text-[9px] text-white/20 tracking-[0.4em] uppercase hover:text-white/50 transition-colors">
            [ 返回 ]
          </button>
        </div>
      )}

      {isShowing && currentFortune && (
        <div className={`pointer-events-auto fixed inset-0 flex items-center justify-center bg-black/98 p-4 sm:p-6 overflow-hidden ${status === AppState.DISSOLVING ? 'animate-dissolve' : ''}`}>
          <div className="bg-[#06050a] border border-white/5 p-6 sm:p-16 w-full max-w-2xl h-full max-h-[90vh] sm:h-auto animate-unfold relative shadow-[0_0_150px_rgba(255,100,200,0.05)] flex flex-col">
            
            <div className="flex flex-row-reverse justify-between flex-1 gap-4 sm:gap-12 overflow-x-auto pb-4 scrollbar-hide">
              {/* Main Rank Section */}
              <div className="flex flex-col items-center border-l border-white/5 pl-4 sm:pl-10 shrink-0">
                <div className="vertical-text text-5xl sm:text-7xl font-black text-white/95 mb-6 sm:mb-10 tracking-[0.1em]">{currentFortune.rank}</div>
                <div className="vertical-text text-[10px] sm:text-sm font-medium text-white/60 tracking-[0.2em] sm:tracking-[0.3em]">{currentFortune.summary}</div>
              </div>

              {/* Detail Sections - Row of vertical text */}
              <div className="flex flex-row-reverse gap-4 sm:gap-8 flex-1 justify-center shrink-0">
                {[
                  { label: '事業', value: currentFortune.career },
                  { label: '學問', value: currentFortune.academic },
                  { label: '姻緣', value: currentFortune.love },
                  { label: '財運', value: currentFortune.finance },
                  { label: '健康', value: currentFortune.health }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[20px]">
                    <span className="vertical-text text-[8px] sm:text-[9px] text-white/20 mb-4 sm:mb-8 font-bold opacity-60 uppercase">{item.label}</span>
                    <span className="vertical-text text-[10px] sm:text-[11px] text-white/70 font-light leading-relaxed">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Divine Message */}
              <div className="hidden sm:flex flex-col items-center justify-center opacity-30 shrink-0">
                <div className="vertical-text italic text-white/80 text-[11px] tracking-[0.6em] leading-loose">
                  「 {currentFortune.divineMessage} 」
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-16">
              <button 
                onClick={onConfirm}
                className="w-full py-4 sm:py-5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 tracking-[1em] sm:tracking-[1.5em] text-[10px] uppercase transition-all"
              >
                歸於塵煙
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
