import { create } from 'zustand';
import { getDB } from './db';

export type Task = { id: string; title: string; done: boolean; createdAt: number };

type State = {
  tasks: Task[];
  note: string;
  pomodoroSeconds: number;
  sessionsCompleted: number;
  loading: boolean;
};

type Actions = {
  init: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setNote: (content: string) => Promise<void>;
  addPomodoroSeconds: (delta: number) => Promise<void>;
  completePomodoroSession: () => Promise<void>;
};

export const useStore = create<State & Actions>((set, get) => ({
  tasks: [],
  note: '',
  pomodoroSeconds: 0,
  sessionsCompleted: 0,
  loading: true,

  init: async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(['tasks', 'notes', 'stats']);
      const tasks = await tx.objectStore('tasks').getAll();
      tasks.sort((a, b) => b.createdAt - a.createdAt);
      const noteObj = await tx.objectStore('notes').get('daily');
      const stats = (await tx.objectStore('stats').get('focus')) || { id: 'focus', pomodoroSeconds: 0, completedTasks: 0, sessionsCompleted: 0 };
      set({ tasks, note: noteObj?.content || '', pomodoroSeconds: stats.pomodoroSeconds, sessionsCompleted: stats.sessionsCompleted ?? 0, loading: false });
      // Sync to localStorage as backup
      localStorage.setItem('ff.tasks', JSON.stringify(tasks));
      localStorage.setItem('ff.note', noteObj?.content || '');
      localStorage.setItem('ff.pomo', String(stats.pomodoroSeconds));
      localStorage.setItem('ff.sessions', String(stats.sessionsCompleted ?? 0));
    } catch (err) {
      // Fallback to localStorage if IndexedDB is unavailable (e.g., privacy mode)
      const tasksStr = localStorage.getItem('ff.tasks');
      const noteStr = localStorage.getItem('ff.note') || '';
      const pomoStr = localStorage.getItem('ff.pomo') || '0';
      const sessionsStr = localStorage.getItem('ff.sessions') || '0';
      const tasks = tasksStr ? (JSON.parse(tasksStr) as Task[]) : [];
      set({ tasks, note: noteStr, pomodoroSeconds: Number(pomoStr) || 0, sessionsCompleted: Number(sessionsStr) || 0, loading: false });
    }
  },

  addTask: async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTask: Task = { id: (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)), title: trimmed, done: false, createdAt: Date.now() };
    const next = [newTask, ...get().tasks];
    set({ tasks: next });
    localStorage.setItem('ff.tasks', JSON.stringify(next));
    try {
      const db = await getDB();
      await db.put('tasks', newTask);
    } catch (_) {
      // ignore if idb unavailable
    }
  },

  toggleTask: async (id: string) => {
    const next = get().tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    set({ tasks: next });
    localStorage.setItem('ff.tasks', JSON.stringify(next));
    try {
      const db = await getDB();
      const current = await db.get('tasks', id);
      if (current) await db.put('tasks', { ...current, done: !current.done });
    } catch (_) {
      // ignore if idb unavailable
    }
  },

  deleteTask: async (id: string) => {
    const next = get().tasks.filter((t) => t.id !== id);
    set({ tasks: next });
    localStorage.setItem('ff.tasks', JSON.stringify(next));
    try {
      const db = await getDB();
      await db.delete('tasks', id);
    } catch (_) {
      // ignore if idb unavailable
    }
  },

  setNote: async (content: string) => {
    set({ note: content });
    localStorage.setItem('ff.note', content);
    try {
      const db = await getDB();
      await db.put('notes', { id: 'daily', content, updatedAt: Date.now() });
    } catch (_) {
      // ignore if idb unavailable
    }
  },

  addPomodoroSeconds: async (delta: number) => {
    const value = Math.max(0, get().pomodoroSeconds + delta);
    set({ pomodoroSeconds: value });
    localStorage.setItem('ff.pomo', String(value));
    try {
      const db = await getDB();
      await db.put('stats', { id: 'focus', pomodoroSeconds: value, completedTasks: get().tasks.filter(t => t.done).length, sessionsCompleted: get().sessionsCompleted });
    } catch (_) {
      // ignore if idb unavailable
    }
  },

  completePomodoroSession: async () => {
    const newCount = get().sessionsCompleted + 1;
    set({ sessionsCompleted: newCount });
    localStorage.setItem('ff.sessions', String(newCount));
    try {
      const db = await getDB();
      await db.put('stats', { id: 'focus', pomodoroSeconds: get().pomodoroSeconds, completedTasks: get().tasks.filter(t => t.done).length, sessionsCompleted: newCount });
    } catch (_) {
      // ignore if idb unavailable
    }
  }
}));


