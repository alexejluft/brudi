# Install Bootstrap Gap Report

**Date:** 2026-02-24
**Scope:** Fresh clone → install.sh → are engines runnable?

---

## 1. Current Install Flow

```
git clone https://github.com/alexejluft/brudi.git ~/Brudi
# install.sh internally does:
#   1. Clone repo (or pull if exists)
#   2. chmod +x use.sh, brudi-gate.sh, pre-commit
#   3. Print success message
#   4. Exit
```

**What install.sh does NOT do:** Any `npm install` or dependency resolution. Lines 125-156 show the full install flow — no npm/node_modules/dependency references exist anywhere.

---

## 2. Engine Dependencies

### Layer 4 — Constraint Gate (`brudi-gate-constraints.sh`)
- **Language:** Pure Bash
- **External deps:** None
- **Status:** ✅ RUNS AFTER FRESH CLONE

### Layer 5 — AST Engine (`orchestration/ast-engine/`)
- **Language:** Node.js (ESM)
- **package.json dependencies:**
  - `@babel/parser` ^7.24.0
  - `@babel/traverse` ^7.24.0
  - `@babel/types` ^7.24.0
  - `typescript` ^5.4.0
  - `ts-node` ^10.9.0
  - `glob` ^10.3.0
- **package-lock.json:** ✅ EXISTS (deterministic install possible)
- **node_modules:** ❌ MISSING after fresh clone
- **Status:** ❌ CRASHES after fresh clone — `node index.js` fails with `ERR_MODULE_NOT_FOUND`

### Layer 6 — Outcome Engine (`orchestration/outcome-engine/`)
- **Language:** Node.js (ESM)
- **package.json dependencies:**
  - `playwright` ^1.58.0
- **package-lock.json:** ✅ EXISTS (deterministic install possible)
- **node_modules:** ❌ MISSING after fresh clone
- **Status:** ❌ CRASHES after fresh clone — `node index.js` fails with `ERR_MODULE_NOT_FOUND`
- **Extra:** Playwright also requires browser binaries (`npx playwright install chromium`)

---

## 3. Gate Wiring (What Calls What)

`brudi-gate.sh` post-slice flow:

| Line | Action | Failure Mode |
|------|--------|-------------|
| 322-323 | Check `ast-engine/index.js` exists | `die` if missing |
| 325-326 | Check `node` available | `die` if missing |
| 330 | `node "$ast_engine" . --json --severity=error` | Crashes: missing node_modules |
| 331-334 | Check exit code | `die` if non-zero |
| 345-346 | Check `outcome-engine/index.js` exists | `die` if missing |
| 358 | `node "$outcome_engine" "$html_file"` | Crashes: missing node_modules |

**Both engines are HARD GATES** — gate crashes → `die` → entire post-slice blocked.

---

## 4. Gap Summary

| Component | Has Code | Has package.json | Has lockfile | Has node_modules | Runs After Clone |
|-----------|----------|------------------|-------------|-----------------|-----------------|
| Layer 4 (Constraints) | ✅ | N/A (bash) | N/A | N/A | ✅ |
| Layer 5 (AST Engine) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Layer 6 (Outcome Engine) | ✅ | ✅ | ✅ | ❌ | ❌ |
| install.sh runs npm | — | — | — | — | ❌ |
| use.sh runs npm | — | — | — | — | ❌ |

**Root Cause:** `install.sh` (lines 125-156) only clones and sets permissions. Zero dependency installation logic exists anywhere in the repo.

---

## 5. Impact

After `git clone` + `./install.sh`:
1. Agent starts project with `use.sh` → ✅ works
2. Agent works on slice → ✅ works
3. Agent calls `brudi-gate.sh post-slice 1` → ❌ CRASHES at line 330
4. Error: `ERR_MODULE_NOT_FOUND: @babel/parser` (or similar)
5. Gate `die`s → Agent cannot complete any slice

**Severity: CRITICAL — Brudi is non-functional after fresh install.**
