'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import AIChat from '@/components/AIChat';
import { getProgram, createTutorProfile, fetchTutorProfile, updateProgress } from '@/lib/anchor-client';
import { mintAchievementNFT, generateMilestoneHash } from '@/lib/nft-minter';
import { LESSONS } from '@/lib/constants';
import { Lesson, Achievement } from '@/lib/types';

export default function TutorPage() {
  const { publicKey, connected, wallet } = useWallet();
  const { connection } = useConnection();
  
  const [subject, setSubject] = useState('');
  const [tutorExists, setTutorExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [level, setLevel] = useState(1);

  // Check if tutor profile exists
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
        setSubject(profile.subject);
        setLevel(profile.level);
        
        // Mark lessons as completed based on level
        // Level starts at 1, each completed lesson increments it by 1
        // So level 2 means lesson 1 is done, level 3 means lessons 1-2 are done, etc.
        const completedLessonCount = profile.level - 1;
        setLessons((prev) =>
          prev.map((lesson) => ({
            ...lesson,
            completed: lesson.id <= completedLessonCount,
            nftMinted: lesson.id <= completedLessonCount,
          }))
        );
        
        // Set current lesson to the next incomplete one
        const nextLesson = LESSONS.find((l) => l.id === completedLessonCount + 1);
        if (nextLesson) {
          setCurrentLesson(nextLesson);
        }
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
      const result = await createTutorProfile(program, publicKey, subject);
      
      console.log('Profile created:', result.signature);
      setTutorExists(true);
      setCurrentLesson(lessons[0]);
    } catch (error: any) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleLessonComplete = async () => {
    if (!publicKey || !wallet || !currentLesson) return;
    
    setLoading(true);
    try {
      // 1. Mint NFT Achievement
      console.log('Minting achievement NFT...');
      const nftResult = await mintAchievementNFT(
        connection,
        wallet.adapter,
        currentLesson.title,
        currentLesson.id
      );
      
      console.log('NFT Minted:', nftResult.mintAddress);
      
      // 2. Update progress on-chain
      const newLevel = level + 1;
      const milestoneHash = generateMilestoneHash(currentLesson.id);
      
      const program = getProgram(connection, wallet.adapter);
      const signature = await updateProgress(program, publicKey, newLevel, milestoneHash);
      
      console.log('Progress updated:', signature);
      
      // 3. Update local state
      setLevel(newLevel);
      setLessons((prev) =>
        prev.map((l) =>
          l.id === currentLesson.id
            ? { ...l, completed: true, nftMinted: true }
            : l
        )
      );
      
      setAchievements((prev) => [
        ...prev,
        {
          lesson: currentLesson.title,
          mintAddress: nftResult.mintAddress.toString(),
          timestamp: Date.now(),
        },
      ]);
      
      alert(`🎉 Congratulations! Lesson completed!\n\nNFT Minted: ${nftResult.mintAddress}\nNew Level: ${newLevel}`);
      
      // Move to next lesson
      const nextLesson = lessons.find((l) => !l.completed && l.id > currentLesson.id);
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    } catch (error: any) {
      console.error('Error completing lesson:', error);
      alert('Failed to complete lesson: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎓 AI Tutor</h1>
          <p className="text-gray-600 mb-6">
            Learn blockchain technology with AI assistance and earn NFT achievements!
          </p>
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600" />
        </div>
      </div>
    );
  }

  if (!tutorExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Your Profile</h2>
            <WalletMultiButton />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Blockchain Technology"
              maxLength={50}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">{subject.length}/50 characters</p>
          </div>
          
          <button
            onClick={handleCreateProfile}
            disabled={loading || !subject.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? 'Creating...' : 'Create Profile & Start Learning'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🎓 AI Tutor</h1>
            <p className="text-sm text-gray-600">Level {level} • {subject}</p>
          </div>
          <WalletMultiButton />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentLesson?.id === lesson.id
                      ? 'bg-blue-100 border-2 border-blue-600'
                      : lesson.completed
                      ? 'bg-green-50 border border-green-300'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">
                        {lesson.completed && '✓ '}
                        Lesson {lesson.id}: {lesson.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>
                    </div>
                    {lesson.nftMinted && <span className="text-xl ml-2">🏆</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🏆 Achievements</h3>
                <div className="space-y-2">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-300">
                      <p className="text-sm font-semibold text-gray-800">{achievement.lesson}</p>
                      <p className="text-xs text-gray-600 truncate">NFT: {achievement.mintAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat */}
        <div className="lg:col-span-2 h-[calc(100vh-200px)]">
          {currentLesson ? (
            <AIChat
              subject={subject}
              currentLesson={currentLesson}
              onLessonComplete={handleLessonComplete}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full flex items-center justify-center">
              <div>
                <p className="text-4xl mb-4">📖</p>
                <p className="text-gray-600">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
