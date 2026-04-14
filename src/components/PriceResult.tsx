import React from 'react';
import { TrendingUp, TrendingDown, Minus, CheckCircle2, AlertCircle, TrendingUp as TrendingUpIcon, Clock, ShoppingBag } from 'lucide-react';
import type { PriceResult as PriceResultType } from '@/types';

interface PriceResultProps {
  result: PriceResultType;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'rising':
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'falling':
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    default:
      return <Minus className="w-4 h-4 text-yellow-400" />;
  }
};

const getTrendText = (trend: string): string => {
  switch (trend) {
    case 'rising':
      return '价格上涨';
    case 'falling':
      return '价格下跌';
    default:
      return '价格稳定';
  }
};

const getTrendColor = (trend: string): string => {
  switch (trend) {
    case 'rising':
      return 'text-emerald-400';
    case 'falling':
      return 'text-red-400';
    default:
      return 'text-yellow-400';
  }
};

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return 'text-emerald-400';
  if (confidence >= 60) return 'text-yellow-400';
  return 'text-orange-400';
};

export const PriceResult: React.FC<PriceResultProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Main Price Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Min Price */}
        <div className="bg-secondary/40 rounded-xl p-4 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground mb-1">最低价</p>
          <p className="text-lg sm:text-xl font-bold text-foreground">
            {formatPrice(result.minPrice)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">快速出手</p>
        </div>

        {/* Recommended Price */}
        <div className="price-card-recommended rounded-xl p-4 text-center relative glow">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full">
            推荐
          </div>
          <p className="text-xs text-primary/80 mb-1">推荐价</p>
          <p className="text-xl sm:text-2xl font-bold gradient-text">
            {formatPrice(result.recommendedPrice)}
          </p>
          <p className="text-xs text-primary/70 mt-1">性价比最优</p>
        </div>

        {/* Max Price */}
        <div className="bg-secondary/40 rounded-xl p-4 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground mb-1">最高价</p>
          <p className="text-lg sm:text-xl font-bold text-foreground">
            {formatPrice(result.maxPrice)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">耐心等待</p>
        </div>
      </div>

      {/* Market Info */}
      <div className="grid grid-cols-2 gap-3">
        {/* Confidence */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">估价置信度</p>
            <p className={`text-sm font-semibold ${getConfidenceColor(result.confidence)}`}>
              {result.confidence}%
            </p>
          </div>
        </div>

        {/* Market Trend */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUpIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">市场趋势</p>
            <p className={`text-sm font-semibold flex items-center gap-1 ${getTrendColor(result.marketTrend)}`}>
              {getTrendIcon(result.marketTrend)}
              {getTrendText(result.marketTrend)}
            </p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          定价依据
        </h4>
        <ul className="space-y-2">
          {result.reasoning.map((reason, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Deals */}
      {result.recentDeals.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            近期成交参考
          </h4>
          <div className="space-y-2">
            {result.recentDeals.map((deal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{deal.platform}</p>
                    <p className="text-xs text-muted-foreground">{deal.condition} · {deal.date}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(deal.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceResult;
