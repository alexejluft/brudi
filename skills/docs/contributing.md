# Contributing

## Skill Structure

```
skills/
  skill-name/
    SKILL.md        # Required
    references/     # Optional supporting docs
```

## SKILL.md Format

```yaml
---
name: verb-based-name
description: Use when [trigger condition]. [What it helps with].
---

# Skill Name

## Overview (1-2 sentences)
## When to Use (decision help)
## Core Pattern (code)
## Common Mistakes (with fixes)
```

## Requirements

1. **Description starts with "Use when..."**
2. **Name is verb-first** (building-, designing-, testing-)
3. **Under 120 lines** (target: ~100)
4. **Real code examples** (not theoretical)
5. **Common mistakes included**

## Before Submitting

- [ ] Write pressure test scenarios
- [ ] Test what fails WITHOUT your skill
- [ ] Verify skill addresses those failures
- [ ] Check line count (<120)

## Pull Request

Include:
- What the skill addresses
- Pressure scenarios tested
- Known limitations
