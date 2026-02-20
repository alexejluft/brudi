# MASTERPLAN — brudi-webdev Skills

**Stand:** 2026-02-20 14:50
**Pfad:** `/Users/alexejluft/AI/Brudi Workspace/projects/brudi/`

---

## Aktuelle Struktur

```
projects/brudi/
├── README.md              ← Übersicht (lies das zuerst)
├── skills/                🔧 WERKSTATT (das Produkt)
│   ├── BOOTSTRAP.md       ← Einstieg für Skills
│   ├── skills/            ← 8 installierbare Skills
│   └── docs/              ← Pläne, Tests, Philosophy
└── playground/            🎮 SPIELWIESE (wo ich übe)
    └── src/pages/
        ├── duo/           ← Alex & Brudi Website
        └── [learning-pages]
```

---

## Status

### Skills (827 Zeilen total)

| Skill | Zeilen | TDD Test |
|-------|--------|----------|
| building-layouts | 99 | ✅ |
| designing-for-awards | 102 | ✅ |
| animating-interfaces | 111 | ✅ |
| developing-with-react | 99 | ✅ |
| typing-with-typescript | 107 | ⏳ |
| testing-user-interfaces | 97 | ⏳ |
| optimizing-performance | 104 | ⏳ |
| building-accessibly | 108 | ⏳ |

### Playground

- /duo wiederhergestellt
- Learning Pages vorhanden
- Nicht deployed (lokal)

---

## Nächste Schritte (in logischer Reihenfolge)

```
1. Skills praktisch TESTEN     ← Beweisen dass sie funktionieren
         ↓
2. Basierend auf Tests VERBESSERN
         ↓
3. Remaining TDD Tests (4 Skills)
         ↓
4. DANN erst GitHub pushen     ← Wenn verifiziert
```

**Regel:** Nicht veröffentlichen bevor getestet.

---

## Workflow

### Neues Thema lernen

```
playground/  →  Experimentieren, Learning Page bauen
     ↓
skills/      →  Wenn verstanden: Skill erstellen, TDD testen
     ↓
/duo         →  Skill praktisch anwenden
```

### Skill-Entwicklung (TDD)

```
1. Pressure Scenario schreiben
2. Testen OHNE Skill — was geht schief?
3. Skill schreiben der das löst
4. Testen MIT Skill — funktioniert es?
5. Lücken schließen
```

---

## Regeln

- **< 120 Zeilen** pro Skill
- **"Use when..."** Descriptions
- **Verb-first** Naming (building-, designing-, testing-)
- **Testen vor Pushen**
- **Planen vor Bauen**

---

## Bei Gedächtnisverlust

Alex sagt: "Lies `projects/brudi/README.md`"

Dann:
1. `brudi/skills/BOOTSTRAP.md` für Skills-Kontext
2. `brudi/skills/docs/internal/MASTERPLAN.md` (dieses Dokument) für den Plan

---

*Logik > Laune. Testen > Pushen. Planen > Bauen.*
