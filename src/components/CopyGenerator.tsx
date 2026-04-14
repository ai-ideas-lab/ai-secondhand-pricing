import React, { useState } from 'react';
import { Copy, Check, RefreshCw, ShoppingBag, Users, Sparkles } from 'lucide-react';
import type { PlatformType, ItemInfo, PriceResult } from '@/types';

interface CopyGeneratorProps {
  itemInfo: ItemInfo;
  priceResult: PriceResult;
}

const platformConfig: Record<PlatformType, {
  name: string;
  icon: React.ElementType;
  className: string;
  description: string;
}> = {
  xianyu: {
    name: '闲鱼风格',
    icon: ShoppingBag,
    className: 'platform-xianyu',
    description: '活泼亲切，emoji丰富',
  },
  zhuanzhuan: {
    name: '转转风格',
    icon: RefreshCw,
    className: 'platform-zhuanzhuan',
    description: '专业简洁，信息清晰',
  },
  moments: {
    name: '朋友圈风格',
    icon: Users,
    className: 'platform-moments',
    description: '生活化，真实感强',
  },
};

// 模拟生成文案的函数
const generateCopy = (platform: PlatformType, itemInfo: ItemInfo, priceResult: PriceResult): string => {
  const { brand, model, condition, flaws, description, usageDuration, purchasePrice } = itemInfo;
  const { recommendedPrice } = priceResult;
  
  const conditionText = condition >= 9 ? '几乎全新' : condition >= 7 ? '成色很好' : condition >= 5 ? '正常使用痕迹' : '有明显磨损';
  const itemName = brand && model ? `${brand} ${model}` : brand || model || '闲置物品';
  
  switch (platform) {
    case 'xianyu':
      return `✨【${itemName}】✨

💰 售价：¥${recommendedPrice}
📦 成色：${conditionText} ${condition}/10
⏰ 使用时长：${usageDuration === 'less-than-3' ? '3个月内' : usageDuration === '3-to-6' ? '3-6个月' : usageDuration === '6-to-12' ? '6-12个月' : usageDuration === '1-to-2' ? '1-2年' : '2年以上'}
${purchasePrice > 0 ? `💳 原价：¥${purchasePrice}` : ''}

📝 物品详情：
${description || '无特殊说明'}

⚠️ 瑕疵说明：
${flaws || '无明显瑕疵'}

🎁 交易方式：
✅ 支持验货
✅ 包邮/自提
✅ 可小刀

📩 感兴趣的话给我留言吧！看到就回～

#闲置 #${brand || '二手'} #${model || '转让'}`;

    case 'zhuanzhuan':
      return `【${itemName}】

价格：¥${recommendedPrice}
成色：${conditionText}（${condition}/10分）
使用时长：${usageDuration === 'less-than-3' ? '3个月内' : usageDuration === '3-to-6' ? '3-6个月' : usageDuration === '6-to-12' ? '6-12个月' : usageDuration === '1-to-2' ? '1-2年' : '2年以上'}
${purchasePrice > 0 ? `购买价格：¥${purchasePrice}` : ''}

物品描述：
${description || '无特殊说明'}

瑕疵说明：
${flaws || '无明显瑕疵'}

交易方式：
- 支持平台验货
- 可邮寄或同城自提
- 价格可商议

欢迎咨询，非诚勿扰。`;

    case 'moments':
      return `清理闲置～

${itemName}，${conditionText}，¥${recommendedPrice}出

${description ? `具体情况：${description}` : ''}
${flaws ? `瑕疵：${flaws}` : '保存得还不错'}

有需要的私聊我哈，价格好商量😊

#断舍离 #闲置转让`;

    default:
      return '';
  }
};

export const CopyGenerator: React.FC<CopyGeneratorProps> = ({
  itemInfo,
  priceResult,
}) => {
  const [activePlatform, setActivePlatform] = useState<PlatformType>('xianyu');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    // 模拟生成延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    const copy = generateCopy(activePlatform, itemInfo, priceResult);
    setGeneratedCopy(copy);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!generatedCopy) return;
    
    try {
      await navigator.clipboard.writeText(generatedCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 首次加载时自动生成
  React.useEffect(() => {
    if (!generatedCopy) {
      handleGenerate();
    }
  }, []);

  // 平台切换时重新生成
  React.useEffect(() => {
    handleGenerate();
  }, [activePlatform]);

  const PlatformIcon = platformConfig[activePlatform].icon;

  return (
    <div className="space-y-4">
      {/* Platform Selector */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">选择平台风格</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(platformConfig) as PlatformType[]).map((platform) => {
            const config = platformConfig[platform];
            const Icon = config.icon;
            const isActive = activePlatform === platform;
            
            return (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-secondary border-2 border-primary'
                    : 'bg-secondary/40 border-2 border-transparent hover:bg-secondary/60'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${config.className} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {config.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generated Copy */}
      <div className="relative">
        <div className="absolute top-3 left-3">
          <div className={`w-8 h-8 rounded-lg ${platformConfig[activePlatform].className} flex items-center justify-center`}>
            <PlatformIcon className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <textarea
          value={generatedCopy}
          readOnly
          className="w-full min-h-[280px] p-4 pl-14 pr-4 rounded-xl bg-secondary/30 border border-border/50 text-sm text-foreground resize-none focus:outline-none"
          placeholder="点击生成按钮创建文案..."
        />

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={!generatedCopy || isGenerating}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5 hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              复制
            </>
          )}
        </button>

        {/* Regenerate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-secondary/80 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? '生成中...' : '重新生成'}
        </button>
      </div>

      {/* Platform Tips */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">{platformConfig[activePlatform].name}</span>
          ：{platformConfig[activePlatform].description}，已为您优化文案风格
        </p>
      </div>
    </div>
  );
};

export default CopyGenerator;
