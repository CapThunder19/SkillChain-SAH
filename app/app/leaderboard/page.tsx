'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, GetProgramAccountsFilter } from '@solana/web3.js';
import Link from 'next/link';
import { PROGRAM_ID, RPC_ENDPOINT } from '@/lib/constants';

interface LeaderEntry {
    wallet: string;
    level: number;
    subject: string;
    completedLessons: number;
    rank: number;
}

const MOCK_LEADERS: LeaderEntry[] = [
    { wallet: 'Gh9Zk...m4Qx', level: 18, subject: 'Solana Development', completedLessons: 17, rank: 1 },
    { wallet: 'Rt2Wq...p7Nm', level: 15, subject: 'Web Development', completedLessons: 14, rank: 2 },
    { wallet: 'Xv4Bf...k9Cj', level: 12, subject: 'AI & Machine Learning', completedLessons: 11, rank: 3 },
    { wallet: 'Mn8Ts...j2Yd', level: 10, subject: 'Blockchain Fundamentals', completedLessons: 9, rank: 4 },
    { wallet: 'Pw3Lz...r5Hg', level: 8, subject: 'DeFi Essentials', completedLessons: 7, rank: 5 },
    { wallet: 'Qk7Cs...d1Fn', level: 7, subject: 'Cybersecurity', completedLessons: 6, rank: 6 },
    { wallet: 'Ej5Vr...x8Ab', level: 5, subject: 'Python Programming', completedLessons: 4, rank: 7 },
    { wallet: 'Bt6Wu...n3Ip', level: 4, subject: 'Web Development', completedLessons: 3, rank: 8 },
    { wallet: 'Fd1Yo...s6Kl', level: 3, subject: 'Blockchain Fundamentals', completedLessons: 2, rank: 9 },
    { wallet: 'Lc9Gm...h4Qt', level: 2, subject: 'Solana Development', completedLessons: 1, rank: 10 },
];

const RANK_STYLES: Record<number, { bg: string; text: string; badge: string }> = {
    1: { bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40', text: 'text-yellow-400', badge: '🥇' },
    2: { bg: 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/40', text: 'text-gray-300', badge: '🥈' },
    3: { bg: 'bg-gradient-to-r from-orange-700/20 to-amber-600/20 border-orange-600/40', text: 'text-orange-400', badge: '🥉' },
};

function getRankTitle(level: number): string {
    if (level >= 18) return 'Grand Master 🏆';
    if (level >= 12) return 'Diamond 💎';
    if (level >= 6) return 'Gold 🥇';
    if (level >= 3) return 'Silver 🥈';
    return 'Bronze 🥉';
}

function getSubjectColor(subject: string): string {
    const map: Record<string, string> = {
        'Web Development': 'bg-blue-500/20 text-blue-400',
        'Blockchain Fundamentals': 'bg-purple-500/20 text-purple-400',
        'Solana Development': 'bg-yellow-500/20 text-yellow-400',
        'DeFi Essentials': 'bg-green-500/20 text-green-400',
        'AI & Machine Learning': 'bg-red-500/20 text-red-400',
        'Python Programming': 'bg-indigo-500/20 text-indigo-400',
        'Cybersecurity': 'bg-gray-500/20 text-gray-400',
    };
    return map[subject] ?? 'bg-gray-500/20 text-gray-400';
}

export default function LeaderboardPage() {
    const { publicKey, connected } = useWallet();
    const [leaders, setLeaders] = useState<LeaderEntry[]>(MOCK_LEADERS);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'weekly'>('all');
    const [loading, setLoading] = useState(false);

    // In production you'd fetch real on-chain accounts here.
    // For now we show simulated leaderboard with the current user injected.
    useEffect(() => {
        if (publicKey && connected) {
            const shortWallet = `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`;
            // Add the connected user dynamically (level from localStorage or default 1)
            const storedLevel = parseInt(localStorage.getItem(`userLevel_${publicKey.toString()}`) ?? '1');
            const userEntry: LeaderEntry = {
                wallet: shortWallet,
                level: storedLevel,
                subject: 'Web3 Development',
                completedLessons: Math.max(0, storedLevel - 1),
                rank: 0,
            };

            const combined = [...MOCK_LEADERS, userEntry]
                .sort((a, b) => b.level - a.level)
                .map((e, i) => ({ ...e, rank: i + 1 }));

            const myIdx = combined.findIndex(e => e.wallet === shortWallet);
            if (myIdx !== -1) setMyRank(combined[myIdx].rank);

            setLeaders(combined.slice(0, 10));
        }
    }, [publicKey, connected]);

    return (
        <div className="min-h-screen bg-[var(--bg)] py-6 px-6 md:px-8 lg:px-10">
            <div className="w-full mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">🏆 Leaderboard</h1>
                    <p className="text-gray-400 text-lg">Top learners on the AI Tutor platform</p>

                    {myRank && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-block mt-4 px-5 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold"
                        >
                            🎯 Your Rank: #{myRank}
                        </motion.div>
                    )}
                </motion.div>

                {/* Filter tabs */}
                <div className="flex gap-3 justify-center mb-8">
                    {(['all', 'weekly'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === f
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {f === 'all' ? '🌍 All Time' : '📅 This Week'}
                        </button>
                    ))}
                </div>

                {/* Top 3 Podium */}
                <div className="flex items-end justify-center gap-4 mb-8">
                    {/* 2nd */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-300 flex items-center justify-center text-2xl mb-2 shadow-lg">
                            🥈
                        </div>
                        <p className="text-white text-xs font-bold">{leaders[1]?.wallet}</p>
                        <p className="text-gray-400 text-xs">Lvl {leaders[1]?.level}</p>
                        <div className="w-20 h-20 bg-gray-500/20 border border-gray-500/30 rounded-t-xl mt-2 flex items-end justify-center pb-2">
                            <span className="text-gray-400 text-xs font-bold">#2</span>
                        </div>
                    </motion.div>

                    {/* 1st */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl mb-2 shadow-xl shadow-yellow-500/30 w-16 h-16">
                                🥇
                            </div>
                        </motion.div>
                        <p className="text-white text-xs font-bold">{leaders[0]?.wallet}</p>
                        <p className="text-yellow-400 text-xs font-semibold">Lvl {leaders[0]?.level}</p>
                        <div className="w-20 h-28 bg-yellow-500/20 border border-yellow-500/30 rounded-t-xl mt-2 flex items-end justify-center pb-2">
                            <span className="text-yellow-400 text-xs font-bold">#1</span>
                        </div>
                    </motion.div>

                    {/* 3rd */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-700 to-amber-600 flex items-center justify-center text-2xl mb-2 shadow-lg">
                            🥉
                        </div>
                        <p className="text-white text-xs font-bold">{leaders[2]?.wallet}</p>
                        <p className="text-gray-400 text-xs">Lvl {leaders[2]?.level}</p>
                        <div className="w-20 h-14 bg-orange-700/20 border border-orange-600/30 rounded-t-xl mt-2 flex items-end justify-center pb-2">
                            <span className="text-orange-400 text-xs font-bold">#3</span>
                        </div>
                    </motion.div>
                </div>

                {/* Full Leaderboard Table */}
                <div className="space-y-3">
                    {leaders.map((entry, i) => {
                        const rankStyle = RANK_STYLES[entry.rank] ?? {
                            bg: 'bg-gray-900 border-gray-800',
                            text: 'text-gray-400',
                            badge: null,
                        };
                        const isMe = publicKey && entry.wallet === `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`;

                        return (
                            <motion.div
                                key={entry.wallet + i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl border ${rankStyle.bg} ${isMe ? 'ring-2 ring-purple-500/50' : ''} transition-all hover:scale-[1.01]`}
                            >
                                {/* Rank */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${rankStyle.bg}`}>
                                    {rankStyle.badge ?? <span className={`text-sm ${rankStyle.text}`}>#{entry.rank}</span>}
                                </div>

                                {/* Wallet avatar */}
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                    {entry.wallet.slice(0, 2)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-white font-semibold text-sm">{entry.wallet}</p>
                                        {isMe && <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">You</span>}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSubjectColor(entry.subject)}`}>
                                            {entry.subject}
                                        </span>
                                        <span className="text-xs text-gray-500">{getRankTitle(entry.level)}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-white font-bold">Lvl {entry.level}</p>
                                    <p className="text-gray-500 text-xs">{entry.completedLessons} lessons</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-10"
                >
                    <p className="text-gray-500 text-sm mb-4">Complete lessons to climb the leaderboard!</p>
                    <Link
                        href="/learn"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all shadow-xl"
                    >
                        Start Learning 🚀
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

