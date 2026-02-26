'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: '📚' },
    { name: 'IT & Software', icon: '💻' },
    { name: 'Media Training', icon: '🎬' },
    { name: 'Business', icon: '💼' },
    { name: 'Interior', icon: '🏠' },
  ];

  const courses = [
    {
      id: 1,
      title: 'CCNA 2020 200-125 Video Boot Camp',
      category: 'IT & Software',
      icon: '💻',
      rating: 4.8,
      students: '9,550',
      color: 'from-pink-200 to-pink-300',
      featured: false,
    },
    {
      id: 2,
      title: 'Powerful Business Writing: How to Write Concisely',
      category: 'Business',
      icon: '💼',
      rating: 4.9,
      students: '1,683',
      color: 'from-orange-200 to-amber-300',
      featured: false,
    },
    {
      id: 3,
      title: 'Certified Six Sigma Yellow Belt Training',
      category: 'Media Training',
      icon: '🎬',
      rating: 4.9,
      students: '6,726',
      color: 'from-purple-200 to-purple-300',
      featured: false,
    },
    {
      id: 4,
      title: 'How to Design a Room in 10 Easy Steps',
      category: 'Interior',
      icon: '🏠',
      rating: 5.0,
      students: '8,235',
      color: 'from-emerald-200 to-teal-300',
      featured: false,
      trending: true,
    },
    {
      id: 5,
      title: 'Blockchain Fundamentals',
      category: 'IT & Software',
      icon: '⛓️',
      rating: 4.9,
      students: '12,430',
      color: 'from-blue-200 to-cyan-300',
      featured: true,
    },
    {
      id: 6,
      title: 'Solana Smart Contract Development',
      category: 'IT & Software',
      icon: '🔷',
      rating: 5.0,
      students: '8,921',
      color: 'from-indigo-200 to-purple-300',
      featured: true,
    },
  ];

  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  const popularCourses = filteredCourses.filter(c => !c.featured);
  const featuredCourses = filteredCourses.filter(c => c.featured);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 py-4">
        <div className="w-full mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Invest in your education
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-[var(--text-primary)]">
              🔔
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-[var(--text-primary)]">
              ⚙️
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              SC
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full mx-auto px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setActiveCategory(category.name)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all
                  ${activeCategory === category.name
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Most Popular Courses */}
        {popularCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Most popular</h2>
              <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">View all →</button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
              {popularCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href="/learn"
                    className={`flex flex-col justify-between bg-gradient-to-br ${course.color} rounded-3xl p-6 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group relative overflow-hidden min-h-[260px] h-full`}
                  >
                    <div>
                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2">
                          <span className="text-lg">{course.icon}</span>
                          <span className="text-xs font-bold text-gray-700">{course.category}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2">
                          <span className="text-sm font-bold text-gray-900">⭐ {course.rating}</span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                        {course.title}
                      </h3>
                    </div>

                    <div className="mt-4">
                      {/* Students Count & Avatars */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                          <Users className="w-4 h-4" />
                          <span>{course.students}</span>
                        </div>

                        {/* Avatar Group */}
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white shadow-md flex-shrink-0" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white shadow-md flex-shrink-0" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-white shadow-md flex-shrink-0" />
                        </div>
                      </div>

                      {(course as any).trending && (
                        <div className="inline-flex items-center gap-1 bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-bold mt-3">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Top 10</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Featured courses</h2>
              <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">View all →</button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    href="/learn"
                    className={`flex flex-col justify-between bg-gradient-to-br ${course.color} rounded-3xl p-6 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group relative overflow-hidden min-h-[260px] h-full`}
                  >
                    <div>
                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2">
                          <span className="text-lg">{course.icon}</span>
                          <span className="text-xs font-bold text-gray-700">{course.category}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2">
                          <span className="text-sm font-bold text-gray-900">⭐ {course.rating}</span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                        {course.title}
                      </h3>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Students Count */}
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>

                      {/* Avatar Group */}
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white shadow-md flex-shrink-0" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white shadow-md flex-shrink-0" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-white shadow-md flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when filtering */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No courses found</h3>
            <p className="text-[var(--text-secondary)]">Try selecting a different category</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
