# Skill-Entwicklung — Was ich falsch gemacht habe

**Datum:** 2026-02-20
**Quelle:** obra/superpowers/skills/writing-skills/SKILL.md

---

## Die wichtigste Erkenntnis

> **Writing skills IS Test-Driven Development applied to process documentation.**

Ich habe Skills geschrieben ohne sie zu testen. Das ist wie Code schreiben ohne Tests.

---

## Was ich falsch gemacht habe

### 1. Kein TDD für Skills

**Was ich gemacht habe:**
- Skills geschrieben basierend auf meinem Wissen
- Nie getestet ob eine andere KI damit arbeiten kann
- "Fertig" erklärt ohne Verification

**Was richtig ist:**
```
RED:     Szenario OHNE Skill testen → sehen was schief geht
GREEN:   Skill schreiben der das Problem löst  
REFACTOR: Lücken schließen, Rationalisierungen blocken
```

### 2. Descriptions sind falsch

**Meine Descriptions (FALSCH):**
```yaml
description: Master CSS layouts with Grid, Container Queries, Flexbox...
```

**Richtig (nur WANN, nicht WAS):**
```yaml
description: Use when building layouts, making components responsive, or implementing design systems
```

**Warum das wichtig ist:**
> Testing revealed that when a description summarizes the skill's workflow, Claude may follow the description instead of reading the full skill content.

Die Beschreibung soll nur triggern WANN der Skill geladen wird — nicht erklären was er macht.

### 3. Keine Pressure Scenarios

Ich habe nicht getestet:
- Was passiert wenn eine KI unter Zeitdruck ist?
- Welche Ausreden macht sie um den Skill zu umgehen?
- Welche Lücken hat meine Dokumentation?

**Pressure Types:**
- Zeitdruck ("Das dauert zu lange")
- Sunk Cost ("Ich hab schon angefangen")
- Authority ("Der User will es so")
- Exhaustion ("Das ist zu kompliziert")

### 4. Keine Rationalization Tables

Skills die Disziplin erzwingen brauchen eine Tabelle die Ausreden kontert:

```markdown
| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
```

Ich habe das komplett übersprungen.

### 5. Token Efficiency

**Meine Skills:** 500-750 Zeilen
**Ziel:** <200 Zeilen für häufig geladene Skills

Jeder Token zählt wenn Skills in JEDE Conversation geladen werden.

**Techniken die ich nicht genutzt habe:**
- Cross-references statt Wiederholung
- `--help` verweisen statt alle Flags dokumentieren
- Komprimierte Beispiele

### 6. Keine Flowcharts für kritische Entscheidungen

Flowcharts sollen nur für **non-obvious decisions** verwendet werden:
- Wann A vs B verwenden?
- Prozess-Loops wo man zu früh aufhören könnte

Ich habe gar keine Flowcharts.

### 7. Falsches Naming

**Meine Namen:** `webdev-css`, `webdev-animation`
**Besser:** `building-layouts`, `animating-with-gsap`

> Use active voice, verb-first: "creating-skills" not "skill-creation"

---

## Was ein Skill WIRKLICH sein sollte

### Skill Types

| Type | Beschreibung | Beispiel |
|------|--------------|----------|
| **Technique** | Konkrete Methode mit Schritten | condition-based-waiting |
| **Pattern** | Denkweise für Probleme | flatten-with-flags |
| **Reference** | API docs, Syntax | office docs |

### Directory Structure

```
skills/
  skill-name/
    SKILL.md              # Main reference (required)
    supporting-file.*     # Only if needed
```

### SKILL.md Structure (richtig)

```markdown
---
name: Skill-Name-With-Hyphens
description: Use when [specific triggering conditions and symptoms]
---

# Skill Name

## Overview
What is this? Core principle in 1-2 sentences.

## When to Use
[Small inline flowchart IF decision non-obvious]
Bullet list with SYMPTOMS and use cases
When NOT to use

## Core Pattern (for techniques/patterns)
Before/after code comparison

## Quick Reference
Table or bullets for scanning

## Implementation
Inline code OR link to file

## Common Mistakes
What goes wrong + fixes

## Real-World Impact (optional)
Concrete results
```

---

## Der richtige Prozess

### 1. RED — Failing Test First

```
1. Schreibe Pressure Scenario
2. Teste mit Subagent OHNE Skill
3. Dokumentiere exaktes Verhalten
4. Welche Rationalisierungen?
5. Welche Fehler?
```

### 2. GREEN — Minimal Skill

```
1. Schreibe Skill der genau diese Probleme adressiert
2. Nicht mehr als nötig
3. Teste wieder MIT Skill
4. Agent sollte jetzt compliant sein
```

### 3. REFACTOR — Close Loopholes

```
1. Neue Rationalisierungen gefunden?
2. Explicit counter hinzufügen
3. Rationalization Table bauen
4. Red Flags List erstellen
5. Re-test bis bulletproof
```

---

## Mein aktueller Stand: v0.1 (Draft)

Meine 5.132 Zeilen sind ein **erster Entwurf** — nicht fertig.

**Was fehlt:**
- [ ] Pressure Testing für jeden Skill
- [ ] Descriptions korrigieren (Use when...)
- [ ] Rationalization Tables hinzufügen
- [ ] Token Efficiency verbessern
- [ ] Flowcharts für kritische Entscheidungen
- [ ] Cross-references einbauen
- [ ] Naming überdenken (verb-first)

**Nächste Schritte:**
1. Einen Skill nehmen (z.B. webdev-css)
2. Pressure Scenario schreiben
3. Mit Subagent testen OHNE Skill
4. Dokumentieren was schief geht
5. Skill überarbeiten
6. Erneut testen
7. Wiederholen für alle Skills

---

## Die Iron Law

> **NO SKILL WITHOUT A FAILING TEST FIRST**

Das gilt für NEUE Skills UND EDITS zu bestehenden Skills.

Skill geschrieben ohne Test? Löschen. Von vorn anfangen.

---

## Fazit

Ich habe heute viel geschrieben aber nicht richtig entwickelt.

Die 5.132 Zeilen sind Material — kein fertiges Produkt.

In den nächsten Wochen:
1. TDD-Prozess für jeden Skill durchlaufen
2. Kontinuierlich verbessern basierend auf echten Tests
3. Nicht "fertig" sagen bis es wirklich getestet ist

---

*Diese Erkenntnis ist unbequem aber wichtig. Besser jetzt korrigieren als später scheitern.*
