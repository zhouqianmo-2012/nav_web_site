'use client';

import { SiteConfig } from '@/types';

interface GeneralSettingsProps {
  config: SiteConfig;
  onConfigChange: (updates: Partial<SiteConfig>) => void;
}

export function GeneralSettings({ config, onConfigChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">常规设置</h2>
        <p className="text-muted-foreground mb-6">
          配置网站的基本信息和显示选项
        </p>
      </div>

      {/* 网站标题 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          网站标题
        </label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onConfigChange({ title: e.target.value })}
          className="w-full max-w-md px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          placeholder="输入网站标题"
        />
        <p className="text-xs text-muted-foreground">
          显示在页面顶部的网站标题
        </p>
      </div>

      {/* 网站描述 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          网站描述
        </label>
        <textarea
          value={config.description}
          onChange={(e) => onConfigChange({ description: e.target.value })}
          rows={3}
          className="w-full max-w-md px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          placeholder="输入网站描述"
        />
        <p className="text-xs text-muted-foreground">
          网站的简短描述，用于SEO和页面元信息
        </p>
      </div>

      {/* 问候语 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          问候语
        </label>
        <input
          type="text"
          value={config.greetings}
          onChange={(e) => onConfigChange({ greetings: e.target.value })}
          className="w-full max-w-md px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          placeholder="输入问候语"
        />
        <p className="text-xs text-muted-foreground">
          显示在时间下方的问候语，留空则自动根据时间显示
        </p>
      </div>

      {/* 显示选项 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">显示选项</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.showTitle}
              onChange={(e) => onConfigChange({ showTitle: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm text-foreground">显示网站标题</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.showDateTime}
              onChange={(e) => onConfigChange({ showDateTime: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm text-foreground">显示日期时间</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.showWeather}
              onChange={(e) => onConfigChange({ showWeather: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm text-foreground">显示天气信息</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.showApps}
              onChange={(e) => onConfigChange({ showApps: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm text-foreground">显示应用列表</span>
          </label>
        </div>
      </div>

      {/* 链接行为 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">链接行为</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.openAppNewTab}
              onChange={(e) => onConfigChange({ openAppNewTab: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <span className="text-sm text-foreground">在新标签页中打开应用</span>
          </label>
        </div>
      </div>
    </div>
  );
}
