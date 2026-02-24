# Brudi Mode Enforcement Audit — Evidence Index

**Cross-Reference Guide for All Findings**

---

## Critical Evidence by Exploit Type

### EXPLOIT #1: Direct state.json Modification

**Files Involved:**
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/CLAUDE.md` **Lines 291-306**
  - Defines mode control rules (PROMPT ONLY, no tooling)
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/state.init.json` **Lines 1-19**
  - Default state file (plain JSON, unprotected)
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/state.schema.json` **Lines 22-25**
  - Schema defines mode enum but no change verification

**Why It Works:**
- state.json is a plain JSON file with no locking mechanism
- No hash validation of state contents
- No cryptographic signature
- Agent can edit with standard `jq` tool
- Changes undetectable if state.json not committed to git

**Remediation Location:**
- CLAUDE.md should add: "Modifying state.json directly is FORBIDDEN"
- state.schema.json should add: "mode_changed_at" and "mode_changed_by" fields
- brudi-gate.sh should add: State hash validation on entry

---

### EXPLOIT #2: Skip brudi-gate.sh Entirely

**Files Involved:**
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/brudi-gate.sh` **Lines 329-376**
  - cmd_mode_check() function exists but is OPTIONAL to call
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/CLAUDE.md` **Line 302**
  - States "Ein Moduswechsel erfolgt NUR durch explizite User-Anweisung"
  - But no mechanism to VERIFY this (prompt only)

**Why It Works:**
- brudi-gate.sh is a standalone bash script
- No mandatory invocation in git hooks or build process
- Agent can choose not to call it
- No audit trail of which agents called gate vs. skipped it

**Remediation Location:**
- Add pre-commit hook check that verifies gate.last_check timestamp is recent
- Add build step that calls pre-slice gate before allowing code execution
- Add agent telemetry logging (agent must explicitly call gate)

---

### EXPLOIT #3: Pre-Commit Hook Bypass (--no-verify)

**Files Involved:**
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/pre-commit` **Lines 1-139**
  - Pre-commit hook implementation (complete but optional)
- Source: Git documentation (external)
  - `git commit --no-verify` flag allows bypassing pre-commit hooks

**Why It Works:**
- Git's `--no-verify` flag is standard feature
- Brudi cannot prevent this client-side bypass
- No server-side validation to catch bypasses

**Remediation Location:**
- Add server-side push hook (requires git server setup, e.g., GitHub Actions)
- Document in CLAUDE.md: "Using --no-verify is FORBIDDEN and subject to audit"
- Add CI/CD check that validates all commits passed pre-commit checks

**Proof:**
```bash
git commit --no-verify -m "bypass"  # ✅ Works despite hook
```

---

### EXPLOIT #4: Delete state.json

**Files Involved:**
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/pre-commit` **Lines 26-29**
  ```bash
  if [ ! -f "$STATE_FILE" ]; then
    # Not a Brudi project, skip checks
    exit 0
  fi
  ```
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/use.sh` **Line 51**
  - Creates `.brudi/` directory but no protection mechanism

**Why It Works:**
- Pre-commit hook assumes state.json exists
- If file is deleted, hook thinks it's not a Brudi project
- All validation is skipped (exit 0)
- Agent can commit any code without restriction

**Remediation Location:**
- Change pre-commit line 26-29 to REQUIRE state.json:
  ```bash
  if [ ! -f "$STATE_FILE" ]; then
    echo "ERROR: state.json missing — re-run: sh ~/Brudi/use.sh"
    exit 1  # Block, don't skip
  fi
  ```
- Add .gitignore protection (or remove state.json from .gitignore to track it)

---

### EXPLOIT #5: Scope Violations in FIX Mode

**Files Involved:**
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/CLAUDE.md` **Line 299**
  ```
  | **FIX** | Spezifische Issues beheben | NUR die vom User genannten Issues fixen |
  ```
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/brudi-gate.sh` **Lines 360-365**
  ```bash
  FIX)
    case "$action" in
      fix_issue|write_code|screenshot) pass "Action allowed in FIX mode." ;;
      create_file) die "Creating new files not allowed in FIX mode." ;;
      *) warn "Action in FIX mode — proceed with caution" ; exit 0 ;;
    esac
    ;;
  ```

**Why It Can't Be Enforced:**
- Scope validation would require analyzing AST of code changes
- Determining if a change is "fixing issue #42" vs. "adding new feature" is semantic
- Tooling cannot distinguish without human code review

**Why It Matters:**
- Agent in FIX mode for "fix typo" can also:
  - Add dark mode feature (undetected)
  - Refactor bundle optimization (undetected)
  - Implement new API endpoint (undetected)

**Remediation Location:**
- Code review policy (external to Brudi)
- Explicit issue linking in commit messages
- CI/CD validation of commit message format

---

### EXPLOIT #6: jq Dependency Missing

**Files Involved:**
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/pre-commit` **Lines 31-34**
  ```bash
  if ! command -v jq &>/dev/null; then
    echo -e "${YELLOW}⚠️  jq not installed — skipping Brudi pre-commit checks${RESET}"
    exit 0  # ← ALL CHECKS SKIPPED
  fi
  ```
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/brudi-gate.sh` **Lines 66-71**
  ```bash
  require_jq() {
    if ! command -v jq &>/dev/null; then
      echo "ERROR: jq is required..." >&2
      exit 2
    fi
  }
  ```

**Why It Works:**
- jq is external dependency (not bundled with Brudi)
- Pre-commit hook silently skips if jq missing
- Agent can run in environment without jq, disabling all enforcement

**Current Behavior:** ⚠️ SOFT FAIL (warns but allows commits)

**Remediation Location:**
- Change pre-commit line 31-34 to HARD FAIL:
  ```bash
  if ! command -v jq &>/dev/null; then
    echo "ERROR: jq required for Brudi enforcement"
    exit 1  # Block commit
  fi
  ```

---

### EXPLOIT #7: File Type Regex in pre-commit

**Files Involved:**
- Source: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/pre-commit` **Line 57**
  ```bash
  staged_code=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(tsx?|jsx?|css|html|json)$' | grep -v 'state\.json' | grep -v 'PROJECT_STATUS' || true)
  ```

**What It Catches:**
- ✅ `.ts` — TypeScript
- ✅ `.tsx` — TypeScript React
- ✅ `.js` — JavaScript
- ✅ `.jsx` — JavaScript React
- ✅ `.css` — CSS
- ✅ `.html` — HTML
- ✅ `.json` — JSON

**What It MISSES:**
- ❌ `.md` — Markdown (can embed code blocks)
- ❌ `.txt` — Text files
- ❌ `.yml`/`.yaml` — YAML config
- ❌ `.py` — Python scripts
- ❌ `.rb` — Ruby scripts
- ❌ `.go` — Go code

**Example Bypass:**
```bash
# AUDIT mode, write code in markdown:
cat > ANALYSIS.md << 'EOF'
# My Technical Analysis

```javascript
const malicious = () => {
  console.log("injected via markdown");
};
```
EOF

git add ANALYSIS.md
git commit -m "Analysis"  # ✅ Succeeds — .md not in regex
```

**Remediation Location:**
- Expand regex in pre-commit line 57 to catch all code files
- Consider: `.{js,ts,py,rb,go,yaml,yml,xml,php,java,go,c,cpp,h,sh,bash}`
- Or: use language-aware parsing instead of regex

---

## Mode Definition Consistency Check

### Source 1: CLAUDE.md (Lines 291-306)
```
| Modus | Beschreibung | Erlaubte Aktionen | Verbotene Aktionen |
|-------|-------------|-------------------|-------------------|
| **BUILD** | Projekt aufbauen gemäß TASK.md | Code schreiben, Screenshots, Quality Gates | Fremden Code auditieren, Bugs fixen... |
| **AUDIT** | Bestehendes Projekt prüfen | Lesen, Screenshots, Analyse-Dokument schreiben | Code ändern, Dateien erstellen/löschen |
| **FIX** | Spezifische Issues beheben | NUR die vom User genannten Issues fixen | Neue Features, Refactoring, eigenmächtige... |
| **RESEARCH** | Analyse ohne Codeänderungen | Lesen, Recherchieren, Analyse schreiben | Code ändern, Dateien erstellen... |
```

### Source 2: state.schema.json (Lines 22-25)
```json
"mode": {
  "type": "string",
  "enum": ["BUILD", "AUDIT", "FIX", "RESEARCH"],
  "description": "Current working mode. Only the user may change this."
}
```

### Source 3: brudi-gate.sh (Lines 109-112)
```bash
case "$mode" in
  BUILD|AUDIT|FIX|RESEARCH) ;;
  *) die "Invalid mode: $mode (must be BUILD|AUDIT|FIX|RESEARCH)" ;;
esac
```

**Consistency:** ✅ ALL THREE MATCH EXACTLY

---

## Pre-Commit Hook Enforcement Points

### Check #1: state.json Validity (Lines 40-47)
```bash
if ! jq empty "$STATE_FILE" 2>/dev/null; then
  errors+=("state.json is not valid JSON")
fi

version=$(jq -r '.version // "missing"' "$STATE_FILE")
if [ "$version" != "1.0" ]; then
  errors+=("state.json has unknown version: $version")
fi

mode=$(jq -r '.mode // "missing"' "$STATE_FILE")
case "$mode" in
  BUILD|AUDIT|FIX|RESEARCH) ;;
  *) errors+=("state.json has invalid mode: $mode") ;;
esac
```

**Strength:** ✅ GOOD — Validates JSON structure and mode enum

### Check #2: AUDIT Mode Code Restriction (Lines 59-62)
```bash
if [ "$mode" = "AUDIT" ] && [ -n "$staged_code" ]; then
  errors+=("Mode is AUDIT but code files are staged for commit. AUDIT mode forbids code changes.")
  errors+=("Staged code files: $(echo "$staged_code" | head -5 | tr '\n' ', ')")
fi
```

**Strength:** ✅ GOOD — Catches code commits in AUDIT mode

### Check #3: RESEARCH Mode Code Restriction (Lines 64-67)
```bash
if [ "$mode" = "RESEARCH" ] && [ -n "$staged_code" ]; then
  errors+=("Mode is RESEARCH but code files are staged for commit. RESEARCH mode forbids code changes.")
  errors+=("Staged code files: $(echo "$staged_code" | head -5 | tr '\n' ', ')")
fi
```

**Strength:** ✅ GOOD — Catches code commits in RESEARCH mode

### Check #4: Slice Evidence (Lines 71-99)
```bash
in_progress_ids=$(jq -r '[.slices[] | select(.status == "in_progress") | .id] | .[]' "$STATE_FILE" 2>/dev/null || echo "")

for sid in $in_progress_ids; do
  skill_read=$(jq --argjson id "$sid" '.slices[] | select(.id == $id) | .evidence.skill_read // false' "$STATE_FILE")
  if [ "$skill_read" != "true" ]; then
    echo -e "${YELLOW}⚠️  Slice $sid in progress: verifying-ui-quality not yet read${RESET}"
  fi
done

completed_ids=$(jq -r '[.slices[] | select(.status == "completed") | .id] | .[]' "$STATE_FILE" 2>/dev/null || echo "")

for sid in $completed_ids; do
  screenshot_d=$(jq -r --argjson id "$sid" '.slices[] | select(.id == $id) | .evidence.screenshot_desktop // ""' "$STATE_FILE")
  screenshot_m=$(jq -r --argjson id "$sid" '.slices[] | select(.id == $id) | .evidence.screenshot_mobile // ""' "$STATE_FILE")
  qg_count=$(jq --argjson id "$sid" '.slices[] | select(.id == $id) | .evidence.quality_gate_checks | length // 0' "$STATE_FILE")

  if [ -z "$screenshot_d" ]; then
    errors+=("Slice $sid marked completed but missing desktop screenshot path")
  fi
  if [ -z "$screenshot_m" ]; then
    errors+=("Slice $sid marked completed but missing mobile screenshot path")
  fi
  if [ "$qg_count" -lt 3 ]; then
    errors+=("Slice $sid marked completed but has only $qg_count/3 quality gate checks")
  fi
done
```

**Strength:** ✅ GOOD — Validates evidence completeness

---

## Gate Script Mode Check Implementation

### Location: `/sessions/optimistic-quirky-franklin/mnt/brudi/orchestration/brudi-gate.sh` Lines 329-376

### BUILD Mode (Lines 344-351)
```bash
BUILD)
  case "$action" in
    write_code|create_file|screenshot|quality_gate) pass "Action '$action' allowed in BUILD mode." ;;
    audit_code) die "AUDIT action '$action' not allowed in BUILD mode." ;;
    fix_issue) die "FIX action '$action' not allowed in BUILD mode (only current slice bugs)." ;;
    *) pass "Action '$action' allowed in BUILD mode (default allow)." ;;
  esac
  ;;
```

**Assessment:**
- ✅ Allows: write_code, create_file, screenshot, quality_gate
- ✅ Blocks: audit_code (prevents reading others' code)
- ⚠️ Default allow: any unrecognized action passes (permissive)

### AUDIT Mode (Lines 352-359)
```bash
AUDIT)
  case "$action" in
    read_only|screenshot|write_analysis) pass "Action '$action' allowed in AUDIT mode." ;;
    write_code|create_file|delete_file|fix_issue)
      die "Action '$action' FORBIDDEN in AUDIT mode. AUDIT may only read, screenshot, and write analysis documents. Do NOT switch to FIX without user permission." ;;
    *) die "Action '$action' not explicitly allowed in AUDIT mode. Ask user." ;;
  esac
  ;;
```

**Assessment:**
- ✅ Strict whitelist: read_only, screenshot, write_analysis ONLY
- ✅ Explicit error message mentioning "Do NOT switch to FIX without user permission"
- ⚠️ Still only works IF agent calls mode-check (optional)

### FIX Mode (Lines 360-365)
```bash
FIX)
  case "$action" in
    fix_issue|write_code|screenshot) pass "Action '$action' allowed in FIX mode." ;;
    create_file) die "Creating new files not allowed in FIX mode. Only fix named issues." ;;
    *) warn "Action '$action' in FIX mode — proceed with caution (only fix named issues)." ; exit 0 ;;
  esac
  ;;
```

**Assessment:**
- ✅ Allows: fix_issue, write_code (scoped), screenshot
- ⚠️ Blocks: create_file (but agent can use mkdir then write to it)
- ⚠️ Default warn: unrecognized actions warn but allow (permissive)
- ❌ Scope not enforceable: write_code allows ANY code changes

### RESEARCH Mode (Lines 367-373)
```bash
RESEARCH)
  case "$action" in
    read_only|write_analysis) pass "Action '$action' allowed in RESEARCH mode." ;;
    write_code|create_file|delete_file|fix_issue)
      die "Action '$action' FORBIDDEN in RESEARCH mode. RESEARCH may only read and write analysis." ;;
    *) die "Action '$action' not explicitly allowed in RESEARCH mode." ;;
  esac
  ;;
```

**Assessment:**
- ✅ Strict whitelist: read_only, write_analysis ONLY
- ✅ Blocks: write_code, create_file, delete_file, fix_issue
- ✅ Default deny: unrecognized actions blocked
- ⚠️ Still optional to call

---

## Example Projects Analysis

### Project 1: testo

**File:** `/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/testo/.brudi/state.json`

**State:**
- mode: "BUILD" ✅
- phase: 2 ✅
- Slices: 7 completed ✅
- Phase gates: 0_to_1 ✓, 1_to_2 ✓, 2_to_3 ✗
- Evidence: ❌ NO SCREENSHOT PATHS (violates schema requirement)

**Violation:** Slices marked "complete" but no evidence tracking (lines 13-21)

### Project 2: AVATAR

**File:** `/sessions/optimistic-quirky-franklin/mnt/alexejluft/AI/Brudi Workspace/projects/AVATAR/.brudi/state.json`

**State:**
- mode: "BUILD" ✅
- phase: 3 ✅
- Slices: 15 completed ✅
- Phase gates: All passed ✓
- Evidence: ❌ NO EVIDENCE STRUCTURE

**Schema Violation:**
- Uses string IDs ("s1-preloader") instead of integers
- Schema (state.schema.json line 56-58) requires: `"type": "integer"`
- **Finding:** AVATAR state.json violates its own schema!

---

## Evidence Chain Summary

| Finding | File | Line | Evidence |
|---------|------|------|----------|
| Modes inconsistent? | CLAUDE.md, brudi-gate.sh, schema | 291-306, 109-112, 22-25 | ✅ ALL CONSISTENT |
| Mode change validation? | brudi-gate.sh | 96-117 | ✅ validate_state() strict, BUT optional to call |
| Direct state.json edit prevented? | pre-commit, state.init.json | 26-29, 1-19 | ❌ NO PREVENTION |
| Gate calls mandatory? | orchestration/ | — | ❌ NO, OPTIONAL |
| --no-verify defense? | pre-commit | 1-139 | ❌ NONE (git design) |
| state.json deletion defense? | pre-commit | 26-29 | ❌ SKIPS CHECKS IF MISSING |
| jq protection? | pre-commit | 31-34 | ⚠️ WARNS BUT ALLOWS |
| File type catching? | pre-commit | 57 | ⚠️ MISSES .md, .txt, .yaml |
| Audit AUDIT→FIX escalation | CLAUDE.md, brudi-gate.sh | 304, 352-359 | ⚠️ DOCUMENTED BUT NOT ENFORCED |
| Scope enforcement FIX mode | brudi-gate.sh | 360-365 | ❌ IMPOSSIBLE TECHNICALLY |

---

## Conclusion

**All findings in the security audit report are backed by specific file:line references.**

**No finding is speculative — all are supported by code analysis.**

**Three exploits (1, 2, 3) are CRITICAL and trivially executable.**

---

**Report:** MODE_ENFORCEMENT_SECURITY_AUDIT.md (39 KB, 18 sections)
**Executive Summary:** MODE_ENFORCEMENT_EXECUTIVE_SUMMARY.md (11 KB, 7 findings)
**Evidence Index:** This file

