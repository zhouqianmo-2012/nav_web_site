'use client';

import { App } from '@/types';
import { cn, generateSubdomainUrl } from '@/lib/utils';

interface AppCardProps {
  app: App;
  openInNewTab?: boolean;
  className?: string;
}

export function AppCard({
  app,
  openInNewTab = true,
  className
}: AppCardProps) {

  // 获取链接URL
  const getUrl = () => {
    if (app.isHtmlFile && app.htmlFilePath) {
      // 从文件路径提取UUID（去除.html后缀）
      const fileName = app.htmlFilePath.split(/[/\\]/).pop() || '';
      const uuid = fileName.replace(/\.html$/, '');
      // 使用新的URL格式：/{uuid}.html
      return `${window.location.origin}/${uuid}.html`;
    }
    return app.url;
  };

  const handleClick = () => {
    const url = getUrl();
    if (openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-card border border-border rounded-lg px-4 py-2',
        'paper-shadow paper-shadow-hover hover:border-primary/30 transition-all duration-300',
        'cursor-pointer inline-block',
        'flex items-center justify-center text-center',
        'hover:transform hover:-translate-y-1',
        'h-[36px]', // 固定单行高度
        'min-w-[80px] max-w-[200px]', // 最小和最大宽度
        'whitespace-nowrap', // 防止文字换行
        className
      )}
      onClick={handleClick}
    >
      {/* 仅显示应用名称 */}
      <h3 className="font-medium text-foreground text-sm leading-none truncate">
        {app.name}
      </h3>

      {/* Paper主题悬停效果 */}
      <div className="absolute inset-0 bg-primary/8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
