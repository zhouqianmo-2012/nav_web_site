import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { loadApps } from '@/lib/data/yaml';

interface SubdomainPageProps {
  params: Promise<{ subdomain: string }>;
}

async function getHtmlContent(subdomain: string): Promise<string | null> {
  try {
    // 从应用数据中查找对应的HTML文件
    const apps = await loadApps();
    const app = apps.items.find(item =>
      item.isHtmlFile &&
      item.htmlFilePath &&
      (item.htmlFilePath.includes(subdomain) || item.url.includes(subdomain))
    );

    if (!app || !app.htmlFilePath) {
      return null;
    }

    // 读取HTML文件内容
    const filePath = path.join(process.cwd(), app.htmlFilePath);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error loading HTML content:', error);
    return null;
  }
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain } = await params;
  
  // 获取HTML内容
  const htmlContent = await getHtmlContent(subdomain);
  
  if (!htmlContent) {
    notFound();
  }

  // 直接返回HTML内容
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
  try {
    const apps = await loadApps();
    const htmlApps = apps.items.filter(item => item.isHtmlFile && item.htmlFilePath);

    return htmlApps.map(app => {
      // 从URL或文件路径中提取子域名
      const url = new URL(app.url);
      const subdomain = url.hostname.split('.')[0];
      return { subdomain };
    });
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
