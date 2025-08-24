// 会话管理工具函数

// 会话有效期（30分钟）
const SESSION_DURATION = 30 * 60 * 1000; // 30分钟

/**
 * 检查管理员是否已认证
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const isAuthenticated = sessionStorage.getItem('admin-authenticated');
    const authTime = sessionStorage.getItem('admin-auth-time');
    
    if (!isAuthenticated || !authTime) {
      return false;
    }
    
    const authTimestamp = parseInt(authTime);
    const now = Date.now();
    
    // 检查会话是否过期
    if (now - authTimestamp > SESSION_DURATION) {
      clearAdminSession();
      return false;
    }
    
    return isAuthenticated === 'true';
  } catch (error) {
    console.error('Error checking admin authentication:', error);
    return false;
  }
}

/**
 * 清除管理员会话
 */
export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem('admin-authenticated');
    sessionStorage.removeItem('admin-auth-time');
  } catch (error) {
    console.error('Error clearing admin session:', error);
  }
}

/**
 * 刷新会话时间
 */
export function refreshAdminSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (isAdminAuthenticated()) {
      sessionStorage.setItem('admin-auth-time', Date.now().toString());
    }
  } catch (error) {
    console.error('Error refreshing admin session:', error);
  }
}

/**
 * 获取会话剩余时间（分钟）
 */
export function getSessionRemainingTime(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const authTime = sessionStorage.getItem('admin-auth-time');
    if (!authTime) return 0;
    
    const authTimestamp = parseInt(authTime);
    const now = Date.now();
    const elapsed = now - authTimestamp;
    const remaining = SESSION_DURATION - elapsed;
    
    return Math.max(0, Math.floor(remaining / (60 * 1000)));
  } catch (error) {
    console.error('Error getting session remaining time:', error);
    return 0;
  }
}
