
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppState, GameState, StallType, OmikujiFortune } from './types';
import { generateFortune } from './services/fortuneService';
import { ThreeEnvironment } from './components/ThreeEnvironment';
import { UIOverlay } from './components/UIOverlay';

// 灵敏度参数优化
const SHAKE_THRESHOLD = 12; // 变化量阈值
const SHAKE_WINDOW = 1000;   // 摇晃动作统计窗口 (ms)
const REQUIRED_SHAKES = 3;   // 窗口内需要的有效摆动次数

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: AppState.SELECTING,
    activeStall: null,
    currentFortune: null,
  });
  const [isShaking, setIsShaking] = useState(false);
  
  // 传感器状态跟踪
  const lastPos = useRef({ x: 0, y: 0, z: 0 });
  const shakeCount = useRef(0);
  const lastShakeTime = useRef(0);
  const shakeTimeoutRef = useRef<number | null>(null);

  const handleStartInteraction = useCallback(() => {
    // 只有在互动状态下才触发结果
    setGameState(prev => {
      if (prev.status !== AppState.INTERACTING || !prev.activeStall) return prev;
      const fortune = generateFortune(prev.activeStall);
      return { 
        ...prev, 
        status: AppState.SHOWING, 
        currentFortune: fortune 
      };
    });
    
    // 触发后清理
    window.removeEventListener('devicemotion', handleMotion);
    setIsShaking(false);
    shakeCount.current = 0;
  }, []);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    // 优先使用 acceleration (不含重力)，回退到 accelerationIncludingGravity
    const acc = event.acceleration || event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    const currentTime = Date.now();
    
    // 计算与上一帧的加速度差值 (Delta)
    const deltaX = Math.abs(acc.x - lastPos.current.x);
    const deltaY = Math.abs(acc.y - lastPos.current.y);
    const deltaZ = Math.abs(acc.z - lastPos.current.z);
    
    // 更新上一帧位置
    lastPos.current = { x: acc.x, y: acc.y, z: acc.z };

    // 如果变化剧烈，视为一次有效摆动
    if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
      // 视觉反馈：摇动 3D 模型
      setIsShaking(true);
      if (shakeTimeoutRef.current) window.clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = window.setTimeout(() => setIsShaking(false), 300);

      // 统计逻辑
      if (currentTime - lastShakeTime.current < SHAKE_WINDOW) {
        shakeCount.current += 1;
        if (shakeCount.current >= REQUIRED_SHAKES) {
          handleStartInteraction();
        }
      } else {
        shakeCount.current = 1;
      }
      lastShakeTime.current = currentTime;
    }
  }, [handleStartInteraction]);

  const handleSelectStall = useCallback((type: StallType) => {
    // iOS 权限请求逻辑
    const dm = DeviceMotionEvent as any;
    if (typeof dm.requestPermission === 'function') {
      dm.requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    setGameState(prev => ({ 
      ...prev, 
      status: AppState.INTERACTING, 
      activeStall: type 
    }));
  }, [handleMotion]);

  const handleFinish = useCallback(() => {
    setGameState(prev => ({ ...prev, status: AppState.DISSOLVING }));
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        status: AppState.SELECTING,
        activeStall: null,
        currentFortune: null,
      }));
    }, 800);
  }, []);

  const handleCancel = useCallback(() => {
    window.removeEventListener('devicemotion', handleMotion);
    setGameState(prev => ({ ...prev, status: AppState.SELECTING, activeStall: null }));
    shakeCount.current = 0;
  }, [handleMotion]);

  useEffect(() => {
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (shakeTimeoutRef.current) window.clearTimeout(shakeTimeoutRef.current);
    };
  }, [handleMotion]);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden select-none">
      <ThreeEnvironment shaking={isShaking} />
      
      {gameState.status === AppState.SELECTING && (
        <div 
          onClick={() => handleSelectStall(StallType.TRADITIONAL)}
          className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group"
        >
          <div className="pointer-events-none text-white/20 text-[10px] tracking-[2em] uppercase transition-opacity duration-1000 group-hover:opacity-100">
            [ 點擊進入神社 ]
          </div>
        </div>
      )}

      <UIOverlay 
        status={gameState.status}
        activeStall={gameState.activeStall}
        currentFortune={gameState.currentFortune}
        onConfirm={gameState.status === AppState.INTERACTING ? handleStartInteraction : handleFinish}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default App;
