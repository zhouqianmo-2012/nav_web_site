'use client';

import { AppCard } from './AppCard';
import { App } from '@/types';

interface AppGridProps {
  apps: App[];
  openInNewTab?: boolean;
}

export function AppGrid({
  apps,
  openInNewTab = true
}: AppGridProps) {

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

  return (
    <div className="flex flex-wrap gap-3">
      {apps.map((app) => (
        <AppCard
          key={app.id}
          app={app}
          openInNewTab={openInNewTab}
        />
      ))}
    </div>
  );
}
