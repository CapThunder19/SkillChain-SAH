'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion, QuizResult } from '@/lib/types';

interface QuizModalProps {
    lessonTitle: string;
    lessonContent: string;
    subject: string;
    onComplete: (result: QuizResult) => void;
    onSkip: () => void;
}

const RARITY_CONFIG = {
    common: { label: '🥉 Common', color: 'from-gray-400 to-gray-500', min: 0, desc: 'Keep learning! Every attempt makes you stronger.' },
    rare: { label: '🥈 Rare', color: 'from-blue-400 to-cyan-500', min: 60, desc: 'Great work! You have a solid understanding.' },
    legendary: { label: '🥇 Legendary', color: 'from-yellow-400 to-orange-500', min: 90, desc: 'Exceptional! You\'ve mastered this lesson!' },
};

function getRarity(pct: number): 'common' | 'rare' | 'legendary' {
    if (pct >= 90) return 'legendary';
    if (pct >= 60) return 'rare';
    return 'common';
}

export default function QuizModal({ lessonTitle, lessonContent, subject, onComplete, onSkip }: QuizModalProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        generateQuiz();
    }, []);

    const generateQuiz = async () => {
        setLoading(true);
        setError('');
        try {
            const prompt = `You are an expert quiz maker. Based on this lesson content about "${lessonTitle}" in the course "${subject}", generate exactly 5 multiple-choice quiz questions.

Lesson content:
${lessonContent.slice(0, 1500)}

Return ONLY a valid JSON array (no markdown, no explanation) in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why this is correct."
  }
]

Rules:
- Make questions test real understanding, not just memory
- Each question must have exactly 4 options
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- Keep questions concise and clear`;

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    subject,
                    currentLesson: { id: 0, title: lessonTitle },
                    mode: 'quiz',
                }),
            });

            const data = await res.json();
            const text = data.message || '';
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('Invalid quiz format');
            const parsed: QuizQuestion[] = JSON.parse(jsonMatch[0]);
            if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('No questions generated');
            setQuestions(parsed.slice(0, 5));
        } catch (e: any) {
            console.error('Quiz generation failed:', e);
            setError('Could not generate quiz. You can skip or try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (selected === null) return;
        const newAnswers = [...answers, selected];

        if (currentQ + 1 >= questions.length) {
            // Quiz done
            const correct = newAnswers.filter((a, i) => a === questions[i].correctIndex).length;
            const pct = Math.round((correct / questions.length) * 100);
            const rarity = getRarity(pct);
            setResult({ score: correct, total: questions.length, percentage: pct, rarity });
        } else {
            setAnswers(newAnswers);
            setCurrentQ(currentQ + 1);
            setSelected(null);
            setShowExplanation(false);
        }
    };

    const handleFinish = () => {
        if (result) onComplete(result);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900 border border-gray-700 rounded-3xl p-12 text-center max-w-md w-full mx-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="text-6xl mb-6 inline-block"
                    >
                        🤖
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Generating Quiz...</h3>
                    <p className="text-gray-400">Gemini AI is crafting questions based on your lesson</p>
                    <div className="mt-6 flex justify-center gap-1">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                animate={{ y: [-4, 4, -4] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 bg-purple-500 rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900 border border-red-500/30 rounded-3xl p-10 text-center max-w-md w-full mx-4"
                >
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-white mb-2">Quiz Unavailable</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={generateQuiz} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all">
                            Try Again
                        </button>
                        <button onClick={onSkip} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all">
                            Skip Quiz
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (result) {
        const cfg = RARITY_CONFIG[result.rarity];
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                    className="bg-gray-900 border border-gray-700 rounded-3xl p-10 text-center max-w-lg w-full mx-4 relative overflow-hidden"
                >
                    {/* Confetti-like background for legendary */}
                    {result.rarity === 'legendary' && (
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: ['0%', '100%'], opacity: [1, 0] }}
                                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                                    className="absolute w-2 h-2 rounded-full bg-yellow-400"
                                    style={{ left: `${Math.random() * 100}%`, top: '-5%' }}
                                />
                            ))}
                        </div>
                    )}

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                        className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center text-4xl shadow-lg`}
                    >
                        {result.rarity === 'legendary' ? '🥇' : result.rarity === 'rare' ? '🥈' : '🥉'}
                    </motion.div>

                    <h3 className="text-3xl font-bold text-white mb-1">{cfg.label} NFT!</h3>
                    <p className="text-gray-400 mb-4">{cfg.desc}</p>

                    <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${cfg.color} mb-6`}>
                        <span className="text-white font-bold text-2xl">{result.score}/{result.total}</span>
                        <span className="text-white/80 text-lg ml-2">({result.percentage}%)</span>
                    </div>

                    {/* Score bar */}
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full bg-gradient-to-r ${cfg.color}`}
                        />
                    </div>

                    <div className="text-xs text-gray-500 mb-6">
                        Score 90%+ for 🥇 Legendary &nbsp;|&nbsp; 60%+ for 🥈 Rare &nbsp;|&nbsp; Below for 🥉 Common
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFinish}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r ${cfg.color} shadow-lg hover:shadow-xl transition-all`}
                    >
                        Mint {cfg.label} NFT 🚀
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-purple-400 text-sm font-semibold uppercase tracking-wide">AI Quiz</span>
                        <h3 className="text-xl font-bold text-white">{lessonTitle}</h3>
                    </div>
                    <button onClick={onSkip} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                        Skip Quiz
                    </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                    <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    />
                </div>
                <p className="text-right text-xs text-gray-500 mb-6">Question {currentQ + 1} of {questions.length}</p>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-lg font-semibold text-white mb-6 leading-relaxed">{q.question}</p>

                        <div className="space-y-3 mb-6">
                            {q.options.map((opt, idx) => {
                                let style = 'border-gray-700 bg-gray-800 text-gray-200 hover:border-purple-500 hover:bg-gray-700';
                                if (selected !== null) {
                                    if (idx === q.correctIndex) style = 'border-green-500 bg-green-500/20 text-green-300';
                                    else if (idx === selected && selected !== q.correctIndex) style = 'border-red-500 bg-red-500/20 text-red-300';
                                    else style = 'border-gray-700 bg-gray-800/50 text-gray-500';
                                }
                                return (
                                    <motion.button
                                        key={idx}
                                        whileHover={selected === null ? { scale: 1.01 } : {}}
                                        whileTap={selected === null ? { scale: 0.99 } : {}}
                                        onClick={() => handleSelect(idx)}
                                        disabled={selected !== null}
                                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all ${style}`}
                                    >
                                        <span className="mr-3 font-bold opacity-60">{['A', 'B', 'C', 'D'][idx]}.</span>
                                        {opt}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {showExplanation && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6"
                                >
                                    <p className="text-blue-300 text-sm">
                                        <span className="font-bold">💡 Explanation: </span>
                                        {q.explanation}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            disabled={selected === null}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            {currentQ + 1 === questions.length ? 'See Results 🎯' : 'Next Question →'}
                        </motion.button>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
