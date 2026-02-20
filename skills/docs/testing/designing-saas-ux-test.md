# Pressure Test: designing-saas-ux

Evidenz-Basis: Samuel Hulick UserOnboard Teardowns, Lincoln Murphy (Free Trial Research),
Patrick Campbell ProfitWell (744 Pricing Pages analysiert), Google Material Design Empty States,
Shopify Polaris Empty State Component, Linear Docs, Stripe Dashboard Docs, Nielsen Norman Group (IA).

---

## Scenario 1: Onboarding — Kreditkarte vor erstem Wert

**Prompt:**
"Baue ein Onboarding für unsere SaaS App. User muss sich registrieren und loslegen können."

**Expected WITHOUT skill:**
```
1. E-Mail + Passwort
2. E-Mail bestätigen (Klick im Postfach nötig)
3. Kreditkarte eingeben
4. Plan auswählen
5. Profil anlegen
6. ← Erst hier: Produkt sehen
```
- 27% aller Sign-ups bestätigen die E-Mail nie (ProductLed Research)
- 62.5% der User brechen vor dem "Aha Moment" ab
- Lincoln Murphy: "Free Trials are about building trust — CC vor dem Produkt ist ein Non-Starter"

**Expected WITH skill:**
```
Ziel: So schnell wie möglich zum ersten Wert kommen

1. E-Mail + Name (kein Passwort — Magic Link oder Google OAuth)
2. ← Sofort: Produkt mit Demo-Daten sichtbar
3. Onboarding Checklist (optional, 3-5 Punkte)
   ✓ Erstes Projekt erstellt
   ✓ Team-Mitglied eingeladen
   ✓ Integration verbunden
4. Kreditkarte nur wenn User konvertieren will
```
- Magic Link statt Passwort: kein E-Mail-Bestätigungsschritt
- Demo-Daten zeigen sofort wie das Produkt aussieht wenn es befüllt ist
- Sked Social: User die Onboarding-Checkliste abschlossen → 3x höhere Conversion
- Keine CC bis User den Wert erlebt hat

---

## Scenario 2: Pricing Page — zu viele Tiers, kein Empfohlener Plan

**Prompt:**
"Baue eine Pricing-Seite für unsere SaaS mit 5 Plänen: Starter, Basic, Pro, Business, Enterprise."

**Expected WITHOUT skill:**
```
| Starter | Basic | Pro | Business | Enterprise |
| $9/mo   | $19   | $49 | $99      | Custom     |

(5 Tiers — alle gleichwertig dargestellt, kein Highlight, Feature-Listen ohne "Best for" Erklärung)
```
- ProfitWell: 512 SaaS analysiert — 3 Tiers = 30% höherer ARPU als 4+
- ConversionXL: Wechsel von 4 zu 3 Tiers → +27% Conversion
- Decision Paralysis: User können in 30 Sekunden nicht entscheiden

**Expected WITH skill:**
```
3 Tiers — Enterprise als Anker optional
Von teuer nach günstig (höherer Revenue laut ProfitWell)

| Pro           | Starter     | Enterprise  |
| $49/mo        | $9/mo       | Kontakt     |
| ★ EMPFOHLEN  |             |             |
| Für Teams     | Für Solo    | Für Konzerne|
| 1-50 User     | 1 User      |             |

Social Proof: Kundenzitate direkt unter den Tiers
Trust Badges: "SOC2", "GDPR", "14-Tage Gratis" nahe dem CTA
```
- Empfohlener Tier visuell hervorgehoben (Farbe, Badge, leicht größer)
- "Best for:" / "Für:" — User können sich selbst einordnen
- Intercom: Konsolidierung von 6 auf 3 Pläne → +17% Conversion sofort

---

## Scenario 3: Empty States — leere Seite ohne Kontext

**Prompt:**
"Der User hat sich gerade registriert und sieht zum ersten Mal das Dashboard."

**Expected WITHOUT skill:**
```
Dashboard

[Leerer Bereich]

"Keine Daten vorhanden."
```
- User weiß nicht was das Dashboard zeigen wird
- Keine Handlungsaufforderung — kognitiver Stillstand
- Sieht aus wie ein Fehler

**Expected WITH skill (nach Shopify Polaris + Material Design Pattern):**
```
Dashboard

[Illustration: Dashboard mit Beispiel-Charts / Icons]

"Hier siehst du deine Projekte und Team-Aktivität"
Sobald du dein erstes Projekt startest, erscheint es hier.

[Erstes Projekt erstellen →]          [Demo-Daten laden]
```

Shopify Polaris Empty State enthält:
- Headline (was dieser Bereich ist)
- Kurze Beschreibung (was der User hier tun kann)
- Primary CTA (1 Haupt-Aktion)
- Optional: Secondary Action ("Mehr erfahren")
- Illustration (zeigt wie der Bereich aussieht wenn befüllt)

Material Design: "If the purpose isn't conveyed through an image and tagline,
show educational content instead"

Demo-Daten sind besser als leere States:
- Notion: Neuer Workspace mit Beispiel-Seiten
- Trello: Welcome Board mit Demo-Cards
- Asana: Erstes Dashboard mit Beispiel-Projekten

---

## Scenario 4: Settings — User und Org-Settings vermischt

**Prompt:**
"Baue eine Settings-Seite für die SaaS App."

**Expected WITHOUT skill:**
```
Settings (flach, alles zusammen)
├── Profil
├── Passwort
├── Benachrichtigungen
├── Billing          ← Persönlich oder Org?
├── Team verwalten   ← Persönlich oder Org?
├── API Keys         ← Persönlich oder Org?
├── Integrationen
└── Sprache
```
- Billing, Team, API Keys = Org-Ebene — gehören nicht neben "Passwort"
- Keine RBAC: normale User sehen Billing und Team-Management
- Flache Struktur skaliert nicht bei wachsenden Settings

**Expected WITH skill (Pattern: Linear + Stripe):**
```
Account (persönlich — nur dieser User)
├── Profil (Name, Avatar, E-Mail)
├── Passwort & Sicherheit
├── Benachrichtigungen
├── Erscheinungsbild (Dark Mode, Sprache)
└── Aktive Sessions

Workspace (Organisation — nur Owner/Admin sehen das)
├── Allgemein (Name, Logo, Domain)
├── Team (Mitglieder einladen, Rollen)
├── Billing (Plan, Zahlungsmethode, Rechnungen)
├── API & Integrationen
└── Sicherheit (SSO, 2FA Policy)
```
- Klare Trennung: "Account" = diese Person, "Workspace" = die Organisation
- RBAC: `member` sieht Workspace-Settings nicht (nur Owner/Admin)
- Billing unter Workspace: richtig — es bezahlt die Organisation, nicht der User
- Nielsen Norman Group: "Alle Navigationskategorien müssen spezifisch und
  mutual exclusive sein, damit User ohne Zögern navigieren können"

---

## Test Results

**Scenario 1:** ❌ CC-Gate + E-Mail-Bestätigung vor Produkt — 62.5% Abbruch vor Aha-Moment
**Scenario 2:** ❌ 5 gleichwertige Tiers, kein Highlight — Decision Paralysis, -27% Conversion
**Scenario 3:** ❌ "Keine Daten vorhanden." — kein Kontext, keine CTA, sieht wie Fehler aus
**Scenario 4:** ❌ Billing und Team-Settings neben Passwort — falsche Trennung, kein RBAC
