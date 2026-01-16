
import React from 'react';
import { OmikujiFortune } from '../types';
import { X, Calendar } from 'lucide-react';

interface HistoryPanelProps {
  history: OmikujiFortune[];
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClose }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed right-0 top-0 h-full w-full max-w-xs bg-white border-l-8 border-black z-[101] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b-4 border-black flex justify-between items-center bg-black text-white shadow-[0_4px_0_rgba(0,0,0,0.1)]">
          <h2 className="font-serif font-bold">歷史記錄</h2>
          <button onClick={onClose} className="hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-4 bg-[#fdf6e3]">
          {history.length === 0 ? (
            <div className="text-center py-20 text-stone-400 font-serif italic">
              尚無祭典記錄...
            </div>
          ) : (
            history.map((fortune) => (
              <div key={fortune.id} className="p-4 border-4 border-black bg-white hover:bg-stone-50 transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.1)] group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-red-800 border border-red-800 px-2 py-0.5 text-sm bg-red-50">
                    {fortune.rank}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(fortune.timestamp).toLocaleTimeString('zh-TW')}
                  </span>
                </div>
                <p className="text-sm italic text-stone-700 line-clamp-2 leading-relaxed">
                  「{fortune.summary}」
                </p>
              </div>
            ))
          ).reverse()}
        </div>
      </div>
    </>
  );
};
