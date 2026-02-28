'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Home, BookOpen, Trophy, Award, Users, User, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import StreakWidget from './StreakWidget';
import { cn } from '@/lib/utils';

interface NavLink {
    href: string;
    label: string;
    icon: string;
    lucideIcon?: any;
    badge?: string;
    badgeColor?: string;
}

const NAV_LINKS: NavLink[] = [
    { href: '/', label: 'Home', icon: '🏠', lucideIcon: Home },
    { href: '/learn', label: 'Learn', icon: '📚', lucideIcon: BookOpen, badge: 'AI', badgeColor: 'purple' },
    { href: '/skill-tree', label: 'Skill Tree', icon: '🌳', lucideIcon: Sparkles },
    { href: '/achievements', label: 'Achievements', icon: '🏆', lucideIcon: Trophy },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🥇', lucideIcon: Users },
];

const BOTTOM_LINKS: NavLink[] = [
    { href: '/profile', label: 'Profile', icon: '👤', lucideIcon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { connected, publicKey } = useWallet();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--sidebar-actual-w',
            collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)'
        );
        const main = document.querySelector('.main-content') as HTMLElement | null;
        if (main) {
            main.style.marginLeft = collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)';
        }
    }, [collapsed]);

    const profileHref = publicKey ? `/profile/${publicKey.toBase58()}` : '/';

    return (
        <>
            {/* ── Mobile Hamburger ── */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-[110] lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border shadow-md"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                aria-label="Open menu"
            >
                <span style={{ fontSize: '18px' }}>☰</span>
            </button>

            {/* ── Mobile Overlay ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="sidebar-overlay active"
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar ── */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
            >
                {/* ── Logo / Brand ── */}
                <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                width: 40, height: 40, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                                borderRadius: '12px',
                                fontSize: '20px',
                                boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                            }}
                        >
                            🎓
                        </motion.div>

                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ overflow: 'hidden', minWidth: 0 }}
                                >
                                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                        AI Tutor
                                    </p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
                                        Learn &amp; Earn NFTs
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Main Nav ── */}
                <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {!collapsed && (
                            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 8px 4px', marginTop: '4px' }}>
                                Navigation
                            </p>
                        )}

                        {NAV_LINKS.map((link) => {
                            const isActive = link.href === '/'
                                ? pathname === '/'
                                : pathname.startsWith(link.href);
                            const Icon = link.lucideIcon;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn('nav-item', isActive && 'active')}
                                    data-tooltip={collapsed ? link.label : undefined}
                                    style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                                >
                                    <div className="nav-icon">
                                        {Icon ? <Icon size={18} strokeWidth={2.5} /> : link.icon}
                                    </div>

                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                                style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
                                            >
                                                <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }}>
                                                    {link.label}
                                                </span>
                                                {link.badge && (
                                                    <motion.span 
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        style={{
                                                            fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                                                            borderRadius: '999px', marginLeft: 'auto',
                                                            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                                                            color: '#fff', letterSpacing: '0.04em',
                                                            boxShadow: '0 2px 8px rgba(124,58,237,0.4)'
                                                        }}>
                                                        {link.badge}
                                                    </motion.span>
                                                )}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-indicator"
                                                        style={{
                                                            marginLeft: link.badge ? '0' : 'auto', 
                                                            width: 6, height: 6,
                                                            borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                                                        }}
                                                    />
                                                )}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </div>

                    {/* ── Streak Widget in sidebar ── */}
                    {mounted && connected && !collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ margin: '16px 0 0', padding: '12px', background: 'var(--bg-hover)', borderRadius: '14px', border: '1px solid var(--border)' }}
                        >
                            <StreakWidget compact />
                        </motion.div>
                    )}
                </nav>

                {/* ── Bottom Section ── */}
                <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    {/* Wallet */}
                    <div style={{ overflow: 'hidden' }}>
                        {collapsed ? (
                            <div
                                data-tooltip="Connect Wallet"
                                style={{
                                    width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                                    borderRadius: '12px', fontSize: '20px', cursor: 'pointer', margin: '0 auto',
                                }}
                            >
                                👛
                            </div>
                        ) : (
                            <WalletMultiButton />
                        )}
                    </div>

                    {/* Theme + Collapse in a row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: collapsed ? 'center' : 'space-between' }}>
                        <ThemeToggle />
                        <motion.button
                            onClick={() => setCollapsed(!collapsed)}
                            data-tooltip={collapsed ? 'Expand sidebar' : undefined}
                            className="theme-toggle hidden lg:flex"
                            style={{ fontSize: '14px' }}
                            aria-label={collapsed ? 'Expand' : 'Collapse'}
                        >
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </motion.button>
                    </div>
                </div>
            </motion.aside>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="mobile-bottom-nav">
                {NAV_LINKS.map((link) => {
                    const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', gap: '2px', padding: '6px 0',
                                color: isActive ? '#7c3aed' : 'var(--text-muted)',
                                textDecoration: 'none', fontSize: '10px', fontWeight: isActive ? 700 : 500,
                                transition: 'color 0.2s',
                            }}
                        >
                            <span style={{ fontSize: '20px', lineHeight: 1 }}>{link.icon}</span>
                            <span>{link.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-active"
                                    style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
