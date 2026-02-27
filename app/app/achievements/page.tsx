'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProgram, fetchTutorProfile } from '@/lib/anchor-client';
import { COURSES } from '@/lib/constants';
import NFTCard from '@/components/NFTCard';
import CertificateModal from '@/components/CertificateModal';
import Link from 'next/link';

type Rarity = 'legendary' | 'rare' | 'common';
type Filter = 'all' | Rarity;

interface NFTData {
  lessonId: number;
  lessonTitle: string;
  courseTitle: string;
  courseIcon: string;
  courseId: string;
  rarity: Rarity;
  quizScore?: number;
  mintAddress?: string;
  timestamp?: number;
}

function buildNFTs(
  completedIds: number[],
  level: number,
  nftMeta: Record<string, { rarity: string; score: number }>
): NFTData[] {
  const nfts: NFTData[] = [];

  // If localStorage array is missing or empty, fall back to sequential up to (level - 1)
  const legacyCount = level > 1 ? level - 1 : 0;
  const useLegacy = completedIds.length === 0;

  for (const course of COURSES) {
    for (const lesson of course.lessons) {
      const isCompleted = useLegacy
        ? lesson.id <= legacyCount
        : completedIds.includes(lesson.id);

      if (isCompleted) {
        // Read the actual rarity + score that was saved during minting
        const meta = nftMeta[String(lesson.id)];
        const rarity: Rarity = (meta?.rarity as Rarity) ?? 'common';
        const quizScore = meta?.score ?? 0;

        nfts.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          courseTitle: course.title,
          courseIcon: course.icon,
          courseId: course.id,
          rarity,
          quizScore,
          mintAddress: undefined,
          timestamp: Date.now() - (lesson.id * 1000000),
        });
      }
    }
  }
  return nfts;
}

const RARITY_COLORS = {
  legendary: 'text-yellow-400',
  rare: 'text-blue-400',
  common: 'text-gray-400',
};

export default function AchievementsPage() {
  const { publicKey, wallet, connected } = useWallet();
  const { connection } = useConnection();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [selectedCert, setSelectedCert] = useState<NFTData | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);

  useEffect(() => {
    loadProfile();
  }, [publicKey, connected]);

  const loadProfile = async () => {
    if (!publicKey || !wallet) { setLoading(false); return; }
    try {
      const program = getProgram(connection, wallet.adapter);
      const tutorProfile = await fetchTutorProfile(program, publicKey);
      if (tutorProfile) {
        setProfile(tutorProfile);

        let completedIds: number[] = [];
        let nftMeta: Record<string, { rarity: string; score: number }> = {};
        try {
          const stored = localStorage.getItem(`completedLessons_${publicKey.toString()}`);
          if (stored) completedIds = JSON.parse(stored);
          const storedMeta = localStorage.getItem(`nftMeta_${publicKey.toString()}`);
          if (storedMeta) nftMeta = JSON.parse(storedMeta);
        } catch (err) { }

        setNfts(buildNFTs(completedIds, tutorProfile.level, nftMeta));
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    }
    setLoading(false);
  };

  const filteredNFTs = filter === 'all' ? nfts : nfts.filter(n => n.rarity === filter);

  const stats = {
    total: nfts.length,
    legendary: nfts.filter(n => n.rarity === 'legendary').length,
    rare: nfts.filter(n => n.rarity === 'rare').length,
    common: nfts.filter(n => n.rarity === 'common').length,
  };

  // ── Not connected ──
  if (!connected) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-6 px-6 md:px-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-7xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-white mb-3">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">Connect your Solana wallet to view your NFT achievement collection</p>
          <Link href="/learn" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
            Connect & Start Learning
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-6 px-6 md:px-8 lg:px-10">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <span className="text-7xl">🎓</span>
          </motion.div>
          <p className="text-gray-400 mt-4 text-lg">Loading your NFT collection...</p>
        </div>
      </div>
    );
  }

  // ── No profile ──
  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-6 px-6 md:px-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="text-7xl mb-6">📚</div>
          <h2 className="text-2xl font-bold text-white mb-3">No Profile Found</h2>
          <p className="text-gray-400 mb-8">Create your learner profile and complete lessons to earn NFT badges!</p>
          <Link href="/learn" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
            Start Learning
          </Link>
        </motion.div>
      </div>
    );
  }

  const completedCount = nfts.length;

  return (
    <div className="min-h-screen bg-[var(--bg)] py-6 px-6 md:px-8 lg:px-10">
      <div className="w-full mx-auto">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-10 p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a1628 50%, #0d2744 100%)' }}
        >
          {/* Animated orbs */}
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-semibold mb-4">
                🏆 NFT Achievement Gallery
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">Your Collection</h1>
              <p className="text-gray-400 text-lg max-w-lg">
                Every NFT proves your learning on the Solana blockchain. Tap any card to reveal its details.
              </p>
            </div>

            {/* Stats panel */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400 text-xs mt-1">Total NFTs</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{stats.legendary}</p>
                <p className="text-gray-400 text-xs mt-1">Legendary 🥇</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{stats.rare}</p>
                <p className="text-gray-400 text-xs mt-1">Rare 🥈</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-gray-400">{stats.common}</p>
                <p className="text-gray-400 text-xs mt-1">Common 🥉</p>
              </div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="relative z-10 mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>{completedCount}/21 lessons · Level {profile.level}</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((completedCount / 21) * 100, 100)}%` }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-3 flex-wrap mb-8">
          {([
            { key: 'all', label: '✨ All NFTs', count: stats.total },
            { key: 'legendary', label: '🥇 Legendary', count: stats.legendary },
            { key: 'rare', label: '🥈 Rare', count: stats.rare },
            { key: 'common', label: '🥉 Common', count: stats.common },
          ] as const).map(({ key, label, count }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${filter === key
                ? 'bg-white text-black border-white'
                : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
            >
              {label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${filter === key ? 'bg-[var(--bg)]/20' : 'bg-gray-800'}`}>
                {count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── NFT Grid ── */}
        {filteredNFTs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-gray-900/40 border border-gray-800 rounded-3xl"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">No {filter !== 'all' ? filter : ''} NFTs yet</h3>
            <p className="text-gray-400 mb-6">
              {filter !== 'all'
                ? `Earn ${filter} NFTs by getting higher quiz scores!`
                : 'Complete lessons to start earning NFT badges!'}
            </p>
            <Link href="/learn" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
              Go Learn 🚀
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {filteredNFTs.map((nft, i) => (
              <NFTCard
                key={nft.lessonId}
                index={i}
                lessonId={nft.lessonId}
                lessonTitle={nft.lessonTitle}
                courseTitle={nft.courseTitle}
                courseIcon={nft.courseIcon}
                courseId={nft.courseId}
                rarity={nft.rarity}
                quizScore={nft.quizScore}
                mintAddress={nft.mintAddress}
                timestamp={nft.timestamp}
                onViewCertificate={() => setSelectedCert(nft)}
              />
            ))}

            {/* Locked placeholder cards */}
            {completedCount < 21 && filter === 'all' && (
              Array.from({ length: Math.min(3, 21 - completedCount) }).map((_, i) => (
                <motion.div
                  key={`locked-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: filteredNFTs.length * 0.08 + i * 0.05 }}
                  className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-700 bg-gray-900/40 flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-3xl opacity-30">🔒</span>
                  <span className="text-xs text-gray-600 text-center px-2">Complete more lessons</span>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ── NFT Preview API Link ── */}
        {nfts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl"
          >
            <h3 className="text-white font-bold mb-3">🖼️ Preview NFT Artwork</h3>
            <p className="text-gray-400 text-sm mb-4">
              Each NFT has unique on-chain SVG artwork generated by our API. Preview any NFT:
            </p>
            <div className="flex gap-2 flex-wrap">
              {nfts.slice(0, 5).map(nft => (
                <a
                  key={nft.lessonId}
                  href={`/api/nft-metadata/${nft.lessonId}?rarity=${nft.rarity}&score=${nft.quizScore ?? 0}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-all hover:scale-105 font-mono border border-gray-700"
                >
                  #{String(nft.lessonId).padStart(3, '0')} {nft.courseIcon}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all shadow-xl shadow-purple-500/30"
          >
            <span>Keep Earning NFTs</span>
            <span>🚀</span>
          </Link>
        </motion.div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          lessonId={selectedCert.lessonId}
          lessonTitle={selectedCert.lessonTitle}
          courseTitle={selectedCert.courseTitle}
          rarity={selectedCert.rarity}
          quizScore={selectedCert.quizScore}
          mintAddress={selectedCert.mintAddress}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}


