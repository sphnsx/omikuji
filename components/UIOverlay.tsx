import React, { useState, useEffect, useRef } from 'react';
import { AppState, OmikujiFortune, StallType } from '../types';
import { Smartphone, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { strings, rankLabels, categoryLabels } from '../i18n';

interface UIOverlayProps {
  status: AppState;
  activeStall: StallType | null;
  currentFortune: OmikujiFortune | null;
  onConfirm: () => void;
  onCancel: () => void;
  showPermissionGuide: boolean;
  onClosePermissionGuide: () => void;
  platform: 'ios' | 'android' | 'desktop';
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  status,
  activeStall,
  currentFortune,
  onConfirm,
  onCancel,
  showPermissionGuide,
  onClosePermissionGuide,
  platform,
}) => {
  const { language } = useLanguage();
  const [isDivineVisible, setIsDivineVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isInteracting = status === AppState.INTERACTING;
  const isShowing = status === AppState.SHOWING || status === AppState.DISSOLVING;
  const t = strings[language];
  const ranks = rankLabels[language];
  const categories = categoryLabels[language];

  // 當新籤文出現時，重置詳解顯示狀態
  useEffect(() => {
    if (status === AppState.SHOWING) {
      setIsDivineVisible(false);
    }
  }, [status, currentFortune?.id]);

  // 右滑看詳解：初始滾動到最右（顯示摘要），詳解在左側
  useEffect(() => {
    if (status === AppState.SHOWING && currentFortune && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const scrollToRight = () => {
        el.scrollLeft = el.scrollWidth - el.clientWidth;
      };
      requestAnimationFrame(scrollToRight);
    }
  }, [status, currentFortune?.id]);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      
      {/* Android 權限指引彈窗 */}
      {showPermissionGuide && platform === 'android' && (
        <div className="pointer-events-auto fixed inset-0 bg-black/98 backdrop-blur-3xl flex items-center justify-center z-[100] animate-unfold">
          <div className="bg-[#08080c] border border-white/10 p-8 sm:p-12 max-w-lg mx-4 space-y-8">
            
            {/* 標題 */}
            <div className="space-y-2 text-center">
              <div className="text-[9px] text-white/20 tracking-[1em] uppercase font-light pl-[1em]">{t.permissionRequired}</div>
              <h2 className="text-2xl font-serif text-white/95 tracking-[0.4em] pl-[0.4em]">{t.permissionTitle}</h2>
            </div>

            <div className="text-sm text-white/60 leading-relaxed space-y-4 font-light">
              <p>{t.permissionBody}</p>
              <p className="text-white/40 text-xs">{t.permissionStepsIntro}</p>
            </div>

            <ol className="space-y-4 text-sm text-white/70 font-light">
              <li className="flex gap-3">
                <span className="text-white/40 shrink-0">1.</span>
                <span>{t.permissionStep1}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/40 shrink-0">2.</span>
                <span>{t.permissionStep2}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/40 shrink-0">3.</span>
                <span>{t.permissionStep3}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-white/40 shrink-0">4.</span>
                <span>{t.permissionStep4}</span>
              </li>
            </ol>

            <div className="space-y-3 pt-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/30 tracking-[0.3em] text-sm font-serif transition-all duration-300 pl-[0.3em]"
              >
                {t.permissionRefresh}
              </button>

              <button
                onClick={onClosePermissionGuide}
                className="w-full py-3 text-xs text-white/30 hover:text-white/60 tracking-[0.6em] transition-colors pl-[0.6em]"
              >
                {t.permissionBack}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 搖晃提示 (Interaction Phase) */}
      {isInteracting && (
        <div 
          className="pointer-events-auto bg-black/95 backdrop-blur-3xl p-8 sm:p-12 flex flex-col items-center justify-center border border-white/5 shadow-[0_0_100px_rgba(255,100,200,0.05)] animate-unfold w-full max-w-sm mx-auto"
        >
          <div className="mb-4 text-[9px] text-white/20 tracking-[1em] uppercase font-light text-center pl-[1em]">{t.omikujiDevotion}</div>
          <div className="flex flex-col items-center gap-8 mb-4 w-full">
            <div className="p-5 rounded-full bg-white/5">
              <Smartphone className="w-12 h-12 text-white/40 animate-wiggle" />
            </div>
            <div className="space-y-3 text-center flex flex-col items-center w-full">
              <h2 className="text-2xl sm:text-3xl font-serif italic text-white/95 flex flex-row items-center justify-center whitespace-nowrap pl-[0.6em]">
                <span className="tracking-[0.6em] whitespace-nowrap">{t.shakeDevoutly}</span>
              </h2>

              {platform === 'desktop' && (
                <div className="text-[9px] text-amber-400/60 tracking-[0.2em] bg-amber-900/10 px-4 py-2 border border-amber-500/20">
                  {t.desktopShakeUnavailable}
                </div>
              )}

              {platform === 'android' && (
                <div className="text-[9px] text-orange-400/60 tracking-[0.2em] bg-orange-900/10 px-4 py-2 border border-orange-500/20">
                  {t.androidSensorUnavailable}
                </div>
              )}

              <p className="text-[10px] text-white/40 tracking-[0.25em] pl-[0.25em]">{t.senseHeavenEarth}</p>
            </div>
          </div>

          <div className="w-full flex justify-center items-center mt-8 mb-8 relative z-50">
            <button
              onClick={onConfirm}
              className="
                  flex items-center justify-center 
                  px-12 py-4 
                  border border-stone-500/50 hover:border-stone-300 
                  bg-black/20 hover:bg-white/5 
                  transition-all duration-500 
                  text-stone-400 hover:text-stone-200 
                  tracking-[0.2em] text-sm font-serif 
                  mx-auto
              "
            >
              <span className="whitespace-nowrap">{t.receiveDirectly}</span>
            </button>
          </div>

          <div className="w-full flex flex-col items-center mt-4">
            <button
              onClick={onCancel}
              className="w-full py-2 text-[10px] text-white/20 tracking-[0.6em] hover:text-white/70 pl-[0.6em] transition-colors flex items-center justify-center text-center"
            >
              {t.leaveForNow}
            </button>
          </div>
        </div>
      )}

      {/* 籤文卡片 (Result Screen) */}
      {isShowing && currentFortune && (
        <div 
          ref={scrollContainerRef}
          className={`pointer-events-auto fixed inset-0 flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-black/98 transition-all duration-1000 ${status === AppState.DISSOLVING ? 'animate-dissolve' : 'animate-unfold'}`}
        >
          
          {/* SLIDE 2: THE REVELATION (DETAILED VIEW) - 左側，右滑進入 */}
          <section className="min-w-full h-full flex items-center justify-center snap-center p-3 sm:p-12">
            <div className="bg-[#08080c] border border-white/5 p-4 sm:px-20 sm:py-16 w-full max-w-[98vw] h-full max-h-[90dvh] relative shadow-[0_0_150px_rgba(255,255,255,0.02)] flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hide min-h-0">
              
              {/* Main Content Area - 左右留白，橫向可滾動 */}
              <div className="flex flex-row-reverse justify-start flex-1 min-h-0 gap-16 sm:gap-24 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide mt-12 sm:mt-4 items-start pl-8 pr-8 sm:pl-10 sm:pr-10">
                
                {/* 1. Rank Column */}
                <div className="flex flex-col items-center justify-start shrink-0 border-l border-white/10 pl-10 sm:pl-16 h-full">
                   <div className="[writing-mode:vertical-rl] [text-orientation:upright] text-6xl sm:text-9xl font-black font-serif text-white/90 tracking-[0.2em]">
                    {ranks[currentFortune.rank]}
                  </div>
                </div>

                {/* 2. Summary Column (解卦) */}
                <div className="flex flex-col items-center justify-start h-full gap-8 shrink-0 border-l border-white/10 pl-10 sm:pl-16">
                  <div className="flex flex-col items-center font-serif text-xs text-stone-500 tracking-widest opacity-50">
                    <span>{t.interpretation[0]}</span>
                    <span className="mt-1">{t.interpretation[1]}</span>
                  </div>
                  <div className="w-[1px] h-10 bg-stone-700 opacity-40 shrink-0"></div>
                  <div className="font-serif text-xl text-stone-300 [writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.5em] leading-relaxed max-h-[60vh] overflow-y-auto scrollbar-hide">
                    {currentFortune.summary}
                  </div>
                </div>

                {/* 3. Divine Message Section (神諭) - 按鈕縱向居中 */}
                <div className="flex flex-row-reverse items-center gap-16 sm:gap-28 h-full shrink-0">
                  
                  {/* 按鈕容器 - 對話框內縱向居中 */}
                  <div className="h-full flex flex-col justify-center items-center shrink-0">
                    <button 
                      onClick={() => setIsDivineVisible(!isDivineVisible)}
                      className={`
                        w-16 sm:w-24 py-16 flex flex-col items-center justify-center gap-10
                        border transition-all duration-700
                        ${isDivineVisible ? 'border-white/20 text-white/80 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-white/10 text-white/25 hover:text-white/40 hover:border-white/15'}
                      `}
                    >
                      <div className="flex flex-col items-center font-serif text-sm tracking-[1em] translate-x-1.5">
                        <span>{isDivineVisible ? t.collapse[0] : t.details[0]}</span>
                        <span className="mt-2">{isDivineVisible ? t.collapse[1] : t.details[1]}</span>
                      </div>
                      <div className="opacity-40">
                        {isDivineVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                    </button>
                  </div>

                  {/* 神諭內容 - 與五大運勢同格式：標籤 + 分隔線 + 可滾動正文 */}
                  <div
                    className={`flex flex-col items-center justify-start h-full gap-8 shrink-0 border-l border-white/10 pl-10 sm:pl-16 overflow-hidden transition-all duration-300 ease-out ${
                      isDivineVisible
                        ? 'min-w-fit max-w-none opacity-100'
                        : 'min-w-0 max-w-0 opacity-0 pl-0 border-l-0'
                    }`}
                  >
                    <div className="flex flex-col items-center font-serif text-xs text-stone-500 tracking-widest opacity-50 shrink-0">
                      <span>{t.divineMessage[0]}</span>
                      <span className="mt-1">{t.divineMessage[1]}</span>
                    </div>
                    <div className="w-[1px] h-10 bg-stone-700 opacity-40 shrink-0 group-hover:bg-stone-600 transition-colors"></div>
                    <div className="
                      font-serif text-lg text-stone-300 
                      [writing-mode:vertical-rl] [text-orientation:mixed] 
                      tracking-[0.3em] leading-[2.6]
                      max-h-[50vh] overflow-x-visible overflow-y-auto scrollbar-hide
                      flex-grow whitespace-normal break-words
                    ">
                      {currentFortune.divineMessage}
                    </div>
                  </div>
                </div>

                {/* 4. Categories Grid */}
                <div className="flex flex-row-reverse justify-start items-start gap-16 sm:gap-24 h-full py-0 shrink-0 overflow-x-visible">
                  {[
                    { label: categories.career, value: currentFortune.career },
                    { label: categories.academic, value: currentFortune.academic },
                    { label: categories.love, value: currentFortune.love },
                    { label: categories.finance, value: currentFortune.finance },
                    { label: categories.health, value: currentFortune.health },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center justify-start h-full gap-8 group shrink-0 min-w-fit">
                      <div className="flex flex-col items-center font-serif text-xs text-stone-500 tracking-widest opacity-50 group-hover:text-white/70 transition-colors">
                        <span>{item.label[0]}</span>
                        <span className="mt-1">{item.label[1]}</span>
                      </div>
                      <div className="w-[1px] h-10 bg-stone-700 opacity-40 shrink-0 group-hover:bg-stone-600 transition-colors"></div>
                      <div className="
                          font-serif text-lg text-stone-300 
                          [writing-mode:vertical-rl] [text-orientation:mixed] 
                          tracking-[0.3em] leading-[2.6]
                          max-h-[50vh] overflow-x-visible overflow-y-auto scrollbar-hide
                          flex-grow whitespace-normal break-words
                      ">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bottom Return Button - 底部留足安全區與留白 */}
              <div className="mt-10 sm:mt-12 shrink-0 border-t border-white/5 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <button
                  onClick={onConfirm}
                  className="w-full py-8 sm:py-10 border border-white/5 text-stone-500 hover:text-white/60 hover:bg-white/5 tracking-[4em] text-[10px] uppercase transition-all duration-1000 pl-[4em] flex items-center justify-center text-center rounded-sm"
                >
                  {t.returnToVoid}
                </button>
              </div>
            </div>
          </section>

          {/* SLIDE 1: RANK & SUMMARY */}
          <section className="min-w-full h-full flex flex-col items-center justify-center snap-center px-4 sm:px-12 relative overflow-hidden">
            <div className="flex flex-row-reverse items-center justify-center gap-6 sm:gap-20 w-full max-w-5xl">
              <div className="[writing-mode:vertical-rl] [text-orientation:upright] text-[9rem] sm:text-[14rem] font-black font-serif text-white leading-none tracking-[0.1em] opacity-90 drop-shadow-[0_0_60px_rgba(255,255,255,0.1)] select-none shrink-0">
                {ranks[currentFortune.rank]}
              </div>
              <div className="max-h-[60vh] [writing-mode:vertical-rl] [text-orientation:upright] text-stone-300 tracking-[0.5em] font-serif text-sm sm:text-xl leading-relaxed border-l border-white/5 pl-6 sm:pl-16 opacity-80 flex-shrink">
                {currentFortune.summary}
              </div>
            </div>
            <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/5">
                <div className="text-[10px] tracking-[1em] text-white/50 font-light pl-[1em]">{t.swipeForDetails}</div>
              </div>
              <ChevronLeft className="w-5 h-5 text-white/30" />
            </div>
          </section>

        </div>
      )}
    </div>
  );
};