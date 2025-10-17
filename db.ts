import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface FocusFlowDB extends DBSchema {
  tasks: {
    key: string;
    value: { id: string; title: string; done: boolean; createdAt: number };
    indexes: { 'by-createdAt': number };
  };
  notes: {
    key: string;
    value: { id: string; content: string; updatedAt: number };
    indexes: { 'by-updatedAt': number };
  };
  stats: {
    key: string;
    value: { id: 'focus'; pomodoroSeconds: number; completedTasks: number; sessionsCompleted?: number };
  };
}

let dbPromise: Promise<IDBPDatabase<FocusFlowDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FocusFlowDB>('focus-flow', 1, {
      upgrade(db) {
        const tasks = db.createObjectStore('tasks', { keyPath: 'id' });
        tasks.createIndex('by-createdAt', 'createdAt');
        const notes = db.createObjectStore('notes', { keyPath: 'id' });
        notes.createIndex('by-updatedAt', 'updatedAt');
        db.createObjectStore('stats', { keyPath: 'id' });
      }
    });
  }
  return dbPromise;
}


