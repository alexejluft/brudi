/**
 * Framer Motion Snippet Library for Brudi AI
 *
 * PHILOSOPHY: These are TECHNIQUES, not components. Learn HOW to do something, then apply to your project.
 *
 * WHEN TO USE FRAMER MOTION vs GSAP:
 * ─────────────────────────────────────
 * GSAP        → Scroll-driven storytelling, marketing sites, complex timelines, sequences
 * Framer      → SaaS dashboards, web apps, component-based UI, layout transitions, React interop
 *
 * Framer Motion strengths:
 * - Layout animations (smooth height/position changes)
 * - Gesture interactions (whileHover, whileTap, drag)
 * - AnimatePresence (mount/unmount with exit animations)
 * - Automatic handling of "auto" values (crucial for accordions, dropdowns)
 * - Native React component integration (no jQuery overhead)
 *
 * All examples use Framer Motion v11+ with TypeScript.
 * Copy snippets and adapt to your design system (no hardcoded colors/sizes).
 */

import { motion, AnimatePresence, LayoutGroup, useScroll, useTransform, useMotionValue, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode, useState, ReactElement } from 'react';

// ============================================================================
// 1. PAGE TRANSITION (AnimatePresence)
// ============================================================================
/**
 * Wraps routes with AnimatePresence for sequential page transitions.
 * Use with Next.js app router or React Router v6.
 * Mode="wait" ensures exit animation completes before entry starts.
 */

interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
}

export const PageTransitionWrapper = ({ children, routeKey }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Usage in layout/route wrapper:
// <PageTransitionWrapper routeKey={pathname}>{children}</PageTransitionWrapper>

// ============================================================================
// 2. LAYOUT ANIMATION
// ============================================================================
/**
 * Layout prop: animate smooth repositioning when DOM changes.
 * layoutId: shared element transitions (e.g., tab indicator moves to active tab).
 * LayoutGroup: scopes layoutId matching to a container.
 */

interface LayoutAnimationTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const LayoutAnimationTabs = ({ tabs, activeTab, onTabChange }: LayoutAnimationTabsProps) => {
  return (
    <LayoutGroup>
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
            }`}
            layout
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                layoutId="tab-indicator"
              />
            )}
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
};

// layoutId="shared-id" on elements in different components → smooth transition when DOM moves

// ============================================================================
// 3. LIST STAGGER (Orchestration)
// ============================================================================
/**
 * Parent variants control staggerChildren timing.
 * Children animate in sequence without explicit delays.
 * Perfect for lists, grids, sidebars.
 */

interface StaggerListItem {
  id: string;
  label: string;
}

interface StaggerListProps {
  items: StaggerListItem[];
}

export const StaggerList = ({ items }: StaggerListProps) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.li
            key={item.id}
            variants={itemVariants}
            exit={{ opacity: 0, x: -20 }}
            className="p-3 rounded-md bg-slate-50 dark:bg-slate-900"
          >
            {item.label}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

// ============================================================================
// 4. GESTURE INTERACTIONS
// ============================================================================
/**
 * whileHover, whileTap: responsive interactions.
 * whileDrag: handle dragging with constraints.
 * useMotionValue + useTransform: gesture-driven derived values.
 */

interface GestureButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export const GestureButton = ({ children, onClick }: GestureButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium"
    >
      {children}
    </motion.button>
  );
};

interface DraggableCardProps {
  children: ReactNode;
  onDragEnd?: (info: any) => void;
}

export const DraggableCard = ({ children, onDragEnd }: DraggableCardProps) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={onDragEnd}
      className="w-64 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
};

// Advanced: useMotionValue + useTransform for derived animations
export const GestureDrivenValue = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg"
    />
  );
};

// ============================================================================
// 5. SCROLL-LINKED ANIMATION
// ============================================================================
/**
 * useScroll + useTransform: animations bound to scroll progress.
 * scrollYProgress: normalized 0–1 value of viewport scroll.
 * Use for: progress bars, parallax, reveal on scroll.
 */

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
    />
  );
};

interface ScrollRevealProps {
  children: ReactNode;
}

export const ScrollReveal = ({ children }: ScrollRevealProps) => {
  const ref = null; // In real use: useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref as any });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.8, 1]);

  return (
    <motion.div ref={ref as any} style={{ opacity }}>
      {children}
    </motion.div>
  );
};

// Parallax effect: content moves slower than scroll
export const ParallaxSection = ({ children }: { children: ReactNode }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (latest) => latest * 0.5);

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
};

// ============================================================================
// 6. MODAL / OVERLAY TRANSITION
// ============================================================================
/**
 * AnimatePresence + portal for mount/unmount animations.
 * Backdrop fades while content scales/slides in.
 * Exit animations run before unmount (GSAP's weakness).
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Portal in real app: createPortal(content, document.body) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl pointer-events-auto">
              {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
              {children}
              <button
                onClick={onClose}
                className="mt-6 w-full py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 7. ACCORDION / EXPANDABLE
// ============================================================================
/**
 * FRAMER MOTION'S KILLER FEATURE: height: "auto" animation.
 * Smooth expansion from 0 to content height (no hardcoded sizes).
 * AnimatePresence handles mount/unmount.
 */

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
}

export const Accordion = ({ items, multiple = false }: AccordionProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      if (!multiple) newExpanded.clear();
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {items.map((item, index) => (
        <div key={item.id} className={index > 0 ? 'border-t border-slate-200 dark:border-slate-700' : ''}>
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 text-left font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-between"
          >
            {item.title}
            <motion.div
              animate={{ rotate: expandedIds.has(item.id) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-slate-500"
            >
              ▼
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {expandedIds.has(item.id) && (
              <motion.div
                key={`content-${item.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// 8. NOTIFICATION / TOAST
// ============================================================================
/**
 * AnimatePresence + list for toast notifications.
 * Slide in from edge, fade, auto-dismiss with exit animation.
 */

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast = ({ id, message, type = 'info', duration = 4000, onClose }: ToastProps) => {
  const bgClasses = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
    warning: 'bg-amber-500 dark:bg-amber-600',
  };

  // Auto-dismiss effect
  const [isExiting, setIsExiting] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 400, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 400, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`${bgClasses[type]} text-white rounded-lg px-4 py-3 shadow-lg max-w-sm`}
      onAnimationComplete={() => {
        if (!isExiting) {
          const timer = setTimeout(() => {
            setIsExiting(true);
            onClose(id);
          }, duration);
          return () => clearTimeout(timer);
        }
      }}
    >
      {message}
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' | 'warning' }>;
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={onRemove}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// 9. SKELETON / LOADING STATES
// ============================================================================
/**
 * Pulse animation simulates loading state.
 * AnimatePresence mode="wait" transitions skeleton → real content.
 * useReducedMotion respected for a11y.
 */

export const SkeletonPulse = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: shouldReduceMotion ? 1 : [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded"
    />
  );
};

interface SkeletonLoaderProps {
  isLoading: boolean;
  children: ReactNode;
  skeletonLines?: number;
}

export const SkeletonLoader = ({ isLoading, children, skeletonLines = 3 }: SkeletonLoaderProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          {Array.from({ length: skeletonLines }).map((_, i) => (
            <SkeletonPulse key={i} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 10. REDUCED MOTION RESPECT (A11y)
// ============================================================================
/**
 * useReducedMotion(): hook respects user's "prefer-reduced-motion" system setting.
 * Always wrap animations with this for accessibility.
 * Conditional animation values: either animated or instant.
 */

interface A11yAnimatedProps {
  children: ReactNode;
  onClick?: () => void;
}

export const A11yAnimatedButton = ({ children, onClick }: A11yAnimatedProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 10 }}
      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium"
    >
      {children}
    </motion.button>
  );
};

/**
 * PATTERN: Wrap any animation with a11y check.
 */
export const A11yAnimatedContainer = ({ children }: { children: ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0 } : { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// EXPORT TYPE FOR TS STRICT MODE
// ============================================================================

export type { StaggerListItem, LayoutAnimationTabsProps, GestureButtonProps, DraggableCardProps, ScrollRevealProps, ModalProps, AccordionItem, AccordionProps, ToastProps, ToastContainerProps, SkeletonLoaderProps, A11yAnimatedProps };

/**
 * USAGE SUMMARY:
 *
 * 1. Page Transition: Wrap routes with PageTransitionWrapper
 * 2. Layout Animation: Add layout prop to elements, use layoutId for shared transitions
 * 3. Stagger List: Use StaggerList variants for orchestrated children
 * 4. Gestures: Use whileHover/whileTap/drag props directly on motion.* elements
 * 5. Scroll: useScroll + useTransform to bind animations to scroll position
 * 6. Modal: Wrap in AnimatePresence, animate backdrop + content separately
 * 7. Accordion: height: "auto" with AnimatePresence for smooth expand/collapse
 * 8. Toast: AnimatePresence + layout for auto-stacking notification list
 * 9. Skeleton: Pulse animation + mode="wait" for smooth loading → content transition
 * 10. A11y: Always check useReducedMotion() before defining animation values
 *
 * All snippets are framework-agnostic once extracted into your components.
 * Customize colors, sizes, timing to match your design system.
 */
