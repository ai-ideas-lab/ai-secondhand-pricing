import { useState, useCallback } from 'react';
import type { ItemInfo, PriceResult, UploadedImage } from '@/types';

// 模拟AI分析图片
const analyzeImages = async (images: UploadedImage[]): Promise<{
  brand: string;
  model: string;
  category: string;
  condition: number;
}> => {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模拟识别结果（实际项目中这里会调用AI API）
  return {
    brand: '',
    model: '',
    category: 'other',
    condition: images.length > 0 ? 7 : 6,
  };
};

// 计算折旧率
const calculateDepreciation = (itemInfo: ItemInfo): number => {
  const { usageDuration, condition } = itemInfo;
  
  // 基础折旧率
  let depreciationRate = 0;
  
  // 根据使用时长计算折旧
  switch (usageDuration) {
    case 'less-than-3':
      depreciationRate = 0.15;
      break;
    case '3-to-6':
      depreciationRate = 0.25;
      break;
    case '6-to-12':
      depreciationRate = 0.35;
      break;
    case '1-to-2':
      depreciationRate = 0.5;
      break;
    case 'more-than-2':
      depreciationRate = 0.7;
      break;
    default:
      depreciationRate = 0.3;
  }
  
  // 根据成色调整
  const conditionFactor = (10 - condition) / 20; // 0-0.5
  depreciationRate += conditionFactor;
  
  // 限制最大折旧率
  return Math.min(depreciationRate, 0.9);
};

// 获取市场趋势
const getMarketTrend = (category: string): 'rising' | 'stable' | 'falling' => {
  const trends: Record<string, 'rising' | 'stable' | 'falling'> = {
    phone: 'falling',
    computer: 'falling',
    camera: 'stable',
    watch: 'stable',
    game: 'rising',
    clothing: 'falling',
    furniture: 'stable',
    other: 'stable',
  };
  return trends[category] || 'stable';
};

// 生成近期成交数据
const generateRecentDeals = (basePrice: number, category: string) => {
  const platforms =
    category === 'phone'
      ? ['闲鱼', '转转', '京东二手', '爱回收']
      : ['闲鱼', '转转', '京东二手', '淘宝二手'];
  const conditions = ['几乎全新', '成色很好', '正常使用痕迹', '有明显磨损'];
  const deals = [];
  
  for (let i = 0; i < 4; i++) {
    const priceVariation = (Math.random() - 0.5) * 0.3; // ±15%
    const daysAgo = Math.floor(Math.random() * 14) + 1;
    
    deals.push({
      platform: platforms[i],
      price: Math.round(basePrice * (1 + priceVariation)),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      date: `${daysAgo}天前`,
    });
  }
  
  return deals.sort((a, b) => a.price - b.price);
};

// 生成定价依据
const generateReasoning = (itemInfo: ItemInfo, depreciationRate: number): string[] => {
  const reasoning: string[] = [];
  const { brand, model, usageDuration, condition, flaws, purchasePrice } = itemInfo;
  
  // 品牌和型号
  if (brand && model) {
    reasoning.push(`${brand} ${model} 在二手市场流通性较好，保值率中等`);
  }
  
  // 使用时长
  const durationText = {
    'less-than-3': '使用时间短，折旧较少',
    '3-to-6': '使用时间较短，有一定折旧',
    '6-to-12': '使用半年左右，正常折旧',
    '1-to-2': '使用一年以上，折旧明显',
    'more-than-2': '使用两年以上，折旧较大',
  };
  reasoning.push(durationText[usageDuration as keyof typeof durationText] || '根据使用时长评估折旧');
  
  // 成色
  if (condition >= 9) {
    reasoning.push('物品成色接近全新，对价格有正向影响');
  } else if (condition >= 7) {
    reasoning.push('物品成色良好，轻微使用痕迹');
  } else if (condition >= 5) {
    reasoning.push('物品有明显使用痕迹，适当降低估价');
  } else {
    reasoning.push('物品磨损较严重，大幅影响估价');
  }
  
  // 瑕疵
  if (flaws && flaws !== '无') {
    reasoning.push(`存在瑕疵：${flaws}，已根据问题严重程度调整价格`);
  } else {
    reasoning.push('无明显瑕疵，有利于快速成交');
  }
  
  // 原价参考
  if (purchasePrice > 0) {
    const remainingValue = Math.round((1 - depreciationRate) * 100);
    reasoning.push(`综合折旧率约 ${Math.round(depreciationRate * 100)}%，剩余价值约 ${remainingValue}%`);
  }
  
  return reasoning;
};

// 主定价函数
export const calculatePrice = async (
  images: UploadedImage[],
  itemInfo: ItemInfo
): Promise<PriceResult> => {
  // 模拟AI分析
  const analysis = await analyzeImages(images);
  
  // 如果用户没有填写，使用AI分析结果
  const finalInfo = {
    ...itemInfo,
    brand: itemInfo.brand || analysis.brand,
    model: itemInfo.model || analysis.model,
    category: itemInfo.category || analysis.category,
    condition: itemInfo.condition || analysis.condition,
  };
  
  // 计算折旧
  const depreciationRate = calculateDepreciation(finalInfo);
  
  // 基础价格
  let basePrice = finalInfo.purchasePrice;
  
  // 如果没有购买价格，根据品类给一个默认估价
  if (!basePrice || basePrice <= 0) {
    const defaultPrices: Record<string, number> = {
      phone: 3000,
      computer: 5000,
      camera: 4000,
      watch: 2000,
      game: 2500,
      clothing: 500,
      furniture: 1000,
      other: 1500,
    };
    basePrice = defaultPrices[finalInfo.category] || 1500;
  }
  
  // 计算推荐价格
  const recommendedPrice = Math.round(basePrice * (1 - depreciationRate));
  
  // 价格区间
  const minPrice = Math.round(recommendedPrice * 0.85);
  const maxPrice = Math.round(recommendedPrice * 1.15);
  
  // 置信度
  const confidence = Math.min(
    95,
    60 + (finalInfo.purchasePrice > 0 ? 20 : 0) + (finalInfo.brand ? 10 : 0) + (finalInfo.model ? 5 : 0)
  );
  
  // 市场趋势
  const marketTrend = getMarketTrend(finalInfo.category);
  
  // 近期成交
  const recentDeals = generateRecentDeals(recommendedPrice, finalInfo.category);
  
  // 定价依据
  const reasoning = generateReasoning(finalInfo, depreciationRate);
  
  return {
    minPrice,
    recommendedPrice,
    maxPrice,
    confidence,
    marketTrend,
    recentDeals,
    reasoning,
  };
};

// 自定义Hook
export const usePricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (images: UploadedImage[], itemInfo: ItemInfo) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const priceResult = await calculatePrice(images, itemInfo);
      setResult(priceResult);
      return priceResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '估价失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    result,
    error,
    calculate,
    reset,
  };
};

export default usePricing;
