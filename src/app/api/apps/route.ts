import { NextRequest, NextResponse } from 'next/server';
import { loadApps, saveApps } from '@/lib/data/yaml';
import { validateApp } from '@/lib/validation';
import { generateId } from '@/lib/utils';
import { App, ApiResponse } from '@/types';

// GET /api/apps - 获取所有应用
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    const apps = await loadApps();
    let filteredItems = apps.items;

    // 按搜索词筛选
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.url.toLowerCase().includes(searchLower)
      );
    }

    const response: ApiResponse = {
      success: true,
      data: {
        ...apps,
        items: filteredItems
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching apps:', error);
    const response: ApiResponse = {
      success: false,
      error: '获取应用失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/apps - 创建新应用
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入数据
    const validation = validateApp(body);
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: validation.errors.join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 加载现有应用
    const apps = await loadApps();

    // 创建新应用
    const newApp: App = {
      id: generateId(),
      name: body.name.trim(),
      url: body.url.trim(),
      icon: body.icon?.trim() || 'app-window',
      description: body.description?.trim() || '',
      category: body.category?.trim() || '',
      isHtmlFile: body.isHtmlFile || false,
      htmlFilePath: body.htmlFilePath || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      private: body.private || false
    };

    // 添加到应用列表
    apps.items.push(newApp);

    // 保存到文件
    const saved = await saveApps(apps);
    if (!saved) {
      const response: ApiResponse = {
        success: false,
        error: '保存应用失败'
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      data: newApp,
      message: '应用创建成功'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating app:', error);
    const response: ApiResponse = {
      success: false,
      error: '创建应用失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/apps - 批量更新应用
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.items || !Array.isArray(body.items)) {
      const response: ApiResponse = {
        success: false,
        error: '无效的应用数据'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 验证所有应用
    for (const item of body.items) {
      const validation = validateApp(item);
      if (!validation.isValid) {
        const response: ApiResponse = {
          success: false,
          error: `应用 "${item.name}" 验证失败: ${validation.errors.join(', ')}`
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // 更新应用数据
    const updatedApps = {
      items: body.items.map((item: App) => ({
        ...item,
        updatedAt: new Date()
      }))
    };

    // 保存到文件
    const saved = await saveApps(updatedApps);
    if (!saved) {
      const response: ApiResponse = {
        success: false,
        error: '保存应用失败'
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      data: updatedApps,
      message: '应用更新成功'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating apps:', error);
    const response: ApiResponse = {
      success: false,
      error: '更新应用失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
