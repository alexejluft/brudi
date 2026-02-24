import * as parser from '@babel/parser';
import { readFileSync } from 'fs';

/**
 * Text size scale mapping for hierarchy validation
 */
const TEXT_SIZE_SCALE = {
  'text-xs': 1,
  'text-sm': 2,
  'text-base': 3,
  'text-lg': 4,
  'text-xl': 5,
  'text-2xl': 6,
  'text-3xl': 7,
  'text-4xl': 8,
  'text-5xl': 9,
  'text-6xl': 10,
  'text-7xl': 11,
  'text-8xl': 12,
  'text-9xl': 13,
};

/**
 * Elements that bear text content
 */
const TEXT_BEARING_ELEMENTS = new Set(['p', 'span', 'div', 'label', 'li', 'td', 'th']);
const HEADING_ELEMENTS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * Extract className strings from JSX elements
 */
function extractClassNameValues(ast, filePath) {
  const classNames = [];
  const elementStack = [];

  function traverse(node, parent = null) {
    if (!node || typeof node !== 'object') return;

    // Track JSXOpeningElement for context
    if (node.type === 'JSXOpeningElement') {
      const tagName = node.name.name || node.name;
      elementStack.push({ name: tagName, node, line: node.loc?.start.line });

      // Look for className attribute
      if (node.attributes) {
        for (const attr of node.attributes) {
          if (attr.type === 'JSXAttribute' && attr.name.name === 'className') {
            if (attr.value) {
              const extracted = extractClassNameValue(attr.value, filePath);
              if (extracted) {
                classNames.push({
                  ...extracted,
                  element: tagName,
                  elementLine: node.loc?.start.line,
                  elementColumn: node.loc?.start.column,
                });
              }
            }
          }
        }
      }

      // Traverse children
      if (node.children) {
        for (const child of node.children) {
          traverse(child, node);
        }
      }

      elementStack.pop();
    } else if (node.type === 'CallExpression') {
      // Handle cn(), clsx(), twMerge() calls
      const calleeName = node.callee.name;
      if (['cn', 'clsx', 'twMerge'].includes(calleeName)) {
        if (node.arguments) {
          for (const arg of node.arguments) {
            if (arg.type === 'StringLiteral') {
              classNames.push({
                value: arg.value,
                line: arg.loc?.start.line,
                column: arg.loc?.start.column,
                element: null,
              });
            } else if (arg.type === 'TemplateLiteral') {
              const value = arg.quasis.map(q => q.value.raw).join('');
              classNames.push({
                value,
                line: arg.loc?.start.line,
                column: arg.loc?.start.column,
                element: null,
              });
            }
          }
        }
      }

      // Traverse call expression arguments
      if (node.arguments) {
        for (const arg of node.arguments) {
          traverse(arg, node);
        }
      }
    }

    // Generic traversal
    for (const key in node) {
      if (key !== 'loc' && key !== 'range' && key !== 'start' && key !== 'end') {
        if (Array.isArray(node[key])) {
          for (const item of node[key]) {
            traverse(item, node);
          }
        } else if (typeof node[key] === 'object') {
          traverse(node[key], node);
        }
      }
    }
  }

  traverse(ast);
  return classNames;
}

/**
 * Extract className value from JSX attribute
 */
function extractClassNameValue(valueNode, filePath) {
  if (valueNode.type === 'StringLiteral') {
    return {
      value: valueNode.value,
      line: valueNode.loc?.start.line,
      column: valueNode.loc?.start.column,
    };
  } else if (valueNode.type === 'JSXExpressionContainer') {
    const expression = valueNode.expression;
    if (expression.type === 'StringLiteral') {
      return {
        value: expression.value,
        line: expression.loc?.start.line,
        column: expression.loc?.start.column,
      };
    } else if (expression.type === 'TemplateLiteral') {
      // For template literals, extract static parts
      const value = expression.quasis.map(q => q.value.raw).join('');
      return {
        value,
        line: expression.loc?.start.line,
        column: expression.loc?.start.column,
      };
    }
  }
  return null;
}

/**
 * Real Tailwind class tokenizer
 * Parses a single class string into structured tokens
 *
 * Example: "sm:hover:bg-blue-500" =>
 * {
 *   variants: ["sm", "hover"],
 *   negative: false,
 *   utility: "bg",
 *   value: "blue-500",
 *   arbitrary: false,
 *   raw: "sm:hover:bg-blue-500"
 * }
 */
function tokenizeClass(classString) {
  if (!classString || typeof classString !== 'string') {
    return null;
  }

  const raw = classString.trim();
  if (!raw) return null;

  // Track parsing state
  let remaining = raw;
  const variants = [];
  let negative = false;
  let utility = '';
  let value = '';
  let arbitrary = false;

  // Extract responsive and state prefixes (e.g., "sm:", "hover:", "dark:")
  const responsivePrefixes = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  const stateVariants = [
    'hover', 'focus', 'active', 'disabled', 'group-hover', 'group-focus',
    'focus-visible', 'focus-within', 'visited', 'target', 'first', 'last',
    'odd', 'even', 'only-child', 'only-of-type', 'empty', 'checked',
    'indeterminate', 'invalid', 'required', 'valid', 'read-only', 'read-write',
    'placeholder-shown', 'autofill', 'enabled', 'dark', 'light'
  ];
  const allVariants = [...responsivePrefixes, ...stateVariants];

  // Parse variants: sm:, hover:, dark:, etc.
  while (remaining.includes(':')) {
    const colonIndex = remaining.indexOf(':');
    const possibleVariant = remaining.substring(0, colonIndex);

    if (allVariants.includes(possibleVariant)) {
      variants.push(possibleVariant);
      remaining = remaining.substring(colonIndex + 1);
    } else {
      // Could be arbitrary value like bg-[#fff]:
      break;
    }
  }

  // Check for negative prefix (e.g., "-mt-4")
  if (remaining.startsWith('-')) {
    negative = true;
    remaining = remaining.substring(1);
  }

  // Parse utility and value
  // Format: utility-value or utility-[arbitrary]
  // Examples: mt-4, bg-blue-500, w-[123px], grid-cols-[1fr_2fr]

  // Check for arbitrary values: utility-[...]
  const arbitraryMatch = remaining.match(/^([a-z-]+)-\[(.+)\]$/);
  if (arbitraryMatch) {
    arbitrary = true;
    utility = arbitraryMatch[1];
    value = arbitraryMatch[2];
  } else {
    // Standard utility-value format
    const dashIndex = remaining.lastIndexOf('-');
    if (dashIndex > 0) {
      utility = remaining.substring(0, dashIndex);
      value = remaining.substring(dashIndex + 1);
    } else if (dashIndex === 0) {
      // Edge case: just "-value"
      utility = '';
      value = remaining.substring(1);
    } else {
      // No dash: single-word utility (e.g., "flex")
      utility = remaining;
      value = '';
    }
  }

  return {
    variants,
    negative,
    utility,
    value,
    arbitrary,
    raw,
  };
}

/**
 * Tokenize a className string into individual class tokens
 */
function tokenizeClasses(classNameString) {
  if (!classNameString) return [];
  const tokens = classNameString
    .split(/\s+/)
    .filter(c => c.length > 0)
    .map(c => tokenizeClass(c))
    .filter(t => t !== null);
  return tokens;
}

/**
 * Validate MAX_CONTAINER_VARIANTS rule
 * Uses tokenized classes to identify unique max-w-* values
 */
function validateMaxContainerVariants(allTokens) {
  const maxWValues = new Set();

  for (const token of allTokens) {
    if (token.utility === 'max-w' && token.value) {
      maxWValues.add(`max-w-${token.value}`);
    }
  }

  const violations = [];
  if (maxWValues.size > 4) {
    violations.push({
      rule: 'MAX_CONTAINER_VARIANTS',
      severity: 'error',
      message: `Too many max-w-* variants (${maxWValues.size}). Keep to 4 or fewer for consistency.`,
      line: null,
      column: null,
    });
  }

  return { violations, metrics: { uniqueMaxWValues: maxWValues.size } };
}

/**
 * Validate SPACING_VARIANCE rule
 * Uses tokenized classes to count unique spacing utility values
 */
function validateSpacingVariance(allTokens) {
  const spacingUtilities = ['py', 'px', 'gap', 'space-y', 'space-x', 'mt', 'mb', 'ml', 'mr', 'pt', 'pb', 'pl', 'pr'];
  const spacingValues = new Set();

  for (const token of allTokens) {
    if (spacingUtilities.includes(token.utility) && token.value) {
      // Exclude zero values (always OK)
      if (token.value !== '0') {
        spacingValues.add(`${token.utility}-${token.value}`);
      }
    }
  }

  const violations = [];
  if (spacingValues.size > 6) {
    violations.push({
      rule: 'SPACING_VARIANCE',
      severity: 'error',
      message: `Too many spacing variants (${spacingValues.size}). Keep to 6 or fewer for consistency.`,
      line: null,
      column: null,
    });
  }

  return { violations, metrics: { uniqueSpacingValues: spacingValues.size } };
}

/**
 * Validate NO_ARBITRARY_VALUES rule
 * Uses tokenized classes to detect arbitrary values (e.g., w-[123px])
 */
function validateNoArbitraryValues(allTokens, classNameMetadata) {
  const violations = [];
  let arbitraryCount = 0;

  for (const token of allTokens) {
    if (token.arbitrary === true) {
      arbitraryCount++;

      // Find matching metadata for location info
      const metadata = classNameMetadata.find(m => m.value && m.value.includes(token.raw)) || {};

      violations.push({
        rule: 'NO_ARBITRARY_VALUES',
        severity: 'error',
        message: `Arbitrary value detected: ${token.raw}. Use design tokens instead.`,
        line: metadata.line || null,
        column: metadata.column || null,
      });
    }
  }

  return { violations, metrics: { arbitraryValueCount: arbitraryCount } };
}

/**
 * Validate MAX_GRID_COLS rule
 * Uses tokenized classes to extract grid-cols values
 */
function validateMaxGridCols(allTokens) {
  const violations = [];
  let maxGridCols = 0;

  for (const token of allTokens) {
    if (token.utility === 'grid-cols' && token.value) {
      const cols = parseInt(token.value, 10);
      if (!isNaN(cols)) {
        if (cols > maxGridCols) {
          maxGridCols = cols;
        }
        if (cols > 4) {
          violations.push({
            rule: 'MAX_GRID_COLS',
            severity: 'warning',
            message: `Grid too dense (${cols} columns). Consider reducing to 4 or fewer columns.`,
            line: null,
            column: null,
          });
        }
      }
    }
  }

  return { violations, metrics: { maxGridCols } };
}

/**
 * Validate FONT_VARIANT_LIMIT rule
 * Uses tokenized classes to count unique text-* size values
 */
function validateFontVariantLimit(allTokens) {
  const validTextSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
  const fontSizes = new Set();
  const violations = [];

  for (const token of allTokens) {
    if (token.utility === 'text' && token.value && validTextSizes.includes(token.value)) {
      fontSizes.add(`text-${token.value}`);
    }
  }

  if (fontSizes.size > 6) {
    violations.push({
      rule: 'FONT_VARIANT_LIMIT',
      severity: 'warning',
      message: `Too many font size variants (${fontSizes.size}). Limit to 6 or fewer for better readability hierarchy.`,
      line: null,
      column: null,
    });
  }

  return { violations, metrics: { uniqueFontSizes: fontSizes.size } };
}

/**
 * Validate TEXT_HIERARCHY_CHECK rule
 * Uses tokenized classes to validate text size appropriateness for elements
 */
function validateTextHierarchy(classNameMetadata) {
  const violations = [];

  for (const metadata of classNameMetadata) {
    if (!metadata.value || !metadata.element) continue;

    const tokens = tokenizeClasses(metadata.value);
    const textToken = tokens.find(t => t.utility === 'text' && TEXT_SIZE_SCALE[`text-${t.value}`]);

    if (textToken) {
      const textSizeClass = `text-${textToken.value}`;
      const scale = TEXT_SIZE_SCALE[textSizeClass];

      // Check: body text too large
      if (TEXT_BEARING_ELEMENTS.has(metadata.element) && scale > 5) {
        violations.push({
          rule: 'TEXT_HIERARCHY_CHECK',
          severity: 'error',
          message: `Body text (<${metadata.element}>) too large (${textSizeClass}, scale ${scale}). Use text-xl or smaller for body text.`,
          line: metadata.line,
          column: metadata.column,
          file: metadata.file,
        });
      }
    }
  }

  return { violations };
}

/**
 * Main analyzer function
 */
export function analyzeTailwind(filePath) {
  const fileContent = readFileSync(filePath, 'utf-8');

  let ast;
  try {
    ast = parser.parse(fileContent, {
      sourceType: 'module',
      plugins: [
        ['jsx', { pragmaFrag: 'React.Fragment' }],
        ['typescript', { isTSX: true }],
        'decorators-legacy',
        'classProperties',
        'exportExtensions',
        'objectRestSpread',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'optionalChaining',
      ],
    });
  } catch (error) {
    return {
      violations: [
        {
          rule: 'PARSE_ERROR',
          severity: 'error',
          message: `Failed to parse file: ${error.message}`,
          line: null,
          column: null,
          file: filePath,
        },
      ],
      metrics: {
        uniqueSpacingValues: 0,
        uniqueMaxWValues: 0,
        uniqueFontSizes: 0,
        arbitraryValueCount: 0,
        maxGridCols: 0,
      },
      file: filePath,
    };
  }

  // Extract className values
  const classNameMetadata = extractClassNameValues(ast, filePath);

  // Tokenize all classes using the real tokenizer
  const allTokens = [];
  for (const metadata of classNameMetadata) {
    const tokens = tokenizeClasses(metadata.value);
    allTokens.push(...tokens);
  }

  // Prepare metadata with file path
  const classNameMetadataWithFile = classNameMetadata.map(m => ({
    ...m,
    file: filePath,
  }));

  // Run all validators with tokenized classes
  const violations = [];
  const metrics = {
    uniqueSpacingValues: 0,
    uniqueMaxWValues: 0,
    uniqueFontSizes: 0,
    arbitraryValueCount: 0,
    maxGridCols: 0,
  };

  // MAX_CONTAINER_VARIANTS
  const maxContainerResult = validateMaxContainerVariants(allTokens);
  violations.push(...maxContainerResult.violations);
  metrics.uniqueMaxWValues = maxContainerResult.metrics.uniqueMaxWValues;

  // SPACING_VARIANCE
  const spacingResult = validateSpacingVariance(allTokens);
  violations.push(...spacingResult.violations);
  metrics.uniqueSpacingValues = spacingResult.metrics.uniqueSpacingValues;

  // NO_ARBITRARY_VALUES
  const arbitraryResult = validateNoArbitraryValues(allTokens, classNameMetadata);
  violations.push(...arbitraryResult.violations.map(v => ({ ...v, file: filePath })));
  metrics.arbitraryValueCount = arbitraryResult.metrics.arbitraryValueCount;

  // MAX_GRID_COLS
  const gridResult = validateMaxGridCols(allTokens);
  violations.push(...gridResult.violations.map(v => ({ ...v, file: filePath })));
  metrics.maxGridCols = gridResult.metrics.maxGridCols;

  // FONT_VARIANT_LIMIT
  const fontResult = validateFontVariantLimit(allTokens);
  violations.push(...fontResult.violations.map(v => ({ ...v, file: filePath })));
  metrics.uniqueFontSizes = fontResult.metrics.uniqueFontSizes;

  // TEXT_HIERARCHY_CHECK
  const hierarchyResult = validateTextHierarchy(classNameMetadataWithFile);
  violations.push(...hierarchyResult.violations);

  return {
    violations,
    metrics,
    file: filePath,
  };
}

export default analyzeTailwind;
