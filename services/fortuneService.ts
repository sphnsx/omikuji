import { OmikujiFortune, StallType } from '../types';
import { FORTUNES } from '../data/fortunes';

/**
 * Generates a fortune exclusively from the high-quality philosophical pool.
 * Ensure data consistency by strictly importing from data/fortunes.ts.
 */
export const generateFortune = (stallType: StallType): OmikujiFortune => {
  if (!FORTUNES || FORTUNES.length === 0) {
    throw new Error("Fortune pool is empty or not loaded.");
  }

  const randomIndex = Math.floor(Math.random() * FORTUNES.length);
  const selectedEntry = FORTUNES[randomIndex];

  // Append a high-entropy suffix to the ID to ensure fresh rendering and avoid build-stale states
  const uniqueId = `OM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  return {
    id: uniqueId,
    rank: selectedEntry.rank,
    summary: selectedEntry.summary,
    divineMessage: selectedEntry.divineMessage,
    career: selectedEntry.career,
    academic: selectedEntry.academic,
    love: selectedEntry.love,
    health: selectedEntry.health,
    finance: selectedEntry.finance,
    timestamp: Date.now(),
    stallType
  };
};