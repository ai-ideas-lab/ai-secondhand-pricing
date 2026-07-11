import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  History, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  RotateCcw,
  Loader2,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { ItemInfoForm } from '@/components/ItemInfoForm';
import { PriceResult } from '@/components/PriceResult';
import { CopyGenerator } from '@/components/CopyGenerator';
import { HistoryRecords } from '@/components/HistoryRecords';
import { usePricing } from '@/hooks/usePricing';
import { useHistory } from '@/hooks/useHistory';
import type { UploadedImage, ItemInfo, AppStep, HistoryRecord } from '@/types';

const defaultItemInfo: ItemInfo = {
  brand: '',
  model: '',
  category: 'other',
  purchasePrice: 0,
  usageDuration: 'less-than-3',
  condition: 7,
  flaws: '',
  description: '',
};

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [itemInfo, setItemInfo] = useState<ItemInfo>(defaultItemInfo);
  const [showHistory, setShowHistory] = useState(false);
  
  const { isLoading, result, calculate, reset: resetPricing } = usePricing();
  const { records, addRecord, clearRecords } = useHistory();

  // 步骤配置
  const steps: { id: AppStep; title: string; icon: React.ElementType }[] = [
    { id: 'upload', title: '上传照片', icon: Upload },
    { id: 'info', title: '补充信息', icon: FileText },
    { id: 'result', title: '获取估价', icon: TrendingUp },
  ];

  // 下一步
  const handleNext = async () => {
    if (currentStep === 'upload') {
      if (images.length === 0) {
        alert('请至少上传一张物品照片');
        return;
      }
      setCurrentStep('info');
    } else if (currentStep === 'info') {
      // 执行估价
      try {
        await calculate(images, itemInfo);
        setCurrentStep('result');
      } catch (error) {
        console.error('估价失败:', error);
      }
    }
  };

  // 上一步
  const handleBack = () => {
    if (currentStep === 'info') {
      setCurrentStep('upload');
    } else if (currentStep === 'result') {
      setCurrentStep('info');
      resetPricing();
    }
  };

  // 重新开始
  const handleReset = () => {
    setImages([]);
    setItemInfo(defaultItemInfo);
    setCurrentStep('upload');
    resetPricing();
  };

  // 加载历史记录
  const handleLoadHistory = (record: HistoryRecord) => {
    setItemInfo(record.itemInfo);
    // 注意：历史记录中的图片是base64字符串，需要转换回UploadedImage格式
    // 这里简化处理，只加载信息
    setCurrentStep('result');
  };

  // 当到达结果页时，自动保存到历史记录
  useEffect(() => {
    if (currentStep === 'result' && result) {
      addRecord(images, itemInfo, result);
    }
  }, [addRecord, currentStep, images, itemInfo, result]);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center glow">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">智能定价助手</h1>
                <p className="text-xs text-muted-foreground">AI 驱动的二手物品估价工具</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                showHistory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">历史记录</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-secondary/30 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground glow'
                          : isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-sm hidden sm:block ${
                        isCurrent ? 'text-foreground font-medium' : isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all ${
                        index < currentStepIndex ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Upload Images */}
            {currentStep === 'upload' && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    上传物品照片
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload images={images} onImagesChange={setImages} />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Item Info */}
            {currentStep === 'info' && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    补充物品信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ItemInfoForm itemInfo={itemInfo} onChange={setItemInfo} />
                </CardContent>
              </Card>
            )}

            {/* Step 3: Result */}
            {currentStep === 'result' && result && (
              <>
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      估价结果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PriceResult result={result} />
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      商品文案生成
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CopyGenerator itemInfo={itemInfo} priceResult={result} />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              {currentStep !== 'upload' ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一步
                </Button>
              ) : (
                <div />
              )}

              {currentStep === 'result' ? (
                <Button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-500"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新估价
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isLoading || (currentStep === 'upload' && images.length === 0)}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-500"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI 分析中...
                    </>
                  ) : (
                    <>
                      {currentStep === 'upload' ? '开始估价' : '获取估价'}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - History */}
          <div className={`${showHistory ? 'block' : 'hidden lg:block'}`}>
            <Card className="border-border/50 bg-card/50 backdrop-blur sticky top-24">
              <CardContent className="p-4">
                <HistoryRecords
                  records={records}
                  onClear={clearRecords}
                  onSelect={handleLoadHistory}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            智能定价助手 · 让二手交易更简单
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            估价结果仅供参考，实际价格以市场为准
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
