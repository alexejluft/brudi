# Brudi — Dein KI-Baukasten für hochwertige Websites

Brudi ist ein Skill-Paket, das deinen KI-Agenten (wie Claude) beibringt, professionelle und preisgekrönte Websites zu bauen. Statt dass die KI rät, hat sie klare Regeln und fertige Bausteine — das Ergebnis sind bessere Websites, schneller und günstiger.

---

## Was ist Brudi?

Brudi ist wie ein Lehrbuch für deinen KI-Agenten. Statt dass der Agent rät wie eine Website gebaut wird, hat er mit Brudi klare Regeln, Best Practices und fertige Bausteine. Das Ergebnis: professionelle, award-würdige Websites — schneller und günstiger. Du brauchst nur drei Schritte, um Brudi zu nutzen.

---

## Installation

### Schritt 1 — Brudi herunterladen

Öffne dein Terminal (das schwarze Fenster mit der Textzeile) und kopiere diesen Befehl hinein. Er lädt Brudi auf deinen Computer herunter.

```bash
git clone https://github.com/alexejluft/brudi.git
cd brudi
```

### Schritt 2 — Brudi installieren

Jetzt installieren wir Brudi mit einem einzigen Befehl. Das Script richtet alles automatisch ein — du musst das nur einmal machen.

```bash
bash scripts/setup-brudi.sh
```

Das Script installiert Brudi unter `~/.brudi/`. Ab jetzt findet dein KI-Agent alles automatisch. ✅ Brudi ist bereit!

---

## Neues Projekt starten

### Schritt 1 — Projektordner vorbereiten

Erstelle einen neuen Ordner für dein Projekt und kopiere die beiden Startdateien hinein — das sind die einzigen Dateien, die du brauchst.

```bash
mkdir ~/Projects/mein-projekt
cp ~/.brudi/templates/CLAUDE.md ~/Projects/mein-projekt/
cp ~/.brudi/templates/TASK.md ~/Projects/mein-projekt/
```

### Schritt 2 — Projektdetails ausfüllen

Öffne die Datei `CLAUDE.md` in deinem Projektordner. Dort findest du Platzhalter, die du mit deinen Projektdetails ausfüllst — Projektname, Farben, Zielgruppe und so weiter.

Keine Sorge — du musst nicht alles verstehen! Schau dir die Beispiel-Datei an (`CLAUDE.example.md` im selben `templates/` Ordner), dort siehst du wie eine ausgefüllte Version aussieht. Du kannst auch ChatGPT oder einen anderen KI-Assistenten bitten, dir beim Ausfüllen zu helfen.

### Schritt 3 — KI-Agent starten

Navigiere deinen KI-Agenten (z.B. Claude Code) zu deinem Projektordner und starte ihn.

```bash
cd ~/Projects/mein-projekt
claude
```

Dann sagst du dem Agenten einfach, was du bauen willst:

> Baue die Forma Studio Website

Der Agent liest automatisch deine `CLAUDE.md`, findet Brudi und fängt an zu arbeiten. Du kannst dich zurücklehnen und zusehen.

---

## Was steckt in Brudi?

📚 **60+ Skills** — Regeln und Best Practices für alles von Animationen bis SEO

🎨 **Professionelle Schriftarten** — Typografische Best Practices, sofort einsatzbereit

🌍 **Mehrsprachig** — Vorgefertigte Übersetzungen und lokalisierte Inhalte

⚖️ **Rechtstexte** — Impressum & Datenschutz Vorlagen für verschiedene Länder

🎬 **Animations-Bausteine** — GSAP, Framer Motion und Web Animations Techniken

⚙️ **Konfigurationen** — Tailwind v4 globals.css template, Design Tokens, CSS und JavaScript Grundlagen

---

## Fragen?

Wenn du Fragen hast, schau dir die Dokumentation in der `docs/` Ordner an oder öffne ein Issue auf GitHub. Das Brudi-Team hilft gerne weiter.

Viel Erfolg beim Bauen! 🚀
