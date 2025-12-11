import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Brain, Star, RefreshCw, 
  Activity, Newspaper, AlertCircle, TrendingUpDown, BarChart3 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import Loader from '../components/common/Loader';

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockInfo, setStockInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [period, setPeriod] = useState('1y');
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [symbol, period]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const requests = [
        fetch(`http://127.0.0.1:5001/api/stocks/info/${symbol}`, { headers }),
        fetch(`http://127.0.0.1:5001/api/stocks/historical/${symbol}?period=${period}`, { headers }),
        fetch(`http://127.0.0.1:5001/api/analysis/summary/${symbol}`, { headers }),
        fetch(`http://127.0.0.1:5001/api/analysis/indicators/${symbol}`, { headers }),
        fetch(`http://127.0.0.1:5001/api/analysis/sentiment/${symbol}`, { headers })
      ];

      const [infoRes, histRes, summaryRes, indicatorsRes, sentimentRes] = await Promise.all(requests);

      const infoData = infoRes.ok ? await infoRes.json() : {};
      const histData = histRes.ok ? await histRes.json() : {};
      const summaryData = summaryRes.ok ? await summaryRes.json() : null;
      const indicatorsData = indicatorsRes.ok ? await indicatorsRes.json() : null;
      const sentimentData = sentimentRes.ok ? await sentimentRes.json() : null;

      setStockInfo(infoData.stock ?? null);
      setChartData(histData.data || []);
      setAnalysisSummary(summaryData);
      setIndicators(indicatorsData);
      setSentiment(sentimentData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAnalysisSummary(null);
      setIndicators(null);
      setSentiment(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrediction = async () => {
    setPredictionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:5001/api/predictions/predict/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.ok ? await response.json() : null;
      setPrediction(data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setPredictionLoading(false);
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

  const getSentimentColor = (score) => {
    if (score > 0.1) return 'text-green-400';
    if (score > -0.1) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) return <Loader />;

  const currentPrice = stockInfo?.current_price || 0;
  const previousClose = stockInfo?.previous_close || 0;
  const change = currentPrice - previousClose;
  const changePercent = previousClose
    ? ((change / previousClose) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/stocks" className="flex items-center text-blue-500 hover:text-blue-400 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Stocks
        </Link>

        {/* Stock Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{symbol}</h1>
                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                </button>
              </div>
              <p className="text-gray-400 mb-4">{stockInfo?.name}</p>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-white">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className={`flex items-center text-lg font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change >= 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                  {change >= 0 ? '+' : ''}${Math.abs(change).toFixed(2)} ({changePercent}%)
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchPrediction}
              disabled={predictionLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold transition-all shadow-lg disabled:opacity-50"
            >
              {predictionLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Get AI Prediction</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Market Analysis Cards */}
        {analysisSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          >
            <div className={`glass p-6 rounded-xl border ${getRegimeColor(analysisSummary.regime)}`}>
              <div className="flex items-center mb-3">
                <Activity className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Market Regime</span>
              </div>
              <p className="text-2xl font-bold capitalize">{analysisSummary.regime}</p>
            </div>
            <div className="glass p-6 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">30d Return</p>
              <p className="text-xl font-bold text-green-400">
                {(analysisSummary.current_return * 100).toFixed(1)}%
              </p>
            </div>
            <div className="glass p-6 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Volatility (30d)</p>
              <p className="text-xl font-bold text-orange-400">
                {(analysisSummary.risk.volatility_30d * 100).toFixed(1)}%
              </p>
            </div>
            <div className="glass p-6 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Sharpe Ratio</p>
              <p className={`text-xl font-bold ${getSharpeColor(analysisSummary.risk.sharpe_90d)}`}>
                {analysisSummary.risk.sharpe_90d?.toFixed(2)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Price Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Price Chart ({period})</h2>
              <div className="flex space-x-2">
                {['1mo', '3mo', '6mo', '1y', '2y'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded transition-colors ${
                      period === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} />
                <Tooltip />
                <Area type="monotone" dataKey="close" stroke="#3B82F6" fill="url(#priceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Technical Indicators Chart */}
          {indicators?.rsi && Array.isArray(indicators.rsi) && indicators?.summary && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-xl"
            >
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                <h2 className="text-xl font-bold text-white">RSI (14)</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={indicators.rsi.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rsi" stroke="#10B981" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="upper" stroke="#F59E0B" strokeWidth={1} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="lower" stroke="#F59E0B" strokeWidth={1} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-400">
                  Current:{' '}
                  <span className="font-bold text-emerald-400">
                    {indicators.summary?.rsi?.toFixed(2) ?? 'N/A'}
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Indicators & Sentiment Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Key Indicators */}
          {indicators?.summary && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUpDown className="w-5 h-5 mr-2 text-purple-400" />
                Technical Indicators
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">RSI (14)</p>
                  <p
                    className={`font-bold ${
                      (indicators.summary.rsi ?? 50) > 70
                        ? 'text-red-400'
                        : (indicators.summary.rsi ?? 50) < 30
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {indicators.summary.rsi?.toFixed(2) ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">MACD Signal</p>
                  <p
                    className={`font-bold ${
                      indicators.summary.macd_signal === 'BUY'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {indicators.summary.macd_signal ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">BB Position</p>
                  <p className="font-bold text-blue-400">
                    {indicators.summary.bb_position?.toFixed(2) ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">ADX Trend</p>
                  <p
                    className={`font-bold ${
                      (indicators.summary.adx ?? 0) > 25
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {indicators.summary.adx?.toFixed(1) ?? 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* News Sentiment */}
          {sentiment && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Newspaper className="w-5 h-5 mr-2 text-orange-400" />
                News Sentiment
              </h2>
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full mx-auto mb-4 ${getSentimentColor(
                    sentiment.score
                  )} border-4 border-opacity-20 flex items-center justify-center`}
                >
                  <span className="text-2xl font-bold">
                    {(sentiment.score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Signal:{' '}
                  <span className="font-bold capitalize">
                    {sentiment.signal}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {sentiment.articles_count} articles analyzed
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Prediction Results */}
        {prediction && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl mb-6 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-emerald-500/30"
          >
            <h2 className="text-xl font-bold text-white mb-4">AI Prediction</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {prediction.predictions?.map((pred, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center border ${
                    pred.direction === 'UP'
                      ? 'bg-green-500/20 border-green-500/30'
                      : 'bg-red-500/20 border-red-500/30'
                  }`}
                >
                  <p className="text-xs text-gray-400 mb-1">{pred.date}</p>
                  <p className="text-lg font-bold text-white">
                    ${pred.predicted_price.toFixed(2)}
                  </p>
                  <p
                    className={`font-semibold ${
                      pred.direction === 'UP'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {pred.direction}
                  </p>
                  <p className="text-xs text-gray-400">
                    {pred.confidence?.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Model: <span className="font-semibold">{prediction.model}</span> |{' '}
              {prediction.note}
            </p>
          </motion.div>
        )}

        {/* Stats & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Key Statistics */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">Key Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Open</span>
                <span>${stockInfo?.open?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High</span>
                <span>${stockInfo?.day_high?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low</span>
                <span>${stockInfo?.day_low?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume</span>
                <span>{stockInfo?.volume?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap</span>
                <span>
                  ${(stockInfo?.market_cap / 1e9)?.toFixed(2)}B
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">P/E Ratio</span>
                <span>{stockInfo?.pe_ratio?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">Company Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Sector</span>
                <span>{stockInfo?.sector || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Industry</span>
                <span>{stockInfo?.industry || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">52W High</span>
                <span>${stockInfo?.['52_week_high']?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">52W Low</span>
                <span>${stockInfo?.['52_week_low']?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Beta</span>
                <span>{stockInfo?.beta?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        {stockInfo?.description && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-400 leading-relaxed">
              {stockInfo.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StockDetail;
