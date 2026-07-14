export default function Dashboard() {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <header className="mb-12 flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">
          My Dashboard
        </h1>
        <button className="glass-button">
          New Task
        </button>
      </header>
      <main>
        <div className="glass-card p-8">
          <p className="text-lg text-foreground/70">
            Dashboard Content Placeholder
          </p>
        </div>
      </main>
    </div>
  );
}
