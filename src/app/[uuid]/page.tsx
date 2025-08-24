import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { loadApps } from '@/lib/data/yaml';

interface UuidPageProps {
  params: Promise<{ uuid: string }>;
}

async function getHtmlContentByUuid(uuid: string): Promise<string | null> {
  try {
    // 首先尝试直接通过文件名查找
    const uploadDir = path.join(process.cwd(), 'data', 'uploads');
    const directFilePath = path.join(uploadDir, `${uuid}.html`);
    
    try {
      await fs.access(directFilePath);
      const content = await fs.readFile(directFilePath, 'utf-8');
      return content;
    } catch {
      // 如果直接文件不存在，从应用数据中查找
      const apps = await loadApps();
      const app = apps.items.find(item =>
        item.isHtmlFile &&
        item.htmlFilePath &&
        (item.htmlFilePath.includes(uuid) || item.id === uuid)
      );

      if (!app || !app.htmlFilePath) {
        return null;
      }

      // 读取HTML文件内容
      const filePath = path.join(process.cwd(), app.htmlFilePath);
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    }
  } catch (error) {
    console.error('Error loading HTML content by UUID:', error);
    return null;
  }
}

export default async function UuidPage({ params }: UuidPageProps) {
  const { uuid } = await params;
  
  // 移除.html后缀（如果存在）
  const cleanUuid = uuid.replace(/\.html$/, '');
  
  // 获取HTML内容
  const htmlContent = await getHtmlContentByUuid(cleanUuid);
  
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
      // 从文件路径中提取UUID
      const fileName = app.htmlFilePath.split(/[/\\]/).pop() || '';
      const uuid = fileName.replace(/\.html$/, '');
      return { uuid };
    });
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
