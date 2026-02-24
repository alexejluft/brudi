/**
 * Typography Analyzer — validates heading hierarchy and text sizing
 */
export function analyzeTypography(metrics) {
  const violations = [];
  const { headings, textElements } = metrics;
  
  // Rule 1: Heading hierarchy must be descending
  // h1 fontSize > h2 fontSize > h3 fontSize
  const headingsByTag = {};
  for (const h of headings) {
    if (!headingsByTag[h.tag]) headingsByTag[h.tag] = [];
    headingsByTag[h.tag].push(h);
  }
  
  const avgSize = (tag) => {
    const items = headingsByTag[tag] || [];
    if (items.length === 0) return null;
    return items.reduce((sum, h) => sum + h.fontSize, 0) / items.length;
  };
  
  const h1Size = avgSize('h1');
  const h2Size = avgSize('h2');
  const h3Size = avgSize('h3');
  const h4Size = avgSize('h4');
  
  if (h1Size && h2Size && h2Size >= h1Size) {
    violations.push({ rule: 'HEADING_HIERARCHY', severity: 'error', message: `h2 (${h2Size}px) >= h1 (${h1Size}px) — hierarchy inverted`, score_impact: -15 });
  }
  if (h2Size && h3Size && h3Size >= h2Size) {
    violations.push({ rule: 'HEADING_HIERARCHY', severity: 'error', message: `h3 (${h3Size}px) >= h2 (${h2Size}px) — hierarchy inverted`, score_impact: -15 });
  }
  if (h3Size && h4Size && h4Size >= h3Size) {
    violations.push({ rule: 'HEADING_HIERARCHY', severity: 'warning', message: `h4 (${h4Size}px) >= h3 (${h3Size}px) — hierarchy inverted`, score_impact: -5 });
  }
  
  // Rule 2: Heading ratio >= 1.15 between levels
  if (h1Size && h2Size) {
    const ratio = h1Size / h2Size;
    if (ratio < 1.15) {
      violations.push({ rule: 'HEADING_RATIO', severity: 'warning', message: `h1/h2 ratio ${ratio.toFixed(2)} < 1.15 — headings too similar`, score_impact: -5 });
    }
  }
  
  // Rule 3: Body text should not be excessively large (> 24px = ~text-xl)
  for (const t of textElements) {
    if (t.fontSize > 24 && ['p', 'span', 'li', 'label'].includes(t.tag)) {
      violations.push({ rule: 'BODY_TEXT_TOO_LARGE', severity: 'error', message: `${t.tag} has fontSize ${t.fontSize}px (max 24px for body text)`, score_impact: -10 });
      break; // One error is enough
    }
  }
  
  // Rule 4: Max 6 different font sizes
  const uniqueFontSizes = metrics.fontSizes.length;
  if (uniqueFontSizes > 6) {
    violations.push({ rule: 'FONT_VARIANCE', severity: 'warning', message: `${uniqueFontSizes} different font sizes (max 6 recommended)`, score_impact: -5 });
  }
  
  // Rule 5: Line height readability (1.2-1.8 for body text)
  for (const t of textElements) {
    if (['p', 'li', 'span'].includes(t.tag) && t.fontSize >= 14) {
      const ratio = t.lineHeight / t.fontSize;
      if (ratio < 1.2 || ratio > 2.0) {
        violations.push({ rule: 'LINE_HEIGHT', severity: 'warning', message: `${t.tag} line-height ratio ${ratio.toFixed(2)} outside 1.2-2.0 range`, score_impact: -3 });
        break;
      }
    }
  }
  
  return violations;
}
