import { useEffect, useState } from 'react';
import { useStore } from '../state/store';

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const addPomodoroSeconds = useStore((s) => s.addPomodoroSeconds);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        const next = Math.max(0, s - 1);
        addPomodoroSeconds(1);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, addPomodoroSeconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <section id="timer" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-2 text-base font-semibold">Pomodoro</h2>
      <div className="mb-3 text-5xl font-bold tabular-nums">{mm}:{ss}</div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button className="rounded bg-sky-600 px-3 py-1.5 font-medium hover:bg-sky-500" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="rounded border border-slate-700 px-3 py-1.5" onClick={() => setSeconds(25 * 60)}>
          Reset
        </button>
        <button className="rounded border border-slate-700 px-3 py-1.5" onClick={() => setSeconds(5 * 60)}>
          Short Break
        </button>
        <button className="rounded border border-slate-700 px-3 py-1.5" onClick={() => setSeconds(15 * 60)}>
          Long Break
        </button>
      </div>
    </section>
  );
}


