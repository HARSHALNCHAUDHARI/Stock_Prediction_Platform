import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, ShoppingCart, Package, Search, X,
  Plus, Minus, History, ArrowRight, RefreshCw, AlertCircle, Brain 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import Loader from '../components/common/Loader';

const Trading = () => {
  const [balance, setBalance] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState('buy'); // 'buy' or 'sell'
  const [loading, setLoading] = useState(true);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [portfolioHistory, setPortfolioHistory] = useState([]);

  useEffect(() => {
    fetchTradingData();
    const interval = setInterval(fetchTradingData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchTradingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [balanceRes, portfolioRes, transactionsRes, historyRes] = await Promise.all([
        fetch('http://127.0.0.1:5001/api/trading/balance', { headers }),
        fetch('http://127.0.0.1:5001/api/trading/portfolio', { headers }),
        fetch('http://127.0.0.1:5001/api/trading/transactions?limit=20', { headers }),
        fetch('http://127.0.0.1:5001/api/trading/portfolio-history', { headers })
      ]);

      const balanceData = await balanceRes.json();
      const portfolioData = await portfolioRes.json();
      const transactionsData = await transactionsRes.json();
      const historyData = await historyRes.json();

      setBalance(balanceData.balance);
      setPortfolio(portfolioData.portfolio || []);
      setTransactions(transactionsData.transactions || []);
      setPortfolioHistory(historyData.history || []);
    } catch (error) {
      console.error('Error fetching trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5001/api/stocks/search?q=${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching stocks:', error);
    }
  };

  const selectStock = (stock) => {
    setSelectedStock(stock);
    setSearchQuery(stock.symbol);
    setSearchResults([]);
  };

  const executeTrade = async () => {
    if (!selectedStock || quantity <= 0) {
      setMessage('Please select a stock and valid quantity');
      return;
    }

    setTradeLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = action === 'buy' ? 'buy' : 'sell';
      
      const res = await fetch(`http://127.0.0.1:5001/api/trading/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          quantity: parseFloat(quantity),
          price: selectedStock.current_price || selectedStock.price
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(`Successfully ${action.toUpperCase()} ${quantity} shares of ${selectedStock.symbol}!`);
        setQuantity(1);
        setAction('buy');
        setSelectedStock(null);
        setSearchQuery('');
        setTimeout(() => setMessage(''), 4000);
        fetchTradingData();
      } else {
        setMessage(data.error || 'Trade failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setTradeLoading(false);
    }
  };

  const getPortfolioPnLChartData = () => {
    return portfolioHistory.map(item => ({
      date: item.date,
      value: item.total_value,
      pnl: item.profit_loss
    }));
  };

  if (loading) return <Loader />;

  const totalValue = (balance?.cash_balance || 0) + (balance?.total_portfolio_value || 0);
  const totalPnL = balance?.total_profit_loss || 0;
  const estTradeValue = selectedStock ? (selectedStock.current_price || selectedStock.price || 0) * quantity : 0;
  const canBuy = balance?.cash_balance >= estTradeValue;
  const portfolioHolding = portfolio.find(p => p.symbol === selectedStock?.symbol);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Paper Trading</h1>
            <p className="text-gray-400">Execute trades and track your portfolio performance</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={fetchTradingData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-all"
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Refresh</span>
          </motion.button>
        </motion.div>

        {/* Success/Error Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-xl backdrop-blur-sm ${
              message.includes('Successfully') 
                ? 'bg-green-500/10 border-2 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-2 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center">
              {message.includes('Successfully') ? <TrendingUp className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
              <span>{message}</span>
            </div>
          </motion.div>
        )}

        {/* Balance Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Value</span>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</h3>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Cash Balance</span>
              <Package className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              ${(balance?.cash_balance || 0).toLocaleString()}
            </h3>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Portfolio Value</span>
              <ShoppingCart className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              ${(balance?.total_portfolio_value || 0).toLocaleString()}
            </h3>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total P&L</span>
              {totalPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <h3 className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnL >= 0 ? '+' : ''}${Math.abs(totalPnL).toLocaleString()}
            </h3>
          </div>
        </motion.div>

        {/* Trading Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl mb-8 lg:max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-400" />
            Quick Trade
          </h2>

          {/* Stock Search */}
          <div className="relative mb-6">
            <div className="relative mb-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search stocks (AAPL, TSLA, MSFT...)"
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-white 
                          focus:outline-none focus:border-blue-500 transition-all backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 border border-gray-700 
                             rounded-2xl max-h-60 overflow-y-auto z-20 backdrop-blur-sm shadow-2xl">
                {searchResults.slice(0, 6).map((stock) => (
                  <motion.button
                    key={stock.symbol}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    onClick={() => selectStock(stock)}
                    className="w-full px-6 py-4 text-left border-b border-gray-700 last:border-b-0 
                               hover:bg-blue-500/10 transition-all first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="font-bold text-white text-lg">{stock.symbol}</div>
                    <div className="text-gray-400 text-sm truncate">{stock.name}</div>
                    {stock.current_price && (
                      <div className="text-emerald-400 font-semibold mt-1">
                        ${stock.current_price.toFixed(2)}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Trade Controls */}
          {selectedStock && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Action Buttons */}
                <div className="md:col-span-2">
                  <div className="flex space-x-3 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAction('buy')}
                      className={`flex-1 p-4 rounded-xl font-semibold transition-all shadow-lg ${
                        action === 'buy'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/25'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-2 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Plus className="w-5 h-5 mr-2 inline" />
                      Buy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAction('sell')}
                      className={`flex-1 p-4 rounded-xl font-semibold transition-all shadow-lg ${
                        action === 'sell'
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border-2 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Minus className="w-5 h-5 mr-2 inline" />
                      Sell
                    </motion.button>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Quantity {portfolioHolding && action === 'sell' && `(Max: ${portfolioHolding.quantity})`}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={action === 'sell' && portfolioHolding ? portfolioHolding.quantity : undefined}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white 
                                focus:outline-none focus:border-blue-500 text-lg font-semibold transition-all 
                                backdrop-blur-sm"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Trade Summary */}
                <div className="glass p-6 rounded-2xl border-2 border-gray-700 md:mt-0 mt-4">
                  <div className="text-center mb-4">
                    <div className="font-bold text-white text-xl mb-1">{selectedStock.symbol}</div>
                    <div className="text-gray-400 text-sm mb-2">{selectedStock.name}</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${(selectedStock.current_price || selectedStock.price || 0).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. Value:</span>
                      <span className="font-bold text-white">${estTradeValue.toLocaleString()}</span>
                    </div>
                    {action === 'buy' && balance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cash needed:</span>
                        <span className={`font-bold ${canBuy ? 'text-green-400' : 'text-red-400'}`}>
                          {canBuy ? '✓ Available' : `✗ $${(estTradeValue - balance.cash_balance).toFixed(2)} short`}
                        </span>
                      </div>
                    )}
                    {action === 'sell' && portfolioHolding && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current holding:</span>
                        <span className="font-bold text-blue-400">{portfolioHolding.quantity} shares</span>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={executeTrade}
                    disabled={!selectedStock || tradeLoading || quantity <= 0 || 
                             (action === 'buy' && !canBuy) || 
                             (action === 'sell' && (!portfolioHolding || quantity > portfolioHolding.quantity))}
                    className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 
                               hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl 
                               shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex 
                               items-center justify-center space-x-2 text-lg"
                  >
                    {tradeLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        {action === 'buy' ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                        <span>{action.toUpperCase()} {quantity} SHARES</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Portfolio & History Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Holdings */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">Portfolio Holdings</h2>
            {portfolio.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Holdings</h3>
                <p className="text-gray-400 mb-6">Start trading to build your portfolio</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => handleSearch('AAPL')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Quick Buy AAPL
                  </button>
                  <Link 
                    to="/stocks" 
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl transition-colors"
                  >
                    Browse Stocks
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {portfolio.map((holding) => (
                  <motion.div
                    key={holding.symbol}
                    whileHover={{ scale: 1.02 }}
                    className="glass p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedStock(holding);
                      setAction('sell');
                      setQuantity(1);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-lg">{holding.symbol}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        holding.profit_loss >= 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {holding.profit_loss_percent?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Quantity</p>
                        <p className="font-semibold text-white">{holding.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Avg Price</p>
                        <p className="font-semibold text-white">${holding.avg_buy_price?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Current</p>
                        <p className="font-semibold text-emerald-400">${holding.current_price?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Value</p>
                        <p className="font-bold text-white">${holding.current_value?.toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Portfolio Performance Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">Portfolio Performance</h2>
            {portfolioHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getPortfolioPnLChartData()}>
                  <defs>
                    <linearGradient id="pnlColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#pnlColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <TrendingUp className="w-16 h-16 mb-4 opacity-40" />
                <p className="text-center">Portfolio history will appear here</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <History className="w-5 h-5 mr-2 text-blue-400" />
              Recent Transactions
            </h2>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No transactions yet</p>
              <p className="text-gray-500">Make your first trade above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Type</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Symbol</th>
                    <th className="text-right py-4 px-6 text-gray-400 font-semibold">Qty</th>
                    <th className="text-right py-4 px-6 text-gray-400 font-semibold">Price</th>
                    <th className="text-right py-4 px-6 text-gray-400 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6 text-gray-400 text-sm">
                        {new Date(txn.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          txn.transaction_type === 'BUY'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {txn.transaction_type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-white">{txn.symbol}</td>
                      <td className="py-4 px-6 text-right text-white font-mono">{txn.quantity}</td>
                      <td className="py-4 px-6 text-right text-white">${txn.price?.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right font-bold text-emerald-400">
                        ${txn.total_amount?.toFixed(2)}
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

export default Trading;
