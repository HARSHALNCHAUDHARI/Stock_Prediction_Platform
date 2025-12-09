import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Award, TrendingUp, Brain, Shield, Target } from 'lucide-react';

const Learning = () => {
  const courses = [
    {
      icon: BookOpen,
      title: 'Stock Market Basics',
      description: 'Learn the fundamentals of stock market investing and trading',
      color: 'blue',
      lessons: 12,
      duration: '2 hours',
    },
    {
      icon: FileText,
      title: 'Technical Analysis',
      description: 'Master chart patterns, indicators, and trading strategies',
      color: 'green',
      lessons: 15,
      duration: '3 hours',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Learn how to manage risk and protect your capital',
      color: 'purple',
      lessons: 10,
      duration: '2 hours',
    },
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Understand how AI predicts stock movements',
      color: 'orange',
      lessons: 8,
      duration: '1.5 hours',
    },
    {
      icon: Target,
      title: 'Portfolio Management',
      description: 'Build and manage a diversified investment portfolio',
      color: 'red',
      lessons: 10,
      duration: '2 hours',
    },
    {
      icon: Video,
      title: 'Trading Psychology',
      description: 'Master the mental game of trading and investing',
      color: 'pink',
      lessons: 8,
      duration: '1.5 hours',
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
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Learning Hub</h1>
          <p className="text-gray-400 mb-8">Master stock trading with our comprehensive courses</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass p-6 rounded-xl text-center">
            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">6</h3>
            <p className="text-gray-400">Courses Available</p>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">63</h3>
            <p className="text-gray-400">Total Lessons</p>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">100%</h3>
            <p className="text-gray-400">Free Content</p>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="glass p-6 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-${course.color}-500/20 rounded-lg flex-shrink-0`}>
                    <Icon className={`w-8 h-8 text-${course.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{course.lessons} lessons</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition-colors">
                        Start Learning
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Coming Soon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-8 rounded-xl mt-8 text-center"
        >
          <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">More Courses Coming Soon!</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're working on adding more comprehensive courses on advanced trading strategies,
            algorithmic trading, options trading, and much more. Stay tuned!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Learning;
