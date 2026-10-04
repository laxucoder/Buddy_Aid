import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  CircleHelp,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Settings,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const links = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/emergency', 'Emergency', ShieldAlert],
  ['/safety-map', 'Safety Map', Map],
  ['/reports', 'Reports', FileText],
  ['/contacts', 'Contacts', Users],
  ['/notifications', 'Notifications', Bell],
  ['/settings', 'Settings', Settings],
  ['/help', 'Help', CircleHelp],
];

function SearchPill() {
  return (
    <span className="text-[#9ba3b9] text-[11px]">
      Search anything…
    </span>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const doLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar relative p-4">
        <div className="px-2 py-2">
          <Logo />
        </div>

        <div className="mt-8 space-y-2">
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={16} />
              <span>{label}</span>

              {label === 'Notifications' && (
                <span className="ml-auto w-4 h-4 rounded-full bg-[#ff3d54] text-white text-[9px] grid place-items-center">
                  3
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <button
          className="sidebar-link w-full mt-4"
          onClick={doLogout}
        >
          <LogOut size={16} />
          Logout
        </button>

        <div className="absolute bottom-6 left-5 right-5 text-[10px] muted">
          Safety is everyone’s responsibility.
        </div>
      </aside>

      <div className="app-main">
        <div className="topbar flex items-center justify-between px-5 md:px-7">
          <button
            className="lg:hidden btn btn-ghost p-2"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs muted">
            <span className="font-black text-[#f31f58]">
              Buddy Aid
            </span>
            <span>/</span>
            <span>Community safety platform</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-[#eee1e7] bg-white text-[11px] muted">
              <SearchPill />
            </div>

            <button
              onClick={() => navigate('/emergency')}
              className="btn btn-primary py-2 px-3 text-[11px]"
            >
              <ShieldAlert size={14} />
              Emergency SOS
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className="block cursor-pointer"
              title="Open Profile"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#fff0f4] grid place-items-center text-xs font-black text-[#f31f58] hover:scale-105 transition-transform">
                  {(user?.name || 'B')
                    .slice(0, 1)
                    .toUpperCase()}
                </div>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden absolute top-[70px] left-3 right-3 z-30 p-3 soft-card">
            {links.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="sidebar-link"
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>
        )}

        <main className="p-4 md:p-7">
          <Outlet />
        </main>

        <div className="mobile-nav">
          {links.slice(0, 5).map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}