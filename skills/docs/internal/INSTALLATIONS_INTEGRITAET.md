# Brudi — Installations-Integritätsanalyse

**Datum:** 2026-02-22
**Version:** Tier-1 Orchestrierung (post-commit `1e27a9c`)
**Scope:** Vollständige Analyse aller Installationspfade, Sync-Mechanismen und Template-Propagation

---

## Executive Summary

**Ergebnis: Fresh Install ✅ FUNKTIONIERT — Sync-Mechanismen ❌ KRITISCH DEFEKT**

Der primäre Installationspfad (`install.sh` → `use.sh`) funktioniert korrekt: Ein neuer Nutzer erhält alle Tier-1-Dateien. **ABER**: Die Update-Mechanismen für bestehende Installationen haben 6 kritische Bugs, die dazu führen, dass Updates nie ankommen oder in falsche Verzeichnisse geschrieben werden.

| Pfad | Status | Risiko |
|------|--------|--------|
| `install.sh` → `use.sh` (Neuinstallation) | ✅ 39/39 Tests bestanden | Kein |
| `post-merge` Hook (nach git pull) | ❌ KRITISCH | Schreibt nach `~/.brudi/` statt `~/Brudi/` |
| `post-commit` Hook (nach Commit) | ❌ KRITISCH | 3 divergierende Versionen, eine ohne Orchestration |
| LaunchAgent (Auto-Sync alle 15min) | ❌ KRITISCH | Hardcoded User-Pfad, nutzt defekten post-merge |
| `setup-hooks.sh` | ❌ HOCH | Installiert veralteten Hook ohne Orchestration |

---

## 1. Installationspfade (Agent 1: Install Flow)

### Pfad A: Globale Erstinstallation (`install.sh`)

```
curl → git clone --depth=1 → cp -r skills/. ~/Brudi/ → chmod orchestration
```

**Ergebnis:** ✅ KORREKT

Alle Dateien werden kopiert:
- `skills/` → `~/Brudi/skills/`
- `templates/` → `~/Brudi/templates/`
- `orchestration/` → `~/Brudi/orchestration/` (brudi-gate.sh, pre-commit, state.init.json, state.schema.json)
- `assets/` → `~/Brudi/assets/`
- `CLAUDE.md`, `AGENTS.md`, `use.sh` → `~/Brudi/`

### Pfad B: Projekt-Verbindung (`use.sh`)

```
cd ~/projects/mein-projekt && sh ~/Brudi/use.sh
```

**Ergebnis:** ✅ KORREKT — 7 Dateien/Verzeichnisse erstellt:

| Datei | Quelle | Tier-1 Referenzen |
|-------|--------|-------------------|
| `.brudi/state.json` | `orchestration/state.init.json` | ✅ Mode: BUILD, Phase: 0 |
| `AGENTS.md` | Inline (Heredoc) | ✅ Gate Runner Befehle |
| `CLAUDE.md` | Inline (Heredoc) | ✅ 5 Tier-1 Befehle |
| `TASK.md` | `templates/TASK.md` | ✅ State-Check in Phase 0 |
| `PROJECT_STATUS.md` | `templates/PROJECT_STATUS.md` | ✅ Evidence-Tabellen |
| `screenshots/` | mkdir | ✅ Evidence-Verzeichnis |
| `.git/hooks/pre-commit` | `orchestration/pre-commit` | ✅ Gate-Enforcement |

### Pfad C: Dev-Setup (`scripts/setup-brudi.sh`)

```
git clone brudi && bash scripts/setup-brudi.sh
```

**Ergebnis:** ⚠️ TEILWEISE KORREKT

- Inline post-commit Hook: ✅ Hat Orchestration-Sync
- post-merge Hook: ❌ Kopiert defekte Version aus `scripts/post-merge`
- LaunchAgent: ❌ Hardcoded Pfad `/Users/alexejluft/...`

### Pfad D: Hook-Setup (`scripts/setup-hooks.sh`)

**Ergebnis:** ❌ DEFEKT — Installiert `scripts/hooks/post-commit` (Version ohne Orchestration-Sync)

---

## 2. Kritische Bugs (Agent 4: Legacy Drift + Agent 6: Sync & Distribution)

### BUG 1: `scripts/post-merge` — Falscher Zielpfad [KRITISCH]

**Datei:** `scripts/post-merge`, Zeilen 9-11
**Problem:** Synct nach `$HOME/.brudi/` (alter, versteckter Pfad) statt `$HOME/Brudi/` (aktueller Pfad)
**Impact:** Nach `git pull` werden Updates in ein Verzeichnis geschrieben, das nicht existiert. Kein Sync findet statt.
**Zusätzlich:** Orchestration-Sync fehlt komplett.

### BUG 2: `.git/hooks/post-merge` — Identisch mit Bug 1 [KRITISCH]

**Datei:** `.git/hooks/post-merge`
**Problem:** Kopie von `scripts/post-merge` — gleicher falscher Pfad.

### BUG 3: `scripts/hooks/post-commit` — Fehlender Orchestration-Sync [KRITISCH]

**Datei:** `scripts/hooks/post-commit`
**Problem:** Synct Skills und Assets, aber NICHT `orchestration/`. Nach Commits werden brudi-gate.sh und pre-commit nicht aktualisiert.
**Divergenz:** Die Inline-Version in `setup-brudi.sh` (Zeilen 52-89) HAT Orchestration-Sync — aber `setup-hooks.sh` installiert die defekte standalone-Version.

### BUG 4: 3 divergierende Post-Commit Hooks [HOCH]

| Version | Orchestration-Sync | Pfad korrekt | Installiert von |
|---------|-------------------|--------------|-----------------|
| `scripts/hooks/post-commit` | ❌ Fehlt | ✅ `$HOME/Brudi/` | `setup-hooks.sh` |
| `setup-brudi.sh` Inline (Z. 52-89) | ✅ Vorhanden | ✅ `$HOME/Brudi/` | `setup-brudi.sh` |
| `.git/hooks/post-commit` | ❌ Fehlt | ✅ `$HOME/Brudi/` | Aktuell installiert |

### BUG 5: `com.brudi.autosync.plist` — Hardcoded Pfad [KRITISCH]

**Datei:** `scripts/com.brudi.autosync.plist`
**Problem:** Enthält `/Users/alexejluft/...` — funktioniert nur auf Alex' Mac, nicht auf anderen Rechnern.

### BUG 6: `INSTALL.md` — Veraltet [MITTEL]

**Datei:** `skills/INSTALL.md`
**Problem:** Erwähnt weder `orchestration/`, `templates/`, noch Tier-1 Mechanismen.

---

## 3. Template-Propagation (Agent 2)

### Kernproblem: Inline vs. Template

`use.sh` erstellt `CLAUDE.md` und `AGENTS.md` per **Inline-Heredoc** statt aus Templates zu kopieren.

| Aspekt | Projekt-CLAUDE.md (Inline, 21 Zeilen) | Template CLAUDE.md (162 Zeilen) | ~/Brudi/CLAUDE.md (411 Zeilen) |
|--------|---------------------------------------|--------------------------------|-------------------------------|
| Tier-1 Befehle | ✅ 5 Befehle | ✅ 5 Befehle + Details | ✅ Komplett |
| Agent Startup (5 Schritte) | ❌ Fehlt | ✅ Vorhanden | ✅ Vorhanden |
| Mode Control Tabelle | ❌ Fehlt | ✅ Vorhanden | ✅ Vorhanden |
| Hard Gates | ❌ Fehlt | ✅ Vorhanden | ✅ Vorhanden |
| Anti-Pattern Guardrails | ❌ Fehlt | ✅ Vorhanden | ✅ Vorhanden |
| Evidence-Spezifikation | ❌ Fehlt | ✅ Vorhanden | ✅ Vorhanden |
| Definition of Done | ❌ Fehlt | ✅ Vorhanden | ✅ Vorhanden |

**Risiko:** Der Projekt-CLAUDE.md enthält nur 15% der Tier-1-Regeln. Ein Agent, der NUR die Projekt-Datei liest (ohne ~/Brudi/CLAUDE.md), überspringt 85% der Guidance.

**Mitigation vorhanden:** Die Inline-CLAUDE.md verweist auf `~/Brudi/CLAUDE.md` — aber ob der Agent diesem Verweis folgt, hängt vom Agent ab.

**Fix:** `use.sh` sollte `templates/CLAUDE.md` kopieren statt Inline-Content zu nutzen.

---

## 4. Version-Divergenzen (Agent 3)

### Zusammenfassung aller Divergenzen

| Komponente | Anzahl Versionen | Korrekte Version | Defekte Version(en) |
|------------|-----------------|------------------|---------------------|
| Post-Commit Hook | 3 | `setup-brudi.sh` Inline | `scripts/hooks/post-commit`, `.git/hooks/post-commit` |
| Post-Merge Hook | 2 (identisch) | — (beide defekt) | `scripts/post-merge`, `.git/hooks/post-merge` |
| CLAUDE.md | 3 | `skills/CLAUDE.md` (411 Z.) | Inline in `use.sh` (21 Z.) — zu kurz |
| AGENTS.md | 2 | `skills/AGENTS.md` (95 Z.) | Inline in `use.sh` (38 Z.) — akzeptabel |

---

## 5. Startup-Sichtbarkeit (Agent 5)

### Was sieht der Agent beim Projektstart?

| Schritt | Datei | Tier-1 sichtbar? | Qualität |
|---------|-------|-------------------|----------|
| 1 | Projekt-CLAUDE.md | ✅ Teilweise | 21 Zeilen, 5 Befehle |
| 2 | → ~/Brudi/CLAUDE.md | ✅ Komplett | 411 Zeilen, ALLE Regeln |
| 3 | .brudi/state.json | ✅ Struktur | Mode, Phase, Slices |
| 4 | TASK.md | ✅ Vorhanden | Phase 0 Gate-Check |
| 5 | brudi-gate.sh pre-slice | ✅ Enforcement | Exit-Code 1 = STOPP |

**Gesamtbewertung:** Wenn der Agent der 5-Schritt-Startup-Sequenz folgt, sieht er ALLE Tier-1-Regeln. Der kritische Punkt ist Schritt 1→2: Der Agent muss dem Verweis in Projekt-CLAUDE.md auf ~/Brudi/CLAUDE.md folgen.

**Redundanz-Score: 8.5/10** — Jede Regel erscheint in mindestens 2-3 Dateien.

---

## 6. Cold Install Regression (Agent 7)

### Testergebnis: 39/39 Checks bestanden

Simuliert: Frischer Rechner → `install.sh` → `use.sh` → Agent-Start

| Test-Kategorie | Tests | Status |
|----------------|-------|--------|
| Install-Verzeichnisstruktur | 8 | ✅ |
| use.sh Datei-Erstellung | 7 | ✅ |
| state.json Validität | 5 | ✅ |
| Gate Runner Funktionalität | 6 | ✅ |
| Pre-Commit Hook | 4 | ✅ |
| Template-Inhalte | 5 | ✅ |
| Orchestration chmod | 4 | ✅ |

---

## 7. Risikoanalyse

### Risikomatrix

| # | Risiko | Wahrscheinlichkeit | Impact | Severity | Status |
|---|--------|-------------------|--------|----------|--------|
| R1 | Post-merge synct nach ~/.brudi/ (existiert nicht) | 100% bei git pull | Updates kommen nie an | 🔴 KRITISCH | Offen |
| R2 | setup-hooks.sh installiert Hook ohne Orchestration | 100% bei Nutzung | Orchestration-Updates fehlen | 🔴 KRITISCH | Offen |
| R3 | LaunchAgent hat hardcoded User-Pfad | 100% bei anderem User | Auto-Sync funktioniert nicht | 🔴 KRITISCH | Offen |
| R4 | Projekt-CLAUDE.md enthält nur 15% der Regeln | ~40% (Agent folgt Verweis nicht) | Agent überspringt Gates | 🟡 HOCH | Offen |
| R5 | INSTALL.md Dokumentation veraltet | Bei jedem neuen User | Verwirrung, falsches Setup | 🟠 MITTEL | Offen |
| R6 | 3 divergierende Post-Commit Hook Versionen | Bei jedem Setup | Unvorhersehbares Verhalten | 🟡 HOCH | Offen |

### Integritätsnachweis

**Fresh Install (install.sh → use.sh):**
- ✅ 39/39 automatisierte Tests bestanden
- ✅ Alle Tier-1-Dateien korrekt propagiert
- ✅ Gate Runner funktioniert aus Projektverzeichnis
- ✅ Pre-Commit Hook blockiert bei fehlender Evidence

**Existing Install (Update-Pfade):**
- ❌ Post-merge Hook defekt (falscher Pfad)
- ❌ Post-commit Hook (standalone) unvollständig
- ❌ LaunchAgent nicht portabel
- ❌ setup-hooks.sh installiert falschen Hook

---

## 8. Installations-Redesign-Plan

### Zu behebende Dateien (6 Stück)

#### Fix 1: `scripts/post-merge` [KRITISCH]

**Problem:** `$HOME/.brudi/` → `$HOME/Brudi/`, fehlender Orchestration-Sync
**Lösung:**
- Alle Pfade von `$HOME/.brudi/` auf `$HOME/Brudi/` ändern
- Orchestration-Sync hinzufügen (analog zu `setup-brudi.sh` Inline-Hook)
- Templates-Sync hinzufügen

#### Fix 2: `scripts/hooks/post-commit` [KRITISCH]

**Problem:** Fehlender Orchestration-Sync
**Lösung:**
- Orchestration-Sync hinzufügen
- chmod für brudi-gate.sh und pre-commit

#### Fix 3: `scripts/setup-hooks.sh` [HOCH]

**Problem:** Installiert defekten standalone post-commit
**Lösung:**
- setup-hooks.sh sollte den korrekten Hook generieren (wie setup-brudi.sh)
- Oder: setup-hooks.sh deprecaten und nur setup-brudi.sh nutzen

#### Fix 4: `scripts/com.brudi.autosync.plist` [KRITISCH]

**Problem:** Hardcoded `/Users/alexejluft/...`
**Lösung:**
- `setup-brudi.sh` sollte den Pfad dynamisch mit `$HOME` ersetzen beim Kopieren
- Oder: plist als Template mit Platzhaltern, die beim Install ersetzt werden

#### Fix 5: `skills/INSTALL.md` [MITTEL]

**Problem:** Veraltet
**Lösung:**
- Orchestration/, Templates/, Tier-1 dokumentieren
- Aktuelle Verzeichnisstruktur beschreiben

#### Fix 6: `skills/use.sh` — CLAUDE.md Template statt Inline [HOCH]

**Problem:** Inline-Heredoc (21 Zeilen) statt Template (162 Zeilen)
**Lösung:**
- `use.sh` soll `templates/CLAUDE.md` kopieren (mit sed-Ersetzung für Projektnamen)
- Analog für AGENTS.md: Template erstellen und kopieren

### Reihenfolge

1. **Fix 1 + Fix 2** (post-merge + post-commit) — behebt Sync-Defekte
2. **Fix 4** (plist) — macht LaunchAgent portabel
3. **Fix 6** (use.sh Template) — Agent sieht alle Regeln
4. **Fix 3** (setup-hooks.sh) — konsistente Hook-Installation
5. **Fix 5** (INSTALL.md) — Dokumentation

### Verifikation nach Fixes

```bash
# 1. Pfad-Check: Kein ~/.brudi/ mehr
grep -r '\.brudi/' scripts/ skills/ --include="*.sh" --include="*.plist" | grep -v 'state.json\|\.brudi/state'
# Erwartung: 0 Treffer

# 2. Orchestration-Sync: In allen Hooks
grep -r 'orchestration' scripts/hooks/ scripts/post-merge
# Erwartung: Treffer in allen Hook-Dateien

# 3. Hardcoded Pfade: Keine User-spezifischen Pfade
grep -r '/Users/' scripts/
# Erwartung: 0 Treffer

# 4. Template-Nutzung: use.sh kopiert Template
grep 'templates/CLAUDE.md' skills/use.sh
# Erwartung: 1 Treffer
```

---

## Fazit

**Die Neuinstallation funktioniert.** Ein Entwickler, der Brudi zum ersten Mal installiert und ein Projekt verbindet, erhält alle Tier-1-Dateien korrekt.

**Die Update-Mechanismen sind defekt.** Bestehende Installationen erhalten keine Updates korrekt — weder über git pull (post-merge → falscher Pfad), noch über Auto-Sync (LaunchAgent → hardcoded), noch über manuelles Hook-Setup (setup-hooks.sh → veralteter Hook).

**Empfehlung:** 6 Fixes implementieren, in der beschriebenen Reihenfolge. Geschätzte Komplexität: Niedrig — alle Fixes sind Pfad-Korrekturen und Copy-Befehle.
