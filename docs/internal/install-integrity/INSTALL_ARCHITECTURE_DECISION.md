# Install Architecture Decision

**Date:** 2026-02-24
**Problem:** Fresh clone + `install.sh` leaves Layer 5/6 non-functional (missing node_modules)

---

## Three Options Analyzed

### Option A: Monorepo Root package.json with npm Workspaces

**Approach:** Add a root `package.json` with:
```json
{
  "workspaces": ["orchestration/ast-engine", "orchestration/outcome-engine"]
}
```
Then `npm install` at root installs all workspace deps.

**Pros:**
- Single `npm install` at root handles everything
- npm deduplicates shared deps (e.g. if both engines share packages)
- Standard pattern for monorepos
- Hoisted node_modules reduces disk usage

**Cons:**
- Brudi is NOT a JavaScript project — it's a bash-based framework with JS engines as sub-components
- Adding a root package.json suggests Brudi itself is a Node project
- Workspaces require npm 7+ (not guaranteed on all systems)
- Hoisted modules can cause import resolution issues with ESM
- Pollutes root directory with `node_modules/` and `package.json`
- `.gitignore` already ignores `node_modules/` — but root-level modules could confuse users
- Updates/pulls become: `git pull && npm install` (two commands at root)

**Performance:** Fast initial install (deduped). No runtime overhead.
**Maintenance:** Medium — must keep root package.json in sync with sub-packages.
**CI/CD:** Simple — one `npm ci` at root.

---

### Option B: install.sh runs npm ci in Engine Directories

**Approach:** Add to `install.sh` (after clone, before success message):
```bash
# Install engine dependencies
if command -v node &>/dev/null && command -v npm &>/dev/null; then
  (cd "${INSTALL_DIR}/orchestration/ast-engine" && npm ci --silent)
  (cd "${INSTALL_DIR}/orchestration/outcome-engine" && npm ci --silent)
fi
```

**Pros:**
- Minimal change (4-6 lines in install.sh)
- No structural changes to repo
- Uses existing lockfiles (`npm ci` = deterministic)
- Each engine stays self-contained
- No root package.json needed
- Works with any npm version that supports `ci`
- Clear separation: bash framework with JS sub-components
- `git pull` only needs: re-run install.sh (which already handles updates)

**Cons:**
- Two separate npm ci calls (slightly slower than workspace dedup)
- If lockfile drifts from package.json, `npm ci` will fail (this is actually a PRO — catches drift)
- Playwright needs additional `npx playwright install chromium` for browser binaries
- Must handle case where Node.js is not installed (warn, not die)

**Performance:** ~15-30s for ast-engine (6 deps), ~60-120s for outcome-engine (playwright is heavy). One-time cost.
**Maintenance:** Minimal — lockfiles already exist. No new config files.
**CI/CD:** Add npm ci to CI pipeline (straightforward).

---

### Option C: Bundle Engines (Build Step, No Runtime Deps)

**Approach:** Use esbuild/rollup to bundle each engine into a single file with all deps inlined. Commit the bundle. No npm install needed at runtime.

**Pros:**
- Zero-dependency install (just clone + use)
- Fastest startup (no module resolution)
- No Node package manager needed at install time
- Works offline

**Cons:**
- Must maintain a build step (developer must run `npm run build` before committing)
- Playwright CANNOT be bundled — it requires native browser binaries
- Bundled files are large and hard to review in git diffs
- Increases repo size significantly (all deps committed as single blob)
- Two sources of truth: source files vs bundle (easy to get out of sync)
- TypeScript compiler API is ~50MB — bundling it is impractical
- Native bindings (if any) can't be bundled
- Dev workflow becomes: edit → build → commit → push

**Performance:** Fastest at runtime. Slowest for development.
**Maintenance:** HIGH — build step before every commit, bundle drift risk.
**CI/CD:** Complex — must verify bundle matches source.

---

## Decision Matrix

| Criterion | A (Workspaces) | B (install.sh npm ci) | C (Bundle) |
|-----------|:-:|:-:|:-:|
| Minimal change to repo | ⚠️ | ✅ | ❌ |
| No structural changes | ❌ | ✅ | ❌ |
| Self-contained engines | ❌ | ✅ | ✅ |
| Works with Playwright | ✅ | ✅ | ❌ |
| Deterministic | ✅ | ✅ | ⚠️ |
| No build step | ✅ | ✅ | ❌ |
| Maintenance burden | Medium | Low | High |
| Repo stays clean | ❌ | ✅ | ❌ |
| Matches Brudi's nature (bash framework) | ❌ | ✅ | ❌ |

---

## EMPFEHLUNG: Option B — install.sh runs npm ci

**Begründung:**

1. **Minimaler Eingriff:** 6-10 Zeilen in `install.sh`, keine strukturellen Änderungen am Repo.

2. **Deterministic:** `npm ci` nutzt die existierenden `package-lock.json` Dateien — exakt reproduzierbare Installs.

3. **Self-Contained Engines:** Jede Engine bleibt in ihrem Verzeichnis mit eigener `package.json` — keine Workspace-Magie, keine Root-Pollution.

4. **Playwright-kompatibel:** `npm ci` installiert playwright, danach `npx playwright install chromium` für Browser-Binaries.

5. **Brudi bleibt ein Bash-Framework:** Kein Root `package.json` suggeriert fälschlicherweise ein Node-Projekt.

6. **Graceful Degradation:** Wenn Node.js nicht installiert ist, warnt install.sh, aber die Bash-Komponenten (Layer 1-4) funktionieren trotzdem.

---

## Implementierungsplan (nach Freigabe)

### install.sh Änderungen:

1. Nach dem Clone/Update-Block (nach Zeile 137): Node.js prüfen und Engine-Dependencies installieren
2. Fallback: Wenn kein Node → Warnung + Hinweis, welche Layer eingeschränkt sind
3. Playwright Browser-Install als separater optionaler Schritt

### Zusätzlich:

4. `brudi-gate.sh` um Pre-Flight-Check erweitern: Prüft ob `node_modules` existieren, gibt klare Fehlermeldung statt kryptischem ERR_MODULE_NOT_FOUND
5. Lockfiles im `.gitignore` NICHT listen (sind bereits tracked, müssen es bleiben)

### Nicht ändern:

- Keine Root `package.json`
- Keine Workspace-Konfiguration
- Keine Build-Steps
- Keine Engine-Code-Änderungen
