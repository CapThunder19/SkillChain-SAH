/**
 * Generates an NFT certificate SVG fully client-side as a data URI.
 * No network request needed — embeds directly in <img src="...">
 */

export interface NFTSvgOptions {
    lessonId: number;
    lessonTitle: string;
    courseTitle: string;
    courseIcon: string;
    courseId: string;
    rarity: 'common' | 'rare' | 'legendary';
    quizScore?: number;
}

interface RarityStyle {
    from: string; mid: string; to: string;
    accent: string; label: string;
}

const RARITY: Record<string, RarityStyle> = {
    legendary: { from: '#92400e', mid: '#d97706', to: '#78350f', accent: '#fbbf24', label: 'LEGENDARY' },
    rare: { from: '#1e3a8a', mid: '#2563eb', to: '#0c4a6e', accent: '#93c5fd', label: 'RARE' },
    common: { from: '#1f2937', mid: '#4b5563', to: '#111827', accent: '#9ca3af', label: 'COMMON' },
};

const COURSE_PALETTE: Record<string, { bg1: string; bg2: string; accent: string }> = {
    'web-development': { bg1: '#0f172a', bg2: '#1e3a5f', accent: '#38bdf8' },
    'blockchain-basics': { bg1: '#1a0533', bg2: '#3b0764', accent: '#c084fc' },
    'solana-development': { bg1: '#1c1003', bg2: '#431407', accent: '#fb923c' },
    'defi-essentials': { bg1: '#022c22', bg2: '#064e3b', accent: '#34d399' },
    'ai-machine-learning': { bg1: '#1c0505', bg2: '#450a0a', accent: '#f87171' },
    'python-programming': { bg1: '#0a0920', bg2: '#1e1b4b', accent: '#818cf8' },
    'cybersecurity': { bg1: '#0a0a0a', bg2: '#1f2937', accent: '#6ee7b7' },
};

function esc(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function trunc(s: string, n: number) {
    return s.length > n ? s.slice(0, n) + '...' : s;
}

export function generateNFTSvg(opts: NFTSvgOptions): string {
    const { lessonId, lessonTitle, courseTitle, courseIcon, courseId, rarity, quizScore = 0 } = opts;
    const r = RARITY[rarity] ?? RARITY.common;
    const cp = COURSE_PALETTE[courseId] ?? COURSE_PALETTE['web-development'];

    const title = esc(trunc(lessonTitle, 26));
    const course = esc(trunc(courseTitle, 24));
    const idStr = String(lessonId).padStart(3, '0');
    const score = Math.min(100, Math.max(0, quizScore));
    const barW = Math.round(210 * score / 100);

    const scoreSection = score > 0
        ? `<text x="145" y="548" font-size="9" font-family="Arial" fill="${r.accent}" opacity="0.7" letter-spacing="1">QUIZ SCORE</text>
       <text x="355" y="548" font-size="9" font-family="Arial" fill="${r.accent}" text-anchor="end" font-weight="bold">${score}%</text>
       <rect x="145" y="554" width="210" height="5" rx="2" fill="#00000066"/>
       <rect x="145" y="554" width="${barW}" height="5" rx="2" fill="${r.mid}"/>`
        : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${cp.bg1}"/>
      <stop offset="100%" stop-color="${cp.bg2}"/>
    </linearGradient>
    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${r.from}"/>
      <stop offset="50%" stop-color="${r.mid}"/>
      <stop offset="100%" stop-color="${r.to}"/>
    </linearGradient>
    <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${r.mid}"/>
      <stop offset="100%" stop-color="${r.from}"/>
    </linearGradient>
    <clipPath id="c"><rect width="500" height="700" rx="28"/></clipPath>
  </defs>

  <g clip-path="url(#c)">
    <!-- bg -->
    <rect width="500" height="700" fill="url(#bg)"/>

    <!-- outer border -->
    <rect x="10" y="10" width="480" height="680" rx="20" fill="none" stroke="${r.accent}" stroke-width="1.5" opacity="0.5"/>
    <rect x="18" y="18" width="464" height="664" rx="15" fill="none" stroke="${r.accent}" stroke-width="0.5" opacity="0.2"/>

    <!-- corner TL -->
    <path d="M28 28 L28 70 M28 28 L70 28" stroke="${r.accent}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <circle cx="28" cy="28" r="4" fill="${r.accent}" opacity="0.8"/>
    <!-- corner TR -->
    <path d="M472 28 L472 70 M472 28 L430 28" stroke="${r.accent}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <circle cx="472" cy="28" r="4" fill="${r.accent}" opacity="0.8"/>
    <!-- corner BL -->
    <path d="M28 672 L28 630 M28 672 L70 672" stroke="${r.accent}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <circle cx="28" cy="672" r="4" fill="${r.accent}" opacity="0.8"/>
    <!-- corner BR -->
    <path d="M472 672 L472 630 M472 672 L430 672" stroke="${r.accent}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <circle cx="472" cy="672" r="4" fill="${r.accent}" opacity="0.8"/>

    <!-- header band -->
    <rect x="10" y="10" width="480" height="90" rx="20" fill="url(#rg)" opacity="0.85"/>
    <rect x="10" y="80" width="480" height="20" fill="url(#rg)" opacity="0.85"/>

    <!-- header text -->
    <text x="250" y="44" font-size="12" font-family="Georgia,serif" fill="${r.accent}" text-anchor="middle" letter-spacing="4" font-weight="bold">AI TUTOR</text>
    <text x="250" y="76" font-size="8.5" font-family="Arial,sans-serif" fill="rgba(255,255,255,0.65)" text-anchor="middle" letter-spacing="3">CERTIFICATE OF ACHIEVEMENT</text>
    <text x="475" y="35" font-size="9" font-family="monospace" fill="${r.accent}" text-anchor="end" opacity="0.6">#${idStr}</text>

    <!-- divider -->
    <path d="M70 96 Q250 104 430 96" stroke="${r.accent}" stroke-width="0.7" fill="none" opacity="0.4"/>

    <!-- stars row -->
    <text x="250" y="120" font-size="14" font-family="Arial" fill="${r.accent}" text-anchor="middle" letter-spacing="6">&#9733;&#9733;&#9733;</text>

    <!-- emblem glow -->
    <circle cx="250" cy="255" r="100" fill="${r.accent}" opacity="0.05"/>
    <!-- rings -->
    <circle cx="250" cy="255" r="95" fill="none" stroke="${r.accent}" stroke-width="1" opacity="0.25"/>
    <circle cx="250" cy="255" r="87" fill="none" stroke="${r.accent}" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.2"/>
    <!-- main circle -->
    <circle cx="250" cy="255" r="78" fill="url(#sg)" opacity="0.9"/>
    <circle cx="250" cy="255" r="78" fill="none" stroke="${r.accent}" stroke-width="1.5" opacity="0.45"/>

    <!-- course icon -->
    <text x="250" y="278" font-size="62" text-anchor="middle" dominant-baseline="middle">${courseIcon}</text>

    <!-- labels -->
    <text x="250" y="383" font-size="10.5" font-family="Georgia,serif" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2" font-style="italic">This certifies completion of</text>
    <text x="250" y="419" font-size="17" font-family="Georgia,serif" fill="#ffffff" text-anchor="middle" font-weight="bold">${title}</text>

    <!-- divider under title -->
    <line x1="90" y1="434" x2="410" y2="434" stroke="${r.accent}" stroke-width="0.4" opacity="0.3"/>

    <!-- course name -->
    <text x="250" y="460" font-size="11" font-family="Arial,sans-serif" fill="${cp.accent}" text-anchor="middle" letter-spacing="1">${course}</text>

    <!-- rarity badge -->
    <rect x="155" y="476" width="190" height="34" rx="17" fill="url(#rg)" opacity="0.92"/>
    <rect x="155" y="476" width="190" height="34" rx="17" fill="none" stroke="${r.accent}" stroke-width="1" opacity="0.6"/>
    <text x="250" y="499" font-size="12.5" font-family="Arial,sans-serif" fill="#ffffff" font-weight="800" text-anchor="middle" letter-spacing="2">${r.label}</text>

    <!-- score bar -->
    ${scoreSection}

    <!-- seal -->
    <circle cx="250" cy="610" r="36" fill="url(#sg)" opacity="0.92"/>
    <circle cx="250" cy="610" r="36" fill="none" stroke="${r.accent}" stroke-width="1.5" opacity="0.55"/>
    <circle cx="250" cy="610" r="28" fill="none" stroke="${r.accent}" stroke-width="0.8" stroke-dasharray="3 3" opacity="0.35"/>
    <text x="250" y="604" font-size="7.5" font-family="Georgia,serif" fill="${r.accent}" text-anchor="middle" letter-spacing="1" font-weight="bold">VERIFIED</text>
    <text x="250" y="619" font-size="10" font-family="Arial" fill="#ffffff" text-anchor="middle" font-weight="bold">&#10003;</text>
    <text x="250" y="631" font-size="5.5" font-family="Arial" fill="${r.accent}" text-anchor="middle" letter-spacing="1">SOLANA</text>

    <!-- footer -->
    <text x="250" y="666" font-size="7.5" font-family="Arial,sans-serif" fill="rgba(255,255,255,0.25)" text-anchor="middle" letter-spacing="1">AI TUTOR &#183; SOLANA DEVNET</text>
    <rect x="10" y="678" width="480" height="12" rx="4" fill="url(#rg)" opacity="0.4"/>
  </g>
</svg>`;
}

/** Returns a data URI (base64 encoded) for use in <img src="..."> */
export function generateNFTDataUri(opts: NFTSvgOptions): string {
    const svg = generateNFTSvg(opts);
    // Use base64 encoding for maximum compatibility
    const b64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${b64}`;
}
