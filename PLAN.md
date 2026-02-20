# Plan: Brudi — Nächste Phase (v0.4.0)

## Ausgangslage

**Was existiert:**
- 14 Skills live auf GitHub (alexejluft/brudi, public)
- Installationssystem fertig (install.sh, use.sh, INSTALL.md)
- CLAUDE.md + AGENTS.md als Einstiegspunkte

**Was fehlt:**
- 13 geplante Skills noch nicht gebaut (Phase 2–5)
- Nur 5 von 14 Skills haben Pressure Tests
- Kein Skill basiert auf echter Recherche — alles aus Erfahrung geschrieben

---

## Das Kernproblem: Behauptung vs. Beweis

Aktuell behauptet jeder Skill: "KI macht das falsch."
Beweis dafür: keiner. Das reicht nicht für "weltbestes Projekt."

**Der neue Standard:**
Jeder Skill muss auf echter, belegter Evidenz basieren.
Quellen: GitHub Issues, Stack Overflow, Postmortems, offizielle Docs.

---

## Der Prozess (für jeden neuen Skill)

```
Schritt 1: RECHERCHE
  → Parallele Agents recherchieren gleichzeitig
  → Quellen: GitHub Issues, Stack Overflow, Dev.to, offizielle Changelogs
  → Ergebnis: Liste der 3–5 häufigsten, schwersten, belegten Fehler

Schritt 2: PRESSURE TEST
  → 4 Szenarien aus Recherche-Ergebnissen destillieren
  → "Without skill" = dokumentiertes Verhalten, nicht Vermutung
  → Format identisch mit bestehenden Tests

Schritt 3: SKILL schreiben
  → Jedes Pattern adressiert einen recherchierten Fehler
  → < 120 Zeilen, verb-first, kein Padding
  → Jede Aussage belegbar

Schritt 4: Commit + Push
```

---

## Priorität der nächsten 3 Skills

### 1. `fetching-data-correctly` (höchste Priorität)

**Warum:** Datenabruf ist der Kern jeder App. Race Conditions und
stale Data sind die häufigsten Produktionsbugs in React-Apps.
FairSplit ist direkt betroffen — Echtzeit-Splits, Offline-Sync.

**Recherche-Fokus:**
- Race Conditions in useEffect (klassischer Fehler, gut dokumentiert)
- AbortController — wann notwendig, wie korrekt
- TanStack Query: häufige Misconfigurations (staleTime, gcTime, refetch)
- Optimistic Updates — Pattern und Rollback bei Fehler
- Stale data nach Navigation (Back-Button Problem)

**Erwartetes Skill-Ergebnis:**
- Wann useEffect für Fetch nie die richtige Antwort ist
- Korrektes TanStack Query Setup
- AbortController Pattern
- Optimistic Update mit Rollback

---

### 2. `crafting-typography` (visuell, sofort sichtbar)

**Warum:** Typografie ist der schnellste visuelle Unterschied zwischen
"KI-generiert" und "Designer war dabei."
KI setzt immer feste px-Werte, ignoriert Fluid Type, kennt keine Hierarchie.

**Recherche-Fokus:**
- Fluid Type Scale Methodik (utopia.fyi Ansatz)
- Variable Fonts: häufige Fehler beim Einbinden (FOUT, FOIT)
- Heading-Hierarchie die tatsächlich führt (nicht nur größer = wichtiger)
- Optical sizing, letter-spacing bei großen Headlines
- Kinetic Type ohne Performance-Probleme

**Erwartetes Skill-Ergebnis:**
- Fluid Type Scale mit clamp() für alle Heading-Level
- Variable Fonts korrekt laden (font-display, preload)
- Hierarchie-Regeln die KI nie anwendet
- Wann und wie Kinetic Type sinnvoll ist

---

### 3. `building-with-nextjs` (kritisch für App-Projekte)

**Warum:** Next.js App Router ist fundamental anders als Pages Router.
KI halluziniert ständig veraltete Patterns (getServerSideProps, etc.)
FairSplit läuft auf Next.js — direkt relevant.

**Recherche-Fokus:**
- RSC vs Client Component: wo ist die Grenze, wann falsch gezogen
- Data Fetching im App Router: fetch() in RSC, cache, revalidate
- Veraltete Patterns die KI noch schreibt (getServerSideProps, etc.)
- Route Groups, Parallel Routes — häufige Missverständnisse
- Metadata API korrekt nutzen (häufig falsch oder vergessen)

**Erwartetes Skill-Ergebnis:**
- Klare RSC/Client-Entscheidungsregel
- Korrektes Data Fetching mit fetch() + cache
- Die 5 veralteten Patterns die KI nie vergisst aber vergessen sollte
- Metadata Pattern für SEO

---

## Bestehende Skills nachrüsten (parallel zu neuen Skills)

5 bestehende Skills haben noch keinen Pressure Test:

| Skill | Recherche-Fokus |
|-------|-----------------|
| `typing-with-typescript` | Häufigste Type-Fehler in echten Codebases |
| `testing-user-interfaces` | Was KI beim Testen systematisch falsch macht |
| `optimizing-performance` | Real-world LCP/INP/CLS Fehler aus Produktionsdaten |
| `building-accessibly` | Häufigste WCAG-Verstöße in KI-generiertem Code |
| `building-layouts` | Grid/Flexbox Bugs die in Produktion auftauchen |

Vorgehen: Recherche → Test. Skill nur anpassen wenn Lücken gefunden.

---

## Was wir NICHT tun

- Keine Skills ohne Recherche-Basis schreiben
- Keine Pressure Tests die nur bestätigen was wir sowieso glauben
- Nicht mehr als 3 neue Skills gleichzeitig — Qualität vor Quantität
- Keine Recherche ohne konkretes Ergebnis (Liste belegter Fehler)

---

## Konkreter Ablauf der nächsten Ausführung

```
Block 1 — Recherche (3 Agents parallel, gleichzeitig gestartet)
  Agent A: fetching-data-correctly
  Agent B: crafting-typography
  Agent C: building-with-nextjs
  → Jeder Agent liefert: Liste der 3–5 belegten Fehlermuster

Block 2 — Pressure Tests (aus Recherche destilliert)
  → Je 4 Szenarien pro Skill
  → Format: identisch mit animating-interfaces-test.md
  → Parallel schreiben sobald Recherche fertig

Block 3 — Skills schreiben
  → Je < 120 Zeilen
  → Jedes Pattern = ein belegter Fehler + Lösung

Block 4 — Bestehende Skills nachrüsten
  → 5 fehlende Pressure Tests recherchieren und schreiben
  → Skills nur anpassen wo Recherche echte Lücken zeigt

Block 5 — Commit + Push
  → Version: v0.4.0
  → 17 Skills + 9 Pressure Tests, alle recherche-basiert
```

---

## Warum das Brudi zum weltbesten macht

Andere Skill-Pakete schreiben "best practices" aus dem Bauch.

Brudi schreibt:
"Dieser Fehler tritt dokumentiert und wiederholt in echten Projekten auf.
Hier ist der exakte Fix, warum er funktioniert, und was ohne ihn passiert."

Das ist der Unterschied zwischen Meinung und Beweis.
Beweis gewinnt.
