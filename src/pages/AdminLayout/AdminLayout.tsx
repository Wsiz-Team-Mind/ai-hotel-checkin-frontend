import { useState, type ReactElement } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib/store';
import styles from './AdminLayout.module.scss';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  icon: ReactElement;
}

interface NavSection {
  label: string;
  items: ReadonlyArray<NavItem>;
}

const DashboardIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 13h7V4H4v9zm0 7h7v-5H4v5zm9 0h7V11h-7v9zm0-16v5h7V4h-7z"
      fill="currentColor"
    />
  </svg>
);

const StaffIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6z"
      fill="currentColor"
    />
  </svg>
);

const BookingsIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 3v2H4v16h16V5h-3V3h-2v2H9V3H7zm-1 6h12v10H6V9z"
      fill="currentColor"
    />
  </svg>
);

const KioskIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 4h16v12H4V4zm2 2v8h12V6H6zm3 14h6v-2H9v2z"
      fill="currentColor"
    />
  </svg>
);

const NAV_SECTIONS: ReadonlyArray<NavSection> = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', end: true, icon: DashboardIcon }],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/bookings', label: 'Bookings', icon: BookingsIcon },
      { to: '/admin/kiosk', label: 'Kiosk', icon: KioskIcon },
    ],
  },
  {
    label: 'Team',
    items: [{ to: '/admin/staff', label: 'Staff', icon: StaffIcon }],
  },
];

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'Dashboard', subtitle: 'Live overview of your property.' },
  '/admin/staff': { title: 'Staff', subtitle: 'Manage members, roles and access.' },
  '/admin/bookings': { title: 'Bookings', subtitle: 'All reservations in one place.' },
  '/admin/kiosk': { title: 'Kiosk', subtitle: 'Guest self check-in activity.' },
};

function getInitials(name: string | undefined): string {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/);
  const [first = '', second = ''] = parts;
  return (
    `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase() ||
    first[0]?.toUpperCase() ||
    'A'
  );
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const staff = useAuthStore((s) => s.staff);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [menuOpen, setMenuOpen] = useState(false);

  const page = PAGE_TITLES[location.pathname] ?? {
    title: 'Admin',
    subtitle: '',
  };

  function handleLogout() {
    clearAuth();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link to="/admin" className={styles.brand}>
          <img src="/uitm-logo.svg" alt="UITM Rzeszów" className={styles.brandLogo} />
        </Link>

        <nav className={styles.nav} aria-label="Admin navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className={styles.navSection}>
              <span className={styles.navLabel}>{section.label}</span>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.userCard}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
          >
            <span className={styles.avatar}>{getInitials(staff?.name)}</span>
            <span className={styles.userInfo}>
              <span className={styles.userName}>{staff?.name ?? 'Account'}</span>
              <span className={styles.userMeta}>{staff?.role ?? staff?.email ?? '—'}</span>
            </span>
            <span className={styles.userCaret} aria-hidden="true">⌄</span>
          </button>

          {menuOpen ? (
            <div className={styles.userMenu} role="menu">
              <div className={styles.userMenuEmail}>{staff?.email}</div>
              <button
                type="button"
                className={styles.userMenuItem}
                role="menuitem"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1 className={styles.pageTitle}>{page.title}</h1>
            {page.subtitle ? (
              <p className={styles.pageSubtitle}>{page.subtitle}</p>
            ) : null}
          </div>

          <div className={styles.search}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.searchIcon}>
              <path
                d="M10 4a6 6 0 104.47 10.03l4.25 4.25 1.41-1.41-4.25-4.25A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z"
                fill="currentColor"
              />
            </svg>
            <input
              type="search"
              placeholder="Search bookings, guests, staff…"
              className={styles.searchInput}
              aria-label="Search"
            />
            <kbd className={styles.kbd}>⌘K</kbd>
          </div>

          <div className={styles.topbarActions}>
            <button type="button" className={styles.iconButton} aria-label="Notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 22a2 2 0 002-2h-4a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5l-2 2v1h16v-1l-2-2z"
                  fill="currentColor"
                />
              </svg>
              <span className={styles.badge} aria-hidden="true" />
            </button>
            <button type="button" className={styles.primaryButton}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"
                  fill="currentColor"
                />
              </svg>
              Invite staff
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
