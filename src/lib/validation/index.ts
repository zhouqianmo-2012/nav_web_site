import { App, SiteConfig, AppFormData } from '@/types';
import { isValidUrl, isHtmlFile } from '@/lib/utils';

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 验证应用数据
export function validateApp(data: AppFormData): ValidationResult {
  const errors: string[] = [];

  // 验证名称
  if (!data.name || data.name.trim().length === 0) {
    errors.push('应用名称不能为空');
  } else if (data.name.trim().length > 100) {
    errors.push('应用名称不能超过100个字符');
  }

  // 验证URL
  if (!data.url || data.url.trim().length === 0) {
    errors.push('应用URL不能为空');
  } else if (!isValidUrl(data.url.trim())) {
    errors.push('请输入有效的URL地址');
  }

  // 验证描述长度
  if (data.description && data.description.length > 500) {
    errors.push('描述不能超过500个字符');
  }

  // 验证图标名称
  if (data.icon && data.icon.length > 50) {
    errors.push('图标名称不能超过50个字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}



// 验证网站配置
export function validateSiteConfig(config: Partial<SiteConfig>): ValidationResult {
  const errors: string[] = [];

  // 验证标题
  if (config.title !== undefined) {
    if (!config.title || config.title.trim().length === 0) {
      errors.push('网站标题不能为空');
    } else if (config.title.length > 100) {
      errors.push('网站标题不能超过100个字符');
    }
  }

  // 验证描述
  if (config.description !== undefined && config.description.length > 500) {
    errors.push('网站描述不能超过500个字符');
  }

  // 验证位置
  if (config.location !== undefined && config.location.length > 100) {
    errors.push('位置信息不能超过100个字符');
  }

  // 验证问候语
  if (config.greetings !== undefined && config.greetings.length > 50) {
    errors.push('问候语不能超过50个字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证文件上传
export function validateFileUpload(file: File): ValidationResult {
  const errors: string[] = [];

  // 验证文件类型
  if (!isHtmlFile(file.name)) {
    errors.push('只允许上传HTML文件（.html或.htm）');
  }

  // 验证文件大小（限制为10MB）
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push('文件大小不能超过10MB');
  }

  // 验证文件名
  if (file.name.length > 255) {
    errors.push('文件名不能超过255个字符');
  }

  // 检查文件名中的特殊字符
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(file.name)) {
    errors.push('文件名包含无效字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证搜索查询
export function validateSearchQuery(query: string): ValidationResult {
  const errors: string[] = [];

  // 验证查询长度
  if (query.length > 100) {
    errors.push('搜索查询不能超过100个字符');
  }

  // 检查是否包含危险字符
  const dangerousChars = /<script|javascript:|data:/i;
  if (dangerousChars.test(query)) {
    errors.push('搜索查询包含不安全的内容');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证ID格式
export function validateId(id: string): ValidationResult {
  const errors: string[] = [];

  if (!id || id.trim().length === 0) {
    errors.push('ID不能为空');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    errors.push('ID只能包含字母、数字、下划线和连字符');
  } else if (id.length > 50) {
    errors.push('ID不能超过50个字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证子域名
export function validateSubdomain(subdomain: string): ValidationResult {
  const errors: string[] = [];

  if (!subdomain || subdomain.trim().length === 0) {
    errors.push('子域名不能为空');
  } else if (!/^[a-z0-9-]+$/.test(subdomain)) {
    errors.push('子域名只能包含小写字母、数字和连字符');
  } else if (subdomain.length < 3 || subdomain.length > 20) {
    errors.push('子域名长度必须在3-20个字符之间');
  } else if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
    errors.push('子域名不能以连字符开头或结尾');
  }

  // 检查保留的子域名
  const reservedSubdomains = ['www', 'api', 'admin', 'mail', 'ftp', 'test', 'dev', 'staging'];
  if (reservedSubdomains.includes(subdomain)) {
    errors.push('该子域名为系统保留，请选择其他名称');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 验证HTML内容安全性
export function validateHtmlContent(content: string): ValidationResult {
  const errors: string[] = [];

  // 检查文件大小（字符串长度）
  if (content.length > 1024 * 1024) { // 1MB
    errors.push('HTML内容过大，请压缩后重试');
  }

  // 检查危险的脚本内容
  const dangerousPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi // 事件处理器
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      errors.push('HTML内容包含潜在的安全风险');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 批量验证应用
export function validateApps(apps: App[]): ValidationResult {
  const errors: string[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();

  apps.forEach((app, index) => {
    // 检查ID重复
    if (ids.has(app.id)) {
      errors.push(`第${index + 1}个应用的ID重复: ${app.id}`);
    } else {
      ids.add(app.id);
    }

    // 检查名称重复
    if (names.has(app.name)) {
      errors.push(`第${index + 1}个应用的名称重复: ${app.name}`);
    } else {
      names.add(app.name);
    }

    // 验证单个应用
    const validation = validateApp({
      name: app.name,
      url: app.url,
      icon: app.icon,
      description: app.description,
      category: app.category
    });

    if (!validation.isValid) {
      errors.push(`第${index + 1}个应用验证失败: ${validation.errors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
