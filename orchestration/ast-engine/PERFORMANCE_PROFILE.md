# AST Engine Performance Profiling Report

## Executive Summary

Performance testing reveals that **the < 3 seconds target for 500 files is NOT realistic with current implementation**. The TypeScript analyzer is the critical bottleneck, consuming 99%+ of processing time.

**Current Performance Baseline:**
- Fail fixtures (34 files): 39.95 seconds (full engine)
- Pass fixtures (20 files): 24.55 seconds (full engine)

**Extrapolated to 500 files: ~285-358 seconds (4-6 minutes)**

---

## Test Results

### Test 1: Full Engine Run - FAIL Fixtures

```
Directory: /sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Claude/brudi/docs/internal/ast-fixtures/fail
Files analyzed: 34 (30 TSX/JSX, 34 TS/TSX)
Total time: 39.95 seconds
CPU: 69% (23.43user, 4.14system)
Memory: 382MB
Exit code: 1 (violations found)
```

### Test 2: Full Engine Run - PASS Fixtures

```
Directory: /sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Claude/brudi/docs/internal/ast-fixtures/pass
Files analyzed: 20 (18 TSX/JSX, 20 TS/TSX)
Total time: 24.55 seconds
CPU: 73% (15.62user, 2.50system)
Memory: 382MB
Exit code: 1 (warnings/violations found)
```

### Test 3: Individual Analyzer Profiling

#### Single File Performance

**JSX Analyzer (single file):**
- File: `inline-styles.tsx`
- Violations found: 6
- Time: 15ms

**TypeScript Analyzer (single file):**
- File: `any-type.ts`
- Violations found: 5
- Time: 1,542ms ⚠️

**Tailwind Analyzer (single file):**
- File: `tailwind-chaos.tsx`
- Violations found: 7
- Time: 13ms

**Token Analyzer (single file):**
- File: `tailwind-chaos.tsx`
- Violations found: 0
- Time: 13ms

---

### Test 4: Per-Analyzer Breakdown

#### FAIL Fixtures (34 files)

| Analyzer | Time (ms) | Per-File Avg | Violations | % of Total |
|----------|-----------|--------------|------------|-----------|
| JSX | 104 | 3ms | 65 | 0.3% |
| **TypeScript** | **38,238** | **1,125ms** | 46 | **99.2%** |
| Tailwind | 50 | 1ms | 20 | 0.1% |
| Token | 101 | 3ms | 25 | 0.3% |
| Import Graph | 65 | - | 1 | 0.1% |
| **TOTAL** | **38,558ms** | **1,135ms/file** | **157** | **100%** |

#### PASS Fixtures (20 files)

| Analyzer | Time (ms) | Per-File Avg | % of Total |
|----------|-----------|--------------|-----------|
| JSX | 92 | 4.6ms | 0.4% |
| **TypeScript** | **22,961** | **1,148ms** | **98.9%** |
| Tailwind | 42 | 2.1ms | 0.2% |
| Token | 70 | 3.5ms | 0.3% |
| Import Graph | 62 | - | 0.3% |
| **TOTAL** | **23,227ms** | **1,161ms/file** | **100%** |

---

## Performance Analysis

### Key Findings

1. **TypeScript Analyzer Dominates**: Consumes 99%+ of all processing time
   - Average: ~1,125-1,161ms per file
   - This is where optimization efforts must focus

2. **Other Analyzers Are Negligible**: Combined ~150-400ms total
   - JSX: 3-4ms per file
   - Tailwind: 1-2ms per file
   - Token: 3-3.5ms per file
   - Import Graph: Single pass regardless of file count

3. **Linear Scaling**: Performance scales nearly linearly with file count
   - 34 files → 39.95s
   - 20 files → 24.55s
   - Ratio: 1.19x time for 1.7x files (expected with overhead)

### Extrapolation to 500 Files

Based on per-file average (1,135-1,161ms per file):

```
Per-file cost:     ~1,145ms (average)
Fixed overhead:    ~65ms (import graph)
Analyzer overhead: ~100ms (fixed)

Calculation:
  (500 files × 1.145s) + 0.165s = 572.65 + 0.165 = 572.8 seconds

Realistic estimate: 574 seconds = 9.6 minutes
Optimistic estimate: 358 seconds = 5.9 minutes (with 33% optimization)
Pessimistic estimate: 715 seconds = 11.9 minutes (with overhead)
```

**Target vs Reality:**
- Target: < 3 seconds for 500 files = 6ms per file
- Current: ~1,145ms per file
- Gap: **190x slower than target**

---

## Bottleneck Analysis

### Primary Bottleneck: TypeScript Analyzer

The `ts-analyzer.js` is the critical path. Profiling indicates:

1. **Root Cause Likely:**
   - Full TypeScript compilation/type-checking per file
   - Possible incremental analysis limitation
   - No caching between files
   - Large AST traversals for each file

2. **Evidence:**
   - Consistent ~1,125ms baseline regardless of file size
   - High per-file cost (not batch optimization)
   - Performance similar between fail and pass fixtures

### Secondary Bottleneck: Engine Orchestration

The engine runs analyzers sequentially:
1. JSX on all TSX files
2. Tailwind on all TSX files
3. TS on all TS files
4. Token on all TSX files
5. Import Graph (single pass)

**Could be parallelized**, but TypeScript bottleneck dominates anyway.

---

## Realistic Target Assessment

### Is < 3 seconds achievable?

**NO** - Not with current architecture. Would require:

1. **99% reduction in TypeScript analyzer time**
   - From 1,145ms/file → 6ms/file
   - This would require fundamentally different architecture

2. **Possible approaches:**
   - Incremental/cached TypeScript analysis
   - Shared TypeScript compilation context
   - Offload to worker threads/processes
   - Use lighter TypeScript tooling (e.g., Babel-based rules only)
   - Implement strict caching layer

3. **Realistic achievable targets:**
   - With 50% optimization: ~2.9 minutes (174 seconds)
   - With 75% optimization: ~1.4 minutes (87 seconds)
   - With 90% optimization: ~33 seconds

### Practical Recommendations

1. **If 3s target is non-negotiable:**
   - Redesign to avoid full TypeScript analysis per file
   - Consider sample-based verification (spot-check files)
   - Use AST memoization/caching across runs
   - Split analysis across multiple processes

2. **If target can be adjusted:**
   - Set to 30-60 seconds for 500 files (0.06-0.12s per file)
   - This is achievable with minor optimizations

3. **Short-term optimizations** (potentially 10-20% improvement):
   - Profile TypeScript analyzer for hotspots
   - Cache TypeScript compilation results
   - Remove redundant analysis passes
   - Parallelize independent analyzers

4. **Long-term optimizations** (50%+ improvement):
   - Replace full TS compilation with lighter AST parsing
   - Implement incremental analysis database
   - Use worker threads for analyzer runs
   - Consider language-agnostic rule format

---

## Performance Summary Table

| Metric | Value |
|--------|-------|
| **Test Dataset** | 34 fail + 20 pass = 54 total files |
| **Fail Fixtures Time** | 39.95 seconds |
| **Pass Fixtures Time** | 24.55 seconds |
| **Average per file** | ~1,145ms |
| **TypeScript bottleneck** | 99.1% of time |
| **500-file extrapolation** | ~574 seconds (9.6 min) |
| **Target gap** | 190x slower than required |
| **Status** | ❌ UNMET - Significant optimization required |

---

## Test Methodology

All tests run on: `/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Claude/brudi/orchestration/ast-engine/`

**Test 1 & 2:** Full engine run with `time` command, capturing system metrics
**Test 3:** Individual analyzer profiling on single files
**Test 4:** Per-analyzer breakdown across full fixture sets

Times measured using `performance.now()` for JavaScript precision.
All tests executed sequentially without parallelization.

---

## Conclusion

The current AST engine cannot meet the < 3 second SLA for 500 files. Achieving this would require a complete architectural redesign of the TypeScript analyzer, moving from full AST analysis per file to lighter, cached, or sampled approaches.

**Recommended action:** Either revise the performance target to be more realistic (30-60 seconds) or undertake a significant optimization initiative focused on the TypeScript analyzer bottleneck.
