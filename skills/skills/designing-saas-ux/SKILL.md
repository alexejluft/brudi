---
name: designing-saas-ux
description: Use when designing SaaS onboarding, pricing pages, empty states, or settings architecture. AI gates users behind credit cards before showing value, builds 5-tier pricing without a recommended plan, shows blank "no data" screens, and mixes user settings with organization settings.
---

# Designing SaaS UX

## The Rule

Four UX moments define first-week stay/leave. Each has documented patterns.

---

## Onboarding — Value Before Friction

```
❌ Credit card → email confirmation → plan selection → profile → product
   62.5% of users abandon before reaching the product (ProductLed)
   27% never confirm the email (ProductLed)

✅ Correct path:
   1. Email + name (Magic Link or Google OAuth — no password step)
   2. ← Product immediately visible with demo data
   3. Onboarding checklist (3–5 items, optional)
      ✓ First project created
      ✓ Team member invited
      ✓ Integration connected
   4. Credit card only when user chooses to convert
```

Demo data from day one — show what the product looks like when full (Notion, Trello, Asana examples).

---

## Pricing Page — Three Tiers, One Highlighted

```
❌ Starter | Basic | Pro | Business | Enterprise
   (5 equal tiers, no recommendation, no "best for")
   — Decision paralysis, -27% conversion vs. three tiers (ConversionXL)

✅ Three tiers, ordered expensive → cheap, one visually highlighted

| Pro          | Starter     | Enterprise  |
| $49/mo       | $9/mo       | Contact us  |
| ★ RECOMMENDED|             |             |
| For teams    | For solo    | For orgs    |
| 1–50 users   | 1 user      | Unlimited   |
```

ProfitWell (744 pricing pages): 3 tiers = 30% higher ARPU than 4+.
Intercom: consolidated 6 plans → 3, saw +17% conversion immediately.

**Page structure:**
- Customer logos at top (trust)
- Tiers with visual hierarchy — recommended tier: distinct color/border/badge
- "Best for:" line on every tier — users self-select without reading feature lists
- Customer testimonials below tiers
- Trust badges (SOC2, GDPR, "14-day free trial") near the CTA

---

## Empty States

Show what full looks like. Never just "No data found."

**See handling-ui-states for detailed empty-state pattern (heading, description, CTA, illustration).**

Every view that can be empty must be designed — it's part of the 4-state requirement.

---

## Settings Architecture — Account vs. Workspace

```
❌ Settings (flat, everything together)
   ├── Profile
   ├── Password
   ├── Billing         ← org-level inside personal settings
   ├── Team            ← org-level inside personal settings
   ├── API Keys        ← org-level inside personal settings
   └── Language

✅ Account (personal — this user only)
   ├── Profile (name, avatar, email)
   ├── Password & security
   ├── Notifications
   ├── Appearance (dark mode, language)
   └── Active sessions

   Workspace (org — Owner/Admin only)
   ├── General (name, logo, domain)
   ├── Team (invite members, assign roles)
   ├── Billing (plan, payment, invoices)
   ├── API & Integrations
   └── Security (SSO, 2FA policy)
```

**RBAC rule:** `member` role cannot see Workspace settings. Billing is
paid by the organization — it belongs under Workspace, not next to password.

Stripe pattern: Personal Settings / Account Settings / Product Settings —
three clear buckets, no overlap.

Nielsen Norman Group: "All navigation categories must be descriptive, specific,
and mutually exclusive so users can navigate without hesitation."

Two-column layout: left sidebar with categories, right pane for content.
Scales with growing settings — tabs don't.
