export interface TutorProfile {
  owner: string;
  subject: string;
  level: number;
  milestoneHash: number[];
  lastUpdated: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export type LessonType = 'chat' | 'document' | 'video';

export interface Lesson {
  id: number;
  title: string;
  description: string;
  type: LessonType;
  content: string;
  videoUrl?: string;
  duration?: string;
  completed: boolean;
  nftMinted: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Achievement {
  lesson: string;
  mintAddress: string;
  timestamp: number;
  rarity?: 'common' | 'rare' | 'legendary';
  quizScore?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalDaysLearned: number;
}

export interface LeaderboardEntry {
  wallet: string;
  level: number;
  subject: string;
  streak: number;
  completedLessons: number;
}
