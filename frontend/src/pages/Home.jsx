import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Brain, Shield, Zap, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Predictions',
      description: 'Advanced machine learning models predict stock movements with high accuracy',
      color: 'blue',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Data',
      description: 'Live stock prices, charts, and technical indicators updated instantly',
      color: 'green',
    },
    {
      icon: DollarSign,
      title: 'Paper Trading',
      description: 'Practice trading with $100,000 virtual money completely risk-free',
      color: 'yellow',
    },
    {
      icon: Shield,
      title: 'Risk Analysis',
      description: 'Advanced risk metrics including VaR, Sharpe Ratio, and volatility',
      color: 'purple',
    },
    {
      icon: Zap,
      title: 'Fast & Accurate',
      description: 'Lightning-fast predictions powered by optimized ML algorithms',
      color: 'orange',
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Get sentiment analysis from news, social media, and market trends',
      color: 'red',
    },
  ];

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
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <TrendingUp className="w-20 h-20 text-blue-500 animate-pulse-slow" />
              <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI-Powered Stock Predictions
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Make smarter investment decisions with machine learning predictions, 
            real-time data, and risk analysis tools. Start with{' '}
            <span className="text-green-400 font-bold">$100,000</span> virtual money!
          </motion.p>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 glass hover:bg-white/10 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
            >
              Login
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-8 rounded-2xl text-center hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className={`bg-${feature.color}-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 glass p-8 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-gray-400">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400">Real-Time Monitoring</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-400 mb-8">Join thousands of traders using AI-powered predictions</p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Create Free Account
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
