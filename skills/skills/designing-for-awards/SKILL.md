---
name: designing-for-awards
description: Use when making visual design decisions, choosing typography or colors, or when design feels generic. Helps avoid AI-slop and create distinctive, award-worthy aesthetics.
---

# Designing for Awards

## Before Designing: Questions First

1. What's the ONE thing someone will remember?
2. What makes this different from competitors?
3. Can I defend every design decision?
4. Would this win on Awwwards?

## Anti-AI-Slop Checklist

**Avoid these clichés:**
- ❌ Purple-to-blue gradient backgrounds
- ❌ Inter, Roboto, Open Sans as defaults
- ❌ Generic SaaS illustrations
- ❌ "Clean and modern" without character
- ❌ Rounded corners everywhere, no variation

**Instead:**
- ✅ One bold, intentional color
- ✅ Distinctive typography
- ✅ Asymmetry with purpose
- ✅ Every element earns its place

## Typography

### Never Default To
- Inter (overused)
- Roboto (Android default)
- Open Sans (generic)

### Consider Instead
**Display:** Clash Display, Cabinet Grotesk, Playfair Display
**Body:** Satoshi, General Sans, Plus Jakarta Sans

### Hierarchy
```css
h1 { letter-spacing: -0.02em; line-height: 1.1; }
p  { line-height: 1.6; }
```

## Color

### Dark Mode Done Right
```css
/* ❌ Never */
background: #000; color: #FFF;

/* ✅ Correct */
background: #09090B;  /* Near-black */
color: #FAFAFA;        /* Off-white */
```

### One Dominant Color
Pick ONE accent. Everything else is neutral.
```css
--primary: #E8A94A;
--bg: #09090B;
--text: #FAFAFA;
--muted: #A1A1AA;
```

## Premium Micro-Details

### Button States
```css
.button {
  transition: all 0.15s ease-out;
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.button:active {
  transform: translateY(0);
}
```

### Shimmer (Use Sparingly)
```css
.shimmer {
  background: linear-gradient(110deg, 
    transparent 25%, 
    rgba(255,255,255,0.1) 50%, 
    transparent 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

## Red Flags in Your Design

If you catch yourself saying:
- "It's clean and modern" → Too generic, add character
- "Similar to [competitor]" → Find differentiation
- "This gradient looks nice" → Probably AI-slop
- "Inter works fine" → Find a distinctive font
