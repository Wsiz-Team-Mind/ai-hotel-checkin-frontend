import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav className="app-nav">
          <a href="/">Home</a>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>AI Hotel Check-in</p>
      </footer>
    </div>
  );
}
