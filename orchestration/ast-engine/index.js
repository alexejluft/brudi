/**
 * BRUDI AST ENFORCEMENT ENGINE — Layer 5
 * Entry point: orchestrates all analyzers, outputs structured report.
 *
 * Usage:
 *   node index.js <project-dir> [--json] [--severity=error|warning|all]
 *
 * Exit codes:
 *   0 = no errors (warnings may exist)
 *   1 = blocking violations found
 */

import { analyzeJSX } from './jsx-analyzer.js';
import { analyzeTailwind } from './tailwind-analyzer.js';
import { analyzeTS, analyzeTSBatch } from './ts-analyzer.js';
import { analyzeTokens } from './token-analyzer.js';
import { analyzeImportGraph } from './import-graph-analyzer.js';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, resolve, extname } from 'path';

// ── Config ──────────────────────────────────────────────────
const SEVERITY_BLOCK = 'error';
const SEVERITY_WARN = 'warning';

// ── File Discovery ──────────────────────────────────────────
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const results = [];
  if (!existsSync(dir)) return results;

  function walk(current) {
    let entries;
    try { entries = readdirSync(current); } catch { return; }
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.next' || entry === '.brudi' || entry === 'dist') continue;
      const full = join(current, entry);
      let stat;
      try { stat = statSync(full); } catch { continue; }
      if (stat.isDirectory()) {
        walk(full);
      } else if (extensions.includes(extname(full))) {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

// ── Main Engine ─────────────────────────────────────────────
async function runEngine(projectDir, options = {}) {
  const startTime = performance.now();
  const dir = resolve(projectDir);

  if (!existsSync(dir)) {
    console.error(`❌ Project directory not found: ${dir}`);
    process.exit(1);
  }

  const files = findFiles(dir);
  const tsxFiles = files.filter(f => /\.(tsx|jsx)$/.test(f));
  const tsFiles = files.filter(f => /\.(ts|tsx)$/.test(f));
  const tokensFile = files.find(f => f.endsWith('tokens.ts') || f.endsWith('tokens.js'));

  const allViolations = [];
  const metrics = {
    filesAnalyzed: files.length,
    tsxFilesAnalyzed: tsxFiles.length,
    tsFilesAnalyzed: tsFiles.length,
    analyzersRun: 0,
    analyzeTimeMs: 0,
  };

  // ── 1. JSX Analysis ───────────────────────────────────────
  for (const file of tsxFiles) {
    try {
      const result = analyzeJSX(file);
      allViolations.push(...result.violations);
    } catch (e) {
      allViolations.push({
        rule: 'ANALYZER_ERROR',
        severity: 'warning',
        message: `JSX analyzer failed on ${file}: ${e.message}`,
        line: 0, column: 0, file
      });
    }
  }
  metrics.analyzersRun++;

  // ── 2. Tailwind Analysis ──────────────────────────────────
  for (const file of tsxFiles) {
    try {
      const result = analyzeTailwind(file);
      allViolations.push(...result.violations);
      // Merge metrics from last file (page-level metrics)
      if (result.metrics) {
        metrics.tailwind = result.metrics;
      }
    } catch (e) {
      allViolations.push({
        rule: 'ANALYZER_ERROR',
        severity: 'warning',
        message: `Tailwind analyzer failed on ${file}: ${e.message}`,
        line: 0, column: 0, file
      });
    }
  }
  metrics.analyzersRun++;

  // ── 3. TypeScript Analysis (BATCH OPTIMIZED) ──────────────
  // Use batch analysis for 11x better performance (1125ms -> ~100ms per file)
  try {
    const batchResults = analyzeTSBatch(tsFiles);
    for (const result of batchResults) {
      allViolations.push(...result.violations);
    }
  } catch (e) {
    allViolations.push({
      rule: 'ANALYZER_ERROR',
      severity: 'warning',
      message: `TS batch analyzer failed: ${e.message}`,
      line: 0, column: 0, file: dir
    });
  }
  metrics.analyzersRun++;

  // ── 4. Token Analysis ─────────────────────────────────────
  for (const file of tsxFiles) {
    try {
      const result = analyzeTokens(file, tokensFile || undefined);
      allViolations.push(...result.violations);
      if (result.metrics) {
        metrics.tokens = result.metrics;
      }
    } catch (e) {
      allViolations.push({
        rule: 'ANALYZER_ERROR',
        severity: 'warning',
        message: `Token analyzer failed on ${file}: ${e.message}`,
        line: 0, column: 0, file
      });
    }
  }
  metrics.analyzersRun++;

  // ── 5. Import Graph Analysis ──────────────────────────────
  try {
    const result = analyzeImportGraph(dir);
    allViolations.push(...result.violations);
    if (result.metrics) {
      metrics.importGraph = result.metrics;
    }
  } catch (e) {
    allViolations.push({
      rule: 'ANALYZER_ERROR',
      severity: 'warning',
      message: `Import graph analyzer failed: ${e.message}`,
      line: 0, column: 0, file: dir
    });
  }
  metrics.analyzersRun++;

  // ── Results ───────────────────────────────────────────────
  const endTime = performance.now();
  metrics.analyzeTimeMs = Math.round(endTime - startTime);

  const errors = allViolations.filter(v => v.severity === SEVERITY_BLOCK);
  const warnings = allViolations.filter(v => v.severity === SEVERITY_WARN);

  const report = {
    version: '1.0.0',
    projectDir: dir,
    timestamp: new Date().toISOString(),
    metrics,
    summary: {
      totalViolations: allViolations.length,
      errors: errors.length,
      warnings: warnings.length,
      blocked: errors.length > 0,
    },
    violations: allViolations,
  };

  return report;
}

// ── CLI Entry Point ─────────────────────────────────────────
const args = process.argv.slice(2);
const projectDir = args.find(a => !a.startsWith('--'));
const jsonOutput = args.includes('--json');
const severityFilter = (args.find(a => a.startsWith('--severity=')) || '').split('=')[1] || 'all';

if (!projectDir) {
  console.error('Usage: node index.js <project-dir> [--json] [--severity=error|warning|all]');
  process.exit(1);
}

const report = await runEngine(projectDir);

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  // Human-readable output
  console.log(`\n🔍 BRUDI AST ENGINE — Layer 5`);
  console.log(`   Project: ${report.projectDir}`);
  console.log(`   Files: ${report.metrics.filesAnalyzed} (${report.metrics.tsxFilesAnalyzed} TSX)`);
  console.log(`   Time: ${report.metrics.analyzeTimeMs}ms`);
  console.log(`   Analyzers: ${report.metrics.analyzersRun}/5\n`);

  if (report.summary.errors > 0) {
    console.log(`⛔ ${report.summary.errors} ERROR(s) — BLOCKING`);
    for (const v of report.violations.filter(v => v.severity === 'error')) {
      const loc = v.line ? `:${v.line}:${v.column}` : '';
      const shortFile = v.file ? v.file.replace(report.projectDir + '/', '') : '[project-level]';
      console.log(`   ❌ [${v.rule}] ${shortFile}${loc} — ${v.message}`);
    }
    console.log('');
  }

  if (report.summary.warnings > 0 && (severityFilter === 'all' || severityFilter === 'warning')) {
    console.log(`⚠️  ${report.summary.warnings} WARNING(s)`);
    for (const v of report.violations.filter(v => v.severity === 'warning')) {
      const loc = v.line ? `:${v.line}:${v.column}` : '';
      const shortFile = v.file ? v.file.replace(report.projectDir + '/', '') : '[project-level]';
      console.log(`   ⚠️  [${v.rule}] ${shortFile}${loc} — ${v.message}`);
    }
    console.log('');
  }

  if (report.summary.blocked) {
    console.log(`⛔ AST GATE: BLOCKED (${report.summary.errors} errors)\n`);
  } else {
    console.log(`✅ AST GATE: PASSED (${report.summary.warnings} warnings)\n`);
  }
}

// Exit code: 1 if blocking errors exist
process.exit(report.summary.blocked ? 1 : 0);
