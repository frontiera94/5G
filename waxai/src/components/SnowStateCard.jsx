import { Snowflake, Sun, Calendar } from 'lucide-react';

export default function SnowStateCard({ snowState }) {
  if (!snowState) return null;

  if (!snowState.hasSnow) {
    return (
      <section className="mx-4 my-4 rounded-2xl bg-navy-800 border border-white/10 overflow-hidden">
        <div className="px-5 py-4">
          <p className="text-xs text-electric-400 font-semibold uppercase tracking-widest mb-2">
            Stato della Neve
          </p>
          <p className="text-ice-300/60 text-sm">
            Nessuna nevicata rilevata negli ultimi 14 giorni.
          </p>
        </div>
      </section>
    );
  }

  const { lastSnowDate, daysSinceSnow, daysAnalysis, condition, conditionColor, conditionDesc } =
    snowState;

  const lastSnowLabel =
    daysSinceSnow === 0 ? 'Oggi' : daysSinceSnow === 1 ? 'Ieri' : `${daysSinceSnow} giorni fa`;

  const dateFormatted = new Date(lastSnowDate + 'T12:00:00Z').toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <section className="mx-4 my-4 rounded-2xl bg-navy-800 border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-electric-400 font-semibold uppercase tracking-widest">
              Stato della Neve
            </p>
            <p className="text-ice-100/70 text-sm mt-1">{conditionDesc}</p>
          </div>
          <span
            className={`text-xs font-bold shrink-0 rounded-full px-3 py-1.5 bg-white/10 border border-white/20 ${conditionColor}`}
          >
            {condition}
          </span>
        </div>
      </div>

      {/* Last snowfall row */}
      <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
        <Snowflake className="w-5 h-5 text-blue-300 shrink-0" />
        <div>
          <p className="text-ice-300/60 text-xs uppercase tracking-widest font-medium">
            Ultima Nevicata
          </p>
          <p className="text-white font-semibold">
            {lastSnowLabel}{' '}
            <span className="text-ice-300/50 font-normal text-sm">({dateFormatted})</span>
          </p>
        </div>
      </div>

      {/* Per-day analysis */}
      {daysAnalysis.length > 0 && (
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5 text-ice-300/50" />
            <p className="text-ice-300/60 text-xs uppercase tracking-widest font-medium">
              Giorni Successivi alla Nevicata
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {daysAnalysis.map((day) => {
              const label = new Date(day.date + 'T12:00:00Z').toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short',
              });
              return (
                <div
                  key={day.date}
                  title={`${day.hoursAboveZero} ore sopra 0 °C`}
                  className={`flex flex-col items-center rounded-xl px-3 py-2 border text-xs font-medium ${
                    day.isWarm
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  }`}
                >
                  {day.isWarm ? (
                    <Sun className="w-3.5 h-3.5 mb-1" />
                  ) : (
                    <Snowflake className="w-3.5 h-3.5 mb-1" />
                  )}
                  <span>{label}</span>
                  <span className="text-[10px] opacity-70">{day.hoursAboveZero}h &gt;0°</span>
                </div>
              );
            })}
          </div>
          <p className="text-ice-300/35 text-xs mt-3 leading-snug">
            <span className="inline-flex items-center gap-1">
              <Sun className="w-3 h-3 text-orange-300/60" /> arancione
            </span>{' '}
            = temperatura sopra 0 °C per &gt;12 h (metamorfismo);{' '}
            <span className="inline-flex items-center gap-1">
              <Snowflake className="w-3 h-3 text-blue-300/60" /> blu
            </span>{' '}
            = rimasto freddo.
          </p>
        </div>
      )}
    </section>
  );
}
