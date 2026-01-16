
import React, { useState } from 'react';
import { StallType } from '../types';

interface InteractionLayerProps {
  type: StallType;
  onComplete: () => void;
  onCancel: () => void;
}

export const InteractionLayer: React.FC<InteractionLayerProps> = ({ type, onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const trigger = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(onComplete, 2000);
  };

  const labels: Record<StallType, string> = {
    [StallType.TRADITIONAL]: '祈願綜合運勢',
    [StallType.FISHING]: '尋覓命中緣分',
    [StallType.WATER]: '啟迪內在智慧',
    [StallType.FOLDING]: '窺見未來前程',
    [StallType.GOLDEN]: '承接世間豐盛',
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-md">
      <div className="relative flex flex-col items-center p-20">
        
        {/* Undersea/Cave Pulse Visual */}
        <div className="h-64 flex items-center justify-center mb-12 relative w-64">
          <div className={`absolute inset-0 border border-cyan-500/30 rounded-full transition-all duration-[2s] ${loading ? 'scale-[3] opacity-0' : 'scale-100 opacity-100 animate-ping'}`} />
          <div className={`w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_30px_#22d3ee] transition-all duration-1000 ${loading ? 'scale-[20] opacity-0' : 'scale-100'}`} />
          
          <div className="absolute bottom-[-20px] text-cyan-300/40 text-[9px] tracking-[1.2em] font-light uppercase">
            {loading ? 'Rippling...' : 'Resonance'}
          </div>
        </div>

        <div className="text-center">
          <p className="text-cyan-50/90 mb-10 font-serif text-2xl font-extralight tracking-[0.4em] italic">
            「 {labels[type]} 」
          </p>
          
          <div className="flex flex-col gap-6 items-center">
            <button 
              onClick={trigger}
              disabled={loading}
              className="px-20 py-4 border border-cyan-400/30 text-cyan-100 hover:bg-cyan-900/20 hover:border-cyan-400 transition-all font-light tracking-[0.8em] text-sm bg-black/20"
            >
              {loading ? '共鳴中' : '啟動'}
            </button>
            
            {!loading && (
              <button onClick={onCancel} className="text-white/10 text-[10px] tracking-[0.5em] hover:text-white/40 transition-colors mt-8 uppercase">
                [ Escape ]
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
