'use client';

import { useState, useEffect } from 'react';
import { CategoryAppGrid } from '../bookmark/CategoryAppGrid';
import { WeatherWidget } from './WeatherWidget';
import { TopDateTime } from './TopDateTime';
import { Header } from './Header';
import { Apps, SiteConfig } from '@/types';

export function HomePage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [apps, setApps] = useState<Apps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    // 添加页面焦点事件监听，当用户从其他页面返回时刷新数据
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener('focus', handleFocus);

    // 添加存储事件监听，当其他页面修改数据时刷新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'apps-updated') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期刷新数据（每30秒）
    const interval = setInterval(loadData, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // 并行加载配置和应用数据
      const [configRes, appsRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/apps')
      ]);

      const [configData, appsData] = await Promise.all([
        configRes.json(),
        appsRes.json()
      ]);

      if (configData.success) setConfig(configData.data);
      if (appsData.success) setApps(appsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-screen flex flex-col">
        {/* 顶部时间日期 */}
        {config.showDateTime && (
          <TopDateTime />
        )}

        {/* 头部 */}
        {config.showTitle && (
          <Header title={config.title} />
        )}

        {/* 问候语和天气 */}
        {(config.greetings || config.showWeather) && (
          <div className="flare-compact-container flex justify-between items-center gap-4">
            {config.greetings && (
              <div className="text-xl text-primary font-medium">
                {config.greetings}
              </div>
            )}
            {config.showWeather && (
              <WeatherWidget location={config.location} />
            )}
          </div>
        )}

        {/* 应用分类网格 */}
        {config.showApps && apps && (
          <div className="flex-1">
            <div className="flare-container">
              <CategoryAppGrid
                apps={apps.items}
                openInNewTab={config.openAppNewTab}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
