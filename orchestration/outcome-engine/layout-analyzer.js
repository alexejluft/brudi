/**
 * Layout Analyzer — section density, grid balance, whitespace
 */
export function analyzeLayout(metrics) {
  const violations = [];
  const { sections, grids } = metrics;
  const viewportHeight = 900; // Standard viewport
  
  // Rule 1: Max 8 sections per 3x viewport height
  const maxScrollHeight = viewportHeight * 3;
  const sectionsInView = sections.filter(s => s.rect.top < maxScrollHeight);
  if (sectionsInView.length > 8) {
    violations.push({ rule: 'SECTION_OVERLOAD', severity: 'error', message: `${sectionsInView.length} sections in first 3 viewports (max 8)`, score_impact: -15 });
  }
  
  // Rule 2: Min spacing between sections >= 48px
  for (let i = 0; i < sections.length - 1; i++) {
    const gap = sections[i + 1].rect.top - sections[i].rect.bottom;
    if (gap < 48 && gap >= 0) {
      violations.push({ rule: 'SECTION_SPACING', severity: 'warning', message: `Section gap ${Math.round(gap)}px < 48px minimum between "${sections[i].id || 'unnamed'}" and "${sections[i+1].id || 'unnamed'}"`, score_impact: -5 });
      break;
    }
  }
  
  // Rule 3: Grid columns max 4 for cards
  for (const grid of grids) {
    if (grid.columns > 4) {
      violations.push({ rule: 'GRID_TOO_DENSE', severity: 'error', message: `Grid with ${grid.columns} columns (max 4 for readability)`, score_impact: -10 });
    }
  }
  
  // Rule 4: Grid child height balance (max 2x difference)
  for (const grid of grids) {
    if (grid.childRects.length >= 2) {
      const heights = grid.childRects.map(r => r.height).filter(h => h > 0);
      if (heights.length >= 2) {
        const maxH = Math.max(...heights);
        const minH = Math.min(...heights);
        if (minH > 0 && maxH / minH > 2) {
          violations.push({ rule: 'GRID_IMBALANCE', severity: 'warning', message: `Grid children height ratio ${(maxH/minH).toFixed(1)}x (max 2x)`, score_impact: -5 });
        }
      }
    }
  }
  
  // Rule 5: No two hero sections back-to-back
  for (let i = 0; i < sections.length - 1; i++) {
    if (sections[i].height > viewportHeight * 0.8 && sections[i+1].height > viewportHeight * 0.8) {
      violations.push({ rule: 'DOUBLE_HERO', severity: 'warning', message: `Two hero-sized sections back-to-back`, score_impact: -5 });
      break;
    }
  }
  
  return violations;
}
