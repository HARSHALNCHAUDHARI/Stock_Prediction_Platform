import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  LogOut,
  User,
  Home,
  BarChart3,
  ShoppingCart,
  BookOpen,
  Shield,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900/95 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">StockPredict</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {/* User portal links – only for non-admin OR for admins when they are in user mode */}
              {!isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/stocks"
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Stocks</span>
                  </Link>
                  <Link
                    to="/trading"
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Trading</span>
                  </Link>
                  <Link
                    to="/learning"
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Learn</span>
                  </Link>
                </>
              )}

              {/* Admin portal links */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                  {/* if you still want admins to see user dashboard links, add them here too */}
                </>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/profile'}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">
                    {user?.username}
                    {isAdmin && <span className="ml-1 text-xs text-purple-400">(Admin)</span>}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
