
import { OmikujiFortune, OmikujiRank, StallType } from '../types';
import { RANK_WEIGHTS, FORTUNE_TEMPLATES, FortuneTemplate } from '../constants';

export const generateFortune = (usedHistory: OmikujiFortune[], stallType: StallType): OmikujiFortune => {
  // 1. 隨機生成等級 (Rank)
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

  // 2. 根據攤位類型篩選模板
  const usedSummaries = usedHistory.map(h => h.summary);
  
  // 優先尋找符合主題且未被使用的模板
  let themeTemplates = FORTUNE_TEMPLATES.filter(t => t.theme === stallType && !usedSummaries.includes(t.summary));
  
  let selectedTemplate: FortuneTemplate;

  if (themeTemplates.length > 0) {
    selectedTemplate = themeTemplates[Math.floor(Math.random() * themeTemplates.length)];
  } else {
    // 如果主題模板抽完了，嘗試尋找任何未使用的模板
    let availableTemplates = FORTUNE_TEMPLATES.filter(t => !usedSummaries.includes(t.summary));
    
    if (availableTemplates.length > 0) {
      selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    } else {
      // 徹底抽完了，重置庫並匹配主題
      const backupTemplates = FORTUNE_TEMPLATES.filter(t => t.theme === stallType);
      selectedTemplate = backupTemplates.length > 0 
        ? backupTemplates[Math.floor(Math.random() * backupTemplates.length)]
        : FORTUNE_TEMPLATES[Math.floor(Math.random() * FORTUNE_TEMPLATES.length)];
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    rank: selectedRank,
    timestamp: Date.now(),
    stallType: stallType,
    ...selectedTemplate
  };
};
