import { NextRequest, NextResponse } from 'next/server';
import { loadConfig, saveConfig } from '@/lib/data/yaml';
import { validateSiteConfig } from '@/lib/validation';
import { ApiResponse } from '@/types';

// GET /api/config - 获取网站配置
export async function GET() {
  try {
    const config = await loadConfig();

    const response: ApiResponse = {
      success: true,
      data: config
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching config:', error);
    const response: ApiResponse = {
      success: false,
      error: '获取配置失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/config - 更新网站配置
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证配置数据
    const validation = validateSiteConfig(body);
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: validation.errors.join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 加载现有配置
    const currentConfig = await loadConfig();

    // 合并配置
    const updatedConfig = {
      ...currentConfig,
      ...body
    };

    // 保存配置
    const saved = await saveConfig(updatedConfig);
    if (!saved) {
      const response: ApiResponse = {
        success: false,
        error: '保存配置失败'
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      data: updatedConfig,
      message: '配置更新成功'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating config:', error);
    const response: ApiResponse = {
      success: false,
      error: '更新配置失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
