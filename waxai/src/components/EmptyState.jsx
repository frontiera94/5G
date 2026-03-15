import { Snowflake, MapPin } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative mb-6">
        <Snowflake
          className="w-24 h-24 text-navy-600"
          strokeWidth={1}
        />
        <MapPin className="absolute bottom-0 right-0 w-8 h-8 text-electric-500" />
      </div>
      <h2 className="text-xl font-bold text-ice-100 mb-2">Pronto a Sciolinare?</h2>
      <p className="text-ice-300/60 text-sm leading-relaxed max-w-xs">
        Inserisci una città o usa la posizione del dispositivo per ricevere consigli in tempo reale
        sulla sciolina da presa e da scorrimento per le condizioni di oggi.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
        {[
          { temp: '−12°', wax: 'Verde', color: '#16a34a' },
          { temp: '−2°', wax: 'Blu', color: '#1d4ed8' },
          { temp: '+2°', wax: 'Rossa', color: '#dc2626' },
        ].map(({ temp, wax, color }) => (
          <div
            key={wax}
            className="rounded-xl bg-navy-800 border border-white/10 p-3 flex flex-col items-center gap-1.5"
          >
            <span
              className="w-6 h-6 rounded-full border-2 border-white/20"
              style={{ backgroundColor: color }}
            />
            <p className="text-white font-bold text-sm">{temp}</p>
            <p className="text-ice-300/60 text-xs">{wax}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
