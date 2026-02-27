'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lesson, QuizResult } from '@/lib/types';
import AIChat from './AIChat';
import QuizModal from './QuizModal';
import NFTRewardPreview from './NFTRewardPreview';
import ReactMarkdown from 'react-markdown';

interface LessonViewerProps {
  lesson: Lesson;
  subject: string;
  onComplete: (quizResult?: QuizResult) => void | Promise<void>;
}

export default function LessonViewer({ lesson, subject, onComplete }: LessonViewerProps) {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleCompleteClick = () => {
    if (lesson.type !== 'chat') {
      setShowQuiz(true);
    } else {
      onComplete();
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    // Keep quiz open (spinner visible) until lesson complete finishes
    await onComplete(result);
    setShowQuiz(false);
  };

  const handleQuizSkip = () => {
    setShowQuiz(false);
    onComplete();
  };

  const renderCompleteButton = () => (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-lg">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCompleteClick}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <span>✓ Complete Lesson &amp; Take Quiz</span>
        <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">→ NFT Reward</span>
      </motion.button>
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
        Take a quick AI-generated quiz to determine your NFT rarity 🏆
      </p>
    </div>
  );

  const renderCompletedBadge = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-gray-200 dark:border-gray-700 p-4 bg-green-50 dark:bg-green-900/30 rounded-b-lg text-center"
    >
      <p className="text-green-700 dark:text-green-400 font-semibold">✓ Lesson Completed! 🎉</p>
      <p className="text-gray-500 text-xs mt-1">Check your Achievements for the NFT certificate</p>
    </motion.div>
  );

  // For document and video lessons, show a two-column layout with NFT preview sidebar
  const withNFTPreview = (contentEl: React.ReactNode) => (
    <div className="flex gap-4 h-full">
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">{contentEl}</div>

      {/* NFT reward sidebar — only when NOT completed */}
      {!lesson.completed && (
        <div className="w-52 flex-shrink-0 hidden lg:block">
          <NFTRewardPreview lessonId={lesson.id} lessonTitle={lesson.title} />
        </div>
      )}
    </div>
  );

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'document': {
        const inner = (
          <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <p className="text-sm opacity-90">📖 Document • {lesson.duration}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
              <div className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100 prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-li:text-gray-800 dark:prose-li:text-gray-300">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>
            </div>
            {!lesson.completed ? renderCompleteButton() : renderCompletedBadge()}
          </div>
        );
        return withNFTPreview(inner);
      }

      case 'video': {
        const inner = (
          <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <p className="text-sm opacity-90">🎥 Video • {lesson.duration}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
              {lesson.videoUrl && (
                <div className="aspect-video w-full mb-6">
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="prose max-w-none text-gray-900 dark:text-gray-100">
                <h3 className="text-gray-900 dark:text-white">About this lesson</h3>
                <p className="text-gray-800 dark:text-gray-300">{lesson.content}</p>
              </div>
            </div>
            {!lesson.completed ? renderCompleteButton() : renderCompletedBadge()}
          </div>
        );
        return withNFTPreview(inner);
      }

      case 'chat':
        return (
          <AIChat
            subject={subject}
            currentLesson={lesson}
            onLessonComplete={() => onComplete()}
          />
        );

      default:
        return <div>Unknown lesson type</div>;
    }
  };

  return (
    <>
      {renderLessonContent()}
      {showQuiz && (
        <QuizModal
          lessonTitle={lesson.title}
          lessonContent={lesson.content}
          subject={subject}
          onComplete={handleQuizComplete}
          onSkip={handleQuizSkip}
        />
      )}
    </>
  );
}
