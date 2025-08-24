'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, Globe, Settings, Wand2 } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { WebsiteInfoForm } from './WebsiteInfoForm';
import { UploadedFile, AppFormData } from '@/types';
import { generateCleanUUID } from '@/lib/utils';

export function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [websiteInfo, setWebsiteInfo] = useState<AppFormData>({
    name: '',
    url: '',
    icon: 'globe',
    description: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (file: UploadedFile | null) => {
    setUploadedFile(file);

    if (file) {
      // 自动填充网站信息 - 使用新的URL格式
      const uuid = generateCleanUUID();
      setWebsiteInfo({
        name: file.originalName.replace(/\.(html|htm)$/i, ''),
        url: `${window.location.origin}/${uuid}.html`,
        icon: 'file-code',
        description: `上传的HTML文件: ${file.originalName}`,
        category: '其他'
      });
    } else {
      // 重置网站信息
      setWebsiteInfo({
        name: '',
        url: '',
        icon: '',
        description: '',
        category: '',
        isHtmlFile: true
      });
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;

    setIsSubmitting(true);
    try {
      // 创建应用记录
      const appData = {
        ...websiteInfo,
        isHtmlFile: true,
        htmlFilePath: uploadedFile.filePath
      };

      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
      } else {
        alert(`提交失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setWebsiteInfo({
      name: '',
      url: '',
      icon: 'globe',
      description: '',
      category: ''
    });
    setSubmitSuccess(false);
  };

  const handleAIAnalysis = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: uploadedFile.filePath,
          fileName: uploadedFile.originalName
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        const analysis = result.data;
        const uuid = generateCleanUUID();

        setWebsiteInfo({
          name: analysis.name || uploadedFile.originalName.replace(/\.(html|htm)$/i, ''),
          url: analysis.url || `${window.location.origin}/${uuid}.html`,
          icon: analysis.icon || 'file-code',
          description: analysis.description || `上传的HTML文件: ${uploadedFile.originalName}`,
          category: analysis.category || '其他'
        });

        // 显示成功提示
        alert('🎉 AI分析完成！网站信息已自动填充，请检查并根据需要调整。');
      } else {
        alert(`AI分析失败: ${result.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('Error analyzing HTML:', error);
      alert('AI分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 头部导航 */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>

          {/* 成功提示 */}
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              上传成功！
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              您的HTML文件已成功上传并添加到导航页面
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={websiteInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Globe className="w-4 h-4" />
                访问网站
              </a>
              
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                查看导航页
              </Link>
              
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Upload className="w-4 h-4" />
                继续上传
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">上传HTML文件</h1>
        </div>

        {/* 上传步骤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 步骤1: 文件上传 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                uploadedFile ? 'bg-green-100 text-green-600' : 'bg-primary text-primary-foreground'
              }`}>
                1
              </div>
              <h2 className="text-xl font-semibold text-foreground">选择HTML文件</h2>
            </div>
            
            <FileUploader
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
            />
          </div>

          {/* 步骤2: 网站信息 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  uploadedFile ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <h2 className="text-xl font-semibold text-foreground">配置网站信息</h2>
              </div>

              {/* AI分析魔术棒按钮 */}
              {uploadedFile && (
                <button
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl paper-shadow-hover"
                  title="使用AI智能分析HTML内容并自动填充表单"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      AI分析中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 animate-pulse" />
                      AI智能填充
                    </>
                  )}
                </button>
              )}
            </div>
            
            <WebsiteInfoForm
              websiteInfo={websiteInfo}
              onInfoChange={setWebsiteInfo}
              disabled={!uploadedFile}
            />
          </div>
        </div>

        {/* 提交按钮 */}
        {uploadedFile && (
          <div className="mt-12 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !websiteInfo.name.trim()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  提交中...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4" />
                  创建网站
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
