'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { WeatherData } from '@/types';

interface WeatherWidgetProps {
  location: string;
}

export function WeatherWidget({ location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadWeather = async () => {
    try {
      setLoading(true);
      // 这里应该调用天气API，暂时使用模拟数据
      const mockWeather: WeatherData = {
        location,
        temperature: 22,
        condition: '晴朗',
        conditionCode: 'sunny',
        humidity: 65,
        windSpeed: 12,
        icon: 'sun'
      };
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWeather(mockWeather);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const iconStyle = { fill: 'var(--color-primary)', width: '48px', height: '48px' };

    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun style={iconStyle} />;
      case 'cloudy':
      case 'overcast':
        return <Cloud style={iconStyle} />;
      case 'rainy':
      case 'rain':
        return <CloudRain style={iconStyle} />;
      case 'snowy':
      case 'snow':
        return <CloudSnow style={iconStyle} />;
      default:
        return <Sun style={iconStyle} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
        <span>加载天气中...</span>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">
      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.conditionCode)}
        <div>
          <div className="text-2xl font-bold text-foreground">
            {weather.temperature}°C
          </div>
          <div className="text-sm text-muted-foreground">
            {weather.condition}
          </div>
        </div>
      </div>
      
      <div className="border-l border-border pl-4">
        <div className="text-sm text-muted-foreground mb-1">
          {weather.location}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>湿度 {weather.humidity}%</span>
          <span className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            {weather.windSpeed}km/h
          </span>
        </div>
      </div>
    </div>
  );
}
