'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: any;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color?: 'purple' | 'blue' | 'gold' | 'green';
  className?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  color = 'purple',
  className,
}: StatsCardProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    gold: 'from-yellow-500 to-orange-500',
    green: 'from-green-500 to-emerald-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn('stat-card', className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            {label}
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp 
                size={14} 
                className={cn(trendUp ? 'text-green-500' : 'text-red-500', !trendUp && 'rotate-180')}
              />
              <span className={cn('text-xs font-medium', trendUp ? 'text-green-500' : 'text-red-500')}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <div 
          className={cn('w-12 h-12 rounded-xl flex items-center justify-center', `bg-gradient-to-br ${colorClasses[color]}`)}
          style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}
        >
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export function StatsGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  );
}

// Pre-configured stat cards
export function LevelStatsCard({ level, className }: { level: number; className?: string }) {
  return (
    <StatsCard
      icon={Award}
      label="Current Level"
      value={level}
      trend="+1 this week"
      trendUp={true}
      color="purple"
      className={className}
    />
  );
}

export function StreakStatsCard({ streak, className }: { streak: number; className?: string }) {
  return (
    <StatsCard
      icon={Zap}
      label="Day Streak"
      value={streak}
      trend={streak > 0 ? 'Keep going!' : 'Start today'}
      trendUp={streak > 0}
      color="gold"
      className={className}
    />
  );
}

export function CompletedStatsCard({ completed, total, className }: { completed: number; total: number; className?: string }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <StatsCard
      icon={Award}
      label="Lessons Completed"
      value={`${completed}/${total}`}
      trend={`${percentage}% complete`}
      trendUp={percentage > 50}
      color="blue"
      className={className}
    />
  );
}

export function TimeStatsCard({ hours, className }: { hours: number; className?: string }) {
  return (
    <StatsCard
      icon={Clock}
      label="Learning Time"
      value={`${hours}h`}
      trend="+2.5h this week"
      trendUp={true}
      color="green"
      className={className}
    />
  );
}
