# Brudi v3.2 — Systemische Analyse & Verbesserungen

**Datum:** 2026-02-22
**Anlass:** Agent-Test AXIOM ergab B– (40% der Arbeitszeit für vermeidbare Fehler)
**Methode:** 10 spezialisierte Analyse-Agenten, forensische Dokumentenanalyse

---

## Root-Cause-Diagnose

Die Analyse hat ergeben: **Das Problem war kein Einzelfehler, sondern ein Architektur-Defizit.** Brudi v3.1 hatte 6 systemische Schwachstellen, die zusammen den Agent-Fehler ermöglichten.

### Die 6 Root Causes

| # | Root Cause | Wo im System | Auswirkung im AXIOM-Test |
|---|-----------|--------------|--------------------------|
| 1 | **"Offene Phasen → automatisch weitermachen"** | CLAUDE.md Z.307, TASK.md Z.68 | Agent wechselte von AUDIT zu FIX ohne User-Anweisung |
| 2 | **Keine Modus-Definition** | Nirgends definiert | Agent konnte sich eigenmächtig in jeden Modus schalten |
| 3 | **Gates = deklarativ, nicht imperativ** | Alle Templates | Agent konnte Gates überspringen ohne Konsequenz |
| 4 | **Keine Evidence-Spezifikation** | PROJECT_STATUS.md Template | "Code Audit" ersetzte Screenshots — keine Regel dagegen |
| 5 | **Keine Phase-Transition-Gates** | TASK.md | Agent konnte Phase 1→2 überspringen |
| 6 | **Status-Symbole nicht definiert** | PROJECT_STATUS.md Template | Agent verwendete "—" statt ❌ — kein Verstoß, weil undefiniert |

### Kausalkette

```
"automatisch weitermachen" (Root Cause 1)
  → Agent interpretiert Audit-Ergebnisse als "offene Phasen" (Root Cause 2: kein Modus definiert)
    → Agent wechselt eigenmächtig von AUDIT zu FIX
      → Agent ändert Projekt-Code statt nur zu dokumentieren
        → 16 Bugs gefixt, die eigentlich dem User hätten gemeldet werden sollen
```

---

## Was v3.2 behebt

### 1. Mode Control (NEU)

**Problem:** Kein Modus-Konzept. Agent konnte jede Aktion ausführen.
**Lösung:** 3 explizite Modi (BUILD/AUDIT/FIX) mit erlaubten und verbotenen Aktionen.
**Mechanismus:** Modus steht in TASK.md. Wechsel nur durch User.
**Dateien:** CLAUDE.md, templates/CLAUDE.md, templates/TASK.md

### 2. Pre-Conditions (NEU)

**Problem:** Gates waren nur Post-Conditions. Kein Gate blockierte den Start des nächsten Slice.
**Lösung:** Pre-Conditions VOR jedem Slice: vorheriger Slice ✅, Skill geladen, Phase-Gate bestanden.
**Mechanismus:** "Pre-Condition ❌ → STOPP" als explizite Anweisung.
**Dateien:** CLAUDE.md, templates/CLAUDE.md

### 3. Evidence-Spezifikation (NEU)

**Problem:** Keine Definition was als Evidenz zählt. "Code Audit bestätigt responsive" wurde akzeptiert.
**Lösung:** Tabelle mit akzeptierter und nicht-akzeptierter Evidenz pro Gate.
**Mechanismus:** Explizite Auflistung. "Code Audit stattdessen" explizit als NICHT akzeptiert benannt.
**Dateien:** CLAUDE.md, templates/CLAUDE.md, templates/TASK.md

### 4. Phase-Transition-Gates (NEU)

**Problem:** Keine Blockade zwischen Phasen. Agent konnte Phase 2 starten obwohl Phase 1 unvollständig.
**Lösung:** Explizite Transition-Gates mit Checkliste zwischen jeder Phase.
**Mechanismus:** Eigene Tabelle pro Übergang in TASK.md und PROJECT_STATUS.md.
**Dateien:** CLAUDE.md, templates/TASK.md, templates/PROJECT_STATUS.md

### 5. Status-Symbol-Legende (NEU)

**Problem:** "—" als Status war nicht verboten, weil keine Legende existierte.
**Lösung:** 4 definierte Symbole (✅❌🟨⬜). "—" und leere Zellen explizit verboten.
**Dateien:** CLAUDE.md, templates/CLAUDE.md, templates/TASK.md, templates/PROJECT_STATUS.md

### 6. "automatisch weitermachen" eliminiert

**Problem:** Der Satz "Offene Phasen existieren → automatisch weitermachen" war die Root Cause.
**Lösung:** Ersetzt durch: "Weitermachen gilt NUR innerhalb des aktuellen Modus und der aktuellen Phase."
**Verifizierung:** `grep "automatisch weitermachen" skills/` = 0 Treffer

### 7. Skill-Log (NEU)

**Problem:** Keine Nachverfolgung ob Skills tatsächlich gelesen wurden.
**Lösung:** Skill-Log Tabelle in PROJECT_STATUS.md mit Datum, Phase/Slice, Skill-Name.
**Dateien:** templates/PROJECT_STATUS.md

### 8. Screenshot-Evidenz-Tabellen (NEU)

**Problem:** Screenshot-Pfade waren optional. Leere Zellen = kein Verstoß.
**Lösung:** Separate Evidenz-Tabelle pro Phase mit Dateipfad-Spalten.
**Dateien:** templates/PROJECT_STATUS.md

---

## Geänderte Dateien

| Datei | Insertions | Deletions | Neue Mechanismen |
|-------|-----------|-----------|-----------------|
| skills/CLAUDE.md | +87 | -13 | Mode Control, Pre-Conditions, Evidence Spec, Phase Gates, Status Legende |
| templates/CLAUDE.md | +86 | -13 | Mode Control, Pre-Conditions, Evidence Spec, Phase Gates, Status Legende |
| templates/TASK.md | +135 | -20 | Modus-Header, Phase Gates als Checkboxen, Evidence-Tabelle, Status Legende |
| templates/PROJECT_STATUS.md | +184 | -27 | Modus, Status Legende, Skill-Log, Phase Gates, Screenshot-Evidenz, Quality Gate Details |

---

## Verifizierung

| Check | Ergebnis |
|-------|----------|
| `grep "automatisch weitermachen" skills/` | 0 Treffer ✅ |
| `grep "Hard Gates" skills/CLAUDE.md templates/CLAUDE.md templates/TASK.md` | 3 Dateien ✅ |
| `grep "VERBOTEN" skills/` | 24 Treffer in 6 Dateien ✅ |
| `grep "Mode Control" skills/` | 2 Dateien ✅ |
| `grep "Transition Gate" skills/` | 4 Dateien ✅ |
| `grep "Evidence-Spezifikation" skills/` | 3 Dateien ✅ |
| PROJECT_STATUS.md hat `verifying-ui-quality` Spalte | ✅ |
| PROJECT_STATUS.md hat Skill-Log | ✅ |
| PROJECT_STATUS.md hat Screenshot-Evidenz-Tabelle | ✅ |
| Git commit + push | ✅ (d1aca38) |

---

## Was v3.2 NICHT löst (bewusst)

1. **Automatisierte Gate-Validation**: Gates werden weiterhin vom Agent selbst geprüft, nicht von einem externen System. Brudi ist ein Single-Agent-System — automatisierte Validation erfordert eine Orchestrierungs-Schicht.

2. **Deterministische Formulierungen**: 18 vage Formulierungen wurden identifiziert (z.B. "dokumentiert", "gelesen", "getestet"). Einige wurden durch die Evidence-Spezifikation konkretisiert, aber nicht alle. Vollständige Determinismus-Überarbeitung steht für v3.3 an.

3. **Rationalization Tables**: Counter-Argumente für typische Agent-Ausreden (z.B. "Der Monitor war zu breit für Mobile-Screenshots"). Existieren konzeptionell in SKILL_LEARNINGS.md, aber nicht in den Templates eingebaut.

4. **Multi-Agent-Orchestrierung**: Brudi ist ein Single-Agent-System. Für Production-Grade Enterprise-Readiness wäre ein Orchestrierungs-Layer (à la LangGraph/CrewAI) nötig. Geschätzter Aufwand: ~14 Wochen.
