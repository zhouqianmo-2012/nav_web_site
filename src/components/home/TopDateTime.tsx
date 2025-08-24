'use client';

import { useState, useEffect } from 'react';

export function TopDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayName = days[date.getDay()];
    
    return `${year}年${month}月${day}日 ${dayName} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flare-compact-container">
      <div className="text-sm text-muted-foreground font-normal">
        {formatDateTime(currentTime)}
      </div>
    </div>
  );
}
