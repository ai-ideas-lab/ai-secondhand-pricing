import { useState, useEffect, useCallback } from 'react';
import type { HistoryRecord, ItemInfo, PriceResult, UploadedImage } from '@/types';

const STORAGE_KEY = 'pricing_history';
const MAX_RECORDS = 20;

// 从localStorage加载历史记录
const loadHistory = (): HistoryRecord[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 验证数据结构
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
  
  return [];
};

// 保存历史记录到localStorage
const saveHistory = (records: HistoryRecord[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
};

export const useHistory = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化时加载历史记录
  useEffect(() => {
    const history = loadHistory();
    setRecords(history);
    setIsLoaded(true);
  }, []);

  // 添加新记录
  const addRecord = useCallback((
    images: UploadedImage[],
    itemInfo: ItemInfo,
    priceResult: PriceResult
  ): HistoryRecord => {
    const newRecord: HistoryRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: Date.now(),
      images: images.map(img => img.preview),
      itemInfo,
      priceResult,
    };

    setRecords(prev => {
      const updated = [newRecord, ...prev].slice(0, MAX_RECORDS);
      saveHistory(updated);
      return updated;
    });

    return newRecord;
  }, []);

  // 删除单条记录
  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => {
      const updated = prev.filter(record => record.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  // 清空所有记录
  const clearRecords = useCallback(() => {
    setRecords([]);
    saveHistory([]);
  }, []);

  // 获取单条记录
  const getRecord = useCallback((id: string): HistoryRecord | undefined => {
    return records.find(record => record.id === id);
  }, [records]);

  return {
    records,
    isLoaded,
    addRecord,
    deleteRecord,
    clearRecords,
    getRecord,
  };
};

export default useHistory;
