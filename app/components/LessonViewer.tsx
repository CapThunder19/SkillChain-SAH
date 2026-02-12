'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lesson } from '@/lib/types';
import AIChat from './AIChat';
import ReactMarkdown from 'react-markdown';

interface LessonViewerProps {
  lesson: Lesson;
  subject: string;
  onComplete: () => void;
}

export default function LessonViewer({ lesson, subject, onComplete }: LessonViewerProps) {
  const [showCompleteButton, setShowCompleteButton] = useState(true);

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'document':
        return (
          <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <p className="text-sm opacity-90">📖 Document • {lesson.duration}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
              <div className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100 prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-li:text-gray-800 dark:prose-li:text-gray-300">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>
            </div>

            {showCompleteButton && !lesson.completed && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onComplete}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  ✓ Complete Lesson & Mint Achievement NFT
                </motion.button>
              </div>
            )}

            {lesson.completed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 p-4 bg-green-50 dark:bg-green-900/30 rounded-b-lg text-center"
              >
                <p className="text-green-700 dark:text-green-400 font-semibold">✓ Lesson Completed! 🎉</p>
              </motion.div>
            )}
          </div>
        );

      case 'video':
        return (
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
                  ></iframe>
                </div>
              )}
              
              <div className="prose max-w-none text-gray-900 dark:text-gray-100">
                <h3 className="text-gray-900 dark:text-white">About this lesson</h3>
                <p className="text-gray-800 dark:text-gray-300">{lesson.content}</p>
              </div>
            </div>

            {showCompleteButton && !lesson.completed && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onComplete}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  ✓ Complete Lesson & Mint Achievement NFT
                </motion.button>
              </div>
            )}

            {lesson.completed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 p-4 bg-green-50 dark:bg-green-900/30 rounded-b-lg text-center"
              >
                <p className="text-green-700 dark:text-green-400 font-semibold">✓ Lesson Completed! 🎉</p>
              </motion.div>
            )}
          </div>
        );

      case 'chat':
        return (
          <AIChat
            subject={subject}
            currentLesson={lesson}
            onLessonComplete={onComplete}
          />
        );

      default:
        return <div>Unknown lesson type</div>;
    }
  };

  return renderLessonContent();
}
