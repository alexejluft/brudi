/**
 * CTA Prominence Analyzer — checks call-to-action visibility
 */
export function analyzeCTA(metrics) {
  const violations = [];
  const { buttons } = metrics;
  const viewportHeight = 900;
  
  // Rule 1: At least 1 CTA above fold
  const aboveFold = buttons.filter(b => b.rect.top < viewportHeight);
  if (buttons.length > 0 && aboveFold.length === 0) {
    violations.push({ rule: 'NO_CTA_ABOVE_FOLD', severity: 'warning', message: `No CTA button found above the fold (${viewportHeight}px)`, score_impact: -5 });
  }
  
  // Rule 2: CTA text size >= 16px (text-lg equivalent)
  for (const btn of buttons) {
    if (btn.fontSize < 16) {
      violations.push({ rule: 'CTA_TOO_SMALL', severity: 'warning', message: `CTA "${btn.text}" has fontSize ${btn.fontSize}px (min 16px)`, score_impact: -3 });
      break;
    }
  }
  
  // Rule 3: CTA padding >= 20px total (clickable area)
  for (const btn of buttons) {
    if (btn.padding < 20) {
      violations.push({ rule: 'CTA_LOW_PADDING', severity: 'warning', message: `CTA "${btn.text}" has ${btn.padding}px total padding (min 20px)`, score_impact: -3 });
      break;
    }
  }
  
  return violations;
}
