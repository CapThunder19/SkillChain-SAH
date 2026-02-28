'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateNFTDataUri } from '@/lib/nft-svg';
import { COURSES } from '@/lib/constants';

interface NFTRewardPreviewProps {
    lessonId: number;
    lessonTitle: string;
}

function getCourseForLesson(lessonId: number) {
    for (const course of COURSES) {
        if (course.lessons.find(l => l.id === lessonId)) return course;
    }
    return null;
}

export default function NFTRewardPreview({ lessonId, lessonTitle }: NFTRewardPreviewProps) {
    const course = getCourseForLesson(lessonId);

    const previewSrc = useMemo(() => generateNFTDataUri({
        lessonId,
        lessonTitle,
        courseTitle: course?.title ?? 'AI Tutor',
        courseIcon: course?.icon ?? '🎓',
        courseId: course?.id ?? 'web-development',
        rarity: 'common',
        quizScore: 0,
    }), [lessonId, lessonTitle, course]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 border-b border-gray-800 px-4 py-3 flex items-center gap-2">
                <span className="text-lg">🎁</span>
                <div>
                    <p className="text-white text-sm font-bold">NFT Reward</p>
                    <p className="text-gray-400 text-xs">Complete lesson to earn</p>
                </div>
            </div>

            <div className="p-4">
                {/* Preview image with lock overlay */}
                <div className="relative mx-auto w-full max-w-[180px] group">
                    {/* Glow behind */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-purple-500 rounded-xl blur-xl"
                    />

                    <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/40">
                        {/* Actual NFT artwork, blurred as teaser */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewSrc}
                            alt="NFT Preview"
                            className="w-full object-cover"
                            style={{ aspectRatio: '5/7', filter: 'blur(3px)', transform: 'scale(1.05)', opacity: 0.5 }}
                        />

                        {/* Lock overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-3xl mb-2"
                            >
                                🔒
                            </motion.div>
                            <p className="text-white/80 text-xs font-bold text-center px-2">Complete quiz to unlock</p>
                        </div>
                    </div>

                    {/* Corner sparkles */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -15], opacity: [0.8, 0], scale: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                            className="absolute text-purple-300 text-xs pointer-events-none"
                            style={{ right: `${5 + i * 10}%`, bottom: `${10 + (i % 2) * 15}%` }}
                        >✦</motion.div>
                    ))}
                </div>

                {/* Rarity tiers */}
                <div className="mt-4 space-y-2">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Rarity Tiers</p>
                    {[
                        { label: '🥇 Legendary', desc: 'Score 90%+', color: '#f59e0b' },
                        { label: '🥈 Rare', desc: 'Score 60%+', color: '#3b82f6' },
                        { label: '🥉 Common', desc: 'Any score', color: '#6b7280' },
                    ].map(tier => (
                        <div key={tier.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tier.color }} />
                                <span className="text-white text-[11px] font-medium">{tier.label}</span>
                            </div>
                            <span className="text-gray-500 text-[10px]">{tier.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
