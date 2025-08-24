'use client';

import { useState, useEffect } from 'react';

interface DateTimeWidgetProps {
  greetings: string;
}

export function DateTimeWidget({ greetings }: DateTimeWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDay = (date: Date) => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[date.getDay()];
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="text-center lg:text-left">
      <div className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
        {formatTime(currentTime)}
      </div>
      <div className="text-lg text-muted-foreground mb-1">
        {formatDate(currentTime)} {formatDay(currentTime)}
      </div>
      <div className="text-xl text-primary font-medium">
        {greetings || getGreeting()}
      </div>
    </div>
  );
}
