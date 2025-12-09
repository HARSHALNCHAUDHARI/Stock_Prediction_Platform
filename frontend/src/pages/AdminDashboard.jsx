import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, BarChart2, ShieldCheck, ArrowUpRight, TrendingUp, AlertTriangle } from 'lucide-react';
import Loader from '../components/common/Loader';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Platform-wide metrics for users, predictions, and trading activity
            </p>
          </div>
          <div className="glass px-4 py-2 rounded-xl flex items-center space-x-2 border border-emerald-500/40">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-200">Admin Mode</span>
          </div>
        </motion.div>

        {/* Top Stat Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs uppercase tracking-wide">Total Users</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{users?.total || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {users?.active || 0} active · {users?.admins || 0} admins
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs uppercase tracking-wide">Predictions</span>
              <BarChart2 className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">{activity?.predictions || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {activity?.trades || 0} trades · {activity?.watchlist_items || 0} watchlist entries
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs uppercase tracking-wide">Total P&L</span>
              <TrendingUp className={`w-5 h-5 ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            <p className={`text-3xl font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnl >= 0 ? '+' : '-'}${Math.abs(totalPnl).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Aggregated user performance</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs uppercase tracking-wide">Portfolios</span>
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white">{activity?.portfolios || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Users with active holdings</p>
          </div>
        </motion.div>

        {/* Top Symbols Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Top Symbols by Activity</h2>
            <span className="text-xs text-gray-400 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              last 5 by trade count
            </span>
          </div>
          {(!top_symbols || top_symbols.length === 0) ? (
            <p className="text-gray-400 text-sm py-4">No trading activity recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Symbol</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Trades</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Turnover ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {top_symbols.map((row) => (
                    <tr key={row.symbol} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-4 text-white font-semibold">{row.symbol}</td>
                      <td className="py-3 px-4 text-right text-gray-200">{row.trade_count}</td>
                      <td className="py-3 px-4 text-right text-gray-200">
                        {row.total_volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
