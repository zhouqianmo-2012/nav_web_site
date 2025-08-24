'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, RotateCcw, LogOut, Clock } from 'lucide-react';
import { isAdminAuthenticated, clearAdminSession, refreshAdminSession, getSessionRemainingTime } from '@/lib/auth';
import { SiteConfig } from '@/types';
import { GeneralSettings } from './GeneralSettings';
import { ThemeSettings } from './ThemeSettings';
import { WeatherSettings } from './WeatherSettings';
import { AdvancedSettings } from './AdvancedSettings';
import { WebsiteManagement } from './WebsiteManagement';

export function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [sessionTime, setSessionTime] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查认证状态
    const checkAuth = () => {
      const authenticated = isAdminAuthenticated();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        // 未认证，重定向到首页
        window.location.href = '/';
        return;
      }

      // 刷新会话时间
      refreshAdminSession();
      setSessionTime(getSessionRemainingTime());
    };

    checkAuth();
    loadConfig();

    // 定期检查会话状态
    const sessionInterval = setInterval(() => {
      const authenticated = isAdminAuthenticated();
      setIsAuthenticated(authenticated);
      setSessionTime(getSessionRemainingTime());

      if (!authenticated) {
        clearInterval(sessionInterval);
        alert('会话已过期，请重新登录');
        window.location.href = '/';
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(sessionInterval);
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config');
      const result = await response.json();
      
      if (result.success) {
        setConfig(result.data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('设置保存成功！');
      } else {
        alert(`保存失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('确定要重置所有设置为默认值吗？此操作不可撤销。')) {
      await loadConfig();
      alert('设置已重置为默认值');
    }
  };

  const updateConfig = (updates: Partial<SiteConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
    }
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      clearAdminSession();
      window.location.href = '/';
    }
  };

  const tabs = [
    { id: 'general', name: '常规设置', component: GeneralSettings },
    { id: 'websites', name: '网站管理', component: WebsiteManagement },
    { id: 'theme', name: '主题设置', component: ThemeSettings },
    { id: 'weather', name: '天气设置', component: WeatherSettings },
    { id: 'advanced', name: '高级设置', component: AdvancedSettings }
  ];

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralSettings;

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-screen flex flex-col">
        {/* 头部导航 */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
            <h1 className="text-2xl font-bold text-foreground">系统设置</h1>

            {/* 会话状态显示 */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                <Clock className="w-3 h-3" />
                会话剩余: {sessionTime}分钟
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm paper-shadow-hover"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
              退出
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all duration-200 text-sm paper-shadow-hover"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm paper-shadow-hover"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存设置
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-1">
          {/* 侧边栏 */}
          <div className="w-64 bg-card border-r border-border">
            <div className="p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm paper-shadow-hover
                      ${activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              <ActiveComponent
                config={config}
                onConfigChange={updateConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
