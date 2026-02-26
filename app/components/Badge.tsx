'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'blue' | 'gold' | 'green' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'purple', 
  size = 'md',
  pulse = false,
  className 
}: BadgeProps) {
  const variants = {
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    gold: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    gray: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full border',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        className
      )}
    >
      {children}
    </motion.span>
  );
}

export function RarityBadge({ rarity, className }: { rarity: 'common' | 'rare' | 'legendary'; className?: string }) {
  const rarityConfig = {
    common: { icon: '🥉', label: 'Common', variant: 'gray' as const },
    rare: { icon: '🥈', label: 'Rare', variant: 'blue' as const },
    legendary: { icon: '🥇', label: 'Legendary', variant: 'gold' as const },
  };

  const config = rarityConfig[rarity];

  return (
    <Badge variant={config.variant} className={className}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </Badge>
  );
}

export function LevelBadge({ level, className }: { level: number; className?: string }) {
  const getVariant = (lvl: number) => {
    if (lvl >= 20) return 'gold';
    if (lvl >= 10) return 'purple';
    return 'blue';
  };

  return (
    <Badge variant={getVariant(level)} className={className} pulse={level >= 20}>
      <span>⭐</span>
      <span>Level {level}</span>
    </Badge>
  );
}

export function StatusBadge({ status, className }: { status: 'active' | 'completed' | 'locked'; className?: string }) {
  const statusConfig = {
    active: { icon: '🔓', label: 'Active', variant: 'green' as const },
    completed: { icon: '✅', label: 'Completed', variant: 'blue' as const },
    locked: { icon: '🔒', label: 'Locked', variant: 'gray' as const },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </Badge>
  );
}
