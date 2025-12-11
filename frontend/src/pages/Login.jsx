import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user'); // "user" | "admin"
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // call backend – this will return user with is_admin
      const user = await login({ username, password });

      // ENFORCE TAB RULES
      if (loginType === 'user' && user.is_admin) {
        setError('This is an admin account. Please use the Admin Login tab.');
        return; // IMPORTANT: stop here, do NOT navigate
      }

      if (loginType === 'admin' && !user.is_admin) {
        setError('This account is not admin. Please use the User Login tab.');
        return; // IMPORTANT
      }

      // Redirect by role (only if above checks pass)
      if (user.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo / heading */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.7, bounce: 0.4 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/40 blur-3xl rounded-3xl" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 via-sky-500 to-indigo-500 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                <TrendingUp className="w-9 h-9 text-white" />
              </div>
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            StockPredict AI
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-400">
            AI-powered stock market predictions & paper trading
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-slate-900/70 to-slate-950/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.75)] p-8 space-y-6"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
              Secure Login
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Choose your portal and sign in with your credentials.
          </p>

          {/* User / Admin toggle */}
          <div className="mt-4 mb-2">
            <div className="flex rounded-full bg-slate-900/70 border border-slate-700/70 p-1">
              <button
                type="button"
                onClick={() => setLoginType('user')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                  loginType === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.6)]'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                User Login
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                  loginType === 'admin'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.6)]'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                Admin Login
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-red-300">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-gray-300 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-11 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl text-sm md:text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 shadow-[0_18px_45px_rgba(37,99,235,0.55)] hover:shadow-[0_22px_55px_rgba(37,99,235,0.75)] transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          <div className="mt-5 text-center text-xs text-gray-400">
            <p>
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 rounded-xl border border-amber-400/40 bg-amber-500/10 text-[11px] text-amber-300 text-center">
            <strong>Demo Admin:</strong> admin / admin123
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
