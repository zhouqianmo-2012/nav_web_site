'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadedFile } from '@/types';
import { validateFileUpload } from '@/lib/validation';
import { formatFileSize } from '@/lib/utils';

interface FileUploaderProps {
  onFileUpload: (file: UploadedFile | null) => void;
  uploadedFile: UploadedFile | null;
}

export function FileUploader({ onFileUpload, uploadedFile }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    // 验证文件
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setIsUploading(true);
    
    try {
      // 创建FormData
      const formData = new FormData();
      formData.append('file', file);

      // 上传文件
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        onFileUpload(result.data);
      } else {
        setError(result.error || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    // Reset the uploaded file
    onFileUpload(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (uploadedFile) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              {uploadedFile.originalName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(uploadedFile.size)} • 上传成功
            </p>
          </div>
          
          <button
            onClick={handleRemoveFile}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 拖拽上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          {isUploading ? (
            <div className="w-12 h-12 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
          ) : (
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {isUploading ? '上传中...' : '选择HTML文件'}
            </h3>
            <p className="text-muted-foreground text-sm">
              拖拽文件到此处，或点击选择文件
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              支持 .html 和 .htm 文件，最大 10MB
            </p>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* 文件格式说明 */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          支持的文件格式
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• HTML文件 (.html, .htm)</li>
          <li>• 单文件应用（包含CSS和JavaScript的完整HTML）</li>
          <li>• 静态网页和单页应用</li>
        </ul>
      </div>
    </div>
  );
}
