import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  BarChart2,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  UserMinus,
  UserCheck,
  Crown,
  RefreshCw,
  FileText,
  Cpu,
} from 'lucide-react';
import Loader from '../components/common/Loader';
import api, { adminAPI } from '../services/api';

const AdminDashboard = ({ section = 'overview' }) => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [models, setModels] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, reportsRes] = await Promise.all([
          adminAPI.getStats(),                    // /api/admin/stats
          adminAPI.listUsers().catch(() => ({ data: [] })),
          adminAPI.listReports().catch(() => ({ data: [] })),
        ]);

        setStats(statsRes.data);
        setUsersList(usersRes.data || []);
        setReports(
          reportsRes.data && reportsRes.data.length
            ? reportsRes.data
            : [
                {
                  id: 1,
                  name: 'Daily Platform Summary',
                  last_generated: 'N/A',
                  status: 'idle',
                },
                {
                  id: 2,
                  name: 'Weekly Risk Report',
                  last_generated: 'N/A',
                  status: 'idle',
                },
              ]
        );

        // For now models are mock cards; later you can fill from backend
        setModels([
          {
            id: 1,
            name: 'LSTM Price Predictor',
            type: 'LSTM',
            status: 'healthy',
            last_trained: '2025-12-10 22:30',
            accuracy: 0.93,
            errors_24h: 0,
          },
          {
            id: 2,
            name: 'XGBoost Alpha Model',
            type: 'XGBoost',
            status: 'training',
            last_trained: '2025-12-09 18:15',
            accuracy: 0.89,
            errors_24h: 3,
          },
        ]);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleToggleActive = async (userId, current) => {
    try {
      setActionLoading(true);
      await adminAPI.updateUser(userId, { is_active: !current });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !current } : u))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, current) => {
    try {
      setActionLoading(true);
      await adminAPI.updateUser(userId, { is_admin: !current });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_admin: !current } : u))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerReport = async (reportId) => {
    try {
      setActionLoading(true);
      await adminAPI.runReport(reportId);
      const now = new Date().toISOString();
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: 'running', last_generated: now }
            : r
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to trigger report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const res = await api.get(`/admin/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download report');
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="glass p-6 rounded-2xl max-w-md w-full text-center border border-red-500/40">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { users, activity, performance, top_symbols } = stats || {};
  const totalPnl = performance?.total_pnl || 0;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Common header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Platform-wide tools for monitoring users, models, predictions, and reports.
            </p>
          </div>
          <div className="glass px-4 py-2 rounded-xl flex items-center space-x-2 border border-emerald-500/40">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-200">Admin Mode</span>
          </div>
        </motion.div>

        {/* OVERVIEW SECTION */}
        {section === 'overview' && (
          <>
            {/* Top stat cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatCard
                icon={Users}
                label="Total Users"
                value={users?.total || 0}
                caption={`${users?.active || 0} active`}
              />
              <StatCard
                icon={Activity}
                label="Total Trades"
                value={activity?.trades || 0}
                caption={`${activity?.predictions || 0} predictions`}
              />
              <StatCard
                icon={TrendingUp}
                label="Total P&L"
                value={totalPnl.toFixed(2)}
                prefix="$"
                positive={totalPnl >= 0}
              />
              <StatCard
                icon={Crown}
                label="Admin Accounts"
                value={users?.admins || 0}
                caption="With elevated access"
              />
            </motion.div>

            {/* Top symbols & quick insights */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Top symbols */}
              <div className="glass p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-sky-400" />
                    Top Traded Symbols
                  </h2>
                  <span className="text-xs text-gray-400">
                    {top_symbols?.length || 0} symbols
                  </span>
                </div>
                {(!top_symbols || !top_symbols.length) && (
                  <p className="text-gray-400 text-sm py-4">No trading activity yet.</p>
                )}
                {top_symbols && top_symbols.length > 0 && (
                  <div className="space-y-2">
                    {top_symbols.map((s) => (
                      <div
                        key={s.symbol}
                        className="flex items-center justify-between rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{s.symbol}</p>
                          <p className="text-xs text-gray-400">
                            {s.trade_count} trades · ${s.total_volume.toFixed(2)}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform health */}
              <div className="glass p-5 rounded-2xl">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Platform Health
                </h2>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Users and trades overview based on live database stats.</li>
                  <li>• Use Users tab to manage accounts and permissions.</li>
                  <li>• Use Reports tab to generate downloadable CSV summaries.</li>
                </ul>
              </div>
            </motion.div>
          </>
        )}

        {/* USERS SECTION */}
        {section === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Users
              </h2>
              {actionLoading && (
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              )}
            </div>
            {usersList.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase text-gray-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 pr-4">User</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} className="border-b border-slate-900/60">
                        <td className="py-2 pr-4">{u.username}</td>
                        <td className="py-2 pr-4">{u.email}</td>
                        <td className="py-2 pr-4">
                          {u.is_admin ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-[11px] text-purple-300 border border-purple-500/40">
                              <Crown className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2 py-0.5 text-[11px] text-slate-200 border border-slate-500/40">
                              User
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                              <UserCheck className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-300">
                              <UserMinus className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-xs text-gray-400">
                          {new Date(u.created_at).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleActive(u.id, u.is_active)}
                            className="text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700"
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                            className="text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700"
                          >
                            {u.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* MODELS SECTION (mock cards for now) */}
        {section === 'models' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                Models
              </h2>
            </div>
            {models.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">
                No models configured yet. Connect your ML models to see performance here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.type} model</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                          m.status === 'healthy'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                            : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40'
                        }`}
                      >
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-300 mt-2">
                      <span>Accuracy: {(m.accuracy * 100).toFixed(1)}%</span>
                      <span>Errors (24h): {m.errors_24h}</span>
                      <span>Last trained: {m.last_trained}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* REPORTS SECTION */}
        {section === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                Reports
              </h2>
              {actionLoading && (
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running report...
                </span>
              )}
            </div>
            {reports.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No reports configured yet.</p>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between border border-gray-700 rounded-xl px-4 py-3 bg-gray-900/60"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{r.name}</p>
                      <p className="text-xs text-gray-400">
                        Last generated: {r.last_generated}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                          r.status === 'sent'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                            : r.status === 'running'
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40'
                            : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleTriggerReport(r.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Run
                      </button>
                      <button
                        onClick={() => handleDownloadReport(r.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, caption, prefix = '', positive }) => (
  <div className="glass p-4 rounded-2xl flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400">{label}</p>
      <Icon className="w-4 h-4 text-purple-400" />
    </div>
    <div className="mt-2">
      <p className="text-xl font-semibold text-white">
        {prefix}
        {value}
      </p>
      {caption && (
        <p className="text-xs text-gray-400 mt-1">
          {caption}{' '}
          {typeof positive === 'boolean' && (
            <span className={positive ? 'text-emerald-400' : 'text-red-400'}>
              {positive ? '↑' : '↓'}
            </span>
          )}
        </p>
      )}
    </div>
  </div>
);

export default AdminDashboard;
