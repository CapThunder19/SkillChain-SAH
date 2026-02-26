'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getProgram, fetchTutorProfile } from '@/lib/anchor-client';
import { COURSES } from '@/lib/constants';
import Link from 'next/link';

interface SkillNode {
    id: number;
    title: string;
    courseTitle: string;
    courseIcon: string;
    completed: boolean;
    row: number;
    col: number;
}

export default function SkillTreePage() {
    const { publicKey, wallet, connected } = useWallet();
    const { connection } = useConnection();
    const [completedCount, setCompletedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string>('all');

    useEffect(() => {
        loadProgress();
    }, [publicKey, connected]);

    const loadProgress = async () => {
        if (!publicKey || !wallet) { setLoading(false); return; }
        try {
            const program = getProgram(connection, wallet.adapter);
            const profile = await fetchTutorProfile(program, publicKey);
            if (profile) setCompletedCount(profile.level - 1);
        } catch { }
        setLoading(false);
    };

    // Build flat nodes for each lesson across all courses
    const allLessons: SkillNode[] = [];
    COURSES.forEach((course, ci) => {
        course.lessons.forEach((lesson, li) => {
            allLessons.push({
                id: lesson.id,
                title: lesson.title,
                courseTitle: course.title,
                courseIcon: course.icon,
                completed: lesson.id <= completedCount,
                row: li,
                col: ci,
            });
        });
    });

    const filteredLessons = selectedCourse === 'all'
        ? allLessons
        : allLessons.filter(n => n.courseTitle === selectedCourse);

    const totalCompleted = allLessons.filter(n => n.completed).length;
    const overallPct = Math.round((totalCompleted / allLessons.length) * 100);

    const courseColors: Record<string, string> = {
        'Web Development': 'from-blue-500 to-cyan-500',
        'Blockchain Fundamentals': 'from-purple-500 to-pink-500',
        'Solana Development': 'from-yellow-400 to-orange-500',
        'DeFi Essentials': 'from-green-400 to-emerald-500',
        'AI & Machine Learning': 'from-red-400 to-rose-500',
        'Python Programming': 'from-indigo-400 to-violet-500',
        'Cybersecurity': 'from-gray-400 to-slate-500',
    };

    const getNodeStyle = (node: SkillNode) => {
        const color = courseColors[node.courseTitle] ?? 'from-gray-500 to-gray-600';
        if (node.completed) return `bg-gradient-to-br ${color} shadow-lg shadow-current/30`;
        const nextUnlocked = node.id === completedCount + 1;
        if (nextUnlocked) return 'bg-gray-800 border-2 border-dashed border-purple-400 animate-pulse';
        return 'bg-gray-800/60 border border-gray-700';
    };

    if (!connected) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-6 px-6 md:px-8 lg:px-10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="text-6xl mb-4">🌳</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Skill Tree</h2>
                    <p className="text-gray-400 mb-6">Connect your wallet to see your skill progress</p>
                    <Link href="/learn" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
                        Connect & Learn
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] py-6 px-6 md:px-8 lg:px-10">
            <div className="w-full mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        🌳 Skill Tree
                    </h1>
                    <p className="text-gray-400 text-lg">Visualize your learning journey across all courses</p>

                    {/* Overall progress */}
                    <div className="mt-6 max-w-lg mx-auto">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>{totalCompleted} lessons unlocked</span>
                            <span>{overallPct}% Complete</span>
                        </div>
                        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${overallPct}%` }}
                                transition={{ duration: 1.2, delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Course filter tabs */}
                <div className="flex gap-2 flex-wrap justify-center mb-8">
                    <button
                        onClick={() => setSelectedCourse('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCourse === 'all' ? 'bg-white text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        All Courses
                    </button>
                    {COURSES.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCourse(c.title)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCourse === c.title
                                ? `bg-gradient-to-r ${courseColors[c.title]} text-white`
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {c.icon} {c.title.split(' ')[0]}
                        </button>
                    ))}
                </div>

                {/* Skill Tree Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                            <span className="text-5xl">🌳</span>
                        </motion.div>
                    </div>
                ) : selectedCourse === 'all' ? (
                    /* Multi-course tree view */
                    <div className="overflow-x-auto pb-4">
                        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${COURSES.length}, minmax(160px, 1fr))`, minWidth: `${COURSES.length * 180}px` }}>
                            {COURSES.map((course, ci) => {
                                const color = courseColors[course.title] ?? 'from-gray-500 to-gray-600';
                                const courseLessons = allLessons.filter(n => n.courseTitle === course.title);
                                const courseCompleted = courseLessons.filter(n => n.completed).length;
                                return (
                                    <div key={course.id} className="flex flex-col items-center">
                                        {/* Column header */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: ci * 0.1 }}
                                            className={`w-full text-center p-3 rounded-2xl bg-gradient-to-br ${color} mb-4`}
                                        >
                                            <div className="text-2xl">{course.icon}</div>
                                            <div className="text-white text-xs font-bold mt-1 leading-tight">{course.title}</div>
                                            <div className="text-white/70 text-xs mt-1">{courseCompleted}/{courseLessons.length}</div>
                                        </motion.div>

                                        {/* Lesson nodes */}
                                        <div className="flex flex-col items-center gap-2 relative w-full">
                                            {/* Vertical connector line */}
                                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 -translate-x-1/2 -z-10" />

                                            {courseLessons.map((node, li) => (
                                                <motion.div
                                                    key={node.id}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: ci * 0.1 + li * 0.05 }}
                                                    onMouseEnter={() => setHoveredNode(node)}
                                                    onMouseLeave={() => setHoveredNode(null)}
                                                    className="relative z-10 w-full"
                                                >
                                                    <div className={`w-full p-3 rounded-xl ${getNodeStyle(node)} transition-all cursor-pointer hover:scale-105`}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${node.completed ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-400'
                                                                }`}>
                                                                {node.completed ? '✓' : node.id}
                                                            </div>
                                                            <p className={`text-xs font-medium leading-tight ${node.completed ? 'text-white' : 'text-gray-400'
                                                                }`}>
                                                                {node.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Single course detailed view */
                    <div className="max-w-2xl mx-auto">
                        {(() => {
                            const course = COURSES.find(c => c.title === selectedCourse)!;
                            const color = courseColors[course.title];
                            const nodes = filteredLessons;
                            return (
                                <div className="space-y-4">
                                    {nodes.map((node, idx) => {
                                        const isNext = node.id === completedCount + 1;
                                        return (
                                            <motion.div
                                                key={node.id}
                                                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all ${node.completed
                                                    ? `bg-gradient-to-r ${color} border-transparent`
                                                    : isNext
                                                        ? 'bg-gray-800 border-purple-500/50 border-dashed'
                                                        : 'bg-gray-900 border-gray-800'
                                                    }`}
                                            >
                                                {/* Connector line */}
                                                {idx < nodes.length - 1 && (
                                                    <div className={`absolute left-8 top-full w-0.5 h-4 ${node.completed ? 'bg-white/30' : 'bg-gray-700'}`} />
                                                )}

                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${node.completed ? 'bg-white/20 text-white' :
                                                    isNext ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-gray-800 text-gray-600'
                                                    }`}>
                                                    {node.completed ? '✓' : isNext ? '▶' : node.id}
                                                </div>

                                                <div className="flex-1">
                                                    <p className={`font-bold ${node.completed ? 'text-white' : isNext ? 'text-purple-300' : 'text-gray-500'}`}>
                                                        {node.title}
                                                    </p>
                                                    <p className={`text-sm ${node.completed ? 'text-white/70' : 'text-gray-600'}`}>
                                                        {node.completed ? '✅ Completed' : isNext ? '🟢 Up Next' : '🔒 Locked'}
                                                    </p>
                                                </div>

                                                {node.completed && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', bounce: 0.6, delay: idx * 0.1 + 0.2 }}
                                                        className="text-2xl"
                                                    >
                                                        🏅
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Action button */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-12">
                    <Link
                        href="/learn"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all shadow-xl"
                    >
                        Continue Learning 🚀
                    </Link>
                </motion.div>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredNode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-xl p-4 text-center shadow-2xl z-50 pointer-events-none"
                    >
                        <p className="text-white font-bold">{hoveredNode.title}</p>
                        <p className="text-gray-400 text-sm">{hoveredNode.courseTitle}</p>
                        <p className={`text-sm mt-1 font-medium ${hoveredNode.completed ? 'text-green-400' : 'text-gray-500'}`}>
                            {hoveredNode.completed ? '✅ Completed' : '🔒 Not yet'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

