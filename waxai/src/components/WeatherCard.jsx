import {
  Thermometer, Droplets, Wind, CloudSnow, Sun, Cloud,
  CloudRain, CloudDrizzle, CloudLightning, RefreshCw,
} from 'lucide-react';

const ICON_MAP = {
  sun: Sun,
  'cloud-sun': Cloud,
  cloud: Cloud,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
};

export default function WeatherCard({ weather, locationName, onRefresh, loading }) {
  const WeatherIcon = ICON_MAP[weather.weatherIcon] || Cloud;

  const tempColor =
    weather.temperature <= -10
      ? 'text-blue-300'
      : weather.temperature <= -2
      ? 'text-ice-300'
      : weather.temperature <= 2
      ? 'text-violet-300'
      : 'text-red-400';

  return (
    <section className="mx-4 rounded-2xl bg-navy-800 border border-white/10 overflow-hidden">
      {/* Location bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <p className="text-xs text-ice-300/60 font-medium uppercase tracking-widest">Condizioni Attuali</p>
          <p className="text-white font-semibold text-sm mt-0.5">{locationName}</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg text-ice-300/60 hover:text-electric-400 hover:bg-white/5 transition"
          aria-label="Aggiorna meteo"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main temp + condition */}
      <div className="flex items-center justify-between px-5 py-5">
        <div>
          <p className={`text-6xl font-black tracking-tighter ${tempColor}`}>
            {Math.round(weather.temperature)}°
          </p>
          <p className="text-ice-300/70 text-sm mt-1">{weather.weatherLabel}</p>
          <p className="text-ice-300/50 text-xs mt-0.5">
            Percepita {Math.round(weather.feelsLike)}°C
          </p>
        </div>
        <WeatherIcon
          className={`w-20 h-20 opacity-20 ${
            weather.isSnowing ? 'text-blue-300' : 'text-yellow-200'
          }`}
          strokeWidth={1}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px bg-white/5">
        <Stat
          icon={<Droplets className="w-4 h-4 text-blue-400" />}
          label="Umidità"
          value={`${weather.humidity}%`}
        />
        <Stat
          icon={<Wind className="w-4 h-4 text-teal-400" />}
          label="Vento"
          value={`${weather.windSpeed} m/s`}
        />
        <Stat
          icon={<CloudSnow className="w-4 h-4 text-ice-300" />}
          label="Precip."
          value={`${weather.precipitation} mm`}
        />
      </div>

      {/* Fetched time */}
      <p className="text-center text-ice-300/30 text-xs py-2">
        Aggiornato {weather.fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </section>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 bg-navy-800">
      {icon}
      <p className="text-white font-semibold text-sm">{value}</p>
      <p className="text-ice-300/50 text-xs">{label}</p>
    </div>
  );
}
