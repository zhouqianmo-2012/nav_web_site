'use client';

import { useState } from 'react';
import { Settings, Upload } from 'lucide-react';
import Link from 'next/link';
import { PasswordModal } from '@/components/ui/PasswordModal';
import { isAdminAuthenticated } from '@/lib/auth';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 检查是否已经认证
    if (isAdminAuthenticated()) {
      // 已认证，直接跳转
      window.location.href = '/settings';
    } else {
      // 未认证，显示密码弹窗
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSuccess = () => {
    // 密码验证成功，跳转到设置页面
    window.location.href = '/settings';
  };

  return (
    <>
      <header className="flare-header-container flex items-center justify-between">
        <h1 className="flare-title no-select">{title}</h1>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 text-sm font-medium paper-shadow-hover"
          >
            <Upload className="w-4 h-4" />
            上传HTML
          </Link>

          <button
            onClick={handleSettingsClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all duration-200 text-sm font-medium paper-shadow-hover"
          >
            <Settings className="w-4 h-4" />
            设置
          </button>
        </div>
      </header>

      {/* 密码验证弹窗 */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        title="设置页面访问验证"
        description="请输入管理员密码以访问系统设置"
      />
    </>
  );
}
