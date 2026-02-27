'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Connection, PublicKey } from '@solana/web3.js';
import { RPC_ENDPOINT } from '@/lib/constants';
import { COURSES } from '@/lib/constants';
import { getProgram, fetchTutorProfile } from '@/lib/anchor-client';
import { AnchorProvider } from '@coral-xyz/anchor';
import IDLJson from '@/lib/idl/tutor_project.json';
import { Program, Idl } from '@coral-xyz/anchor';
import Link from 'next/link';

const RARITY_COLORS: Record<string, string> = {
    legendary: 'from-yellow-400 to-orange-500',
    rare: 'from-blue-400 to-cyan-500',
    common: 'from-gray-400 to-gray-500',
};

export default function ProfilePage() {
    const params = useParams();
    const walletAddress = params?.wallet as string;
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (walletAddress) loadProfile();
    }, [walletAddress]);

    const loadProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const connection = new Connection(RPC_ENDPOINT, 'confirmed');
            const pubkey = new PublicKey(walletAddress);

            // Create a read-only dummy wallet for provider
            const dummyWallet = {
                publicKey: pubkey,
                signTransaction: async (tx: any) => tx,
                signAllTransactions: async (txs: any[]) => txs,
            };

            const provider = new AnchorProvider(connection, dummyWallet as any, { commitment: 'confirmed' });
            const program = new Program(IDLJson as Idl, provider);
            const tutorProfile = await (program.account as any).tutor.fetch(
                (await PublicKey.findProgramAddress(
                    [Buffer.from('tutor'), pubkey.toBuffer()],
                    program.programId
                ))[0]
            );
            setProfile(tutorProfile);
        } catch (e: any) {
            setError('Profile not found or this wallet has not started learning yet.');
        }
        setLoading(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    let initialLevel = profile ? profile.level : 1;
    let completedLessonsCount = initialLevel > 1 ? initialLevel - 1 : 0;

    // Attempt to load proper non-sequential progression from localStorage
    let completedIds: number[] = [];
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem(`completedLessons_${walletAddress}`);
            if (stored) completedIds = JSON.parse(stored);
        } catch (e) { }
    }

    const useLegacy = completedIds.length === 0;
    const allLessons = COURSES.flatMap(c => c.lessons);

    const completedList = allLessons.filter(l =>
        useLegacy ? l.id <= completedLessonsCount : completedIds.includes(l.id)
    );

    const coursePcts = COURSES.map(c => {
        const doneInCourse = c.lessons.filter(l =>
            useLegacy ? l.id <= completedLessonsCount : completedIds.includes(l.id)
        ).length;
        return {
            ...c,
            pct: Math.round((doneInCourse / c.lessons.length) * 100),
        };
    });

    const displayCompletedCount = useLegacy ? completedLessonsCount : completedIds.length;

    const shortWallet = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : '';

    const rankTitle = displayCompletedCount >= 18 ? '🏆 Grand Master'
        : displayCompletedCount >= 12 ? '💎 Diamond Learner'
            : displayCompletedCount >= 6 ? '🥇 Gold Scholar'
                : displayCompletedCount >= 3 ? '🥈 Silver Student'
                    : '🥉 Bronze Beginner';

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-6 px-6 md:px-8 lg:px-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                    <span className="text-6xl">🎓</span>
                </motion.div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-6 px-6 md:px-8 lg:px-10">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link href="/learn" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold">
                        Start Learning
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] py-6 px-6 md:px-8 lg:px-10">
            <div className="max-w-3xl mx-auto">

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-8 mb-6 relative overflow-hidden"
                >
                    {/* Background glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-4xl flex-shrink-0 shadow-xl shadow-purple-500/30">
                            🎓
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-white">{shortWallet}</h1>
                                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm rounded-full font-semibold">
                                    {rankTitle}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Subject: <span className="text-white font-medium">{profile.subject}</span></p>

                            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{profile.level}</p>
                                    <p className="text-xs text-gray-500">Level</p>
                                </div>
                                <div className="w-px bg-gray-700 hidden sm:block" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{displayCompletedCount}</p>
                                    <p className="text-xs text-gray-500">Lessons Done</p>
                                </div>
                                <div className="w-px bg-gray-700 hidden sm:block" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{displayCompletedCount}</p>
                                    <p className="text-xs text-gray-500">NFTs Earned</p>
                                </div>
                                <div className="w-px bg-gray-700 hidden sm:block" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{Math.round((displayCompletedCount / 21) * 100)}%</p>
                                    <p className="text-xs text-gray-500">Complete</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Share button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyLink}
                        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium border border-gray-600 transition-all"
                    >
                        {copied ? '✅ Copied!' : '🔗 Share'}
                    </motion.button>
                </motion.div>

                {/* Course Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-6"
                >
                    <h2 className="text-xl font-bold text-white mb-5">📚 Course Progress</h2>
                    <div className="space-y-4">
                        {coursePcts.map((c, i) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-300">{c.icon} {c.title}</span>
                                    <span className="text-xs font-bold text-gray-400">{c.pct}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.pct}%` }}
                                        transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                                        className={`h-full rounded-full ${c.pct === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* NFT Badges */}
                {completedList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-6"
                    >
                        <h2 className="text-xl font-bold text-white mb-5">🏅 NFT Achievements</h2>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                            {completedList.map((lesson, i) => (
                                <motion.div
                                    key={lesson.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.04, type: 'spring', bounce: 0.4 }}
                                    className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-3 text-center hover:scale-105 transition-transform"
                                >
                                    <div className="text-2xl mb-1">🎖️</div>
                                    <p className="text-white text-xs font-semibold leading-tight">{lesson.title}</p>
                                    <p className="text-gray-500 text-xs mt-1">Lesson #{lesson.id}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* On-chain proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center bg-gray-900/50 border border-gray-800 rounded-2xl p-4"
                >
                    <p className="text-gray-500 text-xs">
                        🔗 Verified on Solana Blockchain •{' '}
                        <a
                            href={`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 underline"
                        >
                            View on Explorer
                        </a>
                    </p>
                </motion.div>

            </div>
        </div>
    );
}
