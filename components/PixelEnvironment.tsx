
import React, { useMemo } from 'react';
import { StallType } from '../types';

interface PixelEnvironmentProps {
  onSelectStall: (type: StallType) => void;
  activeStall: StallType | null;
  isSelecting: boolean;
}

const STALL_CONFIGS = [
  { type: StallType.FOLDING, x: '25%', label: '前程' },
  { type: StallType.WATER, x: '38%', label: '智慧' },
  { type: StallType.TRADITIONAL, x: '50%', label: '祈願' },
  { type: StallType.FISHING, x: '62%', label: '緣分' },
  { type: StallType.GOLDEN, x: '75%', label: '豐盛' },
];

const CatSprite: React.FC<{ left: string, bottom: string, variant: 'black' | 'calico' | 'tuxedo', delay: string }> = ({ left, bottom, variant, delay }) => {
  const colors = {
    black: ['#0a0a0a', '#1a1a1a', '#facc15'], // Body, Pattern, Eyes
    calico: ['#f5f5f5', '#d97706', '#1a1a1a'], 
    tuxedo: ['#1a1a1a', '#ffffff', '#facc15']
  };
  const [c1, c2, eye] = colors[variant];

  return (
    <div className="absolute transition-all duration-1000" style={{ left, bottom, zIndex: 20, animation: `cat-breathe 4s ease-in-out infinite`, animationDelay: delay }}>
      <div className="relative w-8 h-6">
        {/* Tail */}
        <div className="absolute -left-3 bottom-1 w-4 h-1 rounded-full origin-right" style={{ backgroundColor: c1, transform: 'rotate(-20deg)', animation: 'tail-wag 3s ease-in-out infinite' }} />
        {/* Body */}
        <div className="absolute inset-0 rounded-t-lg" style={{ backgroundColor: c1 }}>
           {variant === 'calico' && <div className="absolute top-1 left-2 w-3 h-2 bg-orange-600 opacity-80 rounded-full" />}
           {variant === 'tuxedo' && <div className="absolute bottom-0 left-2 w-4 h-3 bg-white rounded-t-full" />}
        </div>
        {/* Head */}
        <div className="absolute -top-4 left-1 w-6 h-5 rounded-t-md" style={{ backgroundColor: c1 }}>
           {/* Ears */}
           <div className="absolute -top-1.5 left-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent border-b-current" style={{ color: c1 }} />
           <div className="absolute -top-1.5 right-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent border-b-current" style={{ color: c1 }} />
           {/* Eyes */}
           <div className="absolute top-2 left-1 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: eye }} />
           <div className="absolute top-2 right-1 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: eye }} />
        </div>
      </div>
      <style>{`
        @keyframes tail-wag { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(10deg); } }
        @keyframes cat-breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.95); } }
      `}</style>
    </div>
  );
};

const Mushroom: React.FC<{ left: string, bottom: string, scale: number, delay: string }> = ({ left, bottom, scale, delay }) => (
  <div className="absolute flex flex-col items-center" style={{ left, bottom, transform: `scale(${scale})`, animationDelay: delay }}>
    <div className="mushroom-cap w-10 h-6 bg-cyan-400/40 rounded-t-full border-b-2 border-cyan-200/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent" />
      <div className="w-2 h-2 bg-white/40 rounded-full absolute top-1 left-3 blur-[1px]" />
    </div>
    <div className="w-2 h-6 bg-cyan-100/20 rounded-b-full blur-[1px]" />
    {/* Light Aura */}
    <div className="absolute -inset-10 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
  </div>
);

export const PixelEnvironment: React.FC<PixelEnvironmentProps> = ({ onSelectStall, activeStall, isSelecting }) => {
  // 密集櫻吹雪邏輯
  const sakura = useMemo(() => Array.from({ length: 70 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 140}%`,
    top: `${Math.random() * -20}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: 2 + Math.random() * 6
  })), []);

  const mushrooms = useMemo(() => [
    { left: '15%', bottom: '26%', scale: 0.8, delay: '0s' },
    { left: '82%', bottom: '28%', scale: 1.2, delay: '1s' },
    { left: '42%', bottom: '22%', scale: 0.6, delay: '0.5s' },
    { left: '58%', bottom: '22%', scale: 0.5, delay: '1.5s' },
  ], []);

  const sceneContent = (isReflection = false) => (
    <div className={`relative w-full h-full ${isReflection ? 'reflection-container' : ''}`}>
      {/* Central Island */}
      <div className="absolute bottom-[23%] left-1/2 -translate-x-1/2 w-[60%] h-12 bg-stone-900 rounded-[100%] border-t-2 border-stone-800" />
      
      {/* Torii Gate */}
      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-72 h-96 flex flex-col items-center group">
        <div className="w-[130%] h-10 bg-[#1a0505] border-b-4 border-red-950/50 relative">
          <div className="absolute bottom-0 w-full h-1 bg-red-900/20" />
        </div>
        <div className="w-[105%] h-5 bg-[#1a0505] mt-6" />
        <div className="w-full flex justify-around px-12 h-full">
          <div className="w-8 bg-[#1a0505] h-full" />
          <div className="w-8 bg-[#1a0505] h-full" />
        </div>
        {/* Glow behind Torii */}
        {!isReflection && <div className="absolute bottom-40 w-24 h-24 bg-red-900/10 rounded-full blur-[80px]" />}
      </div>

      {/* Cats - Only in main scene */}
      {!isReflection && (
        <>
          <CatSprite left="42%" bottom="26%" variant="black" delay="0s" />
          <CatSprite left="55%" bottom="26%" variant="tuxedo" delay="1.2s" />
          <CatSprite left="28%" bottom="24%" variant="calico" delay="0.5s" />
        </>
      )}

      {/* Mushrooms */}
      {mushrooms.map((m, i) => <Mushroom key={i} {...m} />)}

      {/* Interaction Pillars */}
      {!isReflection && STALL_CONFIGS.map((stall) => (
        <div 
          key={stall.type}
          className="absolute bottom-[20%] group cursor-pointer flex flex-col items-center"
          style={{ left: stall.x, transform: 'translateX(-50%)' }}
          onClick={() => isSelecting && onSelectStall(stall.type)}
        >
          <div className={`w-[2px] h-32 transition-all duration-700 bg-cyan-400/20 group-hover:bg-cyan-400 group-hover:h-48 ${isSelecting || activeStall === stall.type ? 'animate-pulse' : ''} shadow-[0_0_15px_rgba(34,211,238,0.5)]`} />
          <span className="mt-4 text-[11px] vertical-text opacity-0 group-hover:opacity-80 transition-opacity font-light text-cyan-100 tracking-[0.8em]">
            {stall.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`absolute inset-0 w-full h-full transition-all duration-2000 ${!isSelecting ? 'brightness-50 blur-[2px]' : ''}`}>
      {/* Underground Cave Ceiling / Distance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a2e_0%,_transparent_70%)] opacity-30 pointer-events-none" />

      {/* River Bed (Bottom half) */}
      <div className="absolute bottom-0 w-full h-[25%] river-surface z-0" />

      {/* Main Scene */}
      <div className="absolute inset-0 z-10">
        {sceneContent(false)}
      </div>

      {/* Water Reflection */}
      <div className="absolute bottom-0 left-0 w-full h-[25%] overflow-hidden z-0">
        {sceneContent(true)}
      </div>

      {/* Sakura Fubuki - Dense Layer */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {sakura.map(s => (
          <div key={s.id} className="sakura-petal" style={{
            left: s.left, top: s.top, width: s.size, height: s.size,
            animation: `sakura-blizzard ${s.duration} linear infinite`,
            animationDelay: s.delay
          }} />
        ))}
      </div>
    </div>
  );
};
