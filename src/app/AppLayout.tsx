import { NavLink, Outlet } from 'react-router-dom';

interface TopNavItem {
  to: string;
  label: string;
  end?: boolean;
}

const TOP_NAV: ReadonlyArray<TopNavItem> = [
  { to: '/', label: 'Home', end: true },
  { to: '/admin', label: 'Admin' },
];

export function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav className="app-nav" aria-label="Main navigation">
          {TOP_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
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
