
import { OmikujiRank, StallType } from './types';

export const RANK_WEIGHTS: Record<OmikujiRank, number> = {
  [OmikujiRank.DAIKICHI]: 0.08,
  [OmikujiRank.CHUKICHI]: 0.15,
  [OmikujiRank.SHOKICHI]: 0.15,
  [OmikujiRank.KICHI]: 0.22,
  [OmikujiRank.HANKICHI]: 0.15,
  [OmikujiRank.SUEKICHI]: 0.15,
  [OmikujiRank.KYO]: 0.08,
  [OmikujiRank.DAIKYO]: 0.02,
};

export interface FortuneTemplate {
  summary: string;
  career: string;
  academic: string;
  love: string;
  health: string;
  finance: string;
  divineMessage: string;
  theme?: StallType; // 指定主題
}

export const FORTUNE_TEMPLATES: FortuneTemplate[] = [
  // TRADITIONAL - 綜合運勢
  {
    theme: StallType.TRADITIONAL,
    summary: "雨過天晴，長久的等待終將迎來回報。",
    career: "新的機遇正在萌芽，切勿畏懼轉變。",
    academic: "專注於基礎，必能突破當前的瓶頸。",
    love: "誠實的溝通能讓現有的關係更加牢固。",
    health: "生機勃勃，正是戶外活動的好時機。",
    finance: "穩健積累，小有斬獲，切忌投機取巧。",
    divineMessage: "隨順季節的律動，萬物自有開花之時。"
  },
  {
    theme: StallType.TRADITIONAL,
    summary: "清風徐來，遠方將傳來令人振奮的好消息。",
    career: "辛勤的耕耘終於得到認可，收穫在即。",
    academic: "溫故而知新，重溫基礎能解開難題。",
    love: "一次意外的邂逅將帶來意想不到的喜悅。",
    health: "休息與工作同等重要，請傾聽身體的聲音。",
    finance: "心懷感激則財富自來，福報更深。",
    divineMessage: "青山原不動，路在腳下延伸。"
  },
  
  // FISHING - 戀愛與人際 (Love focus)
  {
    theme: StallType.FISHING,
    summary: "紅線暗繫，良緣就在不遠處靜候。",
    career: "職場人際和諧，得貴人相助。",
    academic: "與良師益友切磋，進步神速。",
    love: "兩情相悅，是表白或深化關係的大好時機。",
    health: "心情愉悅是最好的良藥，多與親友聚會。",
    finance: "因人成事，與人合作可望獲利。",
    divineMessage: "愛如細水長流，誠心方能動天。"
  },
  {
    theme: StallType.FISHING,
    summary: "蓮理共生，珍惜眼前的相遇與陪伴。",
    career: "適合團隊合作，不宜單打獨鬥。",
    academic: "心神稍顯不定，宜尋求安靜的學習環境。",
    love: "舊情復燃或深入理解，內心感到充實。",
    health: "注意喉嚨與支氣管的保養。",
    finance: "花費於社交應酬較多，但物有所值。",
    divineMessage: "緣分如潮汐，去留自有定時。"
  },

  // WATER - 學業與智慧 (Academic/Mental focus)
  {
    theme: StallType.WATER,
    summary: "靈感泉湧，困惑已久的事物將豁然開朗。",
    career: "策劃與研究工作將有突破性進展。",
    academic: "金榜題名，面試或考試皆有佳績。",
    love: "以理性的眼光看待感情，減少無謂猜忌。",
    health: "多飲清泉，保持思緒清明。",
    finance: "靠智慧致富，適合長期投資規劃。",
    divineMessage: "上善若水，柔能克剛。"
  },
  {
    theme: StallType.WATER,
    summary: "靜水流深，沉穩的積累將爆發強大能量。",
    career: "默默努力的成果，終將被上司看見。",
    academic: "適合鑽研深奧知識，領悟力極高。",
    love: "平淡中見真情，無需華麗的辭藻。",
    health: "睡眠品質提升，體力逐漸恢復。",
    finance: "守成勝於進攻，不宜大動作變更。" ,
    divineMessage: "心如止水，方能映照萬物。"
  },

  // FOLDING - 事業與前程 (Career focus)
  {
    theme: StallType.FOLDING,
    summary: "大展鴻圖，過往的波折化作前進的基石。",
    career: "升職加薪可期，正是展現領導力的時候。",
    academic: "將知識應用於實踐，效率倍增。",
    love: "事業忙碌，需平衡感情生活，以免冷落對方。",
    health: "注意脊椎與坐姿，適度伸展。",
    finance: "多角化經營有成，財源廣進。",
    divineMessage: "登高望遠，方知天地之寬。"
  },
  {
    theme: StallType.FOLDING,
    summary: "層層遞進，只要堅持不懈，高峰就在眼前。",
    career: "創業或轉型的好時機，膽大心細即可成功。",
    academic: "克服弱點學科，整體實力大幅提升。",
    love: "共同的目標讓彼此的心更加緊貼。",
    health: "腸胃消化系統需多加留意，定時定量。",
    finance: "偏財運佳，可能有意外的獎金或紅利。",
    divineMessage: "路雖遠，行則將至。"
  },

  // GOLDEN - 財運與豐盛 (Finance focus)
  {
    theme: StallType.GOLDEN,
    summary: "金玉滿堂，付出的汗水將化作沉甸甸的果實。",
    career: "業務拓展順利，合同簽署水到渠成。",
    academic: "努力終得回報，成績亮眼。",
    love: "物質基礎穩固，感情生活無憂慮。",
    health: "神采奕奕，能量充沛。",
    finance: "財星高照，投資獲利豐厚，適合守財。",
    divineMessage: "知足者富，誠信者昌。"
  },
  {
    theme: StallType.GOLDEN,
    summary: "財源滾滾，把握住當下的每個致富機會。",
    career: "談判無往不利，競爭對手退避三舍。",
    academic: "在經濟或數理領域表現優異。",
    love: "適合贈送禮物表達心意，增進感情。",
    health: "心情爽朗，小疾不藥而癒。",
    finance: "適合進行大宗採購或資產配置。",
    divineMessage: "勤勞為本，節儉為基。"
  }
];

export const COLORS = {
  SHRINE_RED: '#b91c1c',
  WOOD: '#d4a373',
  GOLD: '#facc15',
  DARK: '#1c1917',
  CREAM: '#fafaf9'
};
