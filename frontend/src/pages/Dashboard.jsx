import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Briefcase, Eye, Activity, 
  ArrowUpRight, ArrowDownRight, Brain, BarChart3, AlertCircle 
} from 'lucide-react';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [trending, setTrending] = useState([]);
  const [marketOverview, setMarketOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [balanceRes, portfolioRes, watchlistRes, trendingRes] = await Promise.all([
        fetch('http://127.0.0.1:5001/api/trading/balance', { headers }),
        fetch('http://127.0.0.1:5001/api/trading/portfolio', { headers }),
        fetch('http://127.0.0.1:5001/api/stocks/watchlist', { headers }),
        fetch('http://127.0.0.1:5001/api/stocks/trending', { headers }),
      ]);

      const balanceData = await balanceRes.json();
      const portfolioData = await portfolioRes.json();
      const watchlistData = await watchlistRes.json();
      const trendingData = await trendingRes.json();

      setBalance(balanceData.balance);
      setPortfolio(portfolioData.portfolio || []);
      setWatchlist(watchlistData.watchlist || []);
      setTrending(trendingData.trending || []);

      // NEW: Fetch market analysis for top 3 watchlist stocks
      if (watchlistData.watchlist?.length > 0) {
        const topSymbols = watchlistData.watchlist.slice(0, 3).map(s => s.symbol);
        const overviewPromises = topSymbols.map(symbol =>
          fetch(`http://127.0.0.1:5001/api/analysis/summary/${symbol}`, { headers })
            .then(res => res.json())
            .catch(() => null)
        );
        const overviews = (await Promise.all(overviewPromises)).filter(Boolean);
        setMarketOverview(overviews);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const totalValue = (balance?.cash_balance || 0) + (balance?.total_portfolio_value || 0);
  const profitLoss = balance?.total_profit_loss || 0;
  const profitLossPercent = totalValue > 0 ? ((profitLoss / totalValue) * 100).toFixed(2) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const getRegimeColor = (regime) => {
    switch (regime) {
      case 'bull': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'bear': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'sideways': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high_vol': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSharpeColor = (sharpe) => {
    if (sharpe > 1) return 'text-green-400';
    if (sharpe > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your portfolio overview</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Value */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Value</span>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              ${totalValue.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Portfolio + Cash</p>
          </motion.div>

          {/* Cash Balance */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Cash Balance</span>
              <Briefcase className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              ${(balance?.cash_balance || 0).toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Available to trade</p>
          </motion.div>

          {/* Portfolio Value */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Portfolio Value</span>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              ${(balance?.total_portfolio_value || 0).toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{portfolio.length} holdings</p>
          </motion.div>

          {/* Profit/Loss */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total P&L</span>
              {profitLoss >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              )}
            </div>
            <h3 className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profitLoss >= 0 ? '+' : ''}${Math.abs(profitLoss).toLocaleString()}
            </h3>
            <p className={`text-xs mt-1 ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profitLoss >= 0 ? '+' : ''}{profitLossPercent}%
            </p>
          </motion.div>
        </motion.div>

        {/* NEW: Market Overview Cards */}
        {marketOverview.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {marketOverview.map((overview, index) => (
              <motion.div 
                key={overview.symbol || index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`glass p-6 rounded-xl border-2 ${getRegimeColor(overview.regime)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Link 
                    to={`/stocks/${overview.symbol}`}
                    className="font-bold text-white hover:text-blue-400 transition-colors"
                  >
                    {overview.symbol}
                  </Link>
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                
                {/* Regime Badge */}
                <div className="mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getRegimeColor(overview.regime)}`}>
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {overview.regime}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">30d Return</p>
                    <p className="font-bold text-green-400">
                      {((overview.current_return || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Volatility</p>
                    <p className="font-bold text-orange-400">
                      {((overview.risk?.volatility_30d || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Sharpe Ratio</p>
                    <p className={`font-bold ${getSharpeColor(overview.risk?.sharpe_90d)}`}>
                      {overview.risk?.sharpe_90d?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Max Drawdown</p>
                    <p className="font-bold text-red-400">
                      {((overview.risk?.max_drawdown || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="text-center pt-2 border-t border-gray-700">
                  <Link 
                    to={`/stocks/${overview.symbol}`}
                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors"
                  >
                    View Analysis →
                  </Link>
                </div>
              </motion.div>
            ))}
            {watchlist.length > 3 && (
              <motion.div 
                variants={itemVariants}
                className="glass p-6 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-blue-500 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Link to="/stocks" className="text-center">
                  <Eye className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">More Watchlist Analysis</h3>
                  <p className="text-gray-400 mb-3">View {watchlist.length - 3} more stocks</p>
                  <span className="text-blue-400 hover:text-blue-300 font-semibold">Go to Stocks →</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Portfolio Holdings & Watchlist */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Portfolio */}
          <motion.div variants={itemVariants} className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Your Portfolio</h2>
              <Link to="/trading" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                View All →
              </Link>
            </div>
            {portfolio.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No holdings yet</p>
                <Link to="/stocks" className="text-blue-500 hover:text-blue-400 text-sm mt-2 inline-block">
                  Start Trading →
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {portfolio.slice(0, 5).map((holding) => (
                  <motion.div
                    key={holding.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-white">{holding.symbol}</h3>
                      <p className="text-sm text-gray-400">
                        {holding.quantity} shares @ ${holding.current_price?.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        ${holding.current_value?.toFixed(2)}
                      </p>
                      <p className={`text-sm ${holding.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.profit_loss >= 0 ? '+' : ''}${holding.profit_loss?.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Watchlist */}
          <motion.div variants={itemVariants} className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Watchlist</h2>
              <Link to="/stocks" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                Manage →
              </Link>
            </div>
            {watchlist.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No stocks in watchlist</p>
                <Link to="/stocks" className="text-blue-500 hover:text-blue-400 text-sm mt-2 inline-block">
                  Add Stocks →
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {watchlist.slice(0, 5).map((stock) => (
                  <Link
                    key={stock.id}
                    to={`/stocks/${stock.symbol}`}
                    className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors block"
                  >
                    <div>
                      <h3 className="font-semibold text-white">{stock.symbol}</h3>
                      <p className="text-sm text-gray-400 truncate">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        ${stock.current_price?.toFixed(2) || 'N/A'}
                      </p>
                      {stock.change_percent && (
                        <p className={`text-sm ${stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Trending Stocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Trending Stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stocks/${stock.symbol}`}
                className="p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">{stock.symbol}</h3>
                  {stock.change_percent >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2 truncate">{stock.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    ${stock.current_price?.toFixed(2) || 'N/A'}
                  </span>
                  {stock.change_percent && (
                    <span className={`text-sm font-semibold ${stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
