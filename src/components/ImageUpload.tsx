import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, X, ImageIcon, Clipboard, Camera } from 'lucide-react';
import type { UploadedImage } from '@/types';

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 9,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );

    const remainingSlots = maxImages - images.length;
    const filesToProcess = imageFiles.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: UploadedImage = {
          id: generateId(),
          file,
          preview: e.target?.result as string,
        };
        onImagesChange([...images, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }, [images, onImagesChange, maxImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = ''; // Reset input
  }, [processFiles]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item =>
      item.type.startsWith('image/')
    );

    if (imageItems.length > 0) {
      e.preventDefault();
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      processFiles(dataTransfer.files);
    }
  }, [processFiles]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  const canAddMore = images.length < maxImages;

  return (
    <div ref={containerRef} className="w-full">
      {/* Upload Zone */}
      {canAddMore && (
        <div
          className={`upload-zone rounded-2xl p-8 text-center cursor-pointer ${
            isDragOver ? 'drag-over' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-glow">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                拖拽图片到此处，或点击上传
              </p>
              <p className="text-sm text-muted-foreground">
                支持 JPG、PNG、WebP 格式，最多 {maxImages} 张
              </p>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <Clipboard className="w-3.5 h-3.5" />
                <span>支持粘贴截图</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <Camera className="w-3.5 h-3.5" />
                <span>支持拍照上传</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              已上传 {images.length}/{maxImages} 张
            </span>
            {images.length >= maxImages && (
              <span className="text-xs text-amber-500">
                已达到最大上传数量
              </span>
            )}
          </div>
          
          <div className="image-grid">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-xl overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={image.preview}
                  alt={`上传图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Number */}
                <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
            ))}

            {/* Add More Button */}
            {canAddMore && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs text-muted-foreground">添加</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Paste Tip */}
      {images.length === 0 && (
        <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clipboard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">快捷粘贴</p>
              <p className="text-xs text-muted-foreground mt-1">
                您可以直接截图后按 Ctrl+V 粘贴，或从其他地方复制图片粘贴到这里
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
