# Tailwind Class AST Analyzer

A comprehensive AST-based analyzer for Tailwind CSS classes in JSX/TSX files, validating against Brudi's design token system.

## Overview

The Tailwind Analyzer parses JSX/TSX files using `@babel/parser` to extract Tailwind CSS classes from `className` attributes, then validates them against a set of design system rules and constraints.

## API

### `analyzeTailwind(filePath: string): AnalysisResult`

Analyzes a single JSX/TSX file for Tailwind CSS violations.

**Parameters:**
- `filePath` (string): Absolute path to the JSX/TSX file

**Returns:**
```typescript
{
  violations: Violation[];
  metrics: Metrics;
  file: string;
}
```

### Violation Structure

Each violation has the following shape:

```typescript
{
  rule: string;           // Rule name (e.g., 'MAX_CONTAINER_VARIANTS')
  severity: 'error' | 'warning';
  message: string;        // Human-readable message
  line: number | null;    // Source line number (1-indexed)
  column: number | null;  // Source column number (0-indexed)
  file: string;           // File path
}
```

### Metrics Structure

```typescript
{
  uniqueSpacingValues: number;    // Count of unique spacing utility variants
  uniqueMaxWValues: number;       // Count of unique max-w-* variants
  uniqueFontSizes: number;        // Count of unique text-size classes
  arbitraryValueCount: number;    // Count of arbitrary value usages
  maxGridCols: number;            // Maximum grid columns found
}
```

## Validation Rules

### 1. MAX_CONTAINER_VARIANTS (Error)

**Description:** Limits the number of different `max-w-*` container variants used in a file.

**Threshold:** > 4 unique values triggers violation

**Regex:** `/\bmax-w-(\w+)/g`

**Why:** Constrains container width to a consistent set of breakpoints for better design coherence.

**Example:**
```jsx
<div className="max-w-sm">Small</div>
<div className="max-w-md">Medium</div>
<div className="max-w-lg">Large</div>
<div className="max-w-xl">XL</div>
<div className="max-w-2xl">2XL - VIOLATION!</div>
```

---

### 2. SPACING_VARIANCE (Error)

**Description:** Limits the number of unique spacing class variants used in a file.

**Threshold:** > 6 unique values triggers violation

**Spacing Classes:** `py-*`, `px-*`, `gap-*`, `space-y-*`, `space-x-*`, `mt-*`, `mb-*`, `ml-*`, `mr-*`, `pt-*`, `pb-*`, `pl-*`, `pr-*`

**Exclusion:** `p-0` and `m-0` are always allowed (zero spacing)

**Why:** Ensures consistent and maintainable spacing throughout the codebase. Too much variance leads to inconsistent layouts.

**Example:**
```jsx
<div className="py-2 px-3">Content</div>
<div className="gap-4 space-y-2">Items</div>
<div className="mt-5 mb-6">Section</div>
<div className="ml-8 mr-7">Aside</div>
<div className="pt-9 pb-10">Header</div>
<div className="pl-11 pr-12">Footer</div>
<div className="p-1">Extra - VIOLATION!</div>
```

---

### 3. TEXT_HIERARCHY_CHECK (Error)

**Description:** Validates text hierarchy rules for different element types.

**Rules:**
- Body text (`<p>`, `<span>`, `<div>`, `<label>`, `<li>`, `<td>`, `<th>`): Must use `text-xl` or smaller (scale ≤ 5)
- Heading hierarchy: `<h1>` > `<h2>` > `<h3>` (within same component scope)

**Text Size Scale:**
```
text-xs  = 1
text-sm  = 2
text-base = 3
text-lg  = 4
text-xl  = 5  (max for body)
text-2xl = 6
text-3xl = 7
text-4xl = 8
text-5xl = 9
text-6xl = 10
text-7xl = 11
text-8xl = 12
text-9xl = 13
```

**Why:** Maintains readable typography hierarchy and prevents awkward text sizing that breaks visual hierarchy.

**Example:**
```jsx
<p className="text-3xl">Too large - VIOLATION!</p>
<span className="text-2xl">Still too large - VIOLATION!</span>
<p className="text-base">Good</p>
```

---

### 4. NO_ARBITRARY_VALUES (Error)

**Description:** Prevents use of arbitrary values in bracket notation, which bypass the design token system.

**Detection Regex:** `/\b(?:w|h|p|m|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr|gap|text|max-w)-\[/`

**Why:** Arbitrary values bypass Brudi's token system, leading to inconsistent spacing, sizing, and spacing.

**Example:**
```jsx
<div className="w-[100px]">Bad</div>
<div className="h-[200px]">Bad</div>
<div className="p-[24px]">Bad</div>
<div className="text-[18px]">Bad</div>
<div className="w-32">Good - uses token</div>
```

---

### 5. MAX_GRID_COLS (Warning)

**Description:** Warns when grid layouts exceed 4 columns.

**Threshold:** grid-cols-N where N > 4

**Detection Regex:** `/\bgrid-cols-(\d+)/`

**Why:** Grids with many columns tend to be too dense and hard to read on most screen sizes.

**Example:**
```jsx
<div className="grid grid-cols-3">Good</div>
<div className="grid grid-cols-4">Good</div>
<div className="grid grid-cols-8">Too dense - WARNING!</div>
```

---

### 6. FONT_VARIANT_LIMIT (Warning)

**Description:** Warns when too many different font sizes are used in a file.

**Threshold:** > 6 unique text-size classes

**Font Size Classes:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`, `text-7xl`, `text-8xl`, `text-9xl`

**Why:** Excessive font size variants lead to inconsistent typography and hurt readability.

**Example:**
```jsx
<div className="text-xs">Extra small</div>
<div className="text-sm">Small</div>
<div className="text-base">Base</div>
<div className="text-lg">Large</div>
<div className="text-xl">Extra large</div>
<div className="text-2xl">2XL</div>
<div className="text-3xl">3XL - VIOLATION!</div>
```

---

## Class Extraction Sources

The analyzer extracts Tailwind classes from:

1. **JSX className attributes** (StringLiteral)
   ```jsx
   <div className="flex gap-2">Content</div>
   ```

2. **JSX className expressions** (JSXExpressionContainer)
   ```jsx
   <div className={isActive ? 'bg-blue-500' : 'bg-gray-500'}>Content</div>
   ```

3. **Template literals** (TemplateLiteral - static parts only)
   ```jsx
   <div className={`flex ${isActive ? 'bg-blue-500' : ''}`}>Content</div>
   ```

4. **Utility function calls** (`cn()`, `clsx()`, `twMerge()`)
   ```jsx
   <div className={cn('flex gap-2', isActive && 'bg-blue-500')}>Content</div>
   <div className={clsx('flex gap-2', { 'bg-blue-500': isActive })}>Content</div>
   <div className={twMerge('flex gap-2', 'gap-4')}>Content</div>
   ```

## Usage Example

```javascript
import { analyzeTailwind } from './tailwind-analyzer.js';

const result = analyzeTailwind('./src/components/Button.tsx');

if (result.violations.length > 0) {
  result.violations.forEach(v => {
    console.error(`[${v.severity}] ${v.rule}: ${v.message} (line ${v.line})`);
  });
}

console.log('Metrics:', result.metrics);
```

## Testing

To test the analyzer loads correctly:

```bash
node -e "import('./tailwind-analyzer.js').then(m => console.log('Tailwind Analyzer loaded, exports:', Object.keys(m)))"
```

Expected output:
```
Tailwind Analyzer loaded, exports: [ 'analyzeTailwind', 'default' ]
```

## Parser Configuration

The analyzer uses `@babel/parser` with the following plugins:

- **jsx**: JSX syntax support
- **typescript**: TypeScript and TSX syntax
- **decorators-legacy**: Legacy decorator syntax
- **classProperties**: Class property syntax
- **exportExtensions**: Extended export syntax
- **objectRestSpread**: Object rest/spread syntax
- **logicalAssignment**: Logical assignment operators (??=, &&=, ||=)
- **nullishCoalescingOperator**: Nullish coalescing operator (??)
- **optionalChaining**: Optional chaining operator (?.

This configuration ensures broad compatibility with modern React/TypeScript codebases.

## Error Handling

If parsing fails, the analyzer returns a PARSE_ERROR violation with details about the failure:

```javascript
{
  violations: [
    {
      rule: 'PARSE_ERROR',
      severity: 'error',
      message: 'Failed to parse file: <error details>',
      line: null,
      column: null,
      file: filePath
    }
  ],
  metrics: {
    uniqueSpacingValues: 0,
    uniqueMaxWValues: 0,
    uniqueFontSizes: 0,
    arbitraryValueCount: 0,
    maxGridCols: 0
  },
  file: filePath
}
```

## Performance Notes

- The analyzer performs a single AST traversal for efficiency
- All validation rules are applied in a single pass
- Time complexity: O(n) where n is the number of nodes in the AST
- Memory: AST is kept in memory for the duration of analysis

## Integration with Brudi

This analyzer is designed to work with Brudi's design token system:

- Validates that only design tokens are used (no arbitrary values)
- Enforces consistent spacing, sizing, and color choices
- Promotes a limited, cohesive typography scale
- Ensures components follow Brudi's design guidelines
