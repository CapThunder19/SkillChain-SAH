import { NextRequest, NextResponse } from 'next/server';
import { COURSES } from '@/lib/constants';

interface RarityStyle {
  from: string;
  mid: string;
  to: string;
  accent: string;
  label: string;
  badge: string;
}

const RARITY_STYLES: Record<string, RarityStyle> = {
  legendary: { from: '#92400e', mid: '#d97706', to: '#78350f', accent: '#fbbf24', label: 'LEGENDARY', badge: 'LEGENDARY' },
  rare: { from: '#1e3a8a', mid: '#2563eb', to: '#0c4a6e', accent: '#93c5fd', label: 'RARE', badge: 'RARE' },
  common: { from: '#1f2937', mid: '#4b5563', to: '#111827', accent: '#9ca3af', label: 'COMMON', badge: 'COMMON' },
};

const COURSE_PALETTES: Record<string, { bg1: string; bg2: string; accent: string }> = {
  'web-development': { bg1: '#0f172a', bg2: '#1e3a5f', accent: '#38bdf8' },
  'blockchain-basics': { bg1: '#1a0533', bg2: '#3b0764', accent: '#c084fc' },
  'solana-development': { bg1: '#1c1003', bg2: '#431407', accent: '#fb923c' },
  'defi-essentials': { bg1: '#022c22', bg2: '#064e3b', accent: '#34d399' },
  'ai-machine-learning': { bg1: '#1c0505', bg2: '#450a0a', accent: '#f87171' },
  'python-programming': { bg1: '#0a0920', bg2: '#1e1b4b', accent: '#818cf8' },
  'cybersecurity': { bg1: '#0a0a0a', bg2: '#1f2937', accent: '#6ee7b7' },
};

function getLessonInfo(id: number) {
  for (const course of COURSES) {
    const lesson = course.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, course };
  }
  return null;
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const sp = req.nextUrl.searchParams;
    const rarityKey = sp.get('rarity') ?? 'common';
    const score = Math.min(100, Math.max(0, parseInt(sp.get('score') ?? '0')));

    const id = parseInt(lessonId);
    const info = getLessonInfo(id);

    const lessonTitle = escapeXml(truncate(info?.lesson.title ?? `Lesson ${id}`, 26));
    const courseTitle = escapeXml(truncate(info?.course.title ?? 'AI Tutor', 24));
    const courseIcon = info?.course.icon ?? '\u{1F393}'; // graduation cap fallback
    const courseId = info?.course.id ?? 'web-development';

    const r = RARITY_STYLES[rarityKey] ?? RARITY_STYLES.common;
    const cp = COURSE_PALETTES[courseId] ?? COURSE_PALETTES['web-development'];

    const scoreBarW = Math.round(210 * score / 100);
    const idStr = String(id).padStart(3, '0');
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Score row (only when score > 0)
    const scoreRow = score > 0
      ? `<text x="145" y="548" font-size="9" font-family="Arial" fill="${r.accent}" opacity="0.6" letter-spacing="1">QUIZ SCORE</text>
         <text x="355" y="548" font-size="9" font-family="Arial" fill="${r.accent}" text-anchor="end" font-weight="bold">${score}%</text>
         <rect x="145" y="554" width="210" height="5" rx="2" fill="rgba(0,0,0,0.5)"/>
         <rect x="145" y="554" width="${scoreBarW}" height="5" rx="2" fill="${r.mid}"/>`
      : '';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${cp.bg1}"/>
      <stop offset="100%" stop-color="${cp.bg2}"/>
    </linearGradient>
    <linearGradient id="rarityGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${r.from}"/>
      <stop offset="50%" stop-color="${r.mid}"/>
      <stop offset="100%" stop-color="${r.to}"/>
    </linearGradient>
    <linearGradient id="sealGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${r.mid}"/>
      <stop offset="100%" stop-color="${r.from}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <clipPath id="card">
      <rect width="500" height="700" rx="28"/>
    </clipPath>
  </defs>

  <g clip-path="url(#card)">
    <!-- Background -->
    <rect width="500" height="700" fill="url(#bgGrad)"/>

    <!-- Subtle dot grid -->
    <rect width="500" height="700" fill="none" stroke="${cp.accent}" stroke-width="0"
      style="background-image: radial-gradient(circle, ${cp.accent}11 1px, transparent 1px); background-size: 24px 24px;"/>

    <!-- Outer border (certificate style) -->
    <rect x="10" y="10" width="480" height="680" rx="20" fill="none" stroke="${r.accent}" stroke-width="2" opacity="0.55"/>
    <rect x="18" y="18" width="464" height="664" rx="15" fill="none" stroke="${r.accent}" stroke-width="0.8" opacity="0.25"/>

    <!-- Corner ornament: Top-Left -->
    <path d="M28 28 L28 72" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path d="M28 28 L72 28" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <circle cx="28" cy="28" r="5" fill="${r.accent}" opacity="0.8"/>

    <!-- Corner ornament: Top-Right -->
    <path d="M472 28 L472 72" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path d="M472 28 L428 28" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <circle cx="472" cy="28" r="5" fill="${r.accent}" opacity="0.8"/>

    <!-- Corner ornament: Bottom-Left -->
    <path d="M28 672 L28 628" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path d="M28 672 L72 672" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <circle cx="28" cy="672" r="5" fill="${r.accent}" opacity="0.8"/>

    <!-- Corner ornament: Bottom-Right -->
    <path d="M472 672 L472 628" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path d="M472 672 L428 672" stroke="${r.accent}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <circle cx="472" cy="672" r="5" fill="${r.accent}" opacity="0.8"/>

    <!-- Header band -->
    <rect x="10" y="10" width="480" height="85" rx="20" fill="url(#rarityGrad)" opacity="0.85"/>
    <rect x="10" y="75" width="480" height="20" fill="url(#rarityGrad)" opacity="0.85"/>

    <!-- Header text -->
    <text x="250" y="44" font-size="12" font-family="Georgia,serif" fill="${r.accent}" text-anchor="middle" letter-spacing="4" font-weight="bold" filter="url(#softGlow)">AI TUTOR</text>
    <text x="250" y="75" font-size="9" font-family="Arial,sans-serif" fill="rgba(255,255,255,0.65)" text-anchor="middle" letter-spacing="3">CERTIFICATE OF ACHIEVEMENT</text>

    <!-- NFT ID top right -->
    <text x="475" y="35" font-size="10" font-family="monospace" fill="${r.accent}" text-anchor="end" opacity="0.7">#${idStr}</text>

    <!-- Divider under header -->
    <path d="M60 92 Q250 100 440 92" stroke="${r.accent}" stroke-width="0.8" fill="none" opacity="0.4"/>

    <!-- Rarity stars row -->
    <text x="250" y="118" font-size="13" font-family="Arial" fill="${r.accent}" text-anchor="middle" filter="url(#softGlow)" letter-spacing="5">&#9733;&#9733;&#9733;</text>

    <!-- Main icon circle — outer glow -->
    <circle cx="250" cy="255" r="105" fill="${r.accent}" opacity="0.08" filter="url(#glow)"/>
    <!-- Outer ring -->
    <circle cx="250" cy="255" r="96" fill="none" stroke="${r.accent}" stroke-width="1.5" opacity="0.35"/>
    <!-- Dashed ring -->
    <circle cx="250" cy="255" r="88" fill="none" stroke="${r.accent}" stroke-width="1" stroke-dasharray="5 5" opacity="0.25"/>
    <!-- Solid circle fill -->
    <circle cx="250" cy="255" r="80" fill="url(#sealGrad)" opacity="0.92" filter="url(#shadow)"/>
    <!-- Circle border -->
    <circle cx="250" cy="255" r="80" fill="none" stroke="${r.accent}" stroke-width="1.5" opacity="0.5"/>

    <!-- Course icon (emoji rendered as text) -->
    <text x="250" y="278" font-size="64" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)">${courseIcon}</text>

    <!-- Subtitle -->
    <text x="250" y="385" font-size="11" font-family="Georgia,serif" fill="rgba(255,255,255,0.45)" text-anchor="middle" letter-spacing="2" font-style="italic">This certifies completion of</text>

    <!-- Lesson Title (serif, bold) -->
    <text x="250" y="420" font-size="18" font-family="Georgia,serif" fill="#ffffff" text-anchor="middle" font-weight="bold" filter="url(#softGlow)">${lessonTitle}</text>

    <!-- Decorative divider under title -->
    <line x1="90" y1="436" x2="410" y2="436" stroke="${r.accent}" stroke-width="0.5" opacity="0.35"/>
    <line x1="130" y1="441" x2="370" y2="441" stroke="${r.accent}" stroke-width="1" opacity="0.2"/>

    <!-- Course name -->
    <text x="250" y="462" font-size="12" font-family="Arial,sans-serif" fill="${cp.accent}" text-anchor="middle" letter-spacing="1">${courseTitle}</text>

    <!-- Rarity badge pill -->
    <rect x="155" y="480" width="190" height="35" rx="17" fill="url(#rarityGrad)" opacity="0.95" filter="url(#shadow)"/>
    <rect x="155" y="480" width="190" height="35" rx="17" fill="none" stroke="${r.accent}" stroke-width="1.2" opacity="0.65"/>
    <text x="250" y="503" font-size="13" font-family="Arial,sans-serif" fill="#ffffff" font-weight="800" text-anchor="middle" letter-spacing="2">${r.badge}</text>

    <!-- Score (if present) -->
    ${scoreRow}

    <!-- Verified seal -->
    <circle cx="250" cy="612" r="38" fill="url(#sealGrad)" opacity="0.95" filter="url(#shadow)"/>
    <circle cx="250" cy="612" r="38" fill="none" stroke="${r.accent}" stroke-width="2" opacity="0.6"/>
    <circle cx="250" cy="612" r="30" fill="none" stroke="${r.accent}" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>
    <text x="250" y="606" font-size="8" font-family="Georgia,serif" fill="${r.accent}" text-anchor="middle" letter-spacing="1" font-weight="bold">VERIFIED</text>
    <text x="250" y="620" font-size="10" font-family="Arial" fill="#ffffff" text-anchor="middle" font-weight="bold">&#10003;</text>
    <text x="250" y="633" font-size="6" font-family="Arial" fill="${r.accent}" text-anchor="middle" letter-spacing="1">SOLANA</text>

    <!-- Date and ID footer -->
    <text x="250" y="668" font-size="8" font-family="Arial,sans-serif" fill="rgba(255,255,255,0.28)" text-anchor="middle" letter-spacing="1">${dateStr.toUpperCase()}</text>

    <!-- Bottom accent bar -->
    <rect x="10" y="678" width="480" height="12" rx="4" fill="url(#rarityGrad)" opacity="0.45"/>
  </g>
</svg>`;

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('NFT image generation error:', err);
    // Return a simple fallback SVG
    const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700">
      <rect width="500" height="700" rx="28" fill="#1a1a2e"/>
      <text x="250" y="350" font-size="48" text-anchor="middle" fill="#9ca3af">🎓</text>
      <text x="250" y="410" font-size="14" font-family="Arial" fill="#6b7280" text-anchor="middle">NFT Achievement</text>
    </svg>`;
    return new NextResponse(fallback, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }
}
