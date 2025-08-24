import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validateFileUpload } from '@/lib/validation';
import { generateCleanUUID, sanitizeFileName } from '@/lib/utils';
import { ApiResponse, UploadedFile } from '@/types';

// 确保上传目录存在
async function ensureUploadDir(): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'data', 'uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
}

// POST /api/upload - 上传HTML文件
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      const response: ApiResponse = {
        success: false,
        error: '没有选择文件'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 验证文件
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: validation.errors.join(', ')
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(buffer);

    // 注意：已移除HTML内容安全验证，允许上传任何HTML内容

    // 确保上传目录存在
    const uploadDir = await ensureUploadDir();

    // 生成文件名 - 使用UUID作为文件ID
    const fileId = generateCleanUUID();
    const sanitizedName = sanitizeFileName(file.name);
    const fileName = `${fileId}.html`; // 直接使用UUID.html格式
    const filePath = path.join(uploadDir, fileName);

    // 保存文件
    await fs.writeFile(filePath, content, 'utf-8');

    // 创建上传文件记录
    const uploadedFile: UploadedFile = {
      id: fileId,
      originalName: file.name,
      fileName: fileName,
      filePath: path.relative(process.cwd(), filePath),
      size: file.size,
      mimeType: file.type || 'text/html',
      uploadedAt: new Date()
    };

    const response: ApiResponse<UploadedFile> = {
      success: true,
      data: uploadedFile,
      message: '文件上传成功'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error uploading file:', error);
    const response: ApiResponse = {
      success: false,
      error: '文件上传失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// GET /api/upload/[filename] - 获取上传的HTML文件内容
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop();

    if (!filename) {
      return new NextResponse('文件名无效', { status: 400 });
    }

    const uploadDir = await ensureUploadDir();
    const filePath = path.join(uploadDir, filename);

    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('文件不存在', { status: 404 });
    }

    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf-8');

    // 返回HTML内容
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
}
