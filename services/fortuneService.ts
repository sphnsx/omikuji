
import { OmikujiFortune, OmikujiRank, StallType } from '../types';
import { RANK_WEIGHTS, FORTUNE_TEXTS } from '../constants';

export const generateFortune = (stallType: StallType): OmikujiFortune => {
  const rand = Math.random();
  let cumulative = 0;
  let selectedRank = OmikujiRank.KICHI;

  for (const [rank, weight] of Object.entries(RANK_WEIGHTS)) {
    cumulative += weight;
    if (rand <= cumulative) {
      selectedRank = rank as OmikujiRank;
      break;
    }
  }

  const template = FORTUNE_TEXTS[stallType];

  return {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    rank: selectedRank,
    timestamp: Date.now(),
    stallType,
    ...template
  };
};
