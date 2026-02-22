---
name: building-disclosure-patterns
description: Use when building tabs, custom dropdowns, disclosure widgets, or any non-accordion expandable patterns. Covers ARIA disclosure patterns and keyboard navigation.
---

# Disclosure Patterns — Tabs & Dropdowns

Disclosure widgets include: tabs, custom dropdowns, collapsible sections, disclosure buttons. These are distinct from accordions (which have mutually exclusive panels).

See `building-components-core` for decision tree and general ARIA requirements.

## Key Differences: Disclosure vs Accordion

| Pattern | Selection | ARIA Role | Panel Behavior |
|---------|-----------|-----------|----------------|
| **Accordion** | Exclusive (one open) | N/A (use aria-expanded) | Collapse on open new |
| **Tabs** | Exclusive (one active) | tab, tabpanel, tablist | Switch on click |
| **Disclosure** | Inclusive (any open) | button, region | Independent toggle |
| **Dropdown** | Single selection | button, listbox | Shows list options |

---

## Disclosure Button Pattern

Basic pattern: button toggles visibility of related content. Works for tooltips, popovers, or simple show/hide sections.

```html
<button aria-expanded="false"
        aria-controls="disclosure-content">
  Show more
</button>

<div id="disclosure-content"
     role="region"
     aria-labelledby="disclosure-button">
  Content revealed here
</div>
```

```js
const button = document.querySelector('[aria-expanded]')
const content = document.getElementById(button.getAttribute('aria-controls'))

button.addEventListener('click', () => {
  const isOpen = button.getAttribute('aria-expanded') === 'true'
  button.setAttribute('aria-expanded', String(!isOpen))
  content.hidden = isOpen
})
```

**Keyboard support:** Space and Enter work natively on `<button>`. Tab moves between disclosure buttons.

---

## Tabs Pattern (ARIA Tab Role)

Tabs are mutually exclusive — only one can be selected at a time. Use `role="tab"` + `role="tablist"` + `role="tabpanel"`.

```html
<div role="tablist" aria-label="Content tabs">
  <button role="tab"
          aria-selected="true"
          aria-controls="panel-1"
          id="tab-1">
    Tab 1
  </button>
  <button role="tab"
          aria-selected="false"
          aria-controls="panel-2"
          id="tab-2">
    Tab 2
  </button>
</div>

<div id="panel-1"
     role="tabpanel"
     aria-labelledby="tab-1"
     tabindex="0">
  Content for tab 1
</div>

<div id="panel-2"
     role="tabpanel"
     aria-labelledby="tab-2"
     tabindex="0"
     hidden>
  Content for tab 2
</div>
```

```js
const tabs = document.querySelectorAll('[role="tab"]')
const panels = document.querySelectorAll('[role="tabpanel"]')

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    // Deselect all
    tabs.forEach(t => t.setAttribute('aria-selected', 'false'))
    panels.forEach(p => p.hidden = true)

    // Select this tab
    tab.setAttribute('aria-selected', 'true')
    const panel = document.getElementById(tab.getAttribute('aria-controls'))
    panel.hidden = false
    panel.focus()
  })

  // Keyboard: Arrow Left/Right to switch tabs
  tab.addEventListener('keydown', (e) => {
    let nextTab
    if (e.key === 'ArrowRight') {
      nextTab = tabs[index + 1] || tabs[0]
    }
    if (e.key === 'ArrowLeft') {
      nextTab = tabs[index - 1] || tabs[tabs.length - 1]
    }
    if (nextTab) {
      nextTab.click()
      nextTab.focus()
    }
  })

  // Home/End keys
  tab.addEventListener('keydown', (e) => {
    if (e.key === 'Home') {
      tabs[0].click()
      tabs[0].focus()
    }
    if (e.key === 'End') {
      tabs[tabs.length - 1].click()
      tabs[tabs.length - 1].focus()
    }
  })
})
```

**Tab keyboard behavior (W3C spec):**
- ArrowRight/ArrowDown: Move to next tab
- ArrowLeft/ArrowUp: Move to previous tab
- Home: Jump to first tab
- End: Jump to last tab
- Tab: Move out of tab list to next focusable element
- Space/Enter: Activate selected tab (if it doesn't activate automatically)

---

## Custom Dropdown Pattern

Dropdown: button opens a list of options. User selects one, list closes.

```html
<div class="dropdown">
  <button aria-expanded="false"
          aria-haspopup="listbox"
          aria-controls="dropdown-list">
    Select option
    <span aria-hidden="true">▼</span>
  </button>

  <ul id="dropdown-list"
      role="listbox"
      aria-label="Options">
    <li role="option" data-value="opt1" aria-selected="false">Option 1</li>
    <li role="option" data-value="opt2" aria-selected="false">Option 2</li>
    <li role="option" data-value="opt3" aria-selected="false">Option 3</li>
  </ul>
</div>
```

```js
const button = document.querySelector('button')
const list = document.getElementById(button.getAttribute('aria-controls'))
const options = list.querySelectorAll('[role="option"]')
let isOpen = false
let focusIndex = 0

button.addEventListener('click', () => {
  isOpen = !isOpen
  button.setAttribute('aria-expanded', String(isOpen))
  list.hidden = !isOpen
  if (isOpen) options[0].focus()
})

options.forEach((option, index) => {
  option.addEventListener('click', () => {
    options.forEach(o => o.setAttribute('aria-selected', 'false'))
    option.setAttribute('aria-selected', 'true')
    button.textContent = option.textContent
    list.hidden = true
    isOpen = false
    button.setAttribute('aria-expanded', 'false')
  })

  option.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusIndex = (index + 1) % options.length
      options[focusIndex].focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusIndex = (index - 1 + options.length) % options.length
      options[focusIndex].focus()
    }
    if (e.key === 'Escape') {
      list.hidden = true
      isOpen = false
      button.setAttribute('aria-expanded', 'false')
      button.focus()
    }
  })
})

// Close on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    list.hidden = true
    isOpen = false
    button.setAttribute('aria-expanded', 'false')
  }
})
```

**Dropdown keyboard behavior:**
- Space/Enter: Open/close list or select option
- ArrowDown: Move focus to next option
- ArrowUp: Move focus to previous option
- Escape: Close list, return focus to button
- Tab: Close list and move to next focusable element

---

## Summary: When to Use Each

- **Accordion** (`building-accordion-patterns`): Multiple collapsible sections, one open at a time
- **Tabs** (this skill): Content switching, one active at a time, clear tab indicators
- **Disclosure**: Show/hide bonus content, independent toggles
- **Dropdown**: Select from predefined list of options

Always use `<button>` for interactive controls. Never `<div onClick>`.
