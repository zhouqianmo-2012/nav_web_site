'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Eye } from 'lucide-react';
import { App, SiteConfig } from '@/types';
import { BootstrapIcon } from '@/components/ui/BootstrapIcon';
import { IconSelector } from '@/components/ui/IconSelector';

interface WebsiteManagementProps {
  config: SiteConfig;
  onConfigChange: (updates: Partial<SiteConfig>) => void;
}

export function WebsiteManagement({ config: _config, onConfigChange: _onConfigChange }: WebsiteManagementProps) {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // 网站类别选项
  const categoryOptions = [
    '语文', '数学', '英语', '科学', '历史', '地理', 
    '生物', '政治', '动漫', '生活', '音乐', '其他'
  ];

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/apps');
      const result = await response.json();
      
      if (result.success) {
        setApps(result.data.items || []);
      }
    } catch (error) {
      console.error('Error loading apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApp = async (app: App) => {
    try {
      const response = await fetch('/api/apps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: apps.map(a => a.id === app.id ? app : a)
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setApps(apps.map(a => a.id === app.id ? app : a));
        setEditingApp(null);

        // 触发主页数据刷新
        localStorage.setItem('apps-updated', Date.now().toString());
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'apps-updated',
          newValue: Date.now().toString()
        }));

        alert('网站信息更新成功！');
      } else {
        alert(`更新失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating app:', error);
      alert('更新失败，请重试');
    }
  };

  const handleDeleteApp = async (appId: string) => {
    if (confirm('确定要删除这个网站吗？此操作不可撤销。')) {
      try {
        const updatedApps = apps.filter(a => a.id !== appId);
        const response = await fetch('/api/apps', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: updatedApps
          })
        });

        const result = await response.json();
        
        if (result.success) {
          setApps(updatedApps);

          // 触发主页数据刷新
          localStorage.setItem('apps-updated', Date.now().toString());
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'apps-updated',
            newValue: Date.now().toString()
          }));

          alert('网站删除成功！');
        } else {
          alert(`删除失败: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting app:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleAddApp = async (newApp: Partial<App>) => {
    try {
      const app: App = {
        id: `app_${Date.now()}`,
        name: newApp.name || '',
        url: newApp.url || '',
        icon: newApp.icon || 'file-code',
        description: newApp.description || '',
        category: newApp.category || '',
        isHtmlFile: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedApps = [...apps, app];
      const response = await fetch('/api/apps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: updatedApps
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setApps(updatedApps);
        setShowAddForm(false);

        // 触发主页数据刷新
        localStorage.setItem('apps-updated', Date.now().toString());
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'apps-updated',
          newValue: Date.now().toString()
        }));

        alert('网站添加成功！');
      } else {
        alert(`添加失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding app:', error);
      alert('添加失败，请重试');
    }
  };

  // 过滤应用
  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">网站数据管理</h2>
        <p className="text-muted-foreground mb-6">
          管理已添加的HTML网站，可以修改网站信息、图标和类别
        </p>
      </div>

      {/* 搜索和添加 */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索网站..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加网站
        </button>
      </div>

      {/* 网站列表 */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? '没有找到匹配的网站' : '还没有添加任何网站'}
          </div>
        ) : (
          filteredApps.map((app) => (
            <div key={app.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {app.icon && (
                      <BootstrapIcon name={app.icon} size={24} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{app.name}</h3>
                    {app.description && (
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {app.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {app.category}
                        </span>
                      )}
                      {app.isHtmlFile && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          HTML文件
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(app.url, '_blank')}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="预览网站"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingApp(app)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteApp(app.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑弹窗 */}
      {editingApp && (
        <EditAppModal
          app={editingApp}
          categoryOptions={categoryOptions}
          onSave={handleSaveApp}
          onCancel={() => setEditingApp(null)}
          onShowIconSelector={() => setShowIconSelector(true)}
        />
      )}

      {/* 添加弹窗 */}
      {showAddForm && (
        <AddAppModal
          categoryOptions={categoryOptions}
          onAdd={handleAddApp}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* 图标选择器 */}
      {showIconSelector && editingApp && (
        <IconSelector
          selectedIcon={editingApp.icon || 'file-code'}
          onIconSelect={(icon) => {
            setEditingApp({ ...editingApp, icon });
            setShowIconSelector(false);
          }}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </div>
  );
}

// 编辑应用模态框
function EditAppModal({
  app,
  categoryOptions,
  onSave,
  onCancel,
  onShowIconSelector
}: {
  app: App;
  categoryOptions: string[];
  onSave: (app: App) => void;
  onCancel: () => void;
  onShowIconSelector: () => void;
}) {
  const [formData, setFormData] = useState(app);

  // 当app发生变化时同步到formData（比如图标选择器更新了app）
  useEffect(() => {
    setFormData(app);
  }, [app]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">编辑网站</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">网站名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">网站描述</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">网站图标</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                  {formData.icon && (
                    <BootstrapIcon name={formData.icon} size={20} />
                  )}
                  <span className="text-sm">{formData.icon || '未选择'}</span>
                </div>
                <button
                  type="button"
                  onClick={onShowIconSelector}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  选择
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">网站类别</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择类别</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={() => onSave(formData)}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 添加应用模态框
function AddAppModal({
  categoryOptions,
  onAdd,
  onCancel
}: {
  categoryOptions: string[];
  onAdd: (app: Partial<App>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: 'file-code',
    description: '',
    category: ''
  });
  const [showIconSelector, setShowIconSelector] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">添加网站</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">网站名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入网站名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">网站URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">网站描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="简单描述网站内容"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">网站图标</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                  {formData.icon && (
                    <BootstrapIcon name={formData.icon} size={20} />
                  )}
                  <span className="text-sm">{formData.icon || '未选择'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIconSelector(true)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  选择
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">网站类别</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择类别</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={() => onAdd(formData)}
              disabled={!formData.name || !formData.url}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      {/* 图标选择器 */}
      {showIconSelector && (
        <IconSelector
          selectedIcon={formData.icon || 'file-code'}
          onIconSelect={(icon) => {
            setFormData({ ...formData, icon });
            setShowIconSelector(false);
          }}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </div>
  );
}
