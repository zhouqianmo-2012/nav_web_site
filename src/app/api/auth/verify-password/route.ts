import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import crypto from 'crypto';

// 默认管理员密码（建议通过环境变量配置）
const DEFAULT_ADMIN_PASSWORD = '1Allforone';

// 从环境变量获取管理员密码，如果没有则使用默认密码
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

// 密码哈希函数（简单的SHA-256，生产环境建议使用更安全的方法）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// POST /api/auth/verify-password - 验证管理员密码
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      const response: ApiResponse = {
        success: false,
        error: '密码不能为空'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 验证密码
    const isValid = password === ADMIN_PASSWORD;

    if (isValid) {
      const response: ApiResponse = {
        success: true,
        message: '密码验证成功'
      };
      return NextResponse.json(response);
    } else {
      // 添加简单的防暴力破解延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response: ApiResponse = {
        success: false,
        error: '密码错误'
      };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error('Password verification error:', error);
    const response: ApiResponse = {
      success: false,
      error: '验证失败'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// GET /api/auth/verify-password - 检查当前会话状态
export async function GET() {
  // 这个端点可以用于检查会话状态，但实际的会话管理在客户端进行
  const response: ApiResponse = {
    success: true,
    message: '请在客户端检查会话状态'
  };
  return NextResponse.json(response);
}
