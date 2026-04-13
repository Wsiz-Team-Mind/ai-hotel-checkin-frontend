import { NavLink, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.scss';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/staff', label: 'Staff' },
];

export function AdminLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        <nav className={styles.nav} aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
