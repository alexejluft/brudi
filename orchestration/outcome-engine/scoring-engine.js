/**
 * Scoring Engine — computes 0-100 quality score from violations
 */
export function computeScore(allViolations) {
  let score = 100;
  
  for (const v of allViolations) {
    score += (v.score_impact || 0);
  }
  
  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));
  
  let level;
  if (score < 70) level = 'BLOCK';
  else if (score <= 85) level = 'WARNING';
  else level = 'PASS';
  
  return { score, level };
}
