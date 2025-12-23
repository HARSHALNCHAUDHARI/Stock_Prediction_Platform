import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Brain,
  Shield,
  Zap,
  DollarSign,
  ArrowRight,
  Newspaper,
  Users,
  Clock,
  Star,
  CheckCircle,
  Activity,
  Sparkles,
  Play,
  ChevronRight,
  Bell,
  Download,
  Smartphone,
  Apple,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Home = () => {
  const [marketData] = useState({
    spy: { price: 485.32, change: 2.45 },
    btc: { price: 42150, change: -1.23 },
    nasdaq: { price: 16240, change: 1.87 },
    gold: { price: 2042.5, change: 0.56 },
  });

  const [tickerStocks] = useState([
    { symbol: 'AAPL', price: 189.45, change: 2.34 },
    { symbol: 'TSLA', price: 242.84, change: -1.45 },
    { symbol: 'NVDA', price: 495.22, change: 5.67 },
    { symbol: 'MSFT', price: 378.91, change: 1.23 },
  ]);

  const features = [
    {
      icon: Brain,
      title: 'AI Predictions',
      description: 'LSTM & Transformer models tuned for short‑term and swing trades.',
      color: 'from-blue-500 to-cyan-500',
      stats: 'Signal accuracy focus',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Microsecond-level feeds, 50+ indicators, and custom dashboards.',
      color: 'from-emerald-500 to-teal-500',
      stats: 'Low-latency data',
    },
    {
      icon: DollarSign,
      title: 'Paper Trading',
      description: '$100K virtual capital with realistic fills and P&L tracking.',
      color: 'from-yellow-500 to-orange-500',
      stats: '$100K sandbox',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'VaR, Sharpe, Beta, and drawdown rules baked into every trade.',
      color: 'from-purple-500 to-pink-500',
      stats: '15+ risk metrics',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized inference pipeline for instant AI signals.',
      color: 'from-orange-500 to-red-500',
      stats: 'Snappy UX',
    },
    {
      icon: Activity,
      title: 'Market Sentiment',
      description: 'News and social sentiment scoring for 10K+ tickers.',
      color: 'from-rose-500 to-red-500',
      stats: 'NLP insights',
    },
  ];

  const trendingStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.34, volume: '52.3M', prediction: 'BUY' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 495.22, change: 5.67, volume: '45.2M', prediction: 'STRONG BUY' },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 1.23, volume: '28.9M', prediction: 'BUY' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -1.45, volume: '98.7M', prediction: 'HOLD' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.8, change: 0.89, volume: '23.4M', prediction: 'BUY' },
    { symbol: 'AMZN', name: 'Amazon.com', price: 151.94, change: -0.67, volume: '41.2M', prediction: 'HOLD' },
  ];

  const latestNews = [
    {
      title: 'Fed hints at 2025 rate cuts as inflation cools further.',
      source: 'Reuters',
      time: '2h ago',
      category: 'Economy',
    },
    {
      title: 'NVIDIA unveils next‑gen AI chips, stock spikes over 5%.',
      source: 'Bloomberg',
      time: '4h ago',
      category: 'Tech',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Day Trader',
      text: '34% returns in 3 months. AI signals and risk controls keep me disciplined.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Investment Analyst',
      text: 'The closest thing to institutional research for independent traders.',
      rating: 5,
    },
  ];

  const showCount = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 6;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-white">
      {/* Ticker Bar */}
      <div className="h-10 md:h-11 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center overflow-hidden">
        <motion.div
          className="flex gap-8 px-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {[...tickerStocks, ...tickerStocks].map((stock, idx) => (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm">
              <span className="font-semibold text-slate-100">{stock.symbol}</span>
              <span className="text-slate-400">${stock.price}</span>
              <span
                className={`flex items-center ${
                  stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-10 right-0 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="text-center relative">
          {/* Compact logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="flex justify-center mb-5"
          >
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/40 border border-white/10">
                <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.4} />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
              <Users className="w-3 h-3" />
              50,000+ traders using AI signals daily
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-3"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Trade Smarter
            </span>
            <br />
            <span className="text-slate-50">With AI‑First Insights</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto text-sm md:text-lg text-slate-300 mb-6 leading-relaxed"
          >
            Combine AI predictions, real‑time analytics, and strict risk controls. Start with{' '}
            <span className="text-emerald-400 font-semibold">$100,000</span> of virtual capital and
            test your strategies safely.
          </motion.p>

          {/* Market cards */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mx-auto max-w-3xl mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'S&P', value: marketData.spy.price, change: marketData.spy.change },
                {
                  name: 'BTC',
                  value: `$${(marketData.btc.price / 1000).toFixed(1)}K`,
                  change: marketData.btc.change,
                },
                {
                  name: 'NASDAQ',
                  value: `${(marketData.nasdaq.price / 1000).toFixed(1)}K`,
                  change: marketData.nasdaq.change,
                },
                { name: 'Gold', value: `$${marketData.gold.price}`, change: marketData.gold.change },
              ].map((m) => (
                <motion.div
                  key={m.name}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-xl bg-slate-900/70 border border-slate-800/80 px-3 py-2.5 text-left shadow-[0_0_20px_rgba(15,23,42,0.9)]"
                >
                  <p className="text-[11px] font-medium text-slate-400 mb-0.5">{m.name}</p>
                  <p className="text-lg font-semibold text-slate-50">{m.value}</p>
                  <p
                    className={`text-[11px] font-semibold ${
                      m.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {m.change >= 0 ? '+' : ''}
                    {m.change}%
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
          >
            <Link
              to="/signup"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 md:px-10 md:py-3.5 text-sm md:text-base font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/60 px-8 py-3 md:px-10 md:py-3.5 text-sm md:text-base font-semibold text-slate-100 hover:border-blue-500/60 hover:bg-slate-900"
            >
              Sign In
            </Link>
          </motion.div>

          {/* small trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4 text-[11px] md:text-xs text-slate-400"
          >
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> No credit card
            </span>
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3 h-3 text-sky-400" /> Risk‑free sandbox
            </span>
            <span className="inline-flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" /> Live market data
            </span>
          </motion.div>
        </div>
      </section>

      {/* Trending Stocks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Trending Stocks Today
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {trendingStocks.slice(0, showCount).map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-blue-500/60 shadow-[0_20px_40px_rgba(15,23,42,0.9)] p-4 cursor-pointer group overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" />
              <div className="relative flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-50">{stock.symbol}</h3>
                  <p className="text-[11px] text-slate-400">{stock.name}</p>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    stock.change >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                  }`}
                >
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change}%
                </div>
              </div>

              <div className="relative flex justify-between items-end mb-3">
                <div>
                  <p className="text-2xl font-bold text-slate-50">${stock.price}</p>
                  <p className="text-[11px] text-slate-500">Vol {stock.volume}</p>
                </div>
                {stock.change >= 0 ? (
                  <TrendingUp className="w-7 h-7 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-7 h-7 text-rose-400" />
                )}
              </div>

              <div className="relative flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center gap-1 text-slate-400">
                  <Brain className="w-3 h-3 text-purple-300" />
                  AI signal
                </div>
                <span
                  className={`font-semibold ${
                    stock.prediction === 'STRONG BUY'
                      ? 'text-emerald-300'
                      : stock.prediction === 'HOLD'
                      ? 'text-amber-300'
                      : 'text-sky-300'
                  }`}
                >
                  {stock.prediction}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/stocks"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-6 py-2.5 text-sm font-semibold text-slate-100 hover:border-blue-500/60 hover:bg-slate-900"
          >
            View all stocks
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Why traders stay here</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="relative rounded-2xl bg-slate-950/70 border border-slate-800/90 p-5 overflow-hidden group"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${feature.color} from-20% to-transparent`}
                />
                <div className="relative">
                  <div
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-lg shadow-slate-900`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 text-slate-50">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 mb-3 leading-relaxed">
                    {feature.description}
                  </p>
                  <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-900/70 border border-white/10 text-[11px] text-slate-100 font-medium">
                    {feature.stats}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Market pulse</h2>
            <p className="text-xs md:text-sm text-slate-400">Curated macro and tech headlines.</p>
          </div>
          <Newspaper className="w-8 h-8 text-sky-400" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {latestNews.map((news, index) => (
            <motion.div
              key={news.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4, borderColor: 'rgb(59 130 246)' }}
              className="rounded-2xl bg-slate-950/70 border border-slate-800/90 p-4 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-[11px] font-semibold text-sky-300">
                  {news.category}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3" />
                  {news.time}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-50 leading-snug mb-1">
                {news.title}
              </h3>
              <p className="text-[11px] text-slate-500">{news.source}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="text-center mb-7">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Traders on StockPredict</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-5"
            >
              <div className="flex mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm md:text-base text-slate-200 italic mb-4 leading-relaxed">
                “{t.text}”
              </p>
              <div className="flex items-center pt-3 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold mr-3">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-50">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass border-2 border-gray-700/50 p-8 md:p-16 rounded-2xl md:rounded-3xl text-center bg-gradient-to-br from-blue-600/10 to-purple-600/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-bold text-xs md:text-sm mb-5 md:mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium free for 3 months
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-5 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Start Trading Like a Pro
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Join thousands of traders using AI predictions, risk tools, and real‑time analytics.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-5 md:mb-6">
              <Link
                to="/signup"
                className="group px-10 md:px-12 py-3.5 md:py-5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-xl text-base md:text-xl font-black transition-all hover:scale-105 shadow-2xl flex items-center justify-center"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/demo"
                className="px-10 md:px-12 py-3.5 md:py-5 glass border-2 border-blue-500 hover:bg-blue-500/20 rounded-xl text-base md:text-xl font-black transition-all hover:scale-105 flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-gray-400">
              {['✓ No card required', '✓ $100K virtual capital', '✓ Real data', '✓ Cancel anytime'].map(
                (text, i) => (
                  <span key={i} className="font-semibold">
                    {text}
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Download App Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-gray-700/50 rounded-3xl p-8 md:p-12 overflow-hidden relative bg-slate-950/80"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 font-bold text-xs md:text-sm mb-6">
                <Smartphone className="w-4 h-4 mr-2" />
                Download the app
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
                Trade Anywhere,
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Anytime
                </span>
              </h2>

              <p className="text-sm md:text-lg text-gray-400 mb-6 md:mb-8 leading-relaxed">
                Access AI predictions, real‑time data, and your complete portfolio on the go. Available
                on iOS and Android.
              </p>

              {/* App store buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center sm:justify-start px-6 py-4 bg-black/50 hover:bg-black/70 rounded-2xl border-2 border-gray-700/50 hover:border-blue-500/50 transition-all"
                >
                  <Apple className="w-8 h-8 mr-3" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase">Download on the</p>
                    <p className="font-bold text-base">App Store</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center sm:justify-start px-6 py-4 bg-black/50 hover:bg-black/70 rounded-2xl border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all"
                >
                  <Download className="w-8 h-8 mr-3" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase">Get it on</p>
                    <p className="font-bold text-base">Google Play</p>
                  </div>
                </motion.button>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: Bell, text: 'Real‑time alerts' },
                  { icon: Shield, text: 'Secure trading' },
                  { icon: Zap, text: 'Lightning fast' },
                ].map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center px-3 py-2 glass border border-gray-700/30 rounded-lg text-xs"
                    >
                      <Icon className="w-3 h-3 text-blue-400 mr-2" />
                      <span className="text-gray-300">{badge.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right content - Phone mockup */}
            <div className="relative">
              <div className="relative glass border-4 border-gray-700/40 rounded-[48px] p-4 md:p-6 shadow-2xl">
                <div className="bg-gray-950 rounded-[36px] overflow-hidden border-2 border-gray-800/50">
                  {/* Status bar */}
                  <div className="bg-gray-900/50 px-6 py-3 flex justify-between items-center text-xs text-gray-400">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <div className="w-4 h-4 rounded-full bg-emerald-500" />
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                    </div>
                  </div>

                  {/* App content preview */}
                  <div className="p-6 space-y-4">
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Portfolio value</p>
                      <p className="text-2xl font-bold text-white">$127,450</p>
                      <p className="text-emerald-400 text-sm">+12.7%</p>
                    </div>

                    <div className="flex items-end justify-between h-24 gap-2">
                      {[60, 80, 50, 90, 70, 95, 75].map((height, i) => (
                        <div
                          key={i}
                          style={{ height: `${height}%` }}
                          className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg"
                        />
                      ))}
                    </div>

                    <div className="space-y-2">
                      {['AAPL', 'NVDA'].map((symbol) => (
                        <div
                          key={symbol}
                          className="glass border border-gray-700/30 rounded-xl p-3 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-white font-bold text-sm">{symbol}</p>
                            <p className="text-gray-500 text-xs">Tech</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-sm">$189.45</p>
                            <p className="text-emerald-400 text-xs">+2.34%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <div className="w-24 h-1.5 bg-gray-600 rounded-full" />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                iOS & Android
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
