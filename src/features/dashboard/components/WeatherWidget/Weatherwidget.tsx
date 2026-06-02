import React, { useEffect, useState } from 'react';
import '../WeatherWidget/Weatherwidget.css';

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
  weatherCode: number;
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌦️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 84) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌡️';
};

const getWeatherDesc = (code: number): string => {
  if (code === 0) return 'Ясно';
  if (code <= 2) return 'Мінлива хмарність';
  if (code === 3) return 'Хмарно';
  if (code <= 49) return 'Туман';
  if (code <= 59) return 'Мряка';
  if (code <= 69) return 'Дощ';
  if (code <= 79) return 'Сніг';
  if (code <= 82) return 'Злива';
  if (code <= 84) return 'Снігопад';
  if (code <= 99) return 'Гроза';
  return 'Невідомо';
};

const getBg = (code: number, hour: number): string => {
  const isNight = hour < 6 || hour >= 20;
  if (isNight) return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
  if (code === 0) return 'linear-gradient(135deg, #7C4DFF 0%, #448AFF 100%)';
  if (code <= 2) return 'linear-gradient(135deg, #7C4DFF 0%, #78909C 100%)';
  if (code <= 49) return 'linear-gradient(135deg, #546E7A 0%, #78909C 100%)';
  if (code <= 69) return 'linear-gradient(135deg, #37474F 0%, #546E7A 100%)';
  if (code <= 99) return 'linear-gradient(135deg, #263238 0%, #37474F 100%)';
  return 'linear-gradient(135deg, #7C4DFF 0%, #448AFF 100%)';
};

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Геолокація недоступна');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Open-Meteo — безкоштовний API без ключа
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
          );
          const weatherData = await weatherRes.json();

          // Reverse geocoding — безкоштовно
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();

          const city =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.village ||
            geoData.address?.county ||
            'Невідоме місто';

          const c = weatherData.current;
          setWeather({
            temp: Math.round(c.temperature_2m),
            feelsLike: Math.round(c.apparent_temperature),
            description: getWeatherDesc(c.weather_code),
            humidity: c.relative_humidity_2m,
            windSpeed: Math.round(c.wind_speed_10m),
            city,
            weatherCode: c.weather_code,
          });
        } catch {
          setError('Не вдалося завантажити погоду');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Дозволь доступ до геолокації');
        setLoading(false);
      }
    );
  }, []);

  const hour = time.getHours();
  const bg = weather ? getBg(weather.weatherCode, hour) : 'linear-gradient(135deg, #7C4DFF 0%, #448AFF 100%)';

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: Date) =>
    d.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="ww" style={{ background: bg }}>
      {loading && (
        <div className="ww__loading">
          <div className="ww__spinner" />
          <span>Визначаємо місцезнаходження...</span>
        </div>
      )}

      {error && !loading && (
        <div className="ww__error">
          <span>📍</span>
          <p>{error}</p>
        </div>
      )}

      {weather && !loading && (
        <>
          <div className="ww__top">
            <div className="ww__location">
              <span className="ww__pin">📍</span>
              <span className="ww__city">{weather.city}</span>
            </div>
            <div className="ww__time">{formatTime(time)}</div>
          </div>

          <div className="ww__main">
            <div className="ww__icon">{getWeatherIcon(weather.weatherCode)}</div>
            <div className="ww__temp-wrap">
              <span className="ww__temp">{weather.temp}°</span>
              <span className="ww__desc">{weather.description}</span>
            </div>
          </div>

          <div className="ww__date">{formatDate(time)}</div>

          <div className="ww__details">
            <div className="ww__detail">
              <span className="ww__detail-icon">🌡️</span>
              <span className="ww__detail-val">Відчувається {weather.feelsLike}°</span>
            </div>
            <div className="ww__detail">
              <span className="ww__detail-icon">💧</span>
              <span className="ww__detail-val">Вологість {weather.humidity}%</span>
            </div>
            <div className="ww__detail">
              <span className="ww__detail-icon">💨</span>
              <span className="ww__detail-val">Вітер {weather.windSpeed} км/г</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;