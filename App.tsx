
import React, { useState, useCallback } from 'react';
import { AppState, GameState, StallType, OmikujiFortune } from './types';
import { generateFortune } from './services/fortuneService';
import { PixelEnvironment } from './components/ThreeEnvironment';
import { InteractionLayer } from './components/InteractionLayer';
import { UIOverlay } from './components/UIOverlay';
import { HistoryPanel } from './components/HistoryPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: AppState.SELECTING,
    activeStall: null,
    currentFortune: null,
    history: [],
    isMuted: false,
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleSelectStall = useCallback((type: StallType) => {
    setGameState(prev => ({ 
      ...prev, 
      status: AppState.INTERACTING, 
      activeStall: type 
    }));
  }, []);

  const handleFinishInteraction = useCallback(() => {
    const newFortune = generateFortune(
      gameState.history,
      gameState.activeStall || StallType.TRADITIONAL
    );

    setGameState(prev => ({ 
      ...prev, 
      status: AppState.SHOWING, 
      currentFortune: newFortune 
    }));
  }, [gameState.activeStall, gameState.history]);

  const handleConfirmResult = useCallback(() => {
    if (!gameState.currentFortune) return;
    const completedFortune = gameState.currentFortune;
    
    setGameState(prev => ({ ...prev, status: AppState.DISSOLVING }));

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        status: AppState.SELECTING,
        activeStall: null,
        currentFortune: null,
        history: [completedFortune, ...prev.history]
      }));
    }, 850);
  }, [gameState.currentFortune]);

  const handleBackToSelection = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: AppState.SELECTING,
      activeStall: null,
      currentFortune: null
    }));
  }, []);

  return (
    <div className="w-full h-full bg-[#010103] overflow-hidden relative flex flex-col items-center justify-center select-none">
      <PixelEnvironment 
        onSelectStall={handleSelectStall} 
        activeStall={gameState.activeStall}
        isSelecting={gameState.status === AppState.SELECTING}
      />
      
      {gameState.status === AppState.INTERACTING && gameState.activeStall && (
        <InteractionLayer 
          type={gameState.activeStall} 
          onComplete={handleFinishInteraction}
          onCancel={handleBackToSelection}
        />
      )}

      <UIOverlay 
        status={gameState.status}
        activeStall={gameState.activeStall}
        currentFortune={gameState.currentFortune}
        onConfirm={handleConfirmResult}
        onReset={handleBackToSelection}
        onToggleHistory={() => setIsHistoryOpen(true)}
        isMuted={gameState.isMuted}
        onToggleMute={() => setGameState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
        historyCount={gameState.history.length}
      />

      <HistoryPanel 
        history={gameState.history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export default App;
