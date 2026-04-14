import React from 'react';
import { Clock, Trash2, ChevronRight, Package } from 'lucide-react';
import type { HistoryRecord } from '@/types';

interface HistoryRecordsProps {
  records: HistoryRecord[];
  onClear: () => void;
  onSelect: (record: HistoryRecord) => void;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}天前`;
  }
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
};

const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    phone: '手机',
    computer: '电脑',
    camera: '相机',
    watch: '手表',
    game: '游戏',
    clothing: '服饰',
    furniture: '家具',
    other: '其他',
  };
  return categoryMap[category] || '其他';
};

export const HistoryRecords: React.FC<HistoryRecordsProps> = ({
  records,
  onClear,
  onSelect,
}) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">暂无估价记录</p>
        <p className="text-muted-foreground/60 text-xs mt-1">开始上传物品获取估价吧</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          历史记录 ({records.length})
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          清空
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto hide-scrollbar">
        {records.map((record, index) => (
          <button
            key={record.id}
            onClick={() => onSelect(record)}
            className="w-full history-item flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 text-left animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
              {record.images.length > 0 ? (
                <img
                  src={record.images[0]}
                  alt="物品缩略图"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {record.itemInfo.brand && record.itemInfo.model
                    ? `${record.itemInfo.brand} ${record.itemInfo.model}`
                    : record.itemInfo.brand || record.itemInfo.model || '未命名物品'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {getCategoryName(record.itemInfo.category)}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(record.priceResult.recommendedPrice)}
                </span>
                <span className="text-xs text-muted-foreground">
                  成色 {record.itemInfo.condition}/10
                </span>
              </div>
            </div>

            {/* Time & Arrow */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatTime(record.timestamp)}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryRecords;
