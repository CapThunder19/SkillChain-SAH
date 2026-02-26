'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, BookOpen, Award, Users, Grid3x3 } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: HomeIcon, href: '/', label: 'Home' },
    { icon: Grid3x3, href: '/skill-tree', label: 'Skills' },
    { icon: BookOpen, href: '/learn', label: 'Courses' },
    { icon: Award, href: '/achievements', label: 'Badges' },
    { icon: Users, href: '/leaderboard', label: 'Board' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom shadow-lg">
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all
                ${isActive 
                  ? 'text-gray-900' 
                  : 'text-gray-500'
                }
              `}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
