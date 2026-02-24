# BRUDI — COMBINED FORENSIC MASTER REPORT

Author: Claude (Forensic Audit Mode)
Date: 2026-02-24
Scope: Layer 5 (AST Engine) + Layer 6 (Outcome Engine)
Method: Vollständige Quellcode-Autopsie, keine Tests, keine Erweiterung

---

## EXECUTIVE VERDICT

**Ist Brudi A) Echt Compiler-Level, B) Teilweise heuristisch, oder C) Oberflächlich implementiert?**

**Antwort: B — Teilweise heuristisch, mit einem echten Compiler-Level-Kern und mehreren oberflächlichen Lücken.**

Layer 5 Gesamtnote: **C+**
Layer 6 Gesamtnote: **B-**
Systemweite Vertrauensstufe: **EINGESCHRÄNKT VERTRAUENSWÜRDIG**

---

## PHASE 1 — AST ENGINE AUTOPSY (Layer 5)

### 1.1 jsx-analyzer.js — ECHT COMPILER-LEVEL

**Technologie-Stack:**
- `@babel/parser` (parse)
- `@babel/traverse` (traverse mit Visitor-Pattern)
- `@babel/types` (t.isXxx() Typ-Checks)

**Beweis:** Der JSX-Analyzer verwendet den vollständigen Babel-Toolchain korrekt. Die `traverse()`-Funktion wird mit einem Visitor-Objekt aufgerufen (`JSXAttribute`, `ObjectProperty`, `CallExpression`, `JSXOpeningElement`, `JSXElement`). Alle 9 Regeln verwenden `t.isXxx()`-Funktionen für strukturelle Node-Type-Prüfungen.

**9 implementierte Regeln:**

| Regel | Methode | AST-Level? |
|-------|---------|------------|
| NO_INLINE_STYLES | t.isJSXAttribute + t.isObjectExpression | JA |
| NO_HARDCODED_COLORS | t.isStringLiteral + isColorValue() | JA (mit Regex-Hilfsfunktion) |
| NO_HARDCODED_PX | t.isObjectProperty + Regex auf Wert | JA (mit Regex-Hilfsfunktion) |
| NO_LAYOUT_ANIMATION | t.isCallExpression + t.isMemberExpression | JA |
| NO_GSAP_FROM | t.isMemberExpression(gsap.from) | JA |
| NO_TRANSITION_ALL | t.isStringLiteral + Regex-Test | HYBRID |
| SECTION_NEEDS_ID | t.isJSXOpeningElement + Attribute-Check | JA |
| MAX_CHILDREN_PER_SECTION | t.isJSXElement + children.filter | JA |
| COMPONENT_DEPTH_CHECK | parentPath-Traversal | JA |

**Exception-Handling:** `style={{display: 'none'}}` wird korrekt ausgenommen. `0px` und `1px` werden bei NO_HARDCODED_PX ausgenommen. `var(--...)` wird bei Farb-Checks ausgenommen.

**Verdict: ECHT. Dies ist der einzige Analyzer, der den vollen Babel-Toolchain korrekt nutzt.**

---

### 1.2 ts-analyzer.js — TEILWEISE AST, KRITISCHER CLAIM-MISMATCH

**Behauptung im Prompt:** "Technologie: TypeScript Compiler API"
**Realität:** Verwendet `@babel/parser`, NICHT die TypeScript Compiler API (`ts.createProgram()`).

**Dies ist der gravierendste Befund der gesamten Audit.**

Die TypeScript Compiler API bietet:
- Vollständiges Type-Checking
- Type Inference
- Symbol Resolution
- Semantic Analysis

@babel/parser bietet:
- Syntaktisches Parsing
- Kein Type-Checking
- Keine Type Inference
- Keine semantische Analyse

**Zweites Problem:** Verwendet eine eigene `traverseNode()`-Funktion statt `@babel/traverse`. Diese manuelle Rekursion funktioniert, aber ohne Visitor-Pattern, ohne Scope-Tracking, ohne Path-Objekte.

**5 implementierte Regeln:**

| Regel | Methode | Funktional? |
|-------|---------|-------------|
| NO_ANY_TYPE | n.type === 'TSAnyKeyword' | JA — syntaktisch korrekt |
| NO_UNUSED_IMPORTS | Identifier-Sammlung | DEFEKT — siehe unten |
| NO_DEFAULT_EXPORT_ANON | ExportDefaultDeclaration Check | JA |
| NO_DEEP_NESTING | Rekursive Tiefenmessung | JA (mit Mehrfach-Report-Bug) |
| STRICT_MODE_CHECK | JSON.parse(tsconfig.json) | KEIN AST — Datei-Inhalt-Check |

**KRITISCHER BUG — NO_UNUSED_IMPORTS:**

```javascript
// Sammelt alle Import-Identifier
ast.program.body.forEach((node) => {
  if (node.type === 'ImportDeclaration') {
    node.specifiers.forEach((spec) => {
      imports.set(spec.local.name, {...});
    });
  }
});

// Sammelt ALLE Identifier im GESAMTEN AST
ast.program.body.forEach((node) => {
  traverseNode(node, (n) => {
    if (n.type === 'Identifier' && n.name) {
      usedIdentifiers.add(n.name);
    }
  });
});
```

**Problem:** Die zweite Schleife traversiert ALLE `program.body`-Nodes — inklusive der `ImportDeclaration`-Nodes selbst. Die Import-Specifier enthalten `local`-Identifier. Das bedeutet: Jeder importierte Name erscheint automatisch in `usedIdentifiers`, weil der Import-Specifier selbst ein Identifier-Node ist.

**Konsequenz: Diese Regel kann NIEMALS einen ungenutzten Import finden. Sie ist funktional tot.**

**Fehlende Regeln laut Prompt:**
- ❌ implicit any (benötigt Type Inference → TypeScript Compiler API)
- ❌ circular imports (existiert im Import-Graph-Analyzer, nicht hier)
- ❌ prop drilling > 3 levels (nicht implementiert)
- ❌ duplicated types (nicht implementiert)

**Verdict: CLAIM-MISMATCH. Keine TypeScript Compiler API. Eine Regel ist DEFEKT. 4 versprochene Regeln fehlen.**

---

### 1.3 tailwind-analyzer.js — HYBRID (AST + Regex)

**Behauptung im Prompt:** "Kein grep. Echte Class Tokenisierung."
**Realität:** AST-basierte className-Extraktion, dann Regex-basierte Validierung.

**Phase 1 — Extraktion (ECHT AST):**
- `@babel/parser` parsed die JSX-Datei
- `extractClassNameValues()` traversiert den AST manuell
- Findet `JSXAttribute` mit `name === 'className'`
- Verarbeitet: StringLiteral, JSXExpressionContainer, TemplateLiteral, cn()/clsx()/twMerge()
- Dies ist GENUINE AST-Analyse

**Phase 2 — Validierung (REGEX):**
- `tokenizeClasses()` ist `string.split(/\s+/)` — kein Tokenizer
- MAX_CONTAINER_VARIANTS: `/\bmax-w-(\w+)/g`
- SPACING_VARIANCE: `/\b(?:py|px|gap|...)-(\w+)/g`
- NO_ARBITRARY_VALUES: `/\b(?:w|h|p|m|...)-\[/g`
- MAX_GRID_COLS: `/\bgrid-cols-(\d+)/g`
- FONT_VARIANT_LIMIT: `/\btext-(xs|sm|...)\b/g`

**6 implementierte Regeln:**

| Regel | Extraktion | Validierung |
|-------|-----------|-------------|
| MAX_CONTAINER_VARIANTS | AST | Regex |
| SPACING_VARIANCE | AST | Regex |
| NO_ARBITRARY_VALUES | AST | Regex |
| MAX_GRID_COLS | AST | Regex |
| FONT_VARIANT_LIMIT | AST | Regex |
| TEXT_HIERARCHY_CHECK | AST | Scale-Mapping |

**"Echte Class Tokenisierung" existiert nicht.** Die Klassen werden per split() getrennt und per Regex gematcht. Eine echte Tokenisierung würde:
- Responsive Prefixes parsen (sm:, md:, lg:)
- State Variants parsen (hover:, focus:, active:)
- Arbitrary Values korrekt parsen ([123px])
- Negative Values parsen (-mt-4)

Nichts davon geschieht.

**Verdict: HYBRID. Die Extraktion ist AST-basiert (gut). Die Validierung ist Regex-basiert (nicht wie behauptet).**

---

### 1.4 token-analyzer.js — GEMISCHT

**4 implementierte Regeln:**

| Regel | Methode | AST-Level? |
|-------|---------|------------|
| HARDCODED_DURATION | ObjectProperty in gsap CallExpression | JA |
| HARDCODED_EASING | ObjectProperty in gsap CallExpression | JA |
| HARDCODED_COLOR_IN_JSX | Regex auf StringLiteral-Werte | HYBRID |
| TOKEN_DEFINED_NOT_USED | content.includes(token) | NEIN — String-Matching |

**Die GSAP-Checks** (Duration, Easing) sind echt AST-basiert: Sie prüfen `isGsapCall()` auf CallExpression → MemberExpression → object.name === 'gsap', dann iterieren sie über ObjectExpression.properties und prüfen key.name und value.type.

**TOKEN_DEFINED_NOT_USED** liest die tokens.ts-Datei, sammelt ExportNamedDeclaration-Identifier (AST), aber prüft dann per `content.includes(token)` ob der Token-Name irgendwo vorkommt. Das ist String-Matching, kein AST. False Positives möglich (z.B. Token-Name in einem Kommentar oder String).

**countTokenReferences** ist gemischt:
- MemberExpression mit object.name === 'token' → AST
- StringLiteral.value.includes('var(--') → String-Matching

**Verdict: GEMISCHT. GSAP-Regeln sind AST. Token-Usage ist String-Matching.**

---

### 1.5 import-graph-analyzer.js — ECHTE GRAPH-ANALYSE

**Kern-Algorithmus:**

```
buildDependencyGraph():
  Map<filePath, Set<importedFilePaths>>
  Verwendet ImportDeclaration AST-Nodes → resolveImportPath()

checkCircularDependencies():
  DFS mit visited + recursionStack Sets
  Korrekte Zyklenerkennung

checkDeepImportChain():
  Rekursive Tiefenmessung mit visited-Set für Zyklen-Schutz
```

**4 implementierte Regeln:**

| Regel | Methode | AST-Level? |
|-------|---------|------------|
| CIRCULAR_DEPENDENCY | DFS auf Import-Graph | JA (Graph-Algorithmus) |
| DEEP_IMPORT_CHAIN | Rekursive Tiefenmessung | JA |
| PRIMITIVES_NOT_USED | content.includes('primitives') | NEIN — String-Matching |
| DUPLICATE_IMPORT | Import-Count aus Graph | JA |

**resolveImportPath()** versucht Extensions (.ts, .tsx, .js, .jsx) und index-Dateien. Korrekt für relative Imports, skipped absolute Imports (node_modules). Kein Path-Alias-Support (z.B. @/ Imports).

**Toter Code:** Die `traverseNode()`-Funktion (Zeilen 321-338) wird in dieser Datei NIRGENDS aufgerufen.

**Verdict: GENUINE Graph-Analyse. Die Zyklenerkennung und Tiefenmessung sind echte Algorithmen. Primitives-Check ist heuristisch.**

---

## PHASE 2-4 — ZUSAMMENFASSUNG LAYER 5

### Antworten auf die 10 Forensic-Fragen (Layer 5):

**F1: Verwendet jeder Analyzer echtes AST-Parsing?**
- jsx-analyzer: JA (@babel/parser + @babel/traverse + @babel/types)
- ts-analyzer: TEILWEISE (@babel/parser, aber NICHT TypeScript Compiler API)
- tailwind-analyzer: TEILWEISE (AST für Extraktion, Regex für Validierung)
- token-analyzer: TEILWEISE (AST für GSAP, String-Matching für Token-Usage)
- import-graph-analyzer: JA (@babel/parser für Import-Extraktion)

**F2: Gibt es versteckte grep/regex Heuristiken?**
JA.
- tailwind-analyzer: 6 Regex-Validierungsfunktionen
- token-analyzer: colorRegex, content.includes()
- import-graph-analyzer: content.includes('primitives')
- ts-analyzer: JSON.parse für tsconfig

**F3: Gibt es defekte Regeln?**
JA.
- ts-analyzer NO_UNUSED_IMPORTS: Funktional tot (findet niemals etwas)
- dom-extractor.js colors: Metrik wird deklariert aber nie befüllt

**F4: Stimmen die Claims mit der Implementierung überein?**
NEIN.
- "TypeScript Compiler API" → @babel/parser (GRAVIEREND)
- "Echte Class Tokenisierung" → string.split() + Regex (GRAVIEREND)
- "prop drilling > 3 levels" → nicht implementiert
- "duplicated types" → nicht implementiert
- "implicit any" → nicht implementiert (benötigt TS Compiler API)

---

## PHASE 5 — OUTCOME ENGINE AUTOPSY (Layer 6)

### 5.1 dom-extractor.js — GENUINE BROWSER-BASIERTE EXTRAKTION

**Technologie:** Playwright mit `chromium.launch({ headless: true })`

**Beweis für echte DOM-Analyse:**
- `page.evaluate()` führt Code im Browser-Kontext aus
- `window.getComputedStyle()` liest tatsächlich berechnete Styles
- `getBoundingClientRect()` liefert echte Layout-Metriken
- Viewport: 1440×900 (Standard-Desktop)

**Extrahierte Metriken:**

| Metrik | Selektor | Methode |
|--------|----------|---------|
| headings | h1-h6 | getComputedStyle → fontSize, fontWeight, lineHeight |
| sections | section, [class*="section"], [id] | padding, height, childCount, rect |
| textElements | p, span, li, a, label, td, th | fontSize, lineHeight, color |
| grids | [class*="grid"] + display:grid | gridTemplateColumns, childRects |
| buttons | button, a[class*="btn"], [role="button"] | fontSize, padding, colors |

**DEFEKT — Colors-Metrik:**
```javascript
colors: new Set(),
// ... nirgendwo wird colors.add() aufgerufen
results.colors = [...results.colors]; // Immer leerer Array
```
Die `colors` Set wird initialisiert aber NIEMALS befüllt. Dies beeinflusst den Cognitive Load Score (ColorVariance ist immer 0).

**HEURISTIK — Grid-Detection:**
`querySelectorAll('[class*="grid"]')` matcht auf Klassennamen, nicht auf computed display-Style. Ein Element mit `display: grid` aber ohne "grid" im Klassennamen wird nicht erkannt. Umgekehrt: `class="grid-layout"` ohne `display: grid` würde initial gematcht (aber der display-Check filtert es).

**HEURISTIK — Section-Detection:**
`querySelectorAll('section, [class*="section"], [id]')` — jedes Element mit einem `id`-Attribut wird als potentielle Section erkannt. Das ist zu breit.

**Verdict: GENUINE Playwright-basierte Extraktion. Colors-Metrik ist defekt. Einige Selektoren sind heuristisch.**

---

### 5.2 typography-analyzer.js — GENUINE

Alle 5 Regeln arbeiten auf echten computed-style Daten:
- HEADING_HIERARCHY: Vergleicht durchschnittliche Font-Sizes
- HEADING_RATIO: Mathematisches Ratio ≥ 1.15
- BODY_TEXT_TOO_LARGE: Threshold > 24px
- FONT_VARIANCE: Zählt unique font sizes
- LINE_HEIGHT: Ratio 1.2-2.0

**Verdict: GENUINE. Alle Regeln basieren auf echten berechneten Werten.**

---

### 5.3 layout-analyzer.js — GENUINE

Alle 5 Regeln arbeiten auf echten getBoundingClientRect Daten:
- SECTION_OVERLOAD: Max 8 Sections in 3 Viewports
- SECTION_SPACING: Gap ≥ 48px
- GRID_TOO_DENSE: Max 4 Columns
- GRID_IMBALANCE: Height-Ratio max 2x
- DOUBLE_HERO: Keine zwei Hero-Sections nacheinander

**Verdict: GENUINE.**

---

### 5.4 animation-density-analyzer.js — FRAMEWORK OHNE DETECTION

**Kritischer Befund:** Dieser Analyzer erkennt KEINE Animationen selbst.

```javascript
export function analyzeAnimationDensity(metrics, animationCount) {
```

Der `animationCount` wird als Parameter übergeben. In `index.js`:
```javascript
const animationCount = options.animationCount || 0;
```

Im Standalone-Betrieb ist `animationCount` IMMER 0 (es sei denn, per CLI `--animations=N` übergeben).

**Konsequenz:** Alle 3 Regeln (ANIMATION_OVERLOAD, SECTION_ANIMATION_DENSITY, ANIMATION_RATIO) feuern NIE im normalen Betrieb, weil animationCount = 0.

**Die Animation-Detection existiert nicht.** Es gibt keinen Code, der CSS-Transitions, CSS-Animations oder JavaScript-Animationen aus dem DOM extrahiert.

**Verdict: FRAMEWORK-HÜLLE. Die Logik existiert, aber der Input fehlt.**

---

### 5.5 cognitive-load-analyzer.js — GENUINE FORMEL MIT DEFEKTEN INPUTS

**Formel:** `(Sections × 1.5) + (Animations × 1.2) + (FontVariance) + (GridVariance) + (ColorVariance × 1.2)`

Von 5 Variablen sind 2 DEFEKT:
- **Animations**: Immer 0 (keine Detection)
- **ColorVariance**: Immer 0 (colors Set nie befüllt)

**Effektive Formel:** `(Sections × 1.5) + (FontVariance) + (GridVariance)`

**Verdict: GENUINE Formel, aber 40% der Inputs sind tot.**

---

### 5.6 cta-analyzer.js — GENUINE

3 Regeln, alle auf echten DOM-Metriken:
- NO_CTA_ABOVE_FOLD: Position vs. Viewport
- CTA_TOO_SMALL: fontSize ≥ 16px
- CTA_LOW_PADDING: padding ≥ 20px

**Verdict: GENUINE.**

---

### 5.7 scoring-engine.js — FUNKTIONAL, SIMPEL

```javascript
let score = 100;
for (const v of allViolations) {
  score += (v.score_impact || 0); // score_impact ist negativ
}
score = Math.max(0, Math.min(100, score));
```

Lineares Abzugsmodell. Keine Gewichtung nach Kategorie, keine Normalisierung.

**Verdict: FUNKTIONAL. Simpel aber ausreichend für v1.0.**

---

## PHASE 6 — PERFORMANCE

Die package.json enthält korrekte Dependencies:
- @babel/parser, @babel/traverse, @babel/types für AST
- playwright für DOM-Extraktion

Performance kann nicht reproduziert werden (keine Node.js Runtime in dieser Umgebung), aber die Architektur ist:
- Layer 5: Sequentiell pro Datei, kein Caching, kein Worker-Thread-Parallelismus
- Layer 6: Ein Playwright-Browser-Start pro Aufruf (teuer)

**Erwartete Performance-Einschätzung:**
- Layer 5: ~200-500ms für 50-100 Dateien (angemessen)
- Layer 6: ~500-2000ms pro Seite (Playwright-Overhead)
- <3s Ziel für 500 Dateien: UNREALISTISCH ohne Parallelisierung

---

## PHASE 7 — FALSE POSITIVE ANALYSE

**Strukturelle False-Positive-Risiken:**

| Analyzer | Regel | Risiko | Grund |
|----------|-------|--------|-------|
| ts-analyzer | NO_UNUSED_IMPORTS | N/A | Regel ist tot — findet NIE etwas |
| ts-analyzer | STRICT_MODE_CHECK | HOCH | Findet kein tsconfig.json = Error. Monorepos mit tsconfig in Root? |
| tailwind | NO_ARBITRARY_VALUES | MITTEL | Arbitrary Values haben legitime Nutzung |
| tailwind | SPACING_VARIANCE | MITTEL | >6 Spacing-Werte können in komplexen Layouts nötig sein |
| token | TOKEN_DEFINED_NOT_USED | MITTEL | content.includes() matched auch in Kommentaren |
| import-graph | PRIMITIVES_NOT_USED | HOCH | content.includes('primitives') matched den String überall |
| dom-extractor | Section-Detection | HOCH | Jedes Element mit id-Attribut = Section |
| outcome | Animation-Regeln | N/A | Feuern nie (animationCount=0) |

---

## PHASE 8 — GATE WIRING

**brudi-gate.sh Zeilen 320-348:**

```bash
# Layer 5
local ast_engine="${brudi_dir}/orchestration/ast-engine/index.js"
if [ -f "$ast_engine" ] && command -v node &>/dev/null; then
  if ! node "$ast_engine" . --severity=error 2>&1; then
    die "AST enforcement gate failed..."
  fi
fi

# Layer 6
local outcome_engine="${brudi_dir}/orchestration/outcome-engine/index.js"
if [ -f "$outcome_engine" ] && command -v node &>/dev/null; then
  local html_file=""
  for candidate in "out/index.html" "dist/index.html" "..."; do
    if [ -f "$candidate" ]; then html_file="$candidate"; break; fi
  done
  if [ -n "$html_file" ]; then
    if ! node "$outcome_engine" "$html_file" 2>&1; then
      die "Outcome quality gate failed..."
    fi
  fi
fi
```

**Befunde:**

1. **SOFT GATES:** Beide Layer sind `if [ -f ]`-bedingt. Wenn die Datei nicht existiert, wird der Gate STILLSCHWEIGEND übersprungen. Kein Fehler, keine Warnung. Ein Agent der die Dateien löscht umgeht beide Gates.

2. **BRUDI_DIR:** `local brudi_dir="${BRUDI_DIR:-${HOME}/Brudi}"` — Default ist `${HOME}/Brudi` (mit großem B). Wenn das Repo unter `/Users/alexejluft/AI/Claude/brudi` (kleines b) liegt und BRUDI_DIR nicht gesetzt ist, werden beide Engines NICHT GEFUNDEN und STILLSCHWEIGEND ÜBERSPRUNGEN.

3. **Layer 6 HTML-Discovery:** Sucht in `out/`, `dist/`, `.next/server/app/`, `public/`. Wenn kein HTML gefunden wird: "Outcome engine skipped". Kein Fehler. Ein Projekt ohne Build-Output umgeht Layer 6 komplett.

4. **AST Engine arbeitet auf `.`:** `node "$ast_engine" .` analysiert das aktuelle Verzeichnis. Korrekt, wenn im Projekt-Root ausgeführt.

5. **Kein Rückkanal:** Layer 5 Violations werden nicht an Layer 6 weitergegeben. Keine animation-Count-Brücke zwischen AST Engine (die GSAP-Calls zählt) und Outcome Engine (die animationCount braucht).

---

## SEVERITY-MATRIX — ALLE BEFUNDE

### KRITISCH (Blockierend für "Compiler-Level" Claim)

| # | Befund | Betrifft |
|---|--------|----------|
| K1 | TypeScript Compiler API NICHT VERWENDET | ts-analyzer.js |
| K2 | "Echte Class Tokenisierung" NICHT IMPLEMENTIERT | tailwind-analyzer.js |
| K3 | NO_UNUSED_IMPORTS ist FUNKTIONAL TOT | ts-analyzer.js |
| K4 | Animation-Detection NICHT IMPLEMENTIERT | animation-density-analyzer.js |
| K5 | Colors-Metrik NIE BEFÜLLT | dom-extractor.js |

### HOCH (Signifikante Lücken)

| # | Befund | Betrifft |
|---|--------|----------|
| H1 | Soft Gates — stillschweigendes Überspringen | brudi-gate.sh |
| H2 | BRUDI_DIR Default stimmt nicht mit Pfad überein | brudi-gate.sh |
| H3 | Kein Rückkanal AST→Outcome (animationCount) | Architektur |
| H4 | 4 versprochene TS-Regeln fehlen | ts-analyzer.js |
| H5 | Cognitive Load Formel 40% tot | cognitive-load-analyzer.js |

### MITTEL (Verbesserungsbedarf)

| # | Befund | Betrifft |
|---|--------|----------|
| M1 | Token-Usage prüft per String-Matching, nicht AST | token-analyzer.js |
| M2 | Primitives-Check per String-Matching | import-graph-analyzer.js |
| M3 | Section-Detection zu breit (jedes id-Element) | dom-extractor.js |
| M4 | Kein Path-Alias-Support (@/ Imports) | import-graph-analyzer.js |
| M5 | Toter Code (traverseNode in import-graph) | import-graph-analyzer.js |
| M6 | Deep Nesting Mehrfach-Report-Bug | ts-analyzer.js |

### NIEDRIG (Kosmetisch)

| # | Befund | Betrifft |
|---|--------|----------|
| N1 | package.json Scripts referenzieren .ts, Dateien sind .js | ast-engine/package.json |
| N2 | Scoring-Modell ist rein linear ohne Gewichtung | scoring-engine.js |

---

## GESAMTBEWERTUNG

### Layer 5 — AST Engine

| Analyzer | Technologie-Claim | Realität | Note |
|----------|------------------|----------|------|
| jsx-analyzer | @babel/parser + traverse | @babel/parser + traverse + types | **A** |
| ts-analyzer | TypeScript Compiler API | @babel/parser (!) | **D** |
| tailwind-analyzer | Echte Class Tokenisierung | AST-Extraktion + Regex | **C+** |
| token-analyzer | AST-basiert | Gemischt AST + String | **C** |
| import-graph-analyzer | Graph-Analyse | Echte Graph-Algorithmen | **B+** |

**Layer 5 Gesamtnote: C+**
1 von 5 Analyzern ist vollständig Compiler-Level. 1 ist überwiegend echt. 3 sind hybrid oder defekt.

### Layer 6 — Outcome Engine

| Modul | Claim | Realität | Note |
|-------|-------|----------|------|
| dom-extractor | Playwright DOM | Echtes Playwright + getComputedStyle | **B+** |
| typography-analyzer | Computed Styles | Genuine | **A** |
| layout-analyzer | BoundingClientRect | Genuine | **A** |
| animation-density | Animation Detection | Kein Input — Framework-Hülle | **F** |
| cognitive-load | Multi-Faktor-Formel | 40% tote Inputs | **C** |
| cta-analyzer | DOM-Metriken | Genuine | **A** |
| scoring-engine | Score 0-100 | Funktional, simpel | **B** |

**Layer 6 Gesamtnote: B-**
Kern-Module (Typography, Layout, CTA) sind genuine. Animation-Detection fehlt komplett. Colors-Metrik ist defekt.

---

## FINALE ANTWORT

**Frage: Ist Brudi echt Compiler-Level?**

**Antwort:** Brudi ist ein HYBRID-SYSTEM mit einem echten Compiler-Level-Kern (jsx-analyzer, import-graph) und mehreren heuristischen bzw. defekten Komponenten.

**Was ECHT ist:**
- JSX-Analyse via @babel/traverse mit vollem Visitor-Pattern
- Import-Graph mit DFS-Zyklenerkennung
- Playwright-basierte DOM-Extraktion mit getComputedStyle
- Typography- und Layout-Analyse auf echten computed styles

**Was NICHT das ist, was behauptet wird:**
- Keine TypeScript Compiler API (nur syntaktisches Babel-Parsing)
- Keine echte Tailwind-Class-Tokenisierung (Regex auf Strings)
- Keine Animation-Detection im Outcome Engine
- Eine defekte Regel (unused imports) die nie feuert
- Eine nie befüllte Metrik (colors)

**Was FEHLT:**
- implicit any Detection (benötigt TS Compiler API)
- prop drilling Detection
- duplicated types Detection
- CSS/JS Animation-Erkennung aus dem DOM
- Rückkanal zwischen Layer 5 und Layer 6
- Hard Gates (derzeit stillschweigend übersprungen wenn Dateien fehlen)

**Trust Level: EINGESCHRÄNKT.**
Brudi erkennt die offensichtlichen Violations zuverlässig (inline styles, hardcoded colors, gsap.from, circular dependencies, heading hierarchy, layout density). Aber die Tiefe der Analyse entspricht nicht durchgehend dem "Compiler-Ingenieur"-Anspruch.

---

*Keine Diplomatie. Keine Verteidigung. Nur Wahrheit.*
