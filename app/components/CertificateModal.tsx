'use client';

import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateNFTDataUri } from '@/lib/nft-svg';
import { COURSES } from '@/lib/constants';

interface CertificateModalProps {
    lessonId: number;
    lessonTitle: string;
    courseTitle: string;
    rarity: 'common' | 'rare' | 'legendary';
    quizScore?: number;
    mintAddress?: string;
    onClose: () => void;
}

function getCourseInfo(lessonId: number) {
    for (const course of COURSES) {
        const lesson = course.lessons.find(l => l.id === lessonId);
        if (lesson) return { icon: course.icon, id: course.id };
    }
    return { icon: '🎓', id: 'web-development' };
}

const RARITY_LABEL = {
    legendary: { text: '🥇 Legendary Achievement', color: '#fbbf24', glow: 'rgba(251,191,36,0.5)' },
    rare: { text: '🥈 Rare Achievement', color: '#93c5fd', glow: 'rgba(59,130,246,0.4)' },
    common: { text: '🥉 Common Achievement', color: '#9ca3af', glow: 'rgba(107,114,128,0.3)' },
};

export default function CertificateModal({
    lessonId, lessonTitle, courseTitle, rarity, quizScore, mintAddress, onClose
}: CertificateModalProps) {
    const { icon, id: courseId } = getCourseInfo(lessonId);
    const rl = RARITY_LABEL[rarity];

    const imgSrc = useMemo(() => generateNFTDataUri({
        lessonId, lessonTitle, courseTitle,
        courseIcon: icon,
        courseId,
        rarity,
        quizScore: quizScore ?? 0,
    }), [lessonId, lessonTitle, courseTitle, icon, courseId, rarity, quizScore]);

    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = imgSrc;
        a.download = `NFT-Certificate-${lessonId}-${rarity}.svg`;
        a.click();
    };

    const handleShare = async () => {
        const text = `I earned a ${rarity} NFT certificate for completing "${lessonTitle}" on AI Tutor!`;
        if (navigator.share) {
            await navigator.share({ title: `AI Tutor Certificate: ${lessonTitle}`, text, url: window.location.href })
                .catch(() => { });
        } else {
            await navigator.clipboard.writeText(text + ' ' + window.location.href);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', padding: '16px',
                    background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 30 }}
                    transition={{ type: 'spring', bounce: 0.3 }}
                    onClick={e => e.stopPropagation()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '450px', width: '100%', position: 'relative' }}
                >
                    {/* Close hint */}
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '-40px', right: 0, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                    >
                        ESC to close ✕
                    </button>

                    {/* Certificate image */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                        {/* Rarity glow */}
                        <motion.div
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            style={{
                                position: 'absolute', inset: '-20px', borderRadius: '28px',
                                background: rl.glow, filter: 'blur(20px)',
                            }}
                        />

                        {/* Legendary sparkles */}
                        {rarity === 'legendary' && (
                            <>
                                {[...Array(6)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{ y: [0, -50], opacity: [1, 0], scale: [0, 2, 0] }}
                                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
                                        style={{
                                            position: 'absolute', color: '#fbbf24', fontSize: '16px',
                                            left: `${8 + i * 15}%`, bottom: '5px', zIndex: 10,
                                        }}
                                    >✦</motion.span>
                                ))}
                            </>
                        )}

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imgSrc}
                            alt={`Certificate: ${lessonTitle}`}
                            style={{
                                position: 'relative', zIndex: 5, width: '100%',
                                borderRadius: '20px', boxShadow: `0 20px 60px ${rl.glow}`,
                            }}
                        />
                    </div>

                    {/* Info card */}
                    <div style={{
                        marginTop: '16px', width: '100%', maxWidth: '380px',
                        background: 'rgba(10,10,20,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '18px', padding: '16px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <p style={{ color: rl.color, fontSize: '12px', fontWeight: 700, margin: '0 0 4px' }}>{rl.text}</p>
                                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 3px', lineHeight: 1.3 }}>{lessonTitle}</h3>
                                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{courseTitle}</p>
                                {quizScore !== undefined && quizScore > 0 && (
                                    <p style={{ color: rl.color, fontSize: '13px', fontWeight: 600, margin: '4px 0 0' }}>Quiz Score: {quizScore}%</p>
                                )}
                            </div>
                            <span style={{ fontSize: '36px', flexShrink: 0 }}>
                                {rarity === 'legendary' ? '🏆' : rarity === 'rare' ? '🥈' : '🥉'}
                            </span>
                        </div>

                        {mintAddress && (
                            <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' }}>
                                <p style={{ color: '#4b5563', fontSize: '11px', margin: '0 0 3px' }}>On-Chain Verification</p>
                                <a
                                    href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#a78bfa', fontSize: '12px', fontFamily: 'monospace', textDecoration: 'underline' }}
                                >
                                    {mintAddress.slice(0, 12)}…{mintAddress.slice(-8)} ↗
                                </a>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <motion.button
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={handleDownload}
                                style={{
                                    flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                                    color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                ⬇️ Download
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={handleShare}
                                style={{
                                    flex: 1, padding: '10px 0',
                                    background: rarity === 'legendary' ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                                        : rarity === 'rare' ? 'linear-gradient(135deg,#3b82f6,#0891b2)'
                                            : 'linear-gradient(135deg,#6b7280,#4b5563)',
                                    border: 'none', borderRadius: '12px',
                                    color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                🔗 Share
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
