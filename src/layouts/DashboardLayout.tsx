import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import {
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  User as UserIcon,
  LayoutDashboard,
  ShieldCheck,
  GitMerge,
  RefreshCw,
  Building,
  X
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { name: 'Accounts', href: '/dashboard/accounts', icon: Building, roles: ['admin'] },
    { name: 'Contacts', href: '/dashboard/contacts', icon: Users, roles: ['admin', 'customer'] },
    { name: 'Users List', href: '/dashboard/users', icon: ShieldCheck, roles: ['admin'] },
    { name: 'Merge Accounts', href: '/dashboard/merge-accounts', icon: GitMerge, roles: [] }, // Hide for now
    { name: 'Zoho CRM Sync', href: '/dashboard/zoho-sync', icon: RefreshCw, roles: ['admin'] },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon, roles: ['admin', 'customer'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin', 'customer'] },
  ].filter(item => {
    if (item.roles.length === 0) return false;
    const userRole = user?.role || 'customer';
    return item.roles.includes(userRole);
  });

  const currentNav = navigation.find(n => location.pathname === n.href) || navigation[0];

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 flex flex-col bg-slate-950 border-r border-white/5 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-sidebar translate-x-0' : 'w-0 md:w-20 -translate-x-full md:translate-x-0'
          }`}
      >
        <div className="h-topbar flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <h1 className={`text-xl font-bold text-white tracking-tighter transition-opacity duration-200 ${!isSidebarOpen && 'md:opacity-0'
            }`}>
            STUDIO <span className="text-indigo-500">GRAVITY</span>
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4 overflow-x-hidden">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-item group relative ${isActive ? 'active' : ''} ${!isSidebarOpen && 'md:justify-center px-0'
                  }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                <span className={`transition-opacity duration-200 ${!isSidebarOpen && 'md:hidden'}`}>
                  {item.name}
                </span>
                {isActive && isSidebarOpen && <ChevronRight className="ml-auto h-4 w-4" />}

                {/* Tooltip for collapsed mode */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-indigo-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 shrink-0">
          <button
            onClick={logout}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg gap-3 transition-all ${!isSidebarOpen && 'md:justify-center px-0'
              }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={`transition-opacity duration-200 ${!isSidebarOpen && 'md:hidden'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Topbar */}
        <header className="h-topbar bg-slate-950/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-white truncate max-w-[200px]">
              {currentNav.name}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg shadow-indigo-500/20">
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
              </div>
              <div className="text-sm hidden sm:block text-left">
                <p className="font-bold text-white leading-none mb-1">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-slate-500 leading-none truncate max-w-[120px]">
                  {user?.email}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-950/20">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
