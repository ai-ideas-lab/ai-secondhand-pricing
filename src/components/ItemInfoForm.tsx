import React from 'react';
import { Smartphone, Laptop, Camera, Watch, Gamepad2, Shirt, Sofa, MoreHorizontal, Tag, Clock, AlertCircle, FileText, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import type { ItemInfo } from '@/types';

interface ItemInfoFormProps {
  itemInfo: ItemInfo;
  onChange: (info: ItemInfo) => void;
}

const categories = [
  { id: 'phone', name: '手机', icon: Smartphone },
  { id: 'computer', name: '电脑', icon: Laptop },
  { id: 'camera', name: '相机', icon: Camera },
  { id: 'watch', name: '手表', icon: Watch },
  { id: 'game', name: '游戏', icon: Gamepad2 },
  { id: 'clothing', name: '服饰', icon: Shirt },
  { id: 'furniture', name: '家具', icon: Sofa },
  { id: 'other', name: '其他', icon: MoreHorizontal },
];

const usageOptions = [
  { value: 'less-than-3', label: '3个月以内' },
  { value: '3-to-6', label: '3-6个月' },
  { value: '6-to-12', label: '6-12个月' },
  { value: '1-to-2', label: '1-2年' },
  { value: 'more-than-2', label: '2年以上' },
];

const getConditionLabel = (value: number): string => {
  if (value >= 9) return '几乎全新';
  if (value >= 7) return '轻微使用痕迹';
  if (value >= 5) return '明显使用痕迹';
  if (value >= 3) return '较多磨损';
  return '需要维修';
};

const getConditionColor = (value: number): string => {
  if (value >= 9) return 'text-emerald-400';
  if (value >= 7) return 'text-green-400';
  if (value >= 5) return 'text-yellow-400';
  if (value >= 3) return 'text-orange-400';
  return 'text-red-400';
};

export const ItemInfoForm: React.FC<ItemInfoFormProps> = ({
  itemInfo,
  onChange,
}) => {
  const updateField = <K extends keyof ItemInfo>(field: K, value: ItemInfo[K]) => {
    onChange({ ...itemInfo, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          物品类别
        </Label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = itemInfo.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => updateField('category', cat.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand & Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium flex items-center gap-2">
            品牌
          </Label>
          <Input
            id="brand"
            placeholder="如：Apple、Sony、Nike..."
            value={itemInfo.brand}
            onChange={(e) => updateField('brand', e.target.value)}
            className="bg-secondary/50 border-border/50 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium flex items-center gap-2">
            型号
          </Label>
          <Input
            id="model"
            placeholder="如：iPhone 15 Pro、PS5..."
            value={itemInfo.model}
            onChange={(e) => updateField('model', e.target.value)}
            className="bg-secondary/50 border-border/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Purchase Price */}
      <div className="space-y-2">
        <Label htmlFor="purchasePrice" className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          购买价格（元）
        </Label>
        <Input
          id="purchasePrice"
          type="number"
          placeholder="请输入当时的购买价格"
          value={itemInfo.purchasePrice || ''}
          onChange={(e) => updateField('purchasePrice', Number(e.target.value))}
          className="bg-secondary/50 border-border/50 focus:border-primary"
        />
      </div>

      {/* Usage Duration */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          使用时长
        </Label>
        <div className="flex flex-wrap gap-2">
          {usageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('usageDuration', option.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                itemInfo.usageDuration === option.value
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            物品成色
          </Label>
          <span className={`text-sm font-semibold ${getConditionColor(itemInfo.condition)}`}>
            {itemInfo.condition}/10 - {getConditionLabel(itemInfo.condition)}
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-0 condition-slider rounded-full opacity-30" />
          <Slider
            value={[itemInfo.condition]}
            onValueChange={(value) => updateField('condition', value[0])}
            min={1}
            max={10}
            step={1}
            className="relative z-10"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>需要维修</span>
          <span>较多磨损</span>
          <span>明显痕迹</span>
          <span>轻微痕迹</span>
          <span>几乎全新</span>
        </div>
      </div>

      {/* Flaws */}
      <div className="space-y-2">
        <Label htmlFor="flaws" className="text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          瑕疵说明
        </Label>
        <Textarea
          id="flaws"
          placeholder="请描述物品的瑕疵、损坏或问题（如无请填「无」）"
          value={itemInfo.flaws}
          onChange={(e) => updateField('flaws', e.target.value)}
          className="bg-secondary/50 border-border/50 focus:border-primary min-h-[80px] resize-none"
        />
      </div>

      {/* Additional Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          补充描述
        </Label>
        <Textarea
          id="description"
          placeholder="其他需要说明的信息，如配件、包装、购买渠道等..."
          value={itemInfo.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="bg-secondary/50 border-border/50 focus:border-primary min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};

export default ItemInfoForm;
