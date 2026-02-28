'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StreakData } from '@/lib/types';
import { getStreak, getStreakEmoji } from '@/lib/streak';

interface StreakWidgetProps {
    compact?: boolean;
}

export default function StreakWidget({ compact = false }: StreakWidgetProps) {
    const [streak, setStreak] = useState<StreakData | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => { setStreak(getStreak()); }, []);

    if (!streak) return null;

    const emoji = getStreakEmoji(streak.currentStreak);
    const isActive = streak.currentStreak > 0;

    if (compact) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.span
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}
                >
                    {emoji}
                </motion.span>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: isActive ? '#f97316' : 'var(--text-secondary)', margin: 0, lineHeight: 1.2 }}>
                        {streak.currentStreak} day streak
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                        {isActive ? '🔥 Keep going!' : 'Start today!'}
                    </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Best</p>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', margin: 0 }}>{streak.longestStreak}d</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetails(!showDetails)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: isActive ? 'rgba(249,115,22,0.1)' : 'var(--bg-hover)',
                    color: isActive ? '#f97316' : 'var(--text-secondary)',
                    outline: `1px solid ${isActive ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                }}
            >
                <motion.span
                    animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '18px', lineHeight: 1 }}
                >
                    {emoji}
                </motion.span>
                <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, margin: 0, lineHeight: 1 }}>{streak.currentStreak} day streak</p>
                    <p style={{ fontSize: '10px', opacity: 0.6, margin: 0, marginTop: '2px' }}>
                        {streak.currentStreak > 0 ? 'Keep it up!' : 'Start today!'}
                    </p>
                </div>
            </motion.button>

            <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.3 }}
                        style={{
                            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                            width: 240, background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: '18px', padding: '16px', boxShadow: 'var(--shadow-lg)', zIndex: 200,
                        }}
                    >
                        <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px' }}>
                            🔥 Learning Streak
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                            {[
                                { label: 'Current', value: streak.currentStreak, color: '#f97316' },
                                { label: 'Longest', value: streak.longestStreak, color: '#fbbf24' },
                            ].map(s => (
                                <div key={s.label} style={{ background: 'var(--bg-hover)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '22px', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{s.label}</p>
                                </div>
                            ))}
                            <div style={{ background: 'var(--bg-hover)', borderRadius: '12px', padding: '10px', textAlign: 'center', gridColumn: '1 / -1' }}>
                                <p style={{ fontSize: '22px', fontWeight: 800, color: '#3b82f6', margin: 0 }}>{streak.totalDaysLearned}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Total Days Learned</p>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Milestones</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {[3, 7, 14, 30, 100].map(m => (
                                    <span
                                        key={m}
                                        style={{
                                            fontSize: '11px', padding: '2px 8px', borderRadius: '999px', fontWeight: 600,
                                            background: streak.longestStreak >= m ? 'rgba(249,115,22,0.15)' : 'var(--bg-hover)',
                                            color: streak.longestStreak >= m ? '#f97316' : 'var(--text-muted)',
                                            border: `1px solid ${streak.longestStreak >= m ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
                                        }}
                                    >
                                        {m}🔥
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
