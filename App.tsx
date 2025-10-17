import { useEffect, useState } from 'react';
import { useStore } from './state/store';

function Header({ setCurrentView }: { setCurrentView: (view: string) => void }) {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setCurrentView(id);
    history.replaceState(null, '', `#${id}`);
  };
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">Focus Flow</h1>
        <nav className="flex items-center gap-3 text-slate-300">
          <a href="#tasks" onClick={(e) => handleNav(e, 'tasks')} className="hover:text-white">Tasks</a>
          <a href="#timer" onClick={(e) => handleNav(e, 'timer')} className="hover:text-white">Pomodoro</a>
          <a href="#planner" onClick={(e) => handleNav(e, 'planner')} className="hover:text-white">Planner</a>
          <a href="#stats" onClick={(e) => handleNav(e, 'stats')} className="hover:text-white">Stats</a>
        </nav>
      </div>
    </header>
  );
}

type PomodoroMode = 'work' | 'short' | 'long';

function Pomodoro() {
  const WORK_SECONDS = 25 * 60;
  const SHORT_SECONDS = 5 * 60;
  const LONG_SECONDS = 15 * 60;

  const [mode, setMode] = useState<PomodoroMode>('work');
  const [seconds, setSeconds] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [cyclesSinceLong, setCyclesSinceLong] = useState(0);

  const addPomodoroSeconds = useStore((s) => s.addPomodoroSeconds);
  const completePomodoroSession = useStore((s) => s.completePomodoroSession);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        const next = Math.max(0, s - 1);
        if (mode === 'work' && next >= 0) void addPomodoroSeconds(1);
        if (next === 0) onTimerComplete();
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, addPomodoroSeconds, mode]);

  function onTimerComplete() {
    // Sound + notification
    try { beep(); } catch {}
    if (document.visibilityState !== 'visible' && 'Notification' in window) {
      if (Notification.permission === 'granted') new Notification('Focus Flow', { body: mode === 'work' ? 'Work session complete. Break time!' : 'Break over. Back to work!' });
      if (Notification.permission === 'default') Notification.requestPermission();
    }

    if (mode === 'work') {
      void completePomodoroSession();
      const nextCycles = cyclesSinceLong + 1;
      setCyclesSinceLong(nextCycles);
      if (nextCycles >= 4) {
        setMode('long');
        setSeconds(LONG_SECONDS);
        setCyclesSinceLong(0);
      } else {
        setMode('short');
        setSeconds(SHORT_SECONDS);
      }
      setRunning(false);
    } else {
      // Break finished -> return to work
      setMode('work');
      setSeconds(WORK_SECONDS);
      setRunning(false);
    }
  }

  function startStop() {
    setRunning((r) => !r);
    if (!running && seconds === 0) {
      // if starting with 0, reset based on mode
      setSeconds(mode === 'work' ? WORK_SECONDS : mode === 'short' ? SHORT_SECONDS : LONG_SECONDS);
    }
  }

  function setTo(modeNext: PomodoroMode) {
    setMode(modeNext);
    setSeconds(modeNext === 'work' ? WORK_SECONDS : modeNext === 'short' ? SHORT_SECONDS : LONG_SECONDS);
    setRunning(false);
  }

  function beep() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <section id="timer" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-1 text-base font-semibold">Pomodoro</h2>
      <div className="mb-2 text-xs text-slate-400">Mode: {mode === 'work' ? 'Work' : mode === 'short' ? 'Short Break' : 'Long Break'}</div>
      <div className="mb-3 text-5xl font-bold tabular-nums">{mm}:{ss}</div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button className="rounded bg-sky-600 px-3 py-1.5 font-medium hover:bg-sky-500" onClick={startStop}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="rounded border border-slate-700 px-3 py-1.5" onClick={() => setTo('work')}>
          Reset
        </button>
        <button className="rounded border border-slate-700 px-3 py-1.5" onClick={() => setTo('short')}>
          Short Break
        </button>
        <button className="rounded border border-slate-700 px-3 py-1.5" onClick={() => setTo('long')}>
          Long Break
        </button>
      </div>
    </section>
  );
}

function Tasks() {
  const [title, setTitle] = useState('');
  const { tasks, addTask, toggleTask, deleteTask } = useStore((s) => ({
    tasks: s.tasks,
    addTask: s.addTask,
    toggleTask: s.toggleTask,
    deleteTask: s.deleteTask,
  }));

  const onAdd = async () => {
    if (!title.trim()) return;
    await addTask(title);
    setTitle('');
  };

  return (
    <section id="tasks" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-base font-semibold">Tasks</h2>
      <div className="mb-3 flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void onAdd(); }} placeholder="Add a task" className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-600" />
        <button className="rounded bg-sky-600 px-3 py-2 text-sm font-medium hover:bg-sky-500" onClick={onAdd}>Add</button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 px-3 py-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
              <span className={t.done ? 'line-through text-slate-400' : ''}>{t.title}</span>
            </label>
            <button className="text-sm text-slate-400 hover:text-red-400" onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Planner() {
  const note = useStore((s) => s.note);
  const setNote = useStore((s) => s.setNote);
  return (
    <section id="planner" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-base font-semibold">Daily Planner</h2>
      <textarea value={note} onChange={(e) => void setNote(e.target.value)} placeholder="Plan your day..." rows={6} className="w-full resize-y rounded border border-slate-700 bg-slate-950 p-3 text-sm outline-none focus:border-sky-600" />
    </section>
  );
}

function secondsToHMS(total: number) {
  const h = Math.floor(total / 3600).toString().padStart(2, '0');
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(total % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function Stats() {
  const { pomodoroSeconds, tasks, sessionsCompleted } = useStore((s) => ({ pomodoroSeconds: s.pomodoroSeconds, tasks: s.tasks, sessionsCompleted: s.sessionsCompleted }));
  const completed = tasks.filter((t) => t.done).length;

  return (
    <section id="stats" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-2 text-base font-semibold">Stats</h2>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded border border-slate-800 bg-slate-950 p-3">
          <div className="text-slate-400">Focus Time</div>
          <div className="text-2xl font-semibold tabular-nums">{secondsToHMS(pomodoroSeconds)}</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950 p-3">
          <div className="text-slate-400">Completed Tasks</div>
          <div className="text-2xl font-semibold tabular-nums">{completed}</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950 p-3">
          <div className="text-slate-400">Pomodoro Sessions</div>
          <div className="text-2xl font-semibold tabular-nums">{sessionsCompleted}</div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const init = useStore((s) => s.init);
  const loading = useStore((s) => s.loading);
  const [currentView, setCurrentView] = useState('tasks');

  useEffect(() => {
    document.title = 'Focus Flow';
    void init();
  }, [init]);

  const renderView = () => {
    switch (currentView) {
      case 'tasks':
        return <Tasks />;
      case 'timer':
        return <Pomodoro />;
      case 'planner':
        return <Planner />;
      case 'stats':
        return <Stats />;
      default:
        return <Tasks />;
    }
  };

  return (
    <div className="min-h-full">
      <Header setCurrentView={setCurrentView} />
      <main className="mx-auto max-w-5xl p-4">
        {loading ? (
          <div className="rounded border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
            Initializing data...
          </div>
        ) : (
          renderView()
        )}
      </main>
      <footer className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-slate-500">
        Built during the Innovation Sprint
      </footer>
    </div>
  );
}


