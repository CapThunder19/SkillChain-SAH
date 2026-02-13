'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { connected } = useWallet();
  
  const features = [
    {
      icon: '🎓',
      title: 'Learn Blockchain',
      description: 'Master Web3, Solana, DeFi, and more with interactive lessons',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Tutor',
      description: 'Get instant answers to your questions with our AI assistant',
      color: 'from-cyan-500 to-blue-400',
    },
    {
      icon: '🎨',
      title: 'Earn NFT Badges',
      description: 'Complete lessons and mint achievement NFTs on Solana',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: '⛓️',
      title: 'On-Chain Progress',
      description: 'Your learning progress is permanently stored on blockchain',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const courses = [
    { title: 'Blockchain Fundamentals', lessons: 5, icon: '⛓️' },
    { title: 'Web Development', lessons: 4, icon: '🌐' },
    { title: 'Solana Development', lessons: 6, icon: '🔷' },
    { title: 'DeFi Essentials', lessons: 5, icon: '💰' },
    { title: 'AI & Machine Learning', lessons: 5, icon: '🤖' },
    { title: 'Cybersecurity', lessons: 5, icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Blue Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-6 animate-bounce">🎓</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Learn Web3 &<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Earn NFT Badges
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Master blockchain technology with AI-powered lessons and mint achievement NFTs on Solana
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 hover:scale-105"
              >
                {connected ? 'Continue Learning →' : 'Start Learning →'}
              </Link>
              <Link
                href="/achievements"
                className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg border-2 border-blue-500/50 hover:border-blue-500 transition-all hover:scale-105 hover:bg-gray-800"
              >
                View Achievements
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose AI Tutor?
            </h2>
            <p className="text-xl text-gray-400">
              The future of learning is here
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-700/50 hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Available Courses
            </h2>
            <p className="text-xl text-gray-400">
              30+ lessons across 7 comprehensive courses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all hover:scale-105"
              >
                <div className="text-4xl mb-3">{course.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {course.lessons} interactive lessons
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Connect your Solana wallet and begin your Web3 education journey today
            </p>
            <Link
              href="/learn"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started Free →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom gradient fade */}
      <div className="h-32 bg-gradient-to-b from-cyan-600 to-black relative z-10"></div>
    </div>
  );
}
