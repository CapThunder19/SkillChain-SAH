'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { BookOpen, Award, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function TopNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/skill-tree', label: 'Skills', icon: Sparkles },
    { href: '/achievements', label: 'Achievements', icon: Award },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎓</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              AI Tutor
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Wallet & Theme */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <WalletMultiButton />
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-card)]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all
                  ${isActive
                    ? 'text-blue-600'
                    : 'text-[var(--text-secondary)]'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
