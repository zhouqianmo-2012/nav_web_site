'use client';

import { useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { SiteConfig } from '@/types';

interface AdvancedSettingsProps {
  config: SiteConfig;
  onConfigChange: (updates: Partial<SiteConfig>) => void;
}

export function AdvancedSettings({ config, onConfigChange }: AdvancedSettingsProps) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      // 导出配置和应用数据
      const [configRes, appsRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/apps')
      ]);

      const [configData, appsData] = await Promise.all([
        configRes.json(),
        appsRes.json()
      ]);

      const exportData = {
        config: configData.data,
        apps: appsData.data,
        exportTime: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nav-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('数据导出成功！');
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // 验证数据格式
      if (!importData.config || !importData.apps) {
        throw new Error('无效的备份文件格式');
      }

      if (confirm('导入数据将覆盖当前所有设置和应用，确定要继续吗？')) {
        // 导入配置
        await fetch('/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(importData.config)
        });

        // 导入应用
        await fetch('/api/apps', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(importData.apps)
        });

        alert('数据导入成功！页面将刷新以应用新设置。');
        window.location.reload();
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('导入失败，请检查文件格式');
    } finally {
      setImporting(false);
      // 清空文件输入
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">高级设置</h2>
        <p className="text-muted-foreground mb-6">
          系统级配置和数据管理选项
        </p>
      </div>

      {/* 系统选项 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">系统选项</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!config.hideSettingButton}
              onChange={(e) => onConfigChange({ hideSettingButton: !e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <div>
              <span className="text-sm text-foreground">显示设置按钮</span>
              <p className="text-xs text-muted-foreground">在页面头部显示设置按钮</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!config.hideHelpButton}
              onChange={(e) => onConfigChange({ hideHelpButton: !e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <div>
              <span className="text-sm text-foreground">显示帮助按钮</span>
              <p className="text-xs text-muted-foreground">在页面头部显示帮助按钮</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.enableEncryptedLink}
              onChange={(e) => onConfigChange({ enableEncryptedLink: e.target.checked })}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-ring focus:ring-2"
            />
            <div>
              <span className="text-sm text-foreground">启用加密链接</span>
              <p className="text-xs text-muted-foreground">对外部链接进行加密处理</p>
            </div>
          </label>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">数据管理</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 导出数据 */}
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">导出数据</h4>
            <p className="text-sm text-muted-foreground mb-4">
              导出所有配置和应用数据到JSON文件
            </p>
            <button
              onClick={handleExportData}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  导出数据
                </>
              )}
            </button>
          </div>

          {/* 导入数据 */}
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">导入数据</h4>
            <p className="text-sm text-muted-foreground mb-4">
              从JSON文件导入配置和应用数据
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 cursor-pointer transition-colors">
              {importing ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  导入中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  选择文件
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 危险操作 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          危险操作
        </h3>
        
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">重置所有数据</h4>
          <p className="text-sm text-muted-foreground mb-4">
            这将删除所有应用、配置和上传的文件，恢复到初始状态。此操作不可撤销！
          </p>
          <button
            onClick={() => {
              if (confirm('确定要重置所有数据吗？此操作将删除所有内容且不可撤销！')) {
                if (confirm('最后确认：这将删除所有数据，确定要继续吗？')) {
                  alert('重置功能暂未实现，请联系管理员');
                }
              }
            }}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            重置所有数据
          </button>
        </div>
      </div>

      {/* 系统信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">系统信息</h3>
        
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">系统版本:</span>
              <span className="ml-2 text-foreground">1.0.0</span>
            </div>
            <div>
              <span className="text-muted-foreground">构建时间:</span>
              <span className="ml-2 text-foreground">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">技术栈:</span>
              <span className="ml-2 text-foreground">Next.js + TypeScript</span>
            </div>
            <div>
              <span className="text-muted-foreground">数据存储:</span>
              <span className="ml-2 text-foreground">YAML 文件</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
