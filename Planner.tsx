import { useStore } from '../state/store';

export default function Planner() {
  const note = useStore((s) => s.note);
  const setNote = useStore((s) => s.setNote);
  return (
    <section id="planner" className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-base font-semibold">Daily Planner</h2>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Plan your day..." rows={6} className="w-full resize-y rounded border border-slate-700 bg-slate-950 p-3 text-sm outline-none focus:border-sky-600" />
    </section>
  );
}


