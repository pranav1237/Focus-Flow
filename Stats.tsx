import { useStore } from '../state/store';

function secondsToHMS(total: number) {
  const h = Math.floor(total / 3600).toString().padStart(2, '0');
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(total % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function Stats() {
  const { pomodoroSeconds, tasks } = useStore((s) => ({ pomodoroSeconds: s.pomodoroSeconds, tasks: s.tasks }));
  const completed = tasks.filter((t) => t.done).length;

  return (
    <section id="stats" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-2 text-base font-semibold">Stats</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded border border-slate-800 bg-slate-950 p-3">
          <div className="text-slate-400">Focus Time</div>
          <div className="text-2xl font-semibold tabular-nums">{secondsToHMS(pomodoroSeconds)}</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950 p-3">
          <div className="text-slate-400">Completed Tasks</div>
          <div className="text-2xl font-semibold tabular-nums">{completed}</div>
        </div>
      </div>
    </section>
  );
}


