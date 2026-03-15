import { Snowflake } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-4 pt-safe-top pt-5 pb-4 border-b border-white/10">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-electric-500 shrink-0">
        <Snowflake className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>
      <div className="text-left">
        <h1 className="text-xl font-bold text-white leading-tight tracking-tight">WaxAI</h1>
        <p className="text-xs text-ice-300/70 leading-none">Consulente Sciolina</p>
      </div>
      <div className="ml-auto">
        <span className="text-xs bg-electric-500/20 text-electric-400 border border-electric-500/30 rounded-full px-2.5 py-1 font-medium">
          Meteo in Diretta
        </span>
      </div>
    </header>
  );
}
