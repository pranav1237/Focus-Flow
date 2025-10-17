# Focus Flow

A productivity PWA that combines tasks, Pomodoro timer, daily planner, and lightweight stats. Built with React + Vite + TypeScript, TailwindCSS, IndexedDB (idb), and Zustand.

## Features
- Tasks with offline persistence (IndexedDB)
- Pomodoro timer with focus time tracking
- Daily planner notes (auto-saved)
- Minimal stats (focus time, completed tasks)
- Installable PWA

## Tech Stack
- React 18, TypeScript, Vite
- TailwindCSS
- Zustand state, idb for IndexedDB
- Vitest + React Testing Library

## Getting Started
```bash
pnpm install # or npm install / yarn
pnpm dev     # http://localhost:5173
```

### Build
```bash
pnpm build
pnpm preview
```

## Project Structure
```
src/
  components/     # UI components
  state/          # Zustand store + idb wrappers
  App.tsx         # Composition
  main.tsx        # Entry
  index.css       # Tailwind
public/
  sw.js           # Service worker
  manifest.webmanifest
```

## Testing
```bash
pnpm test
```
##Access:
You can also access the whole project through this Google Drive Link:

https://drive.google.com/file/d/1pNYNY4QohmPT5kt0mopVv5CnrJHq2Llc/view?usp=drive_link

