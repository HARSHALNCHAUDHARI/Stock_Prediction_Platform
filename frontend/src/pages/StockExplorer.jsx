import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Eye, Star, X } from 'lucide-react';

const StockExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [trendingRes, watchlistRes] = await Promise.all([
        fetch('http://127.0.0.1:5001/api/stocks/trending', { headers }),
        fetch('http://127.0.0.1:5001/api/stocks/watchlist', { headers }),
      ]);

      const trendingData = await trendingRes.json();
      const watchlistData = await watchlistRes.json();

      setTrending(trendingData.trending || []);
      setWatchlist(watchlistData.watchlist || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5001/api/stocks/search?q=${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://127.0.0.1:5001/api/stocks/watchlist', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbol })
      });
      
      setMessage(`${symbol} added to watchlist!`);
      setTimeout(() => setMessage(''), 3000);
      fetchInitialData();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://127.0.0.1:5001/api/stocks/watchlist/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setMessage('Removed from watchlist');
      setTimeout(() => setMessage(''), 3000);
      fetchInitialData();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8">Explore Stocks</h1>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500"
          >
            {message}
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 rounded-xl mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search stocks by symbol or name... (e.g., AAPL, Tesla)"
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="spinner"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              {searchResults.map((stock) => (
                <motion.div
                  key={stock.symbol}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
                >
                  <Link to={`/stocks/${stock.symbol}`} className="flex-1">
                    <h3 className="font-semibold text-white">{stock.symbol}</h3>
                    <p className="text-sm text-gray-400">{stock.name}</p>
                  </Link>
                  <button
                    onClick={() => addToWatchlist(stock.symbol)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Star className="w-5 h-5 text-white" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {searchQuery && searchResults.length === 0 && !loading && (
            <p className="mt-4 text-gray-400 text-center">No results found</p>
          )}
        </motion.div>

        {/* Watchlist */}
        {watchlist.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4">Your Watchlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map((stock) => (
                <motion.div
                  key={stock.id}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="relative p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-all"
                >
                  <button
                    onClick={() => removeFromWatchlist(stock.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                  
                  <Link to={`/stocks/${stock.symbol}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{stock.symbol}</h3>
                      <Eye className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-400 mb-3 truncate">{stock.name}</p>
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trending Stocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Trending Stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stocks/${stock.symbol}`}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-all"
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
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockExplorer;
