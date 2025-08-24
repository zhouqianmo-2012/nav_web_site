'use client';

import { useState } from 'react';
import { Tag, AlignLeft, Link as LinkIcon, Palette } from 'lucide-react';
import { AppFormData } from '@/types';
import { BootstrapIcon } from '@/components/ui/BootstrapIcon';
import { IconSelector } from '@/components/ui/IconSelector';

interface WebsiteInfoFormProps {
  websiteInfo: AppFormData;
  onInfoChange: (info: AppFormData) => void;
  disabled?: boolean;
}

export function WebsiteInfoForm({ websiteInfo, onInfoChange, disabled = false }: WebsiteInfoFormProps) {
  const [showIconSelector, setShowIconSelector] = useState(false);

  const handleInputChange = (field: keyof AppFormData, value: string) => {
    onInfoChange({
      ...websiteInfo,
      [field]: value
    });
  };

  // 网站类别选项
  const categoryOptions = [
    '语文', '数学', '英语', '科学', '历史', '地理',
    '生物', '政治', '动漫', '生活', '音乐', '其他'
  ];

  return (
    <div className={`space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* AI提示 */}
      {!disabled && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✨</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-900 mb-1">AI智能填充</h4>
              <p className="text-xs text-purple-700">
                点击右上角的&ldquo;AI智能填充&rdquo;按钮，让AI自动分析HTML内容并填充网站信息，省时省力！
              </p>
            </div>
          </div>
        </div>
      )}
      {/* 网站名称 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Tag className="w-4 h-4" />
          网站名称 *
        </label>
        <input
          type="text"
          value={websiteInfo.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="输入网站名称"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          这个名称将显示在导航页面上
        </p>
      </div>

      {/* 访问地址 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          访问地址
        </label>
        <input
          type="url"
          value={websiteInfo.url}
          onChange={(e) => handleInputChange('url', e.target.value)}
          placeholder="https://example.web.zhouqianmo.com"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          系统会自动生成子域名，您也可以自定义
        </p>
      </div>

      {/* 网站描述 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <AlignLeft className="w-4 h-4" />
          网站描述
        </label>
        <textarea
          value={websiteInfo.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="简单描述这个网站的功能或内容"
          rows={3}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          描述将显示在网站卡片下方，帮助用户了解网站内容
        </p>
      </div>

      {/* 网站图标 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Palette className="w-4 h-4" />
          网站图标
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg">
            {websiteInfo.icon && (
              <BootstrapIcon name={websiteInfo.icon} size={20} className="text-primary" />
            )}
            <span className="text-sm text-foreground">
              {websiteInfo.icon || '未选择'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowIconSelector(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            disabled={disabled}
          >
            选择图标
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          从Bootstrap图标库中选择一个图标来代表您的网站
        </p>
      </div>

      {/* 网站类别 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Tag className="w-4 h-4" />
          网站类别
        </label>
        <select
          value={websiteInfo.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          disabled={disabled}
        >
          <option value="">选择类别（可选）</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          选择合适的类别有助于在导航页面中组织和查找
        </p>
      </div>



      {/* 预览卡片 */}
      {websiteInfo.name && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">预览</label>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                {websiteInfo.icon && (
                  <BootstrapIcon name={websiteInfo.icon} size={16} className="text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {websiteInfo.name}
                </h3>
                {websiteInfo.description && (
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                    {websiteInfo.description}
                  </p>
                )}
                {websiteInfo.category && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                    {websiteInfo.category}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
              <LinkIcon className="w-3 h-3" />
              <span className="truncate">自定义域名</span>
            </div>
          </div>
        </div>
      )}

      {/* 图标选择器弹窗 */}
      {showIconSelector && (
        <IconSelector
          selectedIcon={websiteInfo.icon || 'file-code'}
          onIconSelect={(icon) => {
            handleInputChange('icon', icon);
            setShowIconSelector(false);
          }}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </div>
  );
}
