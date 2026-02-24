/**
 * Cognitive Load Analyzer — computes a cognitive load score
 * Formula: (Sections * 1.5) + (Animations * 1.2) + (FontVariance * 1.0) + (GridVariance * 1.0) + (ColorVariance * 1.2)
 */
export function analyzeCognitiveLoad(metrics, animationCount) {
  const violations = [];

  const sectionCount = metrics.sections.length;
  const fontVariance = metrics.fontSizes.length;
  const gridVariance = metrics.grids.length;
  const colorVariance = metrics.colors.length;

  // Use detected animation count from DOM if available, fall back to parameter
  const actualAnimationCount = metrics.animationCount !== undefined ? metrics.animationCount : animationCount;

  const score = (sectionCount * 1.5) + (actualAnimationCount * 1.2) + (fontVariance * 1.0) + (gridVariance * 1.0) + (colorVariance * 1.2);

  // Threshold: score > 30 = warning, > 50 = error
  if (score > 50) {
    violations.push({ rule: 'COGNITIVE_OVERLOAD', severity: 'error', message: `Cognitive load score ${score.toFixed(1)} (max 50). Sections=${sectionCount}, Animations=${actualAnimationCount}, FontSizes=${fontVariance}, Grids=${gridVariance}, Colors=${colorVariance}`, score_impact: -15 });
  } else if (score > 30) {
    violations.push({ rule: 'COGNITIVE_LOAD_HIGH', severity: 'warning', message: `Cognitive load score ${score.toFixed(1)} (recommended <30). Consider reducing complexity.`, score_impact: -5 });
  }

  return { violations, cognitiveLoadScore: score };
}
