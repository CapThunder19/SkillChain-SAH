import { StreakData } from './types';

const STREAK_KEY = 'ai_tutor_streak';

function todayString(): string {
    return new Date().toISOString().split('T')[0];
}

export function getStreak(): StreakData {
    if (typeof window === 'undefined') return defaultStreak();
    try {
        const raw = localStorage.getItem(STREAK_KEY);
        if (!raw) return defaultStreak();
        return JSON.parse(raw) as StreakData;
    } catch {
        return defaultStreak();
    }
}

export function recordActivity(): StreakData {
    const today = todayString();
    const current = getStreak();

    if (current.lastActivityDate === today) {
        return current;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = current.currentStreak;

    if (current.lastActivityDate === yesterdayStr) {
        newStreak += 1;
    } else {
        newStreak = 1;
    }

    const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(current.longestStreak, newStreak),
        lastActivityDate: today,
        totalDaysLearned: current.totalDaysLearned + 1,
    };

    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
}

function defaultStreak(): StreakData {
    return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: '',
        totalDaysLearned: 0,
    };
}

export function getStreakEmoji(streak: number): string {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '✨';
}

export function getStreakMilestone(streak: number): string | null {
    const milestones: Record<number, string> = {
        3: '3-Day Streak! You\'re building a habit!',
        7: '7-Day Streak! One week strong!',
        14: '14-Day Streak! Two weeks of dedication!',
        30: '30-Day Streak! A month of learning!',
        50: '50-Day Streak! Unstoppable!',
        100: '100-Day Streak! Legend!',
    };
    return milestones[streak] ?? null;
}
