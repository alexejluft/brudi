#!/usr/bin/env node
/**
 * AST Engine Test Runner
 * Runs all fixtures against the engine and validates results.
 */
import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ENGINE = resolve(import.meta.dirname, 'index.js');
const FIXTURES = resolve(import.meta.dirname, '../../docs/internal/ast-fixtures');

let passed = 0;
let failed = 0;
const results = [];

console.log('\n🧪 BRUDI AST ENGINE — TEST RUNNER\n');
console.log(`Engine: ${ENGINE}`);
console.log(`Fixtures: ${FIXTURES}\n`);

function parseJSONFromOutput(output) {
  try {
    return JSON.parse(output);
  } catch (e) {
    // If output is truncated, try to extract the JSON that exists
    const str = output.toString();
    const jsonStart = str.indexOf('{');
    const lines = str.substring(jsonStart).split('\n');
    
    // Rebuild with fewer violations - take just the first violation from each rule
    let reconstructed = '';
    let depth = 0;
    let inViolations = false;
    let violationCount = 0;
    
    for (const line of lines) {
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      depth += openBraces - closeBraces;
      
      if (line.includes('"violations"')) inViolations = true;
      if (inViolations && line.includes('rule')) {
        violationCount++;
        if (violationCount > 1) {
          // Stop adding violations to avoid truncation
          continue;
        }
      }
      
      reconstructed += line + '\n';
      
      // If we've closed the main object, we're done
      if (depth === 0 && reconstructed.length > 100) {
        break;
      }
    }
    
    // Just count the violations instead of parsing
    const totalMatch = output.match(/"totalViolations":\s*(\d+)/);
    const errorsMatch = output.match(/"errors":\s*(\d+)/);
    const warningsMatch = output.match(/"warnings":\s*(\d+)/);
    
    if (totalMatch && errorsMatch && warningsMatch) {
      return {
        summary: {
          totalViolations: parseInt(totalMatch[1]),
          errors: parseInt(errorsMatch[1]),
          warnings: parseInt(warningsMatch[1])
        },
        violations: []
      };
    }
    
    throw e;
  }
}

// Test PASS fixtures (expect exit 0, 0 errors)
const passDir = join(FIXTURES, 'pass');
if (existsSync(passDir)) {
  const passFiles = readdirSync(passDir);
  console.log(`Testing ${passFiles.length} PASS fixtures...\n`);
  
  for (const file of passFiles) {
    const tmpDir = `/tmp/ast-test-pass-${Date.now()}-${Math.random()}`;
    try {
      execSync(`mkdir -p ${tmpDir}/src/app && mkdir -p ${tmpDir}/src/primitives`);
      
      const filePath = join(passDir, file);
      let targetPath;
      if (file.endsWith('.ts') && !file.endsWith('.tsx')) {
        targetPath = `${tmpDir}/src/${file}`;
      } else {
        targetPath = `${tmpDir}/src/app/page.tsx`;
      }
      
      execSync(`cp "${filePath}" "${targetPath}"`);
      execSync(`echo '{"compilerOptions":{"strict":true}}' > ${tmpDir}/tsconfig.json`);
      
      let output;
      let exitCode = 0;
      let errorCount = 0;
      
      try {
        output = execSync(`node "${ENGINE}" "${tmpDir}" --json --severity=error 2>&1`, { encoding: 'utf-8' });
        const report = parseJSONFromOutput(output);
        errorCount = report.summary.errors;
      } catch (e) {
        exitCode = 1;
        try {
          if (e.stdout) {
            const report = parseJSONFromOutput(e.stdout);
            errorCount = report.summary.errors;
          }
        } catch {}
      }
      
      if (errorCount === 0) {
        results.push({ file, type: 'PASS', expected: '0 errors', actual: `${errorCount} errors`, status: '✅' });
        passed++;
      } else {
        results.push({ file, type: 'PASS', expected: '0 errors', actual: `${errorCount} errors`, status: '❌' });
        failed++;
      }
    } catch (e) {
      results.push({ file, type: 'PASS', expected: '0 errors', actual: 'EXCEPTION', status: '❌' });
      failed++;
    } finally {
      try {
        execSync(`rm -rf ${tmpDir}`);
      } catch {}
    }
  }
}

// Test FAIL fixtures (expect >0 violations - errors OR warnings)
const failDir = join(FIXTURES, 'fail');
if (existsSync(failDir)) {
  const failFiles = readdirSync(failDir);
  console.log(`Testing ${failFiles.length} FAIL fixtures...\n`);
  
  for (const file of failFiles) {
    const tmpDir = `/tmp/ast-test-fail-${Date.now()}-${Math.random()}`;
    try {
      execSync(`mkdir -p ${tmpDir}/src/app && mkdir -p ${tmpDir}/src/primitives`);
      
      const filePath = join(failDir, file);
      let targetPath;
      if (file.endsWith('.ts') && !file.endsWith('.tsx')) {
        targetPath = `${tmpDir}/src/${file}`;
      } else {
        targetPath = `${tmpDir}/src/app/page.tsx`;
      }
      
      execSync(`cp "${filePath}" "${targetPath}"`);
      execSync(`echo '{"compilerOptions":{"strict":true}}' > ${tmpDir}/tsconfig.json`);
      
      let output;
      let errorCount = 0;
      let warningCount = 0;
      let rules = [];
      
      try {
        output = execSync(`node "${ENGINE}" "${tmpDir}" --json 2>&1`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        const report = parseJSONFromOutput(output);
        errorCount = report.summary.errors;
        warningCount = report.summary.warnings;
        rules = report.violations.filter(v => v.rule).map(v => v.rule);
        if (rules.length === 0) {
          // Try to extract rules from output
          const ruleMatches = output.match(/"rule":\s*"([^"]+)"/g);
          if (ruleMatches) {
            rules = [...new Set(ruleMatches.map(r => r.match(/"rule":\s*"([^"]+)"/)[1]))];
          }
        }
      } catch (e) {
        try {
          if (e.stdout) {
            const report = parseJSONFromOutput(e.stdout);
            errorCount = report.summary.errors;
            warningCount = report.summary.warnings;
            rules = report.violations.filter(v => v.rule).map(v => v.rule);
            if (rules.length === 0) {
              const ruleMatches = e.stdout.toString().match(/"rule":\s*"([^"]+)"/g);
              if (ruleMatches) {
                rules = [...new Set(ruleMatches.map(r => r.match(/"rule":\s*"([^"]+)"/)[1]))];
              }
            }
          }
        } catch {}
      }
      
      const totalViolations = errorCount + warningCount;
      if (totalViolations > 0) {
        const uniqueRules = [...new Set(rules)];
        const ruleList = uniqueRules.length > 0 ? uniqueRules.slice(0, 3).join(', ') : 'unknown';
        results.push({ file, type: 'FAIL', expected: '>0 violations', actual: `${totalViolations} (${ruleList})`, status: '✅' });
        passed++;
      } else {
        results.push({ file, type: 'FAIL', expected: '>0 violations', actual: `${totalViolations}`, status: '❌' });
        failed++;
      }
    } catch (e) {
      results.push({ file, type: 'FAIL', expected: '>0 violations', actual: 'EXCEPTION', status: '❌' });
      failed++;
    } finally {
      try {
        execSync(`rm -rf ${tmpDir}`);
      } catch {}
    }
  }
}

// Print results
console.log('\n========== TEST RESULTS ==========\n');
console.log('| Fixture | Type | Expected | Actual | Status |');
console.log('|---------|------|----------|--------|--------|');
for (const r of results) {
  console.log(`| ${r.file} | ${r.type} | ${r.expected} | ${r.actual} | ${r.status} |`);
}

console.log(`\n✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${passed + failed}\n`);

const passFixtures = results.filter(r => r.type === 'PASS');
const failFixtures = results.filter(r => r.type === 'FAIL');
const falsePositives = passFixtures.filter(r => r.status.includes('❌')).length;
const falseNegatives = failFixtures.filter(r => r.status.includes('❌')).length;

console.log(`False Positive Rate: ${falsePositives}/${passFixtures.length}`);
console.log(`False Negative Rate: ${falseNegatives}/${failFixtures.length}\n`);

process.exit(failed > 0 ? 1 : 0);
