/**
 * KNOWLEDGE.TS — Zentrale Wissensdatenbank
 * 
 * Dies ist die SINGLE SOURCE OF TRUTH für alles was ich weiß.
 * Jedes Learning, jeder Skill, jedes Pattern kommt hierher.
 * 
 * Prinzip: "Was nicht durchsuchbar ist, existiert nicht."
 */

export type SkillLevel = 'novice' | 'learning' | 'practicing' | 'confident' | 'expert';

export type Category = 
  | 'css' 
  | 'react' 
  | 'typescript' 
  | 'performance' 
  | 'testing' 
  | 'architecture' 
  | 'animation'
  | 'accessibility'
  | 'tooling';

export interface Learning {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: Category;
  summary: string;
  keyInsights: string[];
  page?: string; // Link zur Deep Dive Seite
  appliedIn?: string[]; // Wo angewendet
  level: SkillLevel;
  lastReviewed?: string;
  reallyUnderstood: boolean; // Ehrliche Selbsteinschätzung
}

export interface Skill {
  id: string;
  name: string;
  category: Category;
  level: SkillLevel;
  learnings: string[]; // IDs der zugehörigen Learnings
  lastPracticed?: string;
}

// ============================================
// LEARNINGS — Chronologisch
// ============================================

export const learnings: Learning[] = [
  // 2026-02-20
  {
    id: 'container-queries',
    title: 'CSS Container Queries',
    date: '2026-02-20',
    category: 'css',
    summary: 'Container Queries erlauben responsive Design basierend auf Container-Größe statt Viewport.',
    keyInsights: [
      'Media Queries = Viewport, Container Queries = Container',
      'Goldene Regel: "You cannot change what you measure"',
      '20 Jahre unmöglich wegen Endlosschleifen → Containment API löst das',
      'inline-size ist der Sweet Spot (90% der Fälle)',
      'Container Units: cqw, cqi relativ zum Container',
    ],
    page: '/container-queries',
    level: 'confident',
    reallyUnderstood: true,
  },
  {
    id: 'lenis-smooth-scroll',
    title: 'Lenis Smooth Scroll',
    date: '2026-02-20',
    category: 'animation',
    summary: 'Smooth Scrolling mit LERP (Linear Interpolation) als Kernkonzept.',
    keyInsights: [
      'LERP ist das Kernkonzept — nicht Easing',
      'lerp: 0.1 = 10% pro Frame → smooth',
      'duration/easing werden von lerp ÜBERSCHRIEBEN',
      'GSAP Integration: lenis.on("scroll", ScrollTrigger.update)',
      'data-lenis-prevent für nested scrolling',
    ],
    page: '/lenis',
    appliedIn: ['/duo'],
    level: 'confident',
    reallyUnderstood: true,
  },
  {
    id: 'testing-vitest',
    title: 'Testing mit Vitest + Testing Library',
    date: '2026-02-20',
    category: 'testing',
    summary: 'User-zentriertes Testing: Teste wie ein User, nicht wie Code funktioniert.',
    keyInsights: [
      'Query Priority: getByRole > getByLabelText > getByText > getByTestId',
      'getBy = muss existieren, findBy = wartet async, queryBy = kann fehlen',
      'userEvent für echte User-Interaktionen',
      'vi.fn() für Mocks, vi.spyOn() für API',
    ],
    page: '/testing',
    level: 'confident',
    reallyUnderstood: true,
  },
  {
    id: 'gsap-scrolltrigger',
    title: 'GSAP ScrollTrigger',
    date: '2026-02-20',
    category: 'animation',
    summary: 'Scroll-basierte Animationen mit GSAP ScrollTrigger Plugin.',
    keyInsights: [
      'trigger/start/end = wann Animation startet',
      'scrub = Animation an Scrollbar binden',
      'pin = Element fixieren während Scroll',
      'stagger = zeitversetzt animieren',
      'Nur transform/opacity = GPU-beschleunigt',
    ],
    page: '/duo',
    appliedIn: ['/duo'],
    level: 'confident',
    reallyUnderstood: true,
  },
  {
    id: 'react-server-components',
    title: 'React Server Components',
    date: '2026-02-20',
    category: 'react',
    summary: 'RSC sind keine Optimierung — sie sind eine architektonische Grenze.',
    keyInsights: [
      'RSC ≠ SSR — SSR macht HTML, RSC macht serialisierten React-Baum',
      'Wire Format: M = Module References, J = Element Trees',
      'Keine Hooks weil Server Components stateless/effectless BY DESIGN',
      'Props an Server→Client Grenze müssen serialisierbar sein',
      'Composition Pattern: Server Components als children',
    ],
    page: '/rsc',
    level: 'confident',
    reallyUnderstood: true,
  },
  {
    id: 'css-grid-deep',
    title: 'CSS Grid Deep Dive',
    date: '2026-02-20',
    category: 'css',
    summary: 'Grid ist ein 2D Layout System mit Lines und Tracks.',
    keyInsights: [
      'fr = Fraction of FREE space (nach fixen Größen)',
      'Lines sind nummeriert ab 1, Items zwischen Lines',
      'justify = horizontal, align = vertikal',
      'place-items: center ist der einfachste Centering-Trick',
    ],
    page: '/grid',
    level: 'confident',
    reallyUnderstood: true,
  },
  {
    id: 'typescript-utility-types',
    title: 'TypeScript Utility Types',
    date: '2026-02-20',
    category: 'typescript',
    summary: 'Built-in Types wie Partial, Pick, Omit, Record für bessere Type-Safety.',
    keyInsights: [
      'Partial<T> macht alle Properties optional',
      'Pick/Omit für Type-Slicing',
      'Record<K,T> für Dictionaries',
      'Discriminated Unions für State Management',
      'Utility Types haben zero runtime cost',
    ],
    page: '/typescript',
    level: 'practicing',
    reallyUnderstood: true,
  },
  {
    id: 'scroll-driven-animations',
    title: 'CSS Scroll-Driven Animations',
    date: '2026-02-20',
    category: 'css',
    summary: 'Native CSS Animationen basierend auf Scroll-Position — ohne JavaScript.',
    keyInsights: [
      'animation-timeline: scroll() bindet an Scrollbar',
      'view() für Element-basierte Timelines',
      'Kein JS = bessere Performance',
      'Teil von Interop 2026 — kommt in alle Browser',
    ],
    page: '/demos',
    level: 'learning',
    reallyUnderstood: false, // Noch nicht tief genug
  },
  {
    id: 'micro-interactions',
    title: 'Micro-Interactions',
    date: '2026-02-20',
    category: 'animation',
    summary: 'Kleine Animationen die Feedback geben und UX verbessern.',
    keyInsights: [
      'Timing: 100-200ms für Micro, 200-400ms für Standard',
      'Easing: ease-out für Enter, ease-in für Exit',
      'Immer Feedback bei User Actions',
      'Weniger ist mehr — subtil > offensichtlich',
    ],
    page: '/micro',
    level: 'practicing',
    reallyUnderstood: true,
  },
  {
    id: 'a11y-basics',
    title: 'Accessibility Basics',
    date: '2026-02-20',
    category: 'accessibility',
    summary: 'WCAG Guidelines und ARIA für barrierefreie Websites.',
    keyInsights: [
      'Semantic HTML first, ARIA second',
      'Color contrast minimum 4.5:1',
      'Focus states sind Pflicht',
      'prefers-reduced-motion respektieren',
    ],
    page: '/a11y',
    level: 'learning',
    reallyUnderstood: false, // Muss tiefer
  },
];

// ============================================
// SKILLS — Aggregierte Fähigkeiten
// ============================================

export const skills: Skill[] = [
  {
    id: 'css-layout',
    name: 'CSS Layout',
    category: 'css',
    level: 'confident',
    learnings: ['css-grid-deep', 'container-queries'],
    lastPracticed: '2026-02-20',
  },
  {
    id: 'css-animation',
    name: 'CSS Animation',
    category: 'animation',
    level: 'practicing',
    learnings: ['scroll-driven-animations', 'micro-interactions', 'gsap-scrolltrigger', 'lenis-smooth-scroll'],
    lastPracticed: '2026-02-20',
  },
  {
    id: 'react-advanced',
    name: 'React Advanced',
    category: 'react',
    level: 'practicing',
    learnings: ['react-server-components'],
    lastPracticed: '2026-02-20',
  },
  {
    id: 'typescript-types',
    name: 'TypeScript Types',
    category: 'typescript',
    level: 'practicing',
    learnings: ['typescript-utility-types'],
  },
  {
    id: 'testing',
    name: 'Testing',
    category: 'testing',
    level: 'confident',
    learnings: ['testing-vitest'],
    lastPracticed: '2026-02-20',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getLearningsByDate(date: string): Learning[] {
  return learnings.filter(l => l.date === date);
}

export function getLearningsByCategory(category: Category): Learning[] {
  return learnings.filter(l => l.category === category);
}

export function getRecentLearnings(count: number = 5): Learning[] {
  return [...learnings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
}

export function getLearningsNeedingReview(): Learning[] {
  return learnings.filter(l => !l.reallyUnderstood);
}

export function getSkillLevel(skillId: string): SkillLevel | undefined {
  return skills.find(s => s.id === skillId)?.level;
}

export function getTotalLearnings(): number {
  return learnings.length;
}

export function getCategoryStats(): Record<Category, number> {
  const stats = {} as Record<Category, number>;
  for (const l of learnings) {
    stats[l.category] = (stats[l.category] || 0) + 1;
  }
  return stats;
}

// Format für Anzeige
export const skillLevelLabels: Record<SkillLevel, string> = {
  novice: '🌱 Anfänger',
  learning: '📚 Lernend',
  practicing: '🔧 Übend',
  confident: '💪 Sicher',
  expert: '🏆 Experte',
};

export const categoryLabels: Record<Category, string> = {
  css: 'CSS',
  react: 'React',
  typescript: 'TypeScript',
  performance: 'Performance',
  testing: 'Testing',
  architecture: 'Architektur',
  animation: 'Animation',
  accessibility: 'Accessibility',
  tooling: 'Tooling',
};
