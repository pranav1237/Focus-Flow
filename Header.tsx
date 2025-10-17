export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">Focus Flow</h1>
        <nav className="flex items-center gap-3 text-slate-300">
          <a href="#tasks" className="hover:text-white">Tasks</a>
          <a href="#timer" className="hover:text-white">Pomodoro</a>
          <a href="#planner" className="hover:text-white">Planner</a>
          <a href="#stats" className="hover:text-white">Stats</a>
        </nav>
      </div>
    </header>
  );
}


