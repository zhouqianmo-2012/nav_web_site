'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { BootstrapIcon, BOOTSTRAP_ICONS, ICON_CATEGORIES } from './BootstrapIcon';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  onClose: () => void;
}

export function IconSelector({ selectedIcon, onIconSelect, onClose }: IconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('学科');

  // 过滤图标
  const filteredIcons = searchQuery
    ? Object.keys(BOOTSTRAP_ICONS).filter(icon =>
        icon.toLowerCase().includes(searchQuery.toLowerCase()) ||
        BOOTSTRAP_ICONS[icon as keyof typeof BOOTSTRAP_ICONS].toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES] || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-[80vw] h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">选择图标</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索图标..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 分类标签 */}
        {!searchQuery && (
          <div className="px-6 py-4 border-b">
            <div className="flex flex-wrap gap-2">
              {Object.keys(ICON_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 图标网格 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-3">
            {filteredIcons.map((iconName) => (
              <button
                key={iconName}
                onClick={() => onIconSelect(iconName)}
                className={`
                  p-3 rounded-lg border-2 transition-all hover:scale-105
                  ${selectedIcon === iconName
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                title={BOOTSTRAP_ICONS[iconName as keyof typeof BOOTSTRAP_ICONS]}
              >
                <BootstrapIcon name={iconName} size={24} className="text-gray-700" />
              </button>
            ))}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              没有找到匹配的图标
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">当前选择:</span>
              {selectedIcon && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border">
                  <BootstrapIcon name={selectedIcon} size={16} />
                  <span className="text-sm">{BOOTSTRAP_ICONS[selectedIcon as keyof typeof BOOTSTRAP_ICONS]}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onIconSelect(selectedIcon);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
