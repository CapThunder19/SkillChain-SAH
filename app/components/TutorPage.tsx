'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import LessonViewer from '@/components/LessonViewer';
import FloatingChatBot from '@/components/FloatingChatBot';
import ThemeToggle from '@/components/ThemeToggle';
import TypingAnimation from '@/components/TypingAnimation';
import { getProgram, createTutorProfile, fetchTutorProfile, updateProgress } from '@/lib/anchor-client';
import { mintAchievementNFT, generateMilestoneHash } from '@/lib/nft-minter';
import { COURSES } from '@/lib/constants';
import { Course, Lesson, Achievement } from '@/lib/types';

export default function TutorPage() {
  const { publicKey, connected, wallet } = useWallet();
  const { connection } = useConnection();
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [tutorExists, setTutorExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [level, setLevel] = useState(1);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All courses');

  useEffect(() => {
    if (publicKey && connected) {
      checkTutorProfile();
    }
  }, [publicKey, connected]);

  const checkTutorProfile = async () => {
    if (!publicKey || !wallet) return;
    
    try {
      const program = getProgram(connection, wallet.adapter);
      const profile = await fetchTutorProfile(program, publicKey);
      
      if (profile) {
        setTutorExists(true);
        setLevel(profile.level);
        
        // Mark lessons as completed based on level
        const completedLessonCount = profile.level - 1;
        setCourses((prevCourses) =>
          prevCourses.map((course) => ({
            ...course,
            lessons: course.lessons.map((lesson) => ({
              ...lesson,
              completed: lesson.id <= completedLessonCount,
              nftMinted: lesson.id <= completedLessonCount,
            })),
          }))
        );
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const handleCreateProfile = async () => {
    if (!publicKey || !wallet) return;
    
    setLoading(true);
    try {
      const program = getProgram(connection, wallet.adapter);
      const result = await createTutorProfile(program, publicKey, 'Web3 Development');
      
      console.log('Profile created:', result.signature);
      setTutorExists(true);
      toast.success('Profile Created!', {
        description: 'Your learning journey starts now!',
      });
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Lesson, course: Course) => {
    setCurrentLesson(lesson);
    setSelectedCourse(course);
  };

  const getNextLessons = () => {
    const allLessons: Array<{ lesson: Lesson; course: Course }> = [];
    getFilteredCourses().forEach(course => {
      course.lessons.forEach(lesson => {
        if (!lesson.completed) {
          allLessons.push({ lesson, course });
        }
      });
    });
    return allLessons.slice(0, 5);
  };

  const getCourseColors = (index: number) => {
    const colors = [
      { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500', border: 'border-yellow-600' },
      { bg: 'bg-gradient-to-br from-purple-400 to-purple-500', border: 'border-purple-600' },
      { bg: 'bg-gradient-to-br from-blue-400 to-blue-500', border: 'border-blue-600' },
      { bg: 'bg-gradient-to-br from-pink-400 to-pink-500', border: 'border-pink-600' },
      { bg: 'bg-gradient-to-br from-green-400 to-green-500', border: 'border-green-600' },
      { bg: 'bg-gradient-to-br from-indigo-400 to-indigo-500', border: 'border-indigo-600' },
    ];
    return colors[index % colors.length];
  };

  const getFilteredCourses = () => {
    if (selectedCategory === 'All courses') return courses;
    
    return courses.filter(course => {
      if (selectedCategory === 'Web Development') {
        return course.title.includes('Web Development') || course.title.includes('Python');
      }
      if (selectedCategory === 'Blockchain') {
        return course.title.includes('Blockchain') || course.title.includes('Solana') || course.title.includes('DeFi');
      }
      if (selectedCategory === 'AI & ML') {
        return course.title.includes('AI') || course.title.includes('Machine Learning');
      }
      if (selectedCategory === 'Cybersecurity') {
        return course.title.includes('Cybersecurity');
      }
      return false;
    });
  };

  const handleLessonComplete = async () => {
    if (!publicKey || !wallet || !currentLesson) return;
    
    setLoading(true);
    let nftResult: { signature: Uint8Array; mintAddress: any } | null = null;
    
    try {
      // 1. Update progress on-chain FIRST (most important)
      const newLevel = level + 1;
      const milestoneHash = generateMilestoneHash(currentLesson.id);
      
      const program = getProgram(connection, wallet.adapter);
      const signature = await updateProgress(program, publicKey, newLevel, milestoneHash);
      
      console.log('Progress updated:', signature);
      
      // 2. Update local state immediately
      setLevel(newLevel);
      setCourses((prevCourses) =>
        prevCourses.map((course) => ({
          ...course,
          lessons: course.lessons.map((l) =>
            l.id === currentLesson.id
              ? { ...l, completed: true, nftMinted: false }
              : l
          ),
        }))
      );
      
      toast.success('🎉 Lesson Completed!', {
        description: `Level ${newLevel} achieved!`,
        duration: 4000,
      });
      
      // 3. Try to mint NFT (optional - don't fail if this doesn't work)
      try {
        console.log('Minting achievement NFT...');
        nftResult = await mintAchievementNFT(
          connection,
          wallet.adapter,
          currentLesson.title,
          currentLesson.id
        );
        
        console.log('NFT Minted:', nftResult.mintAddress);
        
        // Update NFT status
        setCourses((prevCourses) =>
          prevCourses.map((course) => ({
            ...course,
            lessons: course.lessons.map((l) =>
              l.id === currentLesson.id
                ? { ...l, nftMinted: true }
                : l
            ),
          }))
        );
        
        if (nftResult) {
          setAchievements((prev) => [
            ...prev,
            {
              lesson: currentLesson.title,
              mintAddress: nftResult!.mintAddress.toString(),
              timestamp: Date.now(),
            },
          ]);
        }
        
        toast.success('🎨 NFT Minted!', {
          description: 'Achievement NFT added to your wallet',
          duration: 3000,
        });
      } catch (nftError: any) {
        console.error('NFT minting failed (non-critical):', nftError);
        toast.info('Lesson completed, but NFT minting skipped', {
          description: 'You can still continue learning!',
          duration: 3000,
        });
      }
      
      // 4. Move to next lesson
      const allLessons = courses.flatMap(c => c.lessons);
      const nextLesson = allLessons.find((l) => !l.completed && l.id > currentLesson.id);
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    } catch (error: any) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to complete lesson', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-black dark:bg-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.05, 0.02],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Typing Animation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-semibold">
                  🚀 Web3 Learning Platform
                </span>
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  <TypingAnimation 
                    text="Connect Wallet"
                    speed={120}
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  />
                </h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="text-xl text-gray-300 leading-relaxed"
                >
                  Start your journey in Web3 development, blockchain technology, and AI. 
                  Earn NFT achievements as you progress through interactive lessons.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">21+ Lessons</p>
                    <p className="text-gray-400 text-sm">Interactive content</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">NFT Badges</p>
                    <p className="text-gray-400 text-sm">Earn achievements</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">AI Tutor</p>
                    <p className="text-gray-400 text-sm">24/7 assistance</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Wallet Connection */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl max-w-md w-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
                    <p className="text-gray-300 mb-6">Connect your Solana wallet to continue learning</p>
                    
                    <div className="flex justify-center">
                      <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-xl !h-14 !px-8 !text-base !font-semibold !transition-all !shadow-lg hover:!shadow-xl hover:!scale-105" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-900 text-gray-400 rounded-full">
                          Secure & Decentralized
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-300">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p>Your wallet, your keys - we never access your funds</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p>Progress stored on Solana blockchain</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p>Free NFT badges for completing lessons</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Theme toggle in corner */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </div>
    );
  }

  if (!tutorExists) {
    return (
      <div className="min-h-screen bg-black dark:bg-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.05, 0.02],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl max-w-2xl w-full"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl lg:text-4xl font-bold text-white mb-2"
                >
                  <TypingAnimation 
                    text="One Last Step..."
                    speed={100}
                  />
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-purple-300"
                >
                  Create your learner profile to begin
                </motion.p>
              </div>
              <WalletMultiButton className="!bg-gray-800/50 hover:!bg-gray-700/50 !border !border-gray-700/50" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">What you'll get:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">7 Complete Courses</p>
                      <p className="text-gray-300 text-sm">Web Dev, Blockchain, Solana, DeFi, AI/ML, Python & Cybersecurity with 21+ interactive lessons</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">NFT Achievement Badges</p>
                      <p className="text-gray-300 text-sm">Earn unique NFT badges for completing each lesson, stored permanently on Solana blockchain</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">AI-Powered Learning</p>
                      <p className="text-gray-300 text-sm">24/7 AI tutor assistance with personalized guidance and instant answers to your questions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">On-Chain Progress Tracking</p>
                      <p className="text-gray-300 text-sm">Your learning progress is stored on Solana blockchain - verifiable and permanent</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateProfile}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Creating Your Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Create Learning Profile</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </motion.button>

              <p className="text-center text-gray-400 text-sm">
                🔒 Your wallet remains secure - we only store your progress on-chain
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Theme toggle in corner */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </div>
    );
  }

  if (selectedCourse && currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto p-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              setSelectedCourse(null);
              setCurrentLesson(null);
            }}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </motion.button>
          
          <LessonViewer
            lesson={currentLesson}
            subject={selectedCourse.title}
            onComplete={handleLessonComplete}
          />
        </div>
        <FloatingChatBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            🎓 <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI Tutor</span>
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <WalletMultiButton />
          </div>
        </div>

        {/* Course Filters */}
        <div className="flex gap-3 flex-wrap relative z-10">
          {['All courses', 'Web Development', 'Blockchain', 'AI & ML', 'Cybersecurity'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap relative hover:scale-105 active:scale-95 ${
                selectedCategory === category
                  ? 'bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* My Courses Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My courses</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedCategory === 'All courses' 
                  ? `${getFilteredCourses().length} total courses`
                  : `${getFilteredCourses().length} courses in ${selectedCategory}`
                }
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Level {level} • {achievements.length} NFTs earned
            </div>
          </div>

          {getFilteredCourses().length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-gray-600 dark:text-gray-400">No courses found in this category</p>
              <button
                onClick={() => setSelectedCategory('All courses')}
                className="mt-4 px-6 py-2 bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity border border-gray-300 dark:border-gray-100"
              >
                View all courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredCourses().slice(0, 6).map((course) => {
              const completedCount = course.lessons.filter(l => l.completed).length;
              const totalCount = course.lessons.length;
              const progress = (completedCount / totalCount) * 100;
              const originalIndex = courses.findIndex(c => c.id === course.id);
              const colors = getCourseColors(originalIndex);
              const nextLesson = course.lessons.find(l => !l.completed);

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * originalIndex }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`${colors.bg} rounded-3xl p-6 shadow-lg relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full text-xs font-semibold text-gray-900 dark:text-white">
                      {course.icon} {course.title.split(' ')[0]}
                    </span>
                    <button className="text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-6">{course.title}</h3>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-white/90 mb-2">
                      <span>Progress</span>
                      <span>{completedCount}/{totalCount} lessons</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-white h-full rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                        +{Math.floor(Math.random() * 100 + 20)}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => nextLesson && handleLessonSelect(nextLesson, course)}
                      className="px-6 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full text-sm font-semibold hover:shadow-lg transition-shadow"
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          )}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Next Lessons */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My next lessons</h2>
              <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                View all lessons →
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Lesson</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Teacher</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getNextLessons().map(({ lesson, course }, idx) => (
                      <motion.tr
                        key={lesson.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        onClick={() => handleLessonSelect(lesson, course)}
                        className="border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white mb-1">
                              {lesson.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course.title}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              AI
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              AI Tutor
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {lesson.duration}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* New Course Recommendation */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              New course matching your interests
            </h2>

            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-3xl p-6 shadow-2xl border border-gray-800 dark:border-gray-900"
            >
              <span className="inline-block px-3 py-1 bg-yellow-400 rounded-full text-xs font-semibold text-gray-900 mb-4">
                {courses[3]?.icon} {courses[3]?.title.split(' ')[0]}
              </span>

              <h3 className="text-xl font-bold text-white mb-6">
                {courses[3]?.title}
              </h3>

              <p className="text-gray-300 text-sm mb-6">
                {courses[3]?.description}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                    +{Math.floor(Math.random() * 200 + 100)}
                  </div>
                </div>
                <span className="text-sm text-gray-400">already studying</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => courses[3] && handleLessonSelect(courses[3].lessons[0], courses[3])}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-colors"
              >
                More details
              </motion.button>
            </motion.div>

            {/* Achievement Stats */}
            {achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  🏆 Recent Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.slice(-3).reverse().map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50"
                    >
                      <span className="text-2xl">🎖️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {achievement.lesson}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(achievement.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
            />
            <p className="text-gray-800 dark:text-white font-semibold">Processing...</p>
          </motion.div>
        </motion.div>
      )}

      {/* Floating AI Chatbot */}
      <FloatingChatBot />
    </div>
  );
}
