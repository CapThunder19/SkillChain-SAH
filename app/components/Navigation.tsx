'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import ThemeToggle from './ThemeToggle';
import StreakWidget from './StreakWidget';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Navigation() {
  const pathname = usePathname();
  const { connected } = useWallet();

  const navLinks = [
    { href: '/learn', label: 'Learn', icon: '📚' },
    { href: '/skill-tree', label: 'Skill Tree', icon: '🌳' },
    { href: '/achievements', label: 'Achievements', icon: '🏆' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="text-3xl group-hover:scale-110 transition-transform">
              🎓
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Tutor
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Learn & Earn NFTs</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {connected && <StreakWidget />}
            <ThemeToggle />
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-lg !h-10 !px-4 !text-sm !font-semibold !transition-all" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex gap-1 pb-3 overflow-x-auto scrollbar-none">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
