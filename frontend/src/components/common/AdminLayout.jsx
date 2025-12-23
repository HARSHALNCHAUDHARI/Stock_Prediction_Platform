// src/components/common/AdminLayout.jsx
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, BarChart3, FileText } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const itemClass = (href) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
      path.startsWith(href)
        ? 'bg-slate-800 text-white'
        : 'text-gray-300 hover:text-white hover:bg-slate-800/80'
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Shield className="w-6 h-6 text-purple-400" />
          <div>
            <p className="text-sm font-semibold text-gray-300">StockPredict</p>
            <p className="text-xs text-purple-300/80">Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-1 text-sm flex-1">
          <Link to="/admin/dashboard" className={itemClass('/admin/dashboard')}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className={itemClass('/admin/users')}>
            <Users className="w-4 h-4" />
            <span>Users</span>
          </Link>
          <Link to="/admin/models" className={itemClass('/admin/models')}>
            <BarChart3 className="w-4 h-4" />
            <span>Models</span>
          </Link>
          <Link to="/admin/reports" className={itemClass('/admin/reports')}>
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </Link>
        </nav>

        <p className="mt-4 text-[11px] text-slate-500 px-2">
          Admin-only tools for monitoring users, models, and platform health.
        </p>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
