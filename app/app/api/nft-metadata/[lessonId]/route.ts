import { NextRequest, NextResponse } from 'next/server';
import { COURSES } from '@/lib/constants';

const RARITY_COLORS: Record<string, { from: string; to: string; accent: string; label: string; badge: string }> = {
    legendary: { from: '#f59e0b', to: '#d97706', accent: '#fbbf24', label: 'LEGENDARY', badge: '🥇' },
    rare: { from: '#3b82f6', to: '#0891b2', accent: '#67e8f9', label: 'RARE', badge: '🥈' },
    common: { from: '#6b7280', to: '#4b5563', accent: '#9ca3af', label: 'COMMON', badge: '🥉' },
};

const COURSE_GRADIENTS: Record<string, { from: string; to: string }> = {
    'web-development': { from: '#1e40af', to: '#0e7490' },
    'blockchain-basics': { from: '#6d28d9', to: '#db2777' },
    'solana-development': { from: '#92400e', to: '#b45309' },
    'defi-essentials': { from: '#065f46', to: '#047857' },
    'ai-machine-learning': { from: '#991b1b', to: '#c2410c' },
    'python-programming': { from: '#312e81', to: '#4338ca' },
    'cybersecurity': { from: '#1f2937', to: '#374151' },
};

function getLessonInfo(lessonId: number) {
    for (const course of COURSES) {
        const lesson = course.lessons.find(l => l.id === lessonId);
        if (lesson) return { lesson, course };
    }
    return null;
}

function generateSVG(
    lessonId: number,
    lessonTitle: string,
    courseTitle: string,
    courseIcon: string,
    courseId: string,
    rarity: string,
    score: number,
): string {
    const r = RARITY_COLORS[rarity] ?? RARITY_COLORS.common;
    const cg = COURSE_GRADIENTS[courseId] ?? { from: '#4c1d95', to: '#1e40af' };

    const shortTitle = lessonTitle.length > 22 ? lessonTitle.slice(0, 22) + '…' : lessonTitle;
    const shortCourse = courseTitle.length > 20 ? courseTitle.slice(0, 20) + '…' : courseTitle;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <!-- Main background gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cg.from}"/>
      <stop offset="100%" stop-color="${cg.to}"/>
    </linearGradient>
    <!-- Rarity glow gradient -->
    <linearGradient id="rarityGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${r.from}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${r.to}" stop-opacity="0.9"/>
    </linearGradient>
    <!-- Shine overlay -->
    <linearGradient id="shine" x1="0%" y1="0%" x2="60%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <!-- Radial glow for icon -->
    <radialGradient id="iconGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${r.accent}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${r.accent}" stop-opacity="0"/>
    </radialGradient>
    <!-- Drop shadow filter -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${r.from}" flood-opacity="0.5"/>
    </filter>
    <filter id="textShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="400" height="400" fill="url(#bg)" rx="24"/>

  <!-- Subtle pattern dots -->
  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.05"/>
  </pattern>
  <rect width="400" height="400" fill="url(#dots)" rx="24"/>

  <!-- Shine overlay -->
  <rect width="400" height="400" fill="url(#shine)" rx="24"/>

  <!-- Rarity border glow -->
  <rect width="392" height="392" x="4" y="4" fill="none" stroke="url(#rarityGlow)" stroke-width="3" rx="21" opacity="0.8"/>
  <rect width="384" height="384" x="8" y="8" fill="none" stroke="${r.accent}" stroke-width="1" rx="18" opacity="0.3"/>

  <!-- Top bar: Course label -->
  <rect width="400" height="50" y="0" fill="#000000" fill-opacity="0.25" rx="24"/>
  <rect width="400" height="2" y="50" fill="${r.accent}" fill-opacity="0.4"/>

  <!-- Course name (top left) -->
  <text x="20" y="31" font-size="11" font-family="'Arial',sans-serif" fill="#ffffff" fill-opacity="0.8" font-weight="600" letter-spacing="1">${shortCourse.toUpperCase()}</text>

  <!-- Lesson number (top right) -->
  <text x="380" y="31" font-size="11" font-family="'Arial',sans-serif" fill="${r.accent}" font-weight="700" text-anchor="end" letter-spacing="1">#${String(lessonId).padStart(3, '0')}</text>

  <!-- Icon glow circle -->
  <circle cx="200" cy="175" r="75" fill="url(#iconGlow)"/>

  <!-- Icon background circle -->
  <circle cx="200" cy="175" r="60" fill="#000000" fill-opacity="0.3" filter="url(#shadow)"/>
  <circle cx="200" cy="175" r="58" fill="none" stroke="${r.accent}" stroke-width="2" opacity="0.5"/>

  <!-- Course Icon (emoji as text) -->
  <text x="200" y="198" font-size="56" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)">${courseIcon}</text>

  <!-- Lesson Title -->
  <text x="200" y="265" font-size="17" font-family="'Arial',sans-serif" fill="#ffffff" font-weight="700" text-anchor="middle" filter="url(#textShadow)" letter-spacing="0.5">${shortTitle}</text>

  <!-- Rarity badge background -->
  <rect x="110" y="285" width="180" height="32" fill="url(#rarityGlow)" rx="16" filter="url(#shadow)"/>
  <rect x="110" y="285" width="180" height="32" fill="none" stroke="${r.accent}" stroke-width="1" rx="16" opacity="0.6"/>

  <!-- Rarity text -->
  <text x="200" y="306" font-size="13" font-family="'Arial',sans-serif" fill="#ffffff" font-weight="800" text-anchor="middle" letter-spacing="2">${r.badge} ${r.label}</text>

  <!-- Score bar (if score > 0) -->
  ${score > 0 ? `
  <rect x="40" y="335" width="320" height="6" fill="#000000" fill-opacity="0.3" rx="3"/>
  <rect x="40" y="335" width="${Math.round(320 * score / 100)}" height="6" fill="url(#rarityGlow)" rx="3"/>
  <text x="200" y="356" font-size="10" font-family="'Arial',sans-serif" fill="${r.accent}" text-anchor="middle" opacity="0.8">QUIZ SCORE: ${score}%</text>
  ` : ''}

  <!-- Bottom bar -->
  <rect width="400" height="40" y="360" fill="#000000" fill-opacity="0.3" rx="24"/>
  <rect width="400" height="2" y="360" fill="${r.accent}" fill-opacity="0.3"/>

  <!-- Platform name -->
  <text x="200" y="382" font-size="10" font-family="'Arial',sans-serif" fill="#ffffff" fill-opacity="0.5" text-anchor="middle" letter-spacing="2">AI TUTOR · SOLANA DEVNET</text>
</svg>`;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    const { lessonId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const rarity = searchParams.get('rarity') ?? 'common';
    const score = parseInt(searchParams.get('score') ?? '0');

    const id = parseInt(lessonId);
    const info = getLessonInfo(id);

    const lessonTitle = info?.lesson.title ?? `Lesson ${id}`;
    const courseTitle = info?.course.title ?? 'AI Tutor';
    const courseIcon = info?.course.icon ?? '🎓';
    const courseId = info?.course.id ?? 'web-development';

    const svg = generateSVG(id, lessonTitle, courseTitle, courseIcon, courseId, rarity, score);
    const svgBase64 = Buffer.from(svg).toString('base64');
    const imageDataUri = `data:image/svg+xml;base64,${svgBase64}`;

    const metadata = {
        name: `${lessonTitle} #${String(id).padStart(3, '0')}`,
        symbol: 'TUTOR',
        description: `Achievement NFT for completing "${lessonTitle}" from the ${courseTitle} course on AI Tutor — a decentralized Web3 learning platform on Solana.`,
        image: imageDataUri,
        external_url: 'https://ai-tutor.solana.dev',
        attributes: [
            { trait_type: 'Course', value: courseTitle },
            { trait_type: 'Lesson', value: lessonTitle },
            { trait_type: 'Lesson ID', value: String(id) },
            { trait_type: 'Rarity', value: rarity.charAt(0).toUpperCase() + rarity.slice(1) },
            ...(score > 0 ? [{ trait_type: 'Quiz Score', value: `${score}%` }] : []),
            { trait_type: 'Platform', value: 'AI Tutor' },
            { trait_type: 'Chain', value: 'Solana' },
        ],
        properties: {
            files: [{ uri: imageDataUri, type: 'image/svg+xml' }],
            category: 'image',
            creators: [],
        },
    };

    return NextResponse.json(metadata, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
