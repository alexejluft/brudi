/**
 * BRUDI OUTCOME QUALITY ENGINE — Layer 6
 * Usage: node index.js <html-file-or-project-dir> [--json]
 * 
 * If given a .html file: renders and analyzes directly.
 * If given a directory: looks for out/index.html, .next/server/app/page.html, or public/index.html
 *
 * Exit codes:
 *   0 = PASS (score >= 70)
 *   1 = BLOCK (score < 70)
 */
import { extractDOMMetrics } from './dom-extractor.js';
import { analyzeTypography } from './typography-analyzer.js';
import { analyzeLayout } from './layout-analyzer.js';
import { analyzeAnimationDensity } from './animation-density-analyzer.js';
import { analyzeCognitiveLoad } from './cognitive-load-analyzer.js';
import { analyzeCTA } from './cta-analyzer.js';
import { computeScore } from './scoring-engine.js';
import { existsSync } from 'fs';
import { resolve, extname } from 'path';

async function runEngine(inputPath, options = {}) {
  const startTime = performance.now();
  const absPath = resolve(inputPath);
  
  // Resolve HTML file
  let htmlFile;
  if (extname(absPath) === '.html') {
    htmlFile = absPath;
  } else {
    // Try common output locations
    const candidates = [
      `${absPath}/out/index.html`,
      `${absPath}/dist/index.html`,
      `${absPath}/public/index.html`,
      `${absPath}/index.html`,
    ];
    htmlFile = candidates.find(f => existsSync(f));
  }
  
  if (!htmlFile || !existsSync(htmlFile)) {
    console.error(`❌ No HTML file found at ${absPath}`);
    console.error('   Provide a .html file directly or a directory with out/index.html');
    process.exit(2);
  }
  
  // Extract DOM metrics
  const metrics = await extractDOMMetrics(htmlFile);

  // Use animation count from DOM detection, or fall back to options/parameter
  const animationCount = options.animationCount || metrics.animationCount || 0;

  // Run all analyzers
  const allViolations = [];
  allViolations.push(...analyzeTypography(metrics));
  allViolations.push(...analyzeLayout(metrics));
  allViolations.push(...analyzeAnimationDensity(metrics, animationCount));

  const cogResult = analyzeCognitiveLoad(metrics, animationCount);
  allViolations.push(...cogResult.violations);
  
  allViolations.push(...analyzeCTA(metrics));
  
  // Compute score
  const { score, level } = computeScore(allViolations);
  
  const endTime = performance.now();
  
  const report = {
    version: '1.0.0',
    htmlFile,
    timestamp: new Date().toISOString(),
    analyzeTimeMs: Math.round(endTime - startTime),
    metrics: {
      headings: metrics.headings.length,
      sections: metrics.sections.length,
      textElements: metrics.textElements.length,
      grids: metrics.grids.length,
      buttons: metrics.buttons.length,
      fontSizes: metrics.fontSizes,
      totalElements: metrics.totalElements,
      cognitiveLoadScore: cogResult.cognitiveLoadScore,
    },
    score,
    level,
    violations: allViolations,
    summary: {
      errors: allViolations.filter(v => v.severity === 'error').length,
      warnings: allViolations.filter(v => v.severity === 'warning').length,
      blocked: level === 'BLOCK',
    },
  };
  
  return report;
}

// CLI
const args = process.argv.slice(2);
const inputPath = args.find(a => !a.startsWith('--'));
const jsonOutput = args.includes('--json');
const animCountArg = args.find(a => a.startsWith('--animations='));
const animationCount = animCountArg ? parseInt(animCountArg.split('=')[1]) : 0;

if (!inputPath) {
  console.error('Usage: node index.js <html-file|project-dir> [--json] [--animations=N]');
  process.exit(2);
}

const report = await runEngine(inputPath, { animationCount });

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`\n🎨 BRUDI OUTCOME ENGINE — Layer 6`);
  console.log(`   HTML: ${report.htmlFile}`);
  console.log(`   Elements: ${report.metrics.totalElements}`);
  console.log(`   Sections: ${report.metrics.sections}`);
  console.log(`   Time: ${report.analyzeTimeMs}ms`);
  console.log(`   Cognitive Load: ${report.metrics.cognitiveLoadScore.toFixed(1)}`);
  console.log(`   Score: ${report.score}/100 — ${report.level}\n`);
  
  if (report.summary.errors > 0) {
    console.log(`⛔ ${report.summary.errors} ERROR(s)`);
    for (const v of report.violations.filter(v => v.severity === 'error')) {
      console.log(`   ❌ [${v.rule}] ${v.message}`);
    }
    console.log('');
  }
  if (report.summary.warnings > 0) {
    console.log(`⚠️  ${report.summary.warnings} WARNING(s)`);
    for (const v of report.violations.filter(v => v.severity === 'warning')) {
      console.log(`   ⚠️  [${v.rule}] ${v.message}`);
    }
    console.log('');
  }
  
  if (report.summary.blocked) {
    console.log(`⛔ OUTCOME GATE: BLOCKED (Score ${report.score}/100 < 70)\n`);
  } else {
    console.log(`✅ OUTCOME GATE: ${report.level} (Score ${report.score}/100)\n`);
  }
}

process.exit(report.summary.blocked ? 1 : 0);
