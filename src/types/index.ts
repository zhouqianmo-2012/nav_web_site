// 应用数据模型
export interface App {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
  category?: string;
  isHtmlFile?: boolean;
  htmlFilePath?: string;
  createdAt: Date;
  updatedAt: Date;
  private?: boolean;
}

// 应用集合数据模型
export interface Apps {
  items: App[];
}

// 网站配置模型
export interface SiteConfig {
  title: string;
  description: string;
  theme: string;
  showWeather: boolean;
  location: string;
  openAppNewTab: boolean;
  showTitle: boolean;
  greetings: string;
  showDateTime: boolean;
  showApps: boolean;
  hideSettingButton: boolean;
  hideHelpButton: boolean;
  enableEncryptedLink: boolean;
  iconMode: string;
  keepLetterCase: boolean;
}

// 文件上传相关类型
export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 搜索结果类型
export interface SearchResult {
  apps: App[];
  total: number;
  query: string;
}

// 主题配置类型
export interface ThemeConfig {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardColor: string;
}

// 天气数据类型
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  conditionCode: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

// 用户配置类型
export interface UserPreferences {
  theme: string;
  language: string;
  itemsPerPage: number;
  defaultView: 'grid' | 'list';
  showIcons: boolean;
  showDescriptions: boolean;
}

// 统计数据类型
export interface Statistics {
  totalApps: number;
  totalHtmlFiles: number;
  recentlyAdded: App[];
  mostVisited: App[];
}

// 表单数据类型
export interface AppFormData {
  name: string;
  url: string;
  icon?: string;
  description?: string;
  category?: string;
  isHtmlFile?: boolean;
}

// 编辑器相关类型
export interface EditorData {
  categories: string; // CSV格式的分类数据
  bookmarks: string;  // CSV格式的书签数据
}

// 路由参数类型
export interface SubdomainParams {
  subdomain: string[];
}

// 中间件相关类型
export interface MiddlewareRequest {
  nextUrl: URL;
  headers: Headers;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// 分页类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 排序类型
export interface SortOptions {
  field: keyof App;
  direction: 'asc' | 'desc';
}

// 筛选类型
export interface FilterOptions {
  category?: string;
  search?: string;
  isHtmlFile?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
