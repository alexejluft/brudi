# BRUDI CREATIVE DNA — Integration & Proof Truth Table

**Date:** 2026-02-24
**Mode:** AUDIT (Beweis-Modus)
**Verdict:** System ist TEILWEISE integriert. Enforcement existiert auf Foundation-Level, aber NICHT auf Creative-Complexity-Level.

---

## TRUTH TABLE

| # | Claim | Status | Evidence | Fix Plan |
|---|-------|--------|----------|----------|
| 1 | **install.sh ist unverändert** | ✅ PROVEN | bash -n Exit 0, keine Creative DNA Referenzen, Version 3.3.2 | — |
| 2 | **use.sh ist unverändert** | ✅ PROVEN | bash -n Exit 0, keine Creative DNA Referenzen in use.sh selbst | — |
| 3 | **use.sh kopiert CLAUDE.md mit Creative DNA** | ✅ PROVEN | use.sh Zeile 137-140 → templates/CLAUDE.md Zeile 290-339: "Creative Complexity Floor (KOMPAKT)" | — |
| 4 | **use.sh kopiert PROJECT_STATUS.md mit Evidence-Felder** | ✅ PROVEN | use.sh Zeile 166-168 → templates/PROJECT_STATUS.md Zeile 127-280: Animation Count, Easing Variety, Depth Layers, Forbidden Patterns | — |
| 5 | **use.sh kopiert TASK.md mit Anti-Patterns** | ✅ PROVEN | use.sh Zeile 159-160 → templates/TASK.md Zeile 32, 68-74, 122-133: Skills + Verbotene Patterns | — |
| 6 | **use.sh installiert Pre-Commit Hook** | ✅ PROVEN | use.sh Zeile 179-181: cp pre-commit → .git/hooks/pre-commit + chmod +x | — |
| 7 | **Agent liest Creative DNA beim Boot** | ✅ PROVEN | templates/CLAUDE.md Zeile 20: "Lies ~/Brudi/CLAUDE.md". Globale CLAUDE.md Zeile 291-421: Creative Complexity Floor (FULL). Agent-Boot-Kette bewiesen. | — |
| 8 | **brudi-gate.sh sourced brudi-gate-complexity.sh** | ✅ PROVEN | brudi-gate.sh Zeile 95-97: `source "$COMPLEXITY_MODULE"`. Zeile 186-188: pre-slice ruft `run_complexity_check`. Zeile 272-274: post-slice ruft `run_complexity_check`. | — |
| 9 | **Pre-Slice blockiert ohne Design Tokens** | ✅ PROVEN | Demo-Test: pre-slice ohne materiality-tokens.css/globals.css → Exit Code 1, "Creative DNA Complexity Floor nicht erfüllt." | — |
| 10 | **Post-Slice blockiert bei `transition: all`** | ✅ PROVEN | Demo-Test: src/bad-hero.tsx mit `transition: all` → Exit Code 3, "VIOLATION: 1x transition:all gefunden" | — |
| 11 | **Post-Slice blockiert bei `gsap.from()`** | ✅ PROVEN | Demo-Test: src/bad-hero.tsx mit `gsap.from()` → Exit Code 3, "VIOLATION: 2x gsap.from() gefunden" | — |
| 12 | **ESLint Plugin existiert mit 4 Rules** | ✅ PROVEN | orchestration/eslint-rules/brudi-creative-dna.js: node -c OK, 4 Rules (no-transition-all, no-gsap-from-in-react, scrolltrigger-cleanup-required, no-layout-animation) | — |
| 13 | **ESLint Rules detektieren Violations** | ⚠️ PROVEN MIT BUG | Alle 4 Rules triggern korrekt NACH Fix. Zeile 283: `methodName` undefiniert → ReferenceError bei gsap.to() | Fix: Zeile 283 braucht `const methodName = node.callee.property?.name;` |
| 14 | **verifying-ui-quality upgraded** | ✅ PROVEN | Zeile 163: "Creative DNA Verification (Phase 1 Enhanced)". Zeile 167: Animation Count Evidence. Zeile 194: Easing Variety. Zeile 218: Depth Layers. | — |
| 15 | **Keine Breaking Changes** | ✅ PROVEN | install.sh + use.sh unverändert. Alle Änderungen additiv (neue Dateien + Template-Erweiterungen). | — |
| 16 | **ESLint Config wird automatisch ins Projekt kopiert** | ❌ UNPROVEN | use.sh kopiert eslint.config.brudi.js NICHT. Nur manuell: `cp ~/Brudi/templates/eslint.config.brudi.js ./eslint.config.js` | use.sh erweitern: Zeile nach 180 `cp templates/eslint.config.brudi.js` |
| 17 | **Neue Skills sind wirksam (Agent liest sie)** | ❌ UNPROVEN | designing-award-materiality (720 Z) + designing-creative-constraints (911 Z) existieren, aber sind NICHT in CLAUDE.md referenziert → Agent liest sie nie. | Skills in CLAUDE.md Phase 1 Skills auflisten |
| 18 | **Animation Count wird vom Gate erzwungen** | ❌ UNPROVEN | Kein Mechanismus in brudi-gate.sh oder brudi-gate-complexity.sh der Animation-Anzahl zählt. CLAUDE.md sagt "5+ GSAP Animations", Gate prüft das NICHT. | brudi-gate-complexity.sh: `check_animation_count()` Funktion hinzufügen |
| 19 | **Easing Variety wird vom Gate erzwungen** | ❌ UNPROVEN | Gate prüft nur ob --easing-* Token existieren, NICHT ob 3+ verschiedene Easing-Funktionen im Code verwendet werden. | brudi-gate-complexity.sh: `check_easing_variety()` Funktion hinzufügen |
| 20 | **Depth Layer USAGE wird vom Gate erzwungen** | ❌ UNPROVEN | Gate prüft nur ob --color-bg/surface Token existieren, NICHT ob alle 4 Layer tatsächlich genutzt werden. | brudi-gate-complexity.sh: `check_depth_usage()` Funktion hinzufügen |
| 21 | **Pre-Commit Hook erzwingt Creative DNA** | ⚠️ PARTIAL | Hook prüft state.json + mode + evidence (screenshots, build). Hook ruft brudi-gate.sh complexity checks NICHT auf. Forbidden Patterns werden nur beim post-slice geprüft, nicht beim Commit. | Pre-commit: nach evidence-check `brudi-gate-complexity.sh check_forbidden_patterns` aufrufen |
| 22 | **Layout property animations werden blockiert** | ⚠️ PARTIAL | Gate: nur WARNING, nicht BLOCKING (non-zero exit aber kein die()). ESLint: warn-Level. | Severity auf error setzen wenn gewünscht |
| 23 | **motion-compliance-check.sh ist aktiv** | ❌ UNPROVEN | Datei existiert aber wird von keinem Script referenziert. Orphaned Code. | Löschen oder in brudi-gate.sh integrieren |
| 24 | **Repo ist aufgeräumt** | ❌ UNPROVEN | 9 Audit-Reports im Root-Verzeichnis (140KB). Nicht zum Core-System gehörend. | Reports nach docs/internal/audits/ verschieben |
| 25 | **Ein User kann START_HERE lesen und ohne IT-Wissen loslegen** | ⚠️ PARTIAL | START_HERE.md existiert mit Onboarding-Schritten. Aber: Terminal + git init + use.sh erfordern Basis-Terminal-Wissen. Erklärungen vorhanden aber nicht getestet mit echten Anfängern. | Praxis-Test mit Non-Dev User |
| 26 | **ESLint Plugin ist produktionsreif** | ❌ UNPROVEN | Kritischer Bug Zeile 283 (methodName undefined). Funktioniert nur nach manuellem Fix. | Bug fixen in brudi-creative-dna.js |

---

## ZUSAMMENFASSUNG

### Was WIRKLICH enforced ist (PROVEN, blockiert automatisch):

1. **Token-Existenz** — Pre-Slice blockiert ohne materiality-tokens.css + globals.css mit 4-Layer Tokens
2. **Forbidden Patterns** — Post-Slice blockiert bei `transition: all` + `gsap.from()` im Code
3. **Evidence Pflicht** — Post-Slice blockiert ohne Screenshots, Build, Console, Quality Gate
4. **Mode Enforcement** — Pre-Commit blockiert Code-Änderungen in AUDIT/RESEARCH Mode
5. **Agent-Awareness** — Creative DNA ist im Template-CLAUDE.md (kompakt) + globaler CLAUDE.md (vollständig)

### Was NICHT enforced ist (UNPROVEN, nur Dokumentation):

1. **Animation Count** (5+ pro Hero) — steht in CLAUDE.md, wird vom Gate NICHT geprüft
2. **Easing Variety** (3+ Typen) — steht in CLAUDE.md, Gate prüft nur Token-Existenz
3. **Depth Layer Usage** (4 Layer genutzt) — steht in CLAUDE.md, Gate prüft nur Token-Existenz
4. **Neue Skills** (Materiality + Constraints) — existieren aber Agent liest sie nie
5. **ESLint auto-deploy** — Config muss manuell kopiert werden
6. **ESLint Plugin** — hat kritischen Bug, nicht produktionsreif

### Enforcement-Pyramide (Realität):

```
Level 3: Creative Metrics (Animation Count, Easing, Depth Usage)
→ ❌ NUR IN CLAUDE.md DOKUMENTIERT, NICHT ENFORCED

Level 2: Pattern Blocking (transition:all, gsap.from, Token-Existenz)
→ ✅ GATE BLOCKIERT (brudi-gate-complexity.sh)

Level 1: Process (Screenshots, Build, Console, Mode)
→ ✅ GATE BLOCKIERT (brudi-gate.sh + pre-commit)

Level 0: Templates (CLAUDE.md, TASK.md, PROJECT_STATUS.md)
→ ✅ AUTOMATISCH VIA use.sh
```

**Fazit:** Level 0-2 funktionieren. Level 3 ist "Trust the Agent" — genau das, was wir eliminieren wollten.

---

## FIX-PLAN (Priorisiert)

| # | Fix | Aufwand | Impact | Priorität |
|---|-----|---------|--------|-----------|
| 1 | ESLint Bug Zeile 283 fixen | 5 min | ESLint funktionsfähig | P0 |
| 2 | Neue Skills in CLAUDE.md referenzieren | 10 min | Agent liest Materiality + Constraints | P0 |
| 3 | Repo aufräumen (9 Reports → docs/internal/audits/) | 15 min | Sauberes Root | P1 |
| 4 | use.sh: eslint.config.brudi.js auto-copy | 5 min | ESLint auto-aktiv | P1 |
| 5 | Pre-commit: forbidden pattern check einbauen | 15 min | Commit-Level Blocking | P1 |
| 6 | check_animation_count() in Gate | 30 min | Animation Count Enforcement | P2 |
| 7 | check_easing_variety() in Gate | 30 min | Easing Variety Enforcement | P2 |
| 8 | check_depth_usage() in Gate | 30 min | Depth Layer Enforcement | P2 |
| 9 | motion-compliance-check.sh: integrieren oder löschen | 10 min | Orphaned Code weg | P2 |

**P0 (sofort, 15 min):** System funktionsfähig machen
**P1 (heute, 35 min):** Integration vervollständigen
**P2 (diese Woche, 100 min):** Creative Metrics enforced
