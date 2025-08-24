'use client';

import { SiteConfig } from '@/types';

interface ThemeSettingsProps {
  config: SiteConfig;
  onConfigChange: (updates: Partial<SiteConfig>) => void;
}

export function ThemeSettings({ config, onConfigChange }: ThemeSettingsProps) {
  const themes = [
    { id: 'blackboard', name: '黑板', description: '深色主题，适合夜间使用' },
    { id: 'light', name: '明亮', description: '浅色主题，适合白天使用' },
    { id: 'auto', name: '自动', description: '根据系统设置自动切换' }
  ];

  const iconModes = [
    { id: 'DEFAULT', name: '默认', description: '使用默认图标样式' },
    { id: 'ORIGINAL', name: '原始', description: '使用原始图标' },
    { id: 'SIMPLE', name: '简洁', description: '使用简洁图标样式' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">主题设置</h2>
        <p className="text-muted-foreground mb-6">
          自定义网站的外观和视觉效果
        </p>
      </div>

      {/* 主题选择 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">主题</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`
                p-4 border rounded-lg cursor-pointer transition-colors
                ${config.theme === theme.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
                }
              `}
              onClick={() => onConfigChange({ theme: theme.id })}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`
                    w-4 h-4 rounded-full border-2
                    ${config.theme === theme.id
                      ? 'border-primary bg-primary'
                      : 'border-border'
                    }
                  `}
                />
                <h4 className="font-medium text-foreground">{theme.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 图标模式 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">图标模式</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {iconModes.map((mode) => (
            <div
              key={mode.id}
              className={`
                p-4 border rounded-lg cursor-pointer transition-colors
                ${config.iconMode === mode.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
                }
              `}
              onClick={() => onConfigChange({ iconMode: mode.id })}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`
                    w-4 h-4 rounded-full border-2
                    ${config.iconMode === mode.id
                      ? 'border-primary bg-primary'
                      : 'border-border'
                    }
                  `}
                />
                <h4 className="font-medium text-foreground">{mode.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 其他选项 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">其他选项</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.keepLetterCase}
              onChange={(e) => onConfigChange({ keepLetterCase: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <div>
              <span className="text-sm text-foreground">保持字母大小写</span>
              <p className="text-xs text-muted-foreground">保持应用名称的原始大小写格式</p>
            </div>
          </label>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">预览</h3>
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary font-semibold">A</span>
            </div>
            <div>
              <h4 className="font-medium text-foreground">示例应用</h4>
              <p className="text-sm text-muted-foreground">这是一个示例应用的预览</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            当前主题: {themes.find(t => t.id === config.theme)?.name} | 
            图标模式: {iconModes.find(m => m.id === config.iconMode)?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
