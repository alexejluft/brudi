# Skill-Entwicklung — Arbeitsplan

**Stand:** v0.1.0 (2026-02-20)
**Status:** Lebendiges System — nie "fertig"

---

## Die richtige Perspektive

Die 5.132 Zeilen sind **Version 0.1** — ein Startpunkt, kein Endpunkt.

Über Wochen und Monate wächst dieses System durch:
- Echte Projekte (FairSplit, Zouk Website, neue Aufgaben)
- Neue Learnings (Cron Sessions, Recherche)
- Fehler und deren Lektionen
- Feedback aus der Anwendung

**Siehe:** `SKILL_EVOLUTION.md` für den kontinuierlichen Prozess.

---

---

## Reihenfolge (nach Abhängigkeit)

| # | Skill | Warum diese Reihenfolge | Status |
|---|-------|------------------------|--------|
| 0 | brudi-webdev | Entry Point | ✅ Done |
| 1 | webdev-design | Grundlage für alles visuelle | ✅ Done |
| 2 | **webdev-css** | Fundament für Layout & Animation | ✅ Done (540 Zeilen) |
| 3 | **webdev-animation** | Baut auf CSS auf | ✅ Done (634 Zeilen) |
| 4 | **webdev-react** | Frontend Framework | ✅ Done (620 Zeilen) |
| 5 | **webdev-typescript** | Types für React | ✅ Done (575 Zeilen) |
| 6 | **webdev-testing** | QA | ✅ Done (533 Zeilen) |
| 7 | **webdev-performance** | Optimization | ✅ Done (429 Zeilen) |
| 8 | **webdev-a11y** | Accessibility | ✅ Done (456 Zeilen) |

---

## Pro Session: Ein Skill, 100%

### Was "100% fertig" bedeutet:

1. **SKILL.md komplett** — Frontmatter, alle Sections
2. **Echte Code-Beispiele** — Aus meinem Wissen, nicht generisch
3. **Anti-Patterns** — Was NICHT zu tun ist
4. **Checklists** — Actionable Workflows
5. **Selbst-Test:** Könnte eine andere KI damit arbeiten?

### Session-Ablauf:

```
1. Lies knowledge.ts für das Thema
2. Extrahiere alle relevanten Learnings
3. Schreibe SKILL.md vollständig
4. Review: Fehlt was? Ist es actionable?
5. Commit: "skill: webdev-X complete"
```

---

## JETZT: webdev-css

### Was ich abdecken muss:

Aus meinem Wissen (knowledge.ts + craft/):
- [ ] CSS Grid (fr, lines, justify/align)
- [ ] Container Queries (containment, inline-size, cq units)
- [ ] Custom Properties (CSS Variables, Theming)
- [ ] Flexbox (wann Grid, wann Flex)
- [ ] Modern CSS (color-mix, oklch, clamp, min/max)
- [ ] Responsive ohne Media Queries (fluid typography, container queries)
- [ ] Layout Patterns (Stack, Cluster, Sidebar, etc.)

### Was ich NICHT abdecke (andere Skills):
- Animation → webdev-animation
- Typography Choices → webdev-design
- Performance → webdev-performance

### Ziel-Umfang:
~400-500 Zeilen, vollständig, actionable

---

## Spätere Sessions

Jede Session hat EIN Ziel:

| Session | Ziel | Input |
|---------|------|-------|
| Nächste | webdev-animation | GSAP, Lenis, Scroll-driven aus knowledge.ts |
| +1 | webdev-react | RSC, Hooks, Composition aus knowledge.ts |
| +2 | webdev-typescript | Utility Types aus knowledge.ts |
| +3 | webdev-testing | Vitest, Testing Library aus knowledge.ts |
| +4 | webdev-performance | Core Web Vitals, Lighthouse |
| +5 | webdev-a11y | WCAG, ARIA, reduced-motion |

---

## Nach allen Skills: Integration

Wenn alle 8 Skills fertig:
1. README.md für das Repository
2. Installation Instructions
3. GitHub Repository erstellen
4. Version 1.0.0 taggen

---

*Ein Skill pro Session. Keine Kompromisse.*
