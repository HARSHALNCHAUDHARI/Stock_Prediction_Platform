import { Link } from 'react-router-dom';
import { 
  TrendingUp, BarChart3, Brain, Shield, Zap, DollarSign, 
  ArrowRight, TrendingDown, Newspaper, BookOpen, Users, 
  Clock, Star, CheckCircle, Activity, Globe, Sparkles,
  LineChart, Target, Award, Play, ChevronRight, Bell, Download, 
  Smartphone, Monitor, Apple, Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Home = () => {
  const [marketData] = useState({
    spy: { price: 485.32, change: 2.45 },
    btc: { price: 42150, change: -1.23 },
    nasdaq: { price: 16240, change: 1.87 },
    gold: { price: 2042.50, change: 0.56 }
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
      description: 'LSTM & Transformer models with 95%+ accuracy',
      color: 'from-blue-500 to-cyan-500',
      stats: '95% accuracy'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Sub-millisecond data feeds, 50+ technical indicators',
      color: 'from-emerald-500 to-teal-500',
      stats: '<1ms latency'
    },
    {
      icon: DollarSign,
      title: 'Paper Trading',
      description: '$100K virtual capital, real market conditions',
      color: 'from-yellow-500 to-orange-500',
      stats: '$100K capital'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'VaR, Sharpe Ratio, Beta, max drawdown analysis',
      color: 'from-purple-500 to-pink-500',
      stats: '15+ metrics'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized ML inference, 99.99% uptime SLA',
      color: 'from-orange-500 to-red-500',
      stats: '99.99% uptime'
    },
    {
      icon: Activity,
      title: 'Market Sentiment',
      description: 'NLP-powered news analysis from 10K+ sources',
      color: 'from-rose-500 to-red-500',
      stats: '10K+ sources'
    },
  ];

  const trendingStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.34, volume: '52.3M', prediction: 'BUY' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 495.22, change: 5.67, volume: '45.2M', prediction: 'STRONG BUY' },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 1.23, volume: '28.9M', prediction: 'BUY' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -1.45, volume: '98.7M', prediction: 'HOLD' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 0.89, volume: '23.4M', prediction: 'BUY' },
    { symbol: 'AMZN', name: 'Amazon.com', price: 151.94, change: -0.67, volume: '41.2M', prediction: 'HOLD' }
  ];

  const latestNews = [
    {
      title: 'Fed Signals Rate Cuts in 2025 Amid Cooling Inflation',
      source: 'Reuters',
      time: '2h ago',
      category: 'Economy',
    },
    {
      title: 'NVIDIA Unveils Next-Gen AI Chips, Stock Surges 5.6%',
      source: 'Bloomberg',
      time: '4h ago',
      category: 'Tech',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Day Trader',
      text: '34% returns in 3 months. AI predictions are incredibly accurate!',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Investment Analyst',
      text: 'Institutional-grade tools accessible to everyone. Game-changer.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Live Market Ticker */}
      <div className="bg-gray-950/50 backdrop-blur-xl border-b border-gray-800/50 py-2 overflow-hidden">
        <motion.div 
          className="flex space-x-6 md:space-x-8"
          animate={{ x: [0, -800] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {[...tickerStocks, ...tickerStocks, ...tickerStocks].map((stock, index) => (
            <div key={index} className="flex items-center space-x-2 md:space-x-3 whitespace-nowrap">
              <span className="font-bold text-white text-sm md:text-base">{stock.symbol}</span>
              <span className="text-gray-400 text-xs md:text-sm">${stock.price}</span>
              <span className={`flex items-center text-xs md:text-sm ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Animated Background Blobs */}
        <div className="absolute top-10 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>

        <div className="text-center relative z-10">
          {/* New Logo Design */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-purple-500/30 border border-white/10">
                <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" fill="currentColor" />
              </div>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-full text-emerald-400 font-semibold text-xs backdrop-blur-xl">
              <Award className="w-3 h-3 mr-2" />
              50,000+ Traders Worldwide
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Trade Smarter
            </span>
            <br />
            <span className="text-white">With AI Power</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base md:text-xl text-gray-300 mb-5 md:mb-6 max-w-3xl mx-auto leading-relaxed px-4"
          >
            AI-powered predictions, real-time analytics, institutional tools. 
            Start with <span className="text-emerald-400 font-bold">$100,000</span> virtual capital.
          </motion.p>

          {/* Market Overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass border border-gray-700/50 rounded-xl md:rounded-2xl p-3 md:p-4 mb-5 md:mb-6 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              {[
                { name: 'S&P', value: marketData.spy.price, change: marketData.spy.change },
                { name: 'BTC', value: `$${(marketData.btc.price / 1000).toFixed(1)}K`, change: marketData.btc.change },
                { name: 'NASDAQ', value: `${(marketData.nasdaq.price / 1000).toFixed(1)}K`, change: marketData.nasdaq.change },
                { name: 'Gold', value: `$${marketData.gold.price}`, change: marketData.gold.change }
              ].map((market, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-2 md:p-3 rounded-lg bg-gray-800/30 border border-gray-700/30 hover:border-blue-500/50 transition-all cursor-pointer"
                >
                  <p className="text-gray-400 text-xs font-medium mb-1">{market.name}</p>
                  <p className="text-base md:text-xl font-bold text-white">{market.value}</p>
                  <p className={`text-xs font-semibold ${market.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {market.change >= 0 ? '+' : ''}{market.change}%
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-3 mb-4 md:mb-6 px-4"
          >
            <Link
              to="/signup"
              className="group px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-base md:text-lg font-black transition-all hover:scale-105 shadow-2xl shadow-blue-500/40 flex items-center justify-center"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Free
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 md:px-10 py-3 md:py-4 glass border-2 border-gray-700 hover:border-blue-500 rounded-xl text-base md:text-lg font-black transition-all hover:scale-105 flex items-center justify-center"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs px-4"
          >
            {[
              { icon: CheckCircle, text: 'No credit card' },
              { icon: Shield, text: 'Risk-free' },
              { icon: Activity, text: 'Real data' }
            ].map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="flex items-center text-gray-300">
                  <Icon className="w-3 h-3 md:w-4 md:h-4 text-emerald-400 mr-1" />
                  {badge.text}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Trending Stocks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Trending Stocks
          </h2>
          <p className="text-gray-400 text-sm md:text-lg">AI predictions available</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingStocks.slice(0, window.innerWidth < 640 ? 3 : 6).map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="glass border border-gray-700/50 hover:border-blue-500/50 p-4 rounded-xl cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">{stock.symbol}</h3>
                  <p className="text-gray-400 text-xs">{stock.name}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                  stock.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-white">${stock.price}</p>
                  <p className="text-gray-500 text-xs">Vol: {stock.volume}</p>
                </div>
                {stock.change >= 0 ? 
                  <TrendingUp className="w-8 h-8 text-emerald-400" /> : 
                  <TrendingDown className="w-8 h-8 text-red-400" />
                }
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex items-center">
                  <Brain className="w-3 h-3 text-purple-400 mr-1" />
                  <span className="text-xs text-gray-400">AI</span>
                </div>
                <span className={`text-xs font-bold ${
                  stock.prediction === 'STRONG BUY' ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {stock.prediction}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6 md:mt-8">
          <Link
            to="/stocks"
            className="inline-flex items-center px-6 py-2.5 glass border border-blue-500/50 hover:bg-blue-500/10 rounded-xl text-sm md:text-base font-bold transition-all hover:scale-105"
          >
            View All Stocks
            <ChevronRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">Why Choose Us?</h2>
          <p className="text-gray-400 text-sm md:text-lg px-4">Professional-grade AI tools</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="glass border border-gray-700/50 p-5 md:p-6 rounded-xl transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className={`inline-block px-2.5 py-1 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 text-white text-xs font-semibold`}>
                  {feature.stats}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Latest News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-1">Market News</h2>
            <p className="text-gray-400 text-xs md:text-base">AI-powered insights</p>
          </div>
          <Newspaper className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {latestNews.map((news, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass border border-gray-700/50 hover:border-blue-500/50 p-4 rounded-xl cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold">
                  {news.category}
                </span>
                <span className="text-gray-500 text-xs flex items-center ml-auto">
                  <Clock className="w-3 h-3 mr-1" />
                  {news.time}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white hover:text-blue-400 transition-colors leading-tight">
                {news.title}
              </h3>
              <p className="text-gray-500 text-xs mt-2">{news.source}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">Trusted Worldwide</h2>
          <p className="text-gray-400 text-sm md:text-lg">Real trader stories</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="glass border border-gray-700/50 p-5 md:p-6 rounded-xl"
            >
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic text-sm md:text-base leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center pt-4 border-t border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="glass border border-gray-700/50 p-6 md:p-12 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {[
              { value: '50K+', label: 'Traders', color: 'from-blue-400 to-cyan-400' },
              { value: '95%', label: 'Accuracy', color: 'from-emerald-400 to-teal-400' },
              { value: '$5B+', label: 'Volume', color: 'from-purple-400 to-pink-400' },
              { value: '24/7', label: 'Coverage', color: 'from-orange-400 to-red-400' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className={`text-3xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 md:mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 font-semibold text-xs md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border-2 border-gray-700/50 p-8 md:p-16 rounded-2xl md:rounded-3xl text-center bg-gradient-to-br from-blue-600/10 to-purple-600/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-bold text-xs md:text-sm mb-5 md:mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Free for 3 Months
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-5 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Start Trading Like a Pro
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Join 50,000+ traders using AI predictions and real-time analytics
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
                Demo
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-gray-400">
              {['✓ No card required', '✓ $100K capital', '✓ Real data', '✓ Cancel anytime'].map((text, i) => (
                <span key={i} className="font-semibold">{text}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Download App Section - REDESIGNED */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass border border-gray-700/50 rounded-3xl p-8 md:p-12 overflow-hidden relative"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 font-bold text-xs md:text-sm mb-6">
                <Smartphone className="w-4 h-4 mr-2" />
                Download Now
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
                Trade Anywhere,
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Anytime
                </span>
              </h2>
              
              <p className="text-sm md:text-lg text-gray-400 mb-6 md:mb-8 leading-relaxed">
                Access AI predictions, real-time data, and your complete portfolio on the go. Available on iOS and Android.
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
                  { icon: Bell, text: 'Real-time Alerts' },
                  { icon: Shield, text: 'Secure Trading' },
                  { icon: Zap, text: 'Lightning Fast' }
                ].map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div key={i} className="flex items-center px-3 py-2 glass border border-gray-700/30 rounded-lg text-xs">
                      <Icon className="w-3 h-3 text-blue-400 mr-2" />
                      <span className="text-gray-300">{badge.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right content - Phone mockup */}
            <div className="relative">
              {/* Phone container */}
              <div className="relative glass border-4 border-gray-700/40 rounded-[48px] p-4 md:p-6 shadow-2xl">
                {/* Phone screen */}
                <div className="bg-gray-950 rounded-[36px] overflow-hidden border-2 border-gray-800/50">
                  {/* Status bar */}
                  <div className="bg-gray-900/50 px-6 py-3 flex justify-between items-center text-xs text-gray-400">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    </div>
                  </div>

                  {/* App content preview */}
                  <div className="p-6 space-y-4">
                    {/* Portfolio value */}
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Portfolio Value</p>
                      <p className="text-2xl font-bold text-white">$127,450</p>
                      <p className="text-emerald-400 text-sm">+12.7%</p>
                    </div>

                    {/* Mini chart bars */}
                    <div className="flex items-end justify-between h-24 gap-2">
                      {[60, 80, 50, 90, 70, 95, 75].map((height, i) => (
                        <div 
                          key={i}
                          style={{ height: `${height}%` }}
                          className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg"
                        ></div>
                      ))}
                    </div>

                    {/* Stock cards */}
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

                {/* Home indicator */}
                <div className="flex justify-center mt-4">
                  <div className="w-24 h-1.5 bg-gray-600 rounded-full"></div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                iOS & Android
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
