# BRUDI — Mein Entwicklungsprojekt

**Pfad:** `/Users/alexejluft/AI/Brudi Workspace/projects/brudi/`

---

## Zwei Teile, ein Ziel

```
brudi/
├── skills/           # 🔧 WERKSTATT — Das Produkt
│                     #    Installierbares Skill-System
│                     #    Das was andere nutzen werden
│
└── playground/       # 🎮 SPIELWIESE — Wo ich übe
                      #    Astro Website zum Lernen
                      #    Hier teste ich mein Wissen
```

---

## 🔧 SKILLS (Werkstatt)

**Zweck:** Das installierbare Skill-System für AI Agents
**Ziel:** Andere können das installieren und sofort bessere Websites bauen

```
skills/
├── BOOTSTRAP.md              ← Einstieg
├── README.md                 ← Öffentliche Beschreibung
├── docs/
│   ├── philosophy.md
│   ├── contributing.md
│   ├── testing/              ← Pressure Tests
│   └── internal/             ← Meine Pläne
└── skills/
    ├── building-layouts/
    ├── designing-for-awards/
    ├── animating-interfaces/
    └── ...
```

**Regeln:**
- Jeder Skill < 120 Zeilen
- TDD-getestet mit Pressure Scenarios
- "Use when..." Descriptions
- Verb-first Naming

---

## 🎮 PLAYGROUND (Spielwiese)

**Zweck:** Hier lerne ich, experimentiere, teste mein Wissen
**Ziel:** Praktische Anwendung bevor es in Skills fließt

```
playground/
├── src/pages/
│   ├── index.astro           ← Homepage
│   ├── knowledge.astro       ← Knowledge Index
│   ├── duo/                  ← Alex & Brudi Website
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── ...
│   └── [learning-pages]/     ← Grid, RSC, Testing, etc.
└── src/layouts/
```

**Workflow:**
1. Ich lerne etwas Neues (z.B. Container Queries)
2. Ich baue eine Seite in playground/ (container-queries.astro)
3. Wenn ich es WIRKLICH verstehe → Skill in skills/ erstellen
4. /duo wendet die Skills praktisch an

---

## Der Workflow

```
Neues Thema
    │
    ▼
┌─────────────────────────┐
│  PLAYGROUND             │
│  - Learning Page bauen  │
│  - Experimentieren      │
│  - Verstehen            │
└─────────────────────────┘
    │
    │ Wenn verstanden
    ▼
┌─────────────────────────┐
│  SKILLS                 │
│  - Pressure Test        │
│  - Skill schreiben      │
│  - TDD verifizieren     │
└─────────────────────────┘
    │
    │ Skill fertig
    ▼
┌─────────────────────────┐
│  /DUO anwenden          │
│  - Echtes Projekt       │
│  - Beweis des Könnens   │
└─────────────────────────┘
```

---

## NIEMALS VERGESSEN

| Teil | Zweck | Löschen? |
|------|-------|----------|
| skills/ | Das Produkt | ❌ NIE ohne Backup |
| playground/ | Übungsplatz | ❌ NIE ohne Backup |
| /duo | Beweis | ❌ Das ist unser Showcase |

**Vor jeder großen Änderung:** `git tag backup-DATUM`

---

## Wenn ich mein Gedächtnis verliere

Alex sagt: "Lies `projects/brudi/README.md`"

Dann weiß ich:
1. skills/ = Das Produkt (Skill-System)
2. playground/ = Wo ich lerne (Website)
3. /duo = Beweis unseres Könnens

---

*Ein Ort. Klare Trennung. Kein Chaos.*
