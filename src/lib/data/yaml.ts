import * as yaml from 'js-yaml';
import { promises as fs } from 'fs';
import path from 'path';
import { Apps, SiteConfig } from '@/types';

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), 'data');
const APPS_FILE = path.join(DATA_DIR, 'apps.yml');
const CONFIG_FILE = path.join(DATA_DIR, 'config.yml');

// 确保数据目录存在
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 检查文件是否存在
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// 读取YAML文件
async function readYamlFile<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return yaml.load(content) as T;
  } catch (error) {
    console.error(`Error reading YAML file ${filePath}:`, error);
    return null;
  }
}

// 写入YAML文件
async function writeYamlFile<T>(filePath: string, data: T): Promise<boolean> {
  try {
    await ensureDataDir();
    const yamlContent = yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false
    });
    await fs.writeFile(filePath, yamlContent, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing YAML file ${filePath}:`, error);
    return false;
  }
}



// 创建默认应用数据
function createDefaultApps(): Apps {
  return {
    items: [
      {
        id: 'app-1',
        name: '示例应用',
        url: 'https://app.example.com',
        icon: 'app-window',
        description: '这是一个示例应用',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  };
}

// 创建默认配置
function createDefaultConfig(): SiteConfig {
  return {
    title: '周千墨HTML导航页',
    description: '个人HTML应用导航',
    theme: 'blackboard',
    showWeather: true,
    location: '北京市',
    openAppNewTab: true,
    showTitle: true,
    greetings: '你好',
    showDateTime: true,
    showApps: true,
    hideSettingButton: false,
    hideHelpButton: false,
    enableEncryptedLink: false,
    iconMode: 'DEFAULT',
    keepLetterCase: false
  };
}

// 读取应用数据
export async function loadApps(): Promise<Apps> {
  await ensureDataDir();
  
  if (!(await fileExists(APPS_FILE))) {
    const defaultData = createDefaultApps();
    await writeYamlFile(APPS_FILE, defaultData);
    return defaultData;
  }
  
  const data = await readYamlFile<Apps>(APPS_FILE);
  return data || createDefaultApps();
}

// 保存应用数据
export async function saveApps(apps: Apps): Promise<boolean> {
  return await writeYamlFile(APPS_FILE, apps);
}

// 读取配置数据
export async function loadConfig(): Promise<SiteConfig> {
  await ensureDataDir();
  
  if (!(await fileExists(CONFIG_FILE))) {
    const defaultData = createDefaultConfig();
    await writeYamlFile(CONFIG_FILE, defaultData);
    return defaultData;
  }
  
  const data = await readYamlFile<SiteConfig>(CONFIG_FILE);
  return data || createDefaultConfig();
}

// 保存配置数据
export async function saveConfig(config: SiteConfig): Promise<boolean> {
  return await writeYamlFile(CONFIG_FILE, config);
}

// 备份数据文件
export async function backupData(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(DATA_DIR, 'backups', timestamp);
  
  await fs.mkdir(backupDir, { recursive: true });
  
  const files = [APPS_FILE, CONFIG_FILE];
  
  for (const file of files) {
    if (await fileExists(file)) {
      const fileName = path.basename(file);
      await fs.copyFile(file, path.join(backupDir, fileName));
    }
  }
  
  return backupDir;
}

// 恢复数据文件
export async function restoreData(backupPath: string): Promise<boolean> {
  try {
    const files = ['apps.yml', 'config.yml'];
    
    for (const file of files) {
      const backupFile = path.join(backupPath, file);
      const targetFile = path.join(DATA_DIR, file);
      
      if (await fileExists(backupFile)) {
        await fs.copyFile(backupFile, targetFile);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error restoring data:', error);
    return false;
  }
}
