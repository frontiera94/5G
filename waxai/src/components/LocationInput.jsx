import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

export default function LocationInput({ onCitySearch, onGPSSearch, loading }) {
  const [city, setCity] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) onCitySearch(trimmed);
  }

  return (
    <section className="px-4 py-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ice-300/50 pointer-events-none" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Inserisci città o stazione…"
            disabled={loading}
            className="w-full h-14 pl-10 pr-4 rounded-xl bg-navy-700 border border-white/10 text-white placeholder-ice-300/40
              text-base focus:outline-none focus:ring-2 focus:ring-electric-500 focus:border-transparent
              disabled:opacity-60 transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !city.trim()}
          className="h-14 px-5 rounded-xl bg-electric-500 hover:bg-electric-400 active:scale-95 text-white font-semibold
            disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </form>

      <button
        type="button"
        onClick={onGPSSearch}
        disabled={loading}
        className="mt-3 w-full h-14 flex items-center justify-center gap-2.5 rounded-xl
          border border-electric-500/40 text-electric-400 hover:bg-electric-500/10 active:scale-95
          font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
        Usa la Mia Posizione
      </button>
    </section>
  );
}
