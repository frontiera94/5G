import Header from './components/Header';
import LocationInput from './components/LocationInput';
import WeatherCard from './components/WeatherCard';
import WaxCard from './components/WaxCard';
import SnowStateCard from './components/SnowStateCard';
import EmptyState from './components/EmptyState';
import { useWeather } from './useWeather';
import { getWaxRecommendation } from './waxEngine';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const {
    weather,
    snowState,
    locationName,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByGPS,
  } = useWeather();

  const [dismissedError, setDismissedError] = useState(null);

  const recommendation = weather ? getWaxRecommendation(weather) : null;

  const showError = error && error !== dismissedError;

  function handleRefresh() {
    if (weather) {
      fetchWeatherByCity(locationName || 'Current Location');
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto pb-6">
        <LocationInput
          onCitySearch={fetchWeatherByCity}
          onGPSSearch={fetchWeatherByGPS}
          loading={loading}
        />

        {/* Error banner */}
        {showError && (
          <div className="mx-4 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm flex-1 leading-snug">{error}</p>
            <button
              onClick={() => setDismissedError(error)}
              className="text-red-400/60 hover:text-red-300 transition shrink-0"
              aria-label="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading shimmer */}
        {loading && !weather && (
          <div className="mx-4 space-y-3">
            <Shimmer className="h-44 rounded-2xl" />
            <Shimmer className="h-64 rounded-2xl" />
          </div>
        )}

        {!loading && !weather && <EmptyState />}

        {weather && (
          <>
            <WeatherCard
              weather={weather}
              locationName={locationName}
              onRefresh={handleRefresh}
              loading={loading}
            />
            <SnowStateCard snowState={snowState} />
            {recommendation && <WaxCard recommendation={recommendation} />}
          </>
        )}

        <p className="text-center text-ice-300/25 text-xs px-4 mt-6">
          Dati meteo da{' '}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-electric-400 transition"
          >
            Open-Meteo
          </a>
          . I consigli sulla sciolina sono indicativi — testa sempre sulla neve.
        </p>
      </main>
    </div>
  );
}

function Shimmer({ className }) {
  return <div className={`bg-navy-800 animate-pulse border border-white/5 ${className}`} />;
}
