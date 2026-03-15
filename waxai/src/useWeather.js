import { useState, useCallback } from 'react';
import { parseWeatherCode } from './waxEngine';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherByCoords = useCallback(async (lat, lon, name = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation',
          'weather_code',
          'wind_speed_10m',
          'apparent_temperature',
        ].join(','),
        timezone: 'auto',
        wind_speed_unit: 'ms',
      });

      const res = await fetch(`${BASE_URL}?${params}`);
      if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
      const data = await res.json();
      const c = data.current;

      const { isSnowing, label, icon } = parseWeatherCode(c.weather_code);

      setWeather({
        temperature: c.temperature_2m,
        feelsLike: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        precipitation: c.precipitation,
        windSpeed: c.wind_speed_10m,
        weatherCode: c.weather_code,
        weatherLabel: label,
        weatherIcon: icon,
        isSnowing,
        lat,
        lon,
        fetchedAt: new Date(),
      });
      if (name) setLocationName(name);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(
        `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      if (!geoRes.ok) throw new Error('Geocoding error.');
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`No location found for "${city}". Try a different city name.`);
      }

      const { latitude, longitude, name, country, admin1 } = geoData.results[0];
      const displayName = [name, admin1, country].filter(Boolean).join(', ');
      await fetchWeatherByCoords(latitude, longitude, displayName);
    } catch (err) {
      setError(err.message || 'Failed to find location.');
      setLoading(false);
    }
  }, [fetchWeatherByCoords]);

  const fetchWeatherByGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, 'Your Location');
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError('Location access denied. Please allow location or enter a city manually.');
        } else {
          setError('Unable to determine your location. Please enter a city.');
        }
      },
      { timeout: 10000 }
    );
  }, [fetchWeatherByCoords]);

  return { weather, locationName, loading, error, fetchWeatherByCity, fetchWeatherByGPS };
}
