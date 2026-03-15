import { CheckCircle2, AlertCircle, AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

const CONFIDENCE_CONFIG = {
  high: {
    icon: CheckCircle2,
    label: 'Alta Affidabilità',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  medium: {
    icon: AlertCircle,
    label: 'Testa Prima',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  low: {
    icon: AlertTriangle,
    label: 'Incerto',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
};

export default function WaxCard({ recommendation }) {
  const [gripExpanded, setGripExpanded] = useState(true);
  const [glideExpanded, setGlideExpanded] = useState(false);

  const conf = CONFIDENCE_CONFIG[recommendation.overallConfidence] || CONFIDENCE_CONFIG.medium;
  const ConfIcon = conf.icon;

  return (
    <section className="mx-4 my-4 rounded-2xl bg-navy-800 border border-white/10 overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-electric-400 font-semibold uppercase tracking-widest">
              Consiglio Sciolina
            </p>
            <p className="text-ice-100/70 text-sm mt-1">{recommendation.conditions}</p>
          </div>
          <span
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 shrink-0
              ${conf.bg} ${conf.border} border ${conf.color}`}
          >
            <ConfIcon className="w-3.5 h-3.5" />
            {conf.label}
          </span>
        </div>
      </div>

      {/* GRIP WAX */}
      <WaxSection
        title="Sciolina da Presa"
        waxName={recommendation.gripWax}
        waxColor={recommendation.gripColor}
        notes={recommendation.gripNotes}
        expanded={gripExpanded}
        onToggle={() => setGripExpanded((v) => !v)}
        badge="Zona di Spinta"
        badgeColor="bg-violet-500/20 text-violet-300 border-violet-500/30"
      />

      {/* GLIDE WAX */}
      <WaxSection
        title="Sciolina da Scorrimento"
        waxName={recommendation.glideWax}
        waxColor={recommendation.glideColor}
        notes={recommendation.glideNotes}
        expanded={glideExpanded}
        onToggle={() => setGlideExpanded((v) => !v)}
        badge="Punta e Coda"
        badgeColor="bg-teal-500/20 text-teal-300 border-teal-500/30"
        divider
      />

      {/* General notes */}
      {recommendation.generalNotes.length > 0 && (
        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          {recommendation.generalNotes.map((note, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-electric-400 shrink-0 mt-0.5" />
              <p className="text-ice-300/80 text-sm leading-snug">{note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Technique tip */}
      <div className="px-5 py-3 bg-electric-500/5 border-t border-electric-500/20">
        <p className="text-electric-400 text-xs font-semibold uppercase tracking-widest mb-1">
          Consiglio Tecnica
        </p>
        <p className="text-ice-100/80 text-sm">{recommendation.technique}</p>
      </div>
    </section>
  );
}

function WaxSection({ title, waxName, waxColor, notes, expanded, onToggle, badge, badgeColor, divider }) {
  return (
    <div className={divider ? 'border-t border-white/10' : ''}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 active:bg-white/10 transition"
      >
        <div className="flex items-center gap-3 text-left">
          {/* Color swatch */}
          <span
            className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0"
            style={{ backgroundColor: waxColor }}
          />
          <div>
            <p className="text-ice-300/60 text-xs font-medium uppercase tracking-widest">{title}</p>
            <p className="text-white font-bold text-base mt-0.5 leading-tight">{waxName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 border ${badgeColor}`}>
            {badge}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-ice-300/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-ice-300/40" />
          )}
        </div>
      </button>

      {expanded && notes.length > 0 && (
        <div className="px-5 pb-4 space-y-2">
          {notes.map((note, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-400 shrink-0 mt-2" />
              <p className="text-ice-300/70 text-sm leading-snug">{note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
