// 二手物品智能定价工具 - 类型定义

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export interface ItemInfo {
  brand: string;
  model: string;
  category: string;
  purchasePrice: number;
  usageDuration: string;
  condition: number; // 1-10
  flaws: string;
  description: string;
}

export interface PriceResult {
  minPrice: number;
  recommendedPrice: number;
  maxPrice: number;
  confidence: number; // 0-100
  reasoning: string[];
  marketTrend: 'rising' | 'stable' | 'falling';
  recentDeals: RecentDeal[];
}

export interface RecentDeal {
  platform: string;
  price: number;
  condition: string;
  date: string;
}

export interface GeneratedCopy {
  xianyu: string;
  zhuanzhuan: string;
  moments: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: number;
  images: string[];
  itemInfo: ItemInfo;
  priceResult: PriceResult;
}

export type PlatformType = 'xianyu' | 'zhuanzhuan' | 'moments';

export type AppStep = 'upload' | 'info' | 'result';
