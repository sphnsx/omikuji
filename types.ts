
export enum OmikujiRank {
  DAIKICHI = '大吉',
  CHUKICHI = '中吉',
  SHOKICHI = '小吉',
  KICHI = '吉',
  HANKICHI = '半吉',
  SUEKICHI = '末吉',
  KYO = '凶',
  DAIKYO = '大凶'
}

export enum StallType {
  TRADITIONAL = 'TRADITIONAL',
  FISHING = 'FISHING',
  WATER = 'WATER',
  FOLDING = 'FOLDING',
  GOLDEN = 'GOLDEN'
}

export interface OmikujiFortune {
  id: string;
  rank: OmikujiRank;
  summary: string;
  career: string;
  academic: string;
  love: string;
  health: string;
  finance: string;
  divineMessage: string;
  timestamp: number;
  stallType: StallType;
}

export enum AppState {
  SELECTING = 'SELECTING',
  INTERACTING = 'INTERACTING',
  SHAKING = 'SHAKING',
  DRAWING = 'DRAWING',
  SHOWING = 'SHOWING',
  DISSOLVING = 'DISSOLVING'
}

export interface GameState {
  status: AppState;
  activeStall: StallType | null;
  currentFortune: OmikujiFortune | null;
  history: OmikujiFortune[];
  isMuted: boolean;
}
