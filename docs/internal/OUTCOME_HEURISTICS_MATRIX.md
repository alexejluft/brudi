# OUTCOME HEURISTICS MATRIX

| Category | Rule | Metric | Threshold | Severity |
|----------|------|--------|-----------|----------|
| Typography | HEADING_HIERARCHY | fontSize(hN) > fontSize(hN+1) | Must be descending | error |
| Typography | HEADING_RATIO | fontSize(hN) / fontSize(hN+1) | >= 1.15 | warning |
| Typography | BODY_TEXT_TOO_LARGE | fontSize of p/span/li | <= 24px | error |
| Typography | FONT_VARIANCE | unique font sizes | <= 6 | warning |
| Typography | LINE_HEIGHT | lineHeight / fontSize | 1.2 - 2.0 | warning |
| Layout | SECTION_OVERLOAD | sections in 3 viewports | <= 8 | error |
| Layout | SECTION_SPACING | gap between sections | >= 48px | warning |
| Layout | GRID_TOO_DENSE | grid columns | <= 4 | error |
| Layout | GRID_IMBALANCE | max height / min height | <= 2.0x | warning |
| Layout | DOUBLE_HERO | consecutive hero sections | max 1 | warning |
| Animation | ANIMATION_OVERLOAD | total animations | <= 12 | error |
| Animation | SECTION_ANIMATION_DENSITY | avg per section | <= 3 | warning |
| Animation | ANIMATION_RATIO | animated / total elements | <= 30% | warning |
| Cognitive | COGNITIVE_OVERLOAD | weighted formula | <= 50 | error |
| Cognitive | COGNITIVE_LOAD_HIGH | weighted formula | <= 30 | warning |
| CTA | NO_CTA_ABOVE_FOLD | buttons in first viewport | >= 1 | warning |
| CTA | CTA_TOO_SMALL | button font size | >= 16px | warning |
| CTA | CTA_LOW_PADDING | button padding | >= 20px | warning |

18 heuristics total. 6 errors, 12 warnings.
