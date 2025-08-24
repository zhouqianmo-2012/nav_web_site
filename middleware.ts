import { NextRequest, NextResponse } from 'next/server';
import { parseSubdomain } from '@/lib/utils';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 检查是否是 /{uuid}.html 格式的路径
  const uuidHtmlMatch = pathname.match(/^\/([a-f0-9]{32})\.html$/i);
  if (uuidHtmlMatch) {
    const uuid = uuidHtmlMatch[1];
    const url = request.nextUrl.clone();
    url.pathname = `/${uuid}`;
    return NextResponse.rewrite(url);
  }

  const subdomain = parseSubdomain(host);

  // 如果是子域名访问，重写到子域名处理路由
  if (subdomain && subdomain !== 'www') {
    const url = request.nextUrl.clone();
    url.pathname = `/subdomain/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
