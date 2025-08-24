'use client';

import { SiteConfig } from '@/types';

interface WeatherSettingsProps {
  config: SiteConfig;
  onConfigChange: (updates: Partial<SiteConfig>) => void;
}

export function WeatherSettings({ config, onConfigChange }: WeatherSettingsProps) {
  const commonCities = [
    '北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市',
    '成都市', '武汉市', '西安市', '重庆市', '天津市', '苏州市'
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">天气设置</h2>
        <p className="text-muted-foreground mb-6">
          配置天气信息的显示和位置设置
        </p>
      </div>

      {/* 天气开关 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">天气显示</h3>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={config.showWeather}
            onChange={(e) => onConfigChange({ showWeather: e.target.checked })}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
          />
          <div>
            <span className="text-sm text-foreground">启用天气显示</span>
            <p className="text-xs text-muted-foreground">在页面顶部显示当前天气信息</p>
          </div>
        </label>
      </div>

      {/* 位置设置 */}
      {config.showWeather && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">位置设置</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              城市名称
            </label>
            <input
              type="text"
              value={config.location}
              onChange={(e) => onConfigChange({ location: e.target.value })}
              className="w-full max-w-md px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="输入城市名称"
            />
            <p className="text-xs text-muted-foreground">
              输入您所在的城市名称，例如：北京市、上海市
            </p>
          </div>

          {/* 常用城市快速选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              快速选择
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {commonCities.map((city) => (
                <button
                  key={city}
                  onClick={() => onConfigChange({ location: city })}
                  className={`
                    px-3 py-2 text-sm rounded-lg border transition-colors
                    ${config.location === city
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:border-primary/50'
                    }
                  `}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 天气信息说明 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">说明</h3>
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">关于天气数据</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 天气数据来源于公开的天气API服务</li>
            <li>• 数据更新频率约为每小时一次</li>
            <li>• 支持全国主要城市的天气查询</li>
            <li>• 显示内容包括温度、天气状况、湿度和风速</li>
          </ul>
        </div>
      </div>

      {/* 天气预览 */}
      {config.showWeather && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">预览</h3>
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">☀️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">22°C</div>
                <div className="text-sm text-muted-foreground">晴朗</div>
              </div>
              <div className="border-l border-border pl-4 ml-4">
                <div className="text-sm text-muted-foreground mb-1">{config.location}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>湿度 65%</span>
                  <span>风速 12km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
