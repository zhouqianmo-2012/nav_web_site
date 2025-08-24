import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { ApiResponse } from '@/types';

interface AnalysisResult {
  name: string;
  url: string;
  description: string;
  icon: string;
  category: string;
}

// POST /api/analyze-html - 分析HTML文件内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath, fileName } = body;

    if (!filePath) {
      const response: ApiResponse = {
        success: false,
        error: '缺少文件路径'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 读取HTML文件内容
    const fullPath = join(process.cwd(), filePath);
    let htmlContent: string;

    try {
      htmlContent = await readFile(fullPath, 'utf-8');
    } catch (_fileError) {
      const response: ApiResponse = {
        success: false,
        error: '无法读取HTML文件'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 调用OpenRouter AI分析
    const analysis = await analyzeHtmlWithAI(htmlContent, fileName);

    const response: ApiResponse<AnalysisResult> = {
      success: true,
      data: analysis
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing HTML:', error);
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : '分析失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

async function analyzeHtmlWithAI(htmlContent: string, fileName: string): Promise<AnalysisResult> {
  const prompt = `请分析以下HTML文件内容，并提供网站信息。文件名：${fileName}

HTML内容：
${htmlContent.substring(0, 8000)} ${htmlContent.length > 8000 ? '...(内容已截断)' : ''}

请根据HTML内容分析并返回以下信息（请用JSON格式回复，不要包含任何其他文字）：
{
  "name": "网站名称（从title标签或主要标题提取，不超过20个字符）",
  "url": "保持原样，不需要修改",
  "description": "网站描述（根据内容总结，不超过50个字符）",
  "icon": "Bootstrap图标名称（从以下选项中选择最合适的一个：book, calculator, globe, file-code, music-note, palette, controller, heart, star, home, user, settings, search, mail, phone, camera, video, image, folder, download, upload, edit, trash, plus, minus, check, x, arrow-right, arrow-left, arrow-up, arrow-down）",
  "category": "网站类别（从以下选项中选择最合适的一个：语文, 数学, 英语, 科学, 历史, 地理, 生物, 政治, 动漫, 生活, 音乐, 其他）"
}

注意：
1. 网站名称要简洁明了，优先从title标签提取
2. 描述要概括网站的主要功能或内容
3. 图标要根据网站类型选择最合适的
4. 类别要根据网站内容选择最匹配的学科或领域`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "HTTP-Referer": "nav-web-site",
        "X-Title": "nav-web-site",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-lite",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "temperature": 0.3,
        "max_tokens": 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('AI响应为空');
    }

    // 尝试解析JSON响应
    let analysisResult: AnalysisResult;
    try {
      // 清理响应，移除可能的markdown代码块标记
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      analysisResult = JSON.parse(cleanResponse);
    } catch (_parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('AI响应格式错误');
    }

    // 验证和清理结果
    return {
      name: analysisResult.name?.substring(0, 20) || fileName.replace(/\.(html|htm)$/i, ''),
      url: '', // 保持空，让前端处理
      description: analysisResult.description?.substring(0, 50) || '网站描述',
      icon: validateIcon(analysisResult.icon) || 'file-code',
      category: validateCategory(analysisResult.category) || '其他'
    };

  } catch (error) {
    console.error('AI analysis error:', error);
    // 返回默认值
    return {
      name: fileName.replace(/\.(html|htm)$/i, ''),
      url: '',
      description: `上传的HTML文件: ${fileName}`,
      icon: 'file-code',
      category: '其他'
    };
  }
}

function validateIcon(icon: string): string | null {
  const validIcons = [
    'book', 'calculator', 'globe', 'file-code', 'music-note', 'palette', 
    'controller', 'heart', 'star', 'home', 'user', 'settings', 'search', 
    'mail', 'phone', 'camera', 'video', 'image', 'folder', 'download', 
    'upload', 'edit', 'trash', 'plus', 'minus', 'check', 'x', 
    'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down'
  ];
  return validIcons.includes(icon) ? icon : null;
}

function validateCategory(category: string): string | null {
  const validCategories = [
    '语文', '数学', '英语', '科学', '历史', '地理', 
    '生物', '政治', '动漫', '生活', '音乐', '其他'
  ];
  return validCategories.includes(category) ? category : null;
}
