
import { OmikujiRank, StallType } from './types';

export const RANK_WEIGHTS: Record<OmikujiRank, number> = {
  [OmikujiRank.DAIKICHI]: 0.1,
  [OmikujiRank.CHUKICHI]: 0.15,
  [OmikujiRank.SHOKICHI]: 0.15,
  [OmikujiRank.KICHI]: 0.25,
  [OmikujiRank.HANKICHI]: 0.15,
  [OmikujiRank.SUEKICHI]: 0.1,
  [OmikujiRank.KYO]: 0.08,
  [OmikujiRank.DAIKYO]: 0.02,
};

export const FORTUNE_TEXTS = {
  [StallType.TRADITIONAL]: {
    summary: "雨後天晴，萬事如意。",
    career: "守得雲開見月明，會有意外提攜。",
    academic: "功夫不負有心人，基礎最為重要。",
    love: "隨緣而動，不強求反而更美。",
    health: "多行善舉，福氣自來，體質強健。",
    finance: "平穩向上，適合長期儲蓄。",
    divineMessage: "清風拂面，心寬地闊。"
  },
  [StallType.FISHING]: {
    summary: "紅線暗繫，良緣已至。",
    career: "職場人緣極佳，適宜團隊合作。",
    academic: "與良師益友切磋，進步神速。",
    love: "轉身即見良緣，彼此心照不宣。",
    health: "心情愉悅即是長壽之方。",
    finance: "小財不斷，利在人際往來。",
    divineMessage: "情如細水，長流不息。"
  },
  [StallType.WATER]: {
    summary: "思如泉湧，撥雲見日。",
    career: "策劃與研究工作將有重大突破。",
    academic: "考試運勢極佳，思維敏捷。",
    love: "理性的愛能走得更遠。",
    health: "注意水分補充，清心寡欲。",
    finance: "投資眼光獨到，智慧生財。",
    divineMessage: "上善若水，利萬物而不爭。"
  },
  [StallType.FOLDING]: {
    summary: "鴻圖大展，更上一層。",
    career: "職位躍遷之機，勇敢把握。",
    academic: "成績斐然，適合深入學問。",
    love: "互相成就，感情穩定如山。",
    health: "精力充沛，宜戶外鍛鍊。",
    finance: "財星高照，投資回報豐厚。",
    divineMessage: "登高望遠，方知世界廣大。"
  },
  [StallType.GOLDEN]: {
    summary: "五穀豐登，財庫滿盈。",
    career: "業績紅火，深得信任。",
    academic: "碩果累累，知識化為實力。",
    love: "物質與精神皆圓滿。",
    health: "紅光滿面，神采奕奕。",
    finance: "金玉滿堂，正財偏財皆旺。",
    divineMessage: "知足常樂，勤儉致富。"
  }
};
