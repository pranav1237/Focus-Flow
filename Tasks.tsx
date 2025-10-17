import { useState } from 'react';
import { useStore } from '../state/store';

export default function Tasks() {
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
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task" className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-600" />
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


