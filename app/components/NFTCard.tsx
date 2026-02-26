'use client';

import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateNFTDataUri } from '@/lib/nft-svg';

interface NFTCardProps {
    lessonId: number;
    lessonTitle: string;
    courseTitle: string;
    courseIcon: string;
    courseId: string;
    rarity?: 'common' | 'rare' | 'legendary';
    quizScore?: number;
    mintAddress?: string;
    timestamp?: number;
    index?: number;
    onViewCertificate?: () => void;
}

const RARITY_CONFIG = {
    legendary: {
        glow: '0 0 40px rgba(251,191,36,0.6)',
        border: 'rgba(251,191,36,0.65)',
        badgeGrad: 'linear-gradient(135deg,#f59e0b,#d97706)',
        badge: '🥇 LEGENDARY',
        text: '#fbbf24',
        shimmer: 'rgba(251,191,36,0.25)',
    },
    rare: {
        glow: '0 0 30px rgba(59,130,246,0.5)',
        border: 'rgba(96,165,250,0.6)',
        badgeGrad: 'linear-gradient(135deg,#3b82f6,#0891b2)',
        badge: '🥈 RARE',
        text: '#93c5fd',
        shimmer: 'rgba(147,197,253,0.2)',
    },
    common: {
        glow: '0 0 15px rgba(107,114,128,0.3)',
        border: 'rgba(107,114,128,0.4)',
        badgeGrad: 'linear-gradient(135deg,#6b7280,#4b5563)',
        badge: '🥉 COMMON',
        text: '#9ca3af',
        shimmer: 'rgba(156,163,175,0.1)',
    },
};

export default function NFTCard({
    lessonId, lessonTitle, courseTitle, courseIcon, courseId,
    rarity = 'common', quizScore, mintAddress, timestamp, index = 0,
    onViewCertificate,
}: NFTCardProps) {
    const cfg = RARITY_CONFIG[rarity];
    const [flipped, setFlipped] = useState(false);
    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [tiltX, setTiltX] = useState(0);
    const [tiltY, setTiltY] = useState(0);
    const [shimmerPos, setShimmerPos] = useState({ x: 50, y: 50 });

    // Generate SVG data URI once (memoized) — no network request
    const imgSrc = useMemo(() => generateNFTDataUri({
        lessonId, lessonTitle, courseTitle, courseIcon, courseId, rarity,
        quizScore: quizScore ?? 0,
    }), [lessonId, lessonTitle, courseTitle, courseIcon, courseId, rarity, quizScore]);

    const date = timestamp
        ? new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el || flipped) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setTiltY((x - 0.5) * 16);
        setTiltX(-(y - 0.5) * 16);
        setShimmerPos({ x: x * 100, y: y * 100 });
    };

    const handleMouseLeave = () => {
        setTiltX(0);
        setTiltY(0);
        setHovered(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.07, type: 'spring', bounce: 0.35 }}
            style={{ perspective: '1000px' }}
            className="cursor-pointer select-none"
        >
            <motion.div
                ref={cardRef}
                animate={{
                    rotateX: flipped ? 180 : tiltX,
                    rotateY: flipped ? 180 : tiltY,
                }}
                transition={{ duration: flipped ? 0.55 : 0.08 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setFlipped(!flipped)}
                style={{ transformStyle: 'preserve-3d', position: 'relative' }}
                className="w-full"
            >

                {/* ─── FRONT FACE ─── */}
                <div
                    style={{
                        backfaceVisibility: 'hidden',
                        aspectRatio: '5/7',
                        border: `2px solid ${cfg.border}`,
                        boxShadow: hovered ? cfg.glow : cfg.glow.replace('0.6', '0.3').replace('0.5', '0.2').replace('0.3', '0.1'),
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'box-shadow 0.3s',
                    }}
                >
                    {/* Certificate SVG as img — data URI, no network */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imgSrc}
                        alt={lessonTitle}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />

                    {/* Shimmer overlay on hover */}
                    {hovered && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                pointerEvents: 'none',
                                background: `radial-gradient(circle at ${shimmerPos.x}% ${shimmerPos.y}%, ${cfg.shimmer} 0%, transparent 60%)`,
                                borderRadius: '14px',
                                transition: 'background 0.05s',
                            }}
                        />
                    )}

                    {/* Legendary sparkles */}
                    {rarity === 'legendary' && hovered && (
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '14px', overflow: 'hidden' }}>
                            {[...Array(5)].map((_, i) => (
                                <motion.span
                                    key={i}
                                    animate={{ y: [0, -35], opacity: [1, 0], scale: [0, 1.4, 0] }}
                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        color: '#fbbf24',
                                        fontSize: '12px',
                                        left: `${12 + i * 18}%`,
                                        bottom: `${15 + (i % 2) * 15}%`,
                                    }}
                                >✦</motion.span>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── BACK FACE ─── */}
                <div
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        position: 'absolute',
                        inset: 0,
                        aspectRatio: '5/7',
                        border: `2px solid ${cfg.border}`,
                        boxShadow: cfg.glow,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: '#050508',
                    }}
                >
                    {/* Blurred image bg */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imgSrc}
                        alt=""
                        aria-hidden
                        style={{
                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                            objectFit: 'cover', opacity: 0.12, filter: 'blur(8px)', transform: 'scale(1.1)',
                        }}
                    />

                    <div style={{ position: 'relative', zIndex: 1, padding: '14px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Rarity badge */}
                        <div style={{ background: cfg.badgeGrad, borderRadius: '10px', textAlign: 'center', padding: '6px 0', marginBottom: '10px', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>{cfg.badge}</span>
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>LESSON</p>
                                <p style={{ color: '#fff', fontSize: '11px', fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{lessonTitle}</p>
                            </div>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>COURSE</p>
                                <p style={{ color: '#fff', fontSize: '11px', margin: 0 }}>{courseTitle}</p>
                            </div>
                            {quizScore !== undefined && quizScore > 0 && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>SCORE</p>
                                        <p style={{ color: cfg.text, fontSize: '10px', fontWeight: 700, margin: 0 }}>{quizScore}%</p>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${quizScore}%`, height: '100%', background: cfg.badgeGrad, borderRadius: '2px' }} />
                                    </div>
                                </div>
                            )}
                            {date && (
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>EARNED</p>
                                    <p style={{ color: '#fff', fontSize: '11px', margin: 0 }}>{date}</p>
                                </div>
                            )}
                            {mintAddress && (
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>ON-CHAIN</p>
                                    <a
                                        href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        style={{ color: cfg.text, fontSize: '10px', fontFamily: 'monospace', textDecoration: 'underline' }}
                                    >
                                        {mintAddress.slice(0, 6)}…{mintAddress.slice(-4)}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* View Certificate button */}
                        {onViewCertificate && (
                            <button
                                onClick={e => { e.stopPropagation(); onViewCertificate(); }}
                                style={{
                                    marginTop: '10px', width: '100%', padding: '8px 0',
                                    background: cfg.badgeGrad, border: 'none', borderRadius: '10px',
                                    color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                                    flexShrink: 0,
                                }}
                            >
                                🖼️ View Certificate
                            </button>
                        )}

                        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '9px', textAlign: 'center', marginTop: '6px', flexShrink: 0 }}>
                            Tap to flip back
                        </p>
                    </div>
                </div>
            </motion.div>

            {!flipped && (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '5px' }}>
                    Tap to flip
                </p>
            )}
        </motion.div>
    );
}
