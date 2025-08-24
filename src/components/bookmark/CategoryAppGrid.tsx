'use client';

import { AppCard } from './AppCard';
import { App } from '@/types';

interface CategoryAppGridProps {
  apps: App[];
  openInNewTab?: boolean;
}

export function CategoryAppGrid({
  apps,
  openInNewTab = true
}: CategoryAppGridProps) {
  // 预设分类顺序
  const categoryOrder = [
    '语文', '数学', '英语', '科学', '历史', '地理', 
    '生物', '政治', '动漫', '生活', '音乐', '其他'
  ];

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">还没有应用</p>
        <p className="text-muted-foreground text-sm mt-2">
          点击右上角的&ldquo;上传HTML&rdquo;按钮来添加你的第一个应用
        </p>
      </div>
    );
  }

  // 按分类对应用进行分组
  const groupedApps = apps.reduce((groups: Record<string, App[]>, app) => {
    const category = app.category?.trim() || '其他';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(app);
    return groups;
  }, {});

  // 按预设顺序排序分类，未在预设中的分类放在最后
  const sortedCategories = Object.keys(groupedApps).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    // 如果都在预设列表中，按预设顺序排序
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // 如果只有一个在预设列表中，预设的排在前面
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // 如果都不在预设列表中，按字母顺序排序
    return a.localeCompare(b, 'zh-CN');
  });

  return (
    <div className="space-y-12">
      {sortedCategories.map((category) => {
        const categoryApps = groupedApps[category];
        return (
          <div key={category} className="category-section">
            {/* 分类标题和应用数量 */}
            <div className="flex items-center gap-3 mb-6">
              <h3 className="flare-section-title mb-0">{category}</h3>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {categoryApps.length}
              </span>
            </div>

            {/* 该分类下的应用网格 */}
            <div className="flex flex-wrap gap-3">
              {categoryApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  openInNewTab={openInNewTab}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
