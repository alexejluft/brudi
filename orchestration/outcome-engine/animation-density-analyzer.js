/**
 * Animation Density Analyzer — checks animation appropriateness
 * Note: This analyzes the static HTML. For GSAP detection, see AST engine.
 * This module checks CSS animations/transitions visible in computed styles.
 */
export function analyzeAnimationDensity(metrics, animationCount) {
  const violations = [];
  const { sections, totalElements, animationCount: detectedAnimationCount } = metrics;

  // Use detected animation count from DOM if available, fall back to parameter
  const actualAnimationCount = detectedAnimationCount !== undefined ? detectedAnimationCount : animationCount;

  // Rule 1: Max 12 animations per page
  if (actualAnimationCount > 12) {
    violations.push({ rule: 'ANIMATION_OVERLOAD', severity: 'error', message: `${actualAnimationCount} animations on page (max 12)`, score_impact: -10 });
  }

  // Rule 2: Max 3 animations per section (estimated)
  if (sections.length > 0 && actualAnimationCount > 0) {
    const avgPerSection = actualAnimationCount / sections.length;
    if (avgPerSection > 3) {
      violations.push({ rule: 'SECTION_ANIMATION_DENSITY', severity: 'warning', message: `Average ${avgPerSection.toFixed(1)} animations per section (max 3)`, score_impact: -5 });
    }
  }

  // Rule 3: Animation ratio (animated elements / total elements)
  if (totalElements > 0) {
    const ratio = actualAnimationCount / totalElements;
    if (ratio > 0.3) {
      violations.push({ rule: 'ANIMATION_RATIO', severity: 'warning', message: `${(ratio * 100).toFixed(0)}% of elements animated (max 30%)`, score_impact: -5 });
    }
  }

  return violations;
}
