'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, BookOpen, Award, Users, Grid3x3, Settings } from 'lucide-react';

export default function LeftSidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: HomeIcon, href: '/', label: 'Home' },
    { icon: Grid3x3, href: '/skill-tree', label: 'Skills' },
    { icon: BookOpen, href: '/learn', label: 'Courses' },
    { icon: Award, href: '/achievements', label: 'Achievements' },
    { icon: Users, href: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-24 bg-white border-r border-[var(--border)] flex flex-col items-center py-6 z-50 hidden md:flex">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-2xl shadow-md">
          🦅
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                ${isActive 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title={item.label}
            >
              <Icon size={24} strokeWidth={2} />
            </Link>
          );
        })}
      </nav>

      {/* User Avatar at Bottom */}
      <Link href="/profile" className="mt-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-md">
          SC
        </div>
      </Link>
    </aside>
  );
}
