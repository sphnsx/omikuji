import type { Language } from './types';
import { OmikujiRank } from './types';

const STORAGE_KEY = 'omikuji-lang';

function detectSystemLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en-GB';
  const preferred = navigator.language || (navigator.languages && navigator.languages[0]) || '';
  const languages = [preferred, ...(navigator.languages || [])];
  const hasChinese = languages.some((l) => String(l).toLowerCase().startsWith('zh'));
  return hasChinese ? 'zh-TW' : 'en-GB';
}

export function getLanguage(): Language {
  if (typeof localStorage === 'undefined') return detectSystemLanguage();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'zh-TW' || stored === 'en-GB') return stored;
  return detectSystemLanguage();
}

export function setLanguage(lang: Language): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    const title = lang === 'zh-TW' ? 'Omikuji — 影暗し' : 'Omikuji — Shadow Sanctuary';
    document.title = title;
  }
}

/** Rank display labels per language (British English: -ise, single quotes, em dash with spaces, Oxford comma) */
export const rankLabels: Record<Language, Record<OmikujiRank, string>> = {
  'zh-TW': {
    [OmikujiRank.DAIKICHI]: '大吉',
    [OmikujiRank.CHUKICHI]: '中吉',
    [OmikujiRank.SHOKICHI]: '小吉',
    [OmikujiRank.KICHI]: '吉',
    [OmikujiRank.HANKICHI]: '半吉',
    [OmikujiRank.SUEKICHI]: '末吉',
    [OmikujiRank.KYO]: '凶',
    [OmikujiRank.DAIKYO]: '大凶',
  },
  'en-GB': {
    [OmikujiRank.DAIKICHI]: 'Great Blessing',
    [OmikujiRank.CHUKICHI]: 'Middle Blessing',
    [OmikujiRank.SHOKICHI]: 'Small Blessing',
    [OmikujiRank.KICHI]: 'Blessing',
    [OmikujiRank.HANKICHI]: 'Half Blessing',
    [OmikujiRank.SUEKICHI]: 'Late Blessing',
    [OmikujiRank.KYO]: 'Misfortune',
    [OmikujiRank.DAIKYO]: 'Great Misfortune',
  },
};

/** Category labels for fortune grid: [line1, line2] for vertical layout */
export const categoryLabels: Record<
  Language,
  { career: [string, string]; academic: [string, string]; love: [string, string]; finance: [string, string]; health: [string, string] }
> = {
  'zh-TW': {
    career: ['事', '業'],
    academic: ['學', '問'],
    love: ['姻', '緣'],
    finance: ['財', '富'],
    health: ['健', '康'],
  },
  'en-GB': {
    career: ['Ca', 're'],
    academic: ['St', 'ud'],
    love: ['Lo', 've'],
    finance: ['We', 'al'],
    health: ['He', 'al'],
  },
};

export const strings: Record<Language, {
  shadowSanctuary: string;
  enterShrine: string;
  omikujiDevotion: string;
  shakeDevoutly: string;
  senseHeavenEarth: string;
  receiveDirectly: string;
  leaveForNow: string;
  desktopShakeUnavailable: string;
  androidSensorUnavailable: string;
  permissionRequired: string;
  permissionTitle: string;
  permissionBody: string;
  permissionStepsIntro: string;
  permissionStep1: string;
  permissionStep2: string;
  permissionStep3: string;
  permissionStep4: string;
  permissionRefresh: string;
  permissionBack: string;
  interpretation: [string, string];
  divineMessage: [string, string];
  details: [string, string];
  collapse: [string, string];
  returnToVoid: string;
  swipeForDetails: string;
  sensorDenied: string;
  sensorUnavailable: string;
  permissionRequestError: string;
}> = {
  'zh-TW': {
    shadowSanctuary: 'Shadow Sanctuary',
    enterShrine: '[ 點擊參拜 ]',
    omikujiDevotion: 'Omikuji Devotion',
    shakeDevoutly: '「 虔心搖晃 」',
    senseHeavenEarth: '感應天地，求取神諭',
    receiveDirectly: '直接領取',
    leaveForNow: '[ 暫時離開 ]',
    desktopShakeUnavailable: '桌面瀏覽器無法使用搖籤功能，請直接領取',
    androidSensorUnavailable: '感應器不可用，請點擊下方「直接領取」或開啟權限後重新整理',
    permissionRequired: 'Permission Required',
    permissionTitle: '需要開啟感應器權限',
    permissionBody: 'Chrome 瀏覽器需手動開啟運動感應器權限才能使用搖籤功能。',
    permissionStepsIntro: '請按照以下步驟操作：',
    permissionStep1: '點擊網址列左側的鎖頭圖示',
    permissionStep2: '找到「運動與方向」或「運動感應器」選項',
    permissionStep3: '將其設為「允許」',
    permissionStep4: '重新整理頁面後再次進入',
    permissionRefresh: '我已開啟，重新整理頁面',
    permissionBack: '暫時返回',
    interpretation: ['解', '卦'],
    divineMessage: ['神', '諭'],
    details: ['詳', '解'],
    collapse: ['收', '起'],
    returnToVoid: '歸於虛無',
    swipeForDetails: '右滑揭示詳解',
    sensorDenied: '需要開啟運動感應器權限才能使用搖籤功能。',
    sensorUnavailable: '感應器無法存取，請檢查瀏覽器設定。',
    permissionRequestError: '權限請求出錯，請稍後再試。',
  },
  'en-GB': {
    shadowSanctuary: 'Shadow Sanctuary',
    enterShrine: '[ Enter the shrine ]',
    omikujiDevotion: 'Omikuji Devotion',
    shakeDevoutly: 'Shake devoutly',
    senseHeavenEarth: 'Sense heaven and earth — seek the oracle',
    receiveDirectly: 'Receive directly',
    leaveForNow: '[ Leave for now ]',
    desktopShakeUnavailable: 'Desktop browsers cannot use the shake feature — please receive directly.',
    androidSensorUnavailable: 'Sensor unavailable — tap \'Receive directly\' below or enable permission and refresh.',
    permissionRequired: 'Permission Required',
    permissionTitle: 'Sensor permission required',
    permissionBody: 'Chrome needs the motion sensor permission to be enabled manually for the shake feature.',
    permissionStepsIntro: 'Please follow these steps:',
    permissionStep1: 'Tap the lock icon to the left of the address bar',
    permissionStep2: 'Find \'Motion and orientation\' or \'Motion sensor\'',
    permissionStep3: 'Set it to \'Allow\'',
    permissionStep4: 'Refresh the page and enter again',
    permissionRefresh: 'I\'ve enabled it — refresh page',
    permissionBack: 'Go back for now',
    interpretation: ['In', 'tr'],  // Interpretation
    divineMessage: ['Or', 'ac'],     // Oracle
    details: ['De', 'ts'],           // Details
    collapse: ['Up', '—'],          // Collapse (fold up)
    returnToVoid: 'Return to the void',
    swipeForDetails: 'Swipe left for details',
    sensorDenied: 'Motion sensor permission is required to use the shake feature.',
    sensorUnavailable: 'Sensor could not be accessed — please check browser settings.',
    permissionRequestError: 'Permission request failed — please try again later.',
  },
};
