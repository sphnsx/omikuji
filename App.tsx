import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppState, GameState, StallType } from './types';
import { generateFortune } from './services/fortuneService';
import { ThreeEnvironment } from './components/ThreeEnvironment';
import { UIOverlay } from './components/UIOverlay';
import { useLanguage } from './context/LanguageContext';
import { strings } from './i18n';

// 正式版變量設定
const SHAKE_THRESHOLD = 20; 

// 工具函數：檢測平台類型
const detectPlatform = (): 'ios' | 'android' | 'desktop' => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
};

// 工具函數：檢查是否有運動權限 API
const hasMotionPermissionAPI = (): boolean => {
  return typeof (DeviceMotionEvent as any).requestPermission === 'function';
};

// 工具函數：測試運動傳感器是否可用
const testMotionSensor = (): Promise<boolean> => {
  return new Promise((resolve) => {
    let resolved = false;
    
    const handler = (event: DeviceMotionEvent) => {
      if (!resolved && event.accelerationIncludingGravity) {
        resolved = true;
        window.removeEventListener('devicemotion', handler);
        resolve(true);
      }
    };
    
    window.addEventListener('devicemotion', handler);
    
    // 1秒超時
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.removeEventListener('devicemotion', handler);
        resolve(false);
      }
    }, 1000);
  });
};

const App: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [gameState, setGameState] = useState<GameState>({
    status: AppState.SELECTING,
    activeStall: null,
    currentFortune: null,
  });
  
  const [isShaking, setIsShaking] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  // 搖晃狀態 Refs
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastZ = useRef(0);
  const lastTime = useRef(0);
  const lockShaking = useRef(false);

  // --- 顯靈儀式函數 (revealFortune) ---
  const revealFortune = useCallback(() => {
    // 1. 隱藏「虔心搖晃」的提示文字
    const shakePrompt = document.getElementById('shake-instruction');
    if (shakePrompt) {
      shakePrompt.style.opacity = '0';
      shakePrompt.style.pointerEvents = 'none';
    }

    // 2. 觸發視覺特效 (讓 Three.js 中的物體開始劇烈晃動)
    setIsShaking(true); 

    // 3. 延遲 0.8 秒後切換到顯示籤文狀態
    setTimeout(() => {
      setGameState(prev => {
        if (!prev.activeStall) return prev;
        const fortune = generateFortune(prev.activeStall);
        return { 
          ...prev, 
          status: AppState.SHOWING, 
          currentFortune: fortune 
        };
      });
      setIsShaking(false);
    }, 800);
  }, []);

  // --- 正式版 handleShake 邏輯 ---
  const handleShake = useCallback((event: DeviceMotionEvent) => {
    if (lockShaking.current) return;

    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const currentTime = new Date().getTime();
    
    // 保持 100ms 的檢測頻率
    if ((currentTime - lastTime.current) > 100) {
        lastTime.current = currentTime;

        const curX = acc.x || 0;
        const curY = acc.y || 0;
        const curZ = acc.z || 0;

        const deltaX = Math.abs(curX - lastX.current);
        const deltaY = Math.abs(curY - lastY.current);
        const deltaZ = Math.abs(curZ - lastZ.current);

        const speed = deltaX + deltaY + deltaZ;

        lastX.current = curX;
        lastY.current = curY;
        lastZ.current = curZ;

        // 調試顯示
        const debugConsole = document.getElementById('debug-console');
        if (debugConsole) {
            debugConsole.innerHTML = `Lvl: ${speed.toFixed(1)} / Thres: ${SHAKE_THRESHOLD}`;
        }

        // 觸發條件
        if (speed > SHAKE_THRESHOLD) {
            lockShaking.current = true; // 上鎖，防止重複觸發
            window.removeEventListener('devicemotion', handleShake);
            revealFortune();
        }
    }
  }, [revealFortune]);

  // 管理監聽器
  useEffect(() => {
    if (gameState.status === AppState.INTERACTING) {
      lockShaking.current = false; 
      window.addEventListener('devicemotion', handleShake);
    } else {
      window.removeEventListener('devicemotion', handleShake);
    }
    return () => window.removeEventListener('devicemotion', handleShake);
  }, [gameState.status, handleShake]);

  // 平台檢測
  useEffect(() => {
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);
  }, []);

  const handleSelectStall = useCallback(async (type: StallType) => {
    const startInteraction = () => {
      setGameState(prev => ({ 
        ...prev, 
        status: AppState.INTERACTING, 
        activeStall: type 
      }));
    };

    // 情況 1: iOS 平台，使用 requestPermission API
    if (platform === 'ios' && hasMotionPermissionAPI()) {
      try {
        const dm = DeviceMotionEvent as any;
        const response = await dm.requestPermission();
        
        if (response === 'granted') {
          // 進一步測試傳感器是否真的可用
          const isAvailable = await testMotionSensor();
          if (isAvailable) {
            setSensorAvailable(true);
            startInteraction();
          } else {
            setSensorAvailable(false);
            alert(strings[language].sensorUnavailable);
          }
        } else {
          alert(strings[language].sensorDenied);
        }
      } catch (error) {
        console.error('Permission request failed:', error);
        alert(strings[language].permissionRequestError);
      }
    }
    
    // 情況 2: Android 平台，需要用戶手動開啟權限
    else if (platform === 'android') {
      // 測試傳感器是否可用
      const isAvailable = await testMotionSensor();
      
      if (isAvailable) {
        setSensorAvailable(true);
        startInteraction();
      } else {
        setSensorAvailable(false);
        setShowPermissionGuide(true); // 顯示權限指引
      }
    }
    
    // 情況 3: 桌面瀏覽器，直接進入（使用直接領取按鈕）
    else {
      setSensorAvailable(false);
      startInteraction();
    }
  }, [platform, language]);

  const handleFinish = useCallback(() => {
    setGameState(prev => ({ ...prev, status: AppState.DISSOLVING }));
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        status: AppState.SELECTING,
        activeStall: null,
        currentFortune: null,
      }));
    }, 1200);
  }, []);

  const handleCancel = useCallback(() => {
    setGameState(prev => ({ ...prev, status: AppState.SELECTING, activeStall: null }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh-TW' ? 'en-GB' : 'zh-TW');
  }, [language, setLanguage]);

  return (
    <div className="w-full h-full bg-[#020108] relative overflow-hidden select-none">
      {/* Language toggle — fixed top-right, accessible */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-[60] pointer-events-auto py-2 px-3 text-[10px] tracking-widest uppercase text-white/40 hover:text-white/80 border border-white/10 hover:border-white/20 transition-colors rounded-sm"
        aria-label={language === 'zh-TW' ? 'Switch to English' : '切換至中文'}
        title={language === 'zh-TW' ? 'English' : '中文'}
      >
        {language === 'zh-TW' ? 'English' : '中文'}
      </button>

      {/* 視覺背景部分 */}
      <ThreeEnvironment shaking={isShaking} />
      
      {/* 首頁 */}
      {gameState.status === AppState.SELECTING && (
        <div id="cover-page" className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-12">
          <div className="text-white/5 text-[10px] tracking-[2em] uppercase animate-pulse font-light">{strings[language].shadowSanctuary}</div>
          <button 
            id="enter-btn"
            onClick={() => handleSelectStall(StallType.TRADITIONAL)}
            className="group relative cursor-pointer text-white/30 text-[13px] tracking-[3em] uppercase transition-all duration-1000 hover:text-white pl-[3em] whitespace-nowrap"
          >
            <span className="relative z-10">{strings[language].enterShrine}</span>
            <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000" />
          </button>
        </div>
      )}

      {/* 互動 UI 層 */}
      <div id="main-page" style={{ display: gameState.status !== AppState.SELECTING ? 'block' : 'none' }}>
        <UIOverlay 
          status={gameState.status}
          activeStall={gameState.activeStall}
          currentFortune={gameState.currentFortune}
          onConfirm={gameState.status === AppState.INTERACTING ? revealFortune : handleFinish}
          onCancel={handleCancel}
          showPermissionGuide={showPermissionGuide}
          onClosePermissionGuide={() => setShowPermissionGuide(false)}
          platform={platform}
        />
      </div>

      {/* 調試控制台 */}
      <div id="debug-console" className="fixed bottom-4 left-4 text-[9px] text-white/5 pointer-events-none font-mono tracking-widest uppercase space-y-1">
        <div>Platform: {platform} | Status: {gameState.status}</div>
        <div>Sensor: {sensorAvailable === null ? 'untested' : sensorAvailable ? 'available' : 'unavailable'}</div>
      </div>
    </div>
  );
};

export default App;
