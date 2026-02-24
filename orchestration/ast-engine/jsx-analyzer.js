import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;
import * as t from '@babel/types';
import { readFileSync } from 'fs';

/**
 * JSX AST Analyzer - Core analyzer for Brudi's AST Engine (Layer 5)
 * Analyzes JSX/TSX files using @babel/parser + @babel/traverse
 */

// Helper to get source code location
function getLoc(node) {
  if (node && node.loc) {
    return { line: node.loc.start.line, column: node.loc.start.column };
  }
  return { line: 0, column: 0 };
}

// Helper to check if a string matches color patterns
function isColorValue(str) {
  if (!str || typeof str !== 'string') return false;
  // Hex colors
  if (/^#(?:[0-9a-f]{3}){1,2}$/i.test(str)) return true;
  // rgb/rgba
  if (/^rgba?\(/.test(str)) return true;
  // hsl/hsla
  if (/^hsla?\(/.test(str)) return true;
  // Named colors
  const namedColors = ['red', 'blue', 'green', 'black', 'white', 'gray', 'yellow', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta', 'lime', 'navy', 'teal', 'olive', 'maroon', 'silver', 'gold'];
  if (namedColors.includes(str.toLowerCase())) return true;
  return false;
}

// Helper to extract object properties as key-value pairs
function extractObjectProperties(node) {
  const props = {};
  if (!t.isObjectExpression(node)) return props;
  
  node.properties.forEach(prop => {
    if (t.isObjectProperty(prop) || t.isObjectMethod(prop)) {
      let key = null;
      if (t.isIdentifier(prop.key)) {
        key = prop.key.name;
      } else if (t.isStringLiteral(prop.key)) {
        key = prop.key.value;
      }
      
      if (key && t.isObjectProperty(prop)) {
        props[key] = prop.value;
      }
    }
  });
  
  return props;
}

// Helper to extract string value from various node types
function extractStringValue(node) {
  if (t.isStringLiteral(node)) return node.value;
  if (t.isTemplateLiteral(node)) {
    return node.quasis.map((q, i) => {
      let result = q.value.cooked || q.value.raw;
      if (i < node.expressions.length) result += '${...}';
      return result;
    }).join('');
  }
  return null;
}

/**
 * Rule 1: NO_INLINE_STYLES
 * Detect style={{...}} JSX attributes
 * Exception: style={{display: 'none'}} is OK
 */
function checkNoInlineStyles(path, violations, filePath) {
  if (!t.isJSXAttribute(path.node)) return;
  
  const attr = path.node;
  if (!t.isJSXIdentifier(attr.name) || attr.name.name !== 'style') return;
  
  if (!attr.value || !t.isJSXExpressionContainer(attr.value)) return;
  
  const expr = attr.value.expression;
  if (!t.isObjectExpression(expr)) return;
  
  // Check if it's only display: none
  const props = extractObjectProperties(expr);
  const propKeys = Object.keys(props);
  
  if (propKeys.length === 1 && propKeys[0] === 'display') {
    const displayValue = props.display;
    if (t.isStringLiteral(displayValue) && displayValue.value === 'none') {
      return; // Exception: display none is OK
    }
  }
  
  const loc = getLoc(attr);
  violations.push({
    rule: 'NO_INLINE_STYLES',
    severity: 'error',
    message: 'Inline style objects should not be used. Use CSS classes instead.',
    line: loc.line,
    column: loc.column,
    file: filePath
  });
}

/**
 * Rule 2: NO_HARDCODED_COLORS
 * Detect hardcoded color values in style objects and string literals
 * Exception: values inside CSS custom property references (var(--...))
 */
function checkNoHardcodedColors(path, violations, filePath) {
  if (t.isJSXAttribute(path.node)) {
    const attr = path.node;
    if (!t.isJSXIdentifier(attr.name)) return;
    
    const attrName = attr.name.name;
    const colorProps = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'outlineColor', 'textShadow', 'boxShadow'];
    
    if (!colorProps.includes(attrName)) return;
    
    if (!attr.value) return;
    
    let stringValue = null;
    if (t.isStringLiteral(attr.value)) {
      stringValue = attr.value.value;
    } else if (t.isJSXExpressionContainer(attr.value)) {
      const expr = attr.value.expression;
      if (t.isStringLiteral(expr)) {
        stringValue = expr.value;
      }
    }
    
    if (stringValue && !stringValue.includes('var(--') && isColorValue(stringValue)) {
      const loc = getLoc(attr);
      violations.push({
        rule: 'NO_HARDCODED_COLORS',
        severity: 'error',
        message: `Hardcoded color value "${stringValue}" found in ${attrName}. Use CSS custom properties instead.`,
        line: loc.line,
        column: loc.column,
        file: filePath
      });
    }
  }
  
  // Check style objects
  if (t.isObjectProperty(path.node) || t.isObjectMethod(path.node)) {
    const prop = path.node;
    let key = null;
    if (t.isIdentifier(prop.key)) {
      key = prop.key.name;
    } else if (t.isStringLiteral(prop.key)) {
      key = prop.key.value;
    }
    
    const colorProps = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'outlineColor'];
    
    if (!key || !colorProps.includes(key)) return;
    if (t.isObjectMethod(prop)) return;
    
    let stringValue = null;
    if (t.isStringLiteral(prop.value)) {
      stringValue = prop.value.value;
    } else if (t.isTemplateLiteral(prop.value)) {
      stringValue = extractStringValue(prop.value);
    }
    
    if (stringValue && !stringValue.includes('var(--') && isColorValue(stringValue)) {
      const loc = getLoc(prop);
      violations.push({
        rule: 'NO_HARDCODED_COLORS',
        severity: 'error',
        message: `Hardcoded color value "${stringValue}" found in style.${key}. Use CSS custom properties instead.`,
        line: loc.line,
        column: loc.column,
        file: filePath
      });
    }
  }
}

/**
 * Rule 3: NO_HARDCODED_PX
 * Detect hardcoded px values in style objects
 * Exception: 0, 1px (common for borders)
 */
function checkNoHardcodedPx(path, violations, filePath) {
  if (!t.isObjectProperty(path.node) && !t.isObjectMethod(path.node)) return;
  
  const prop = path.node;
  if (t.isObjectMethod(prop)) return;
  
  let key = null;
  if (t.isIdentifier(prop.key)) {
    key = prop.key.name;
  } else if (t.isStringLiteral(prop.key)) {
    key = prop.key.value;
  }
  
  const spacingProps = ['padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'width', 'height', 'gap', 'rowGap', 'columnGap'];
  
  if (!key || !spacingProps.includes(key)) return;
  
  let stringValue = null;
  if (t.isStringLiteral(prop.value)) {
    stringValue = prop.value.value;
  } else if (t.isTemplateLiteral(prop.value)) {
    stringValue = extractStringValue(prop.value);
  } else if (t.isNumericLiteral(prop.value)) {
    stringValue = prop.value.value.toString();
  }
  
  if (!stringValue) return;
  
  // Check if it matches px pattern (but exclude 0 and 1px)
  if (/^\d+px$/.test(stringValue)) {
    const value = parseInt(stringValue);
    if (value !== 0 && value !== 1) {
      const loc = getLoc(prop);
      violations.push({
        rule: 'NO_HARDCODED_PX',
        severity: 'warning',
        message: `Hardcoded pixel value "${stringValue}" in ${key}. Consider using design tokens or CSS variables.`,
        line: loc.line,
        column: loc.column,
        file: filePath
      });
    }
  }
}

/**
 * Rule 4: NO_LAYOUT_ANIMATION
 * Detect gsap.to/from/fromTo with layout properties
 * These should use transform instead
 */
function checkNoLayoutAnimation(path, violations, filePath) {
  if (!t.isCallExpression(path.node)) return;
  
  const call = path.node;
  if (!t.isMemberExpression(call.callee)) return;
  
  const { object, property } = call.callee;
  if (!t.isIdentifier(object) || object.name !== 'gsap') return;
  if (!t.isIdentifier(property)) return;
  
  const methodName = property.name;
  if (!['to', 'from', 'fromTo'].includes(methodName)) return;
  
  // The tween object is typically the second argument for gsap.to/from
  let tweenObj = null;
  if (methodName === 'fromTo') {
    // gsap.fromTo(target, fromVars, toVars) - toVars is the 3rd arg
    if (call.arguments.length >= 3) tweenObj = call.arguments[2];
  } else {
    // gsap.to/from(target, vars)
    if (call.arguments.length >= 2) tweenObj = call.arguments[1];
  }
  
  if (!tweenObj || !t.isObjectExpression(tweenObj)) return;
  
  const layoutProps = ['width', 'height', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'top', 'left', 'right', 'bottom'];
  
  const props = extractObjectProperties(tweenObj);
  const foundLayoutProps = Object.keys(props).filter(k => layoutProps.includes(k));
  
  if (foundLayoutProps.length > 0) {
    const loc = getLoc(call);
    violations.push({
      rule: 'NO_LAYOUT_ANIMATION',
      severity: 'error',
      message: `gsap.${methodName}() animates layout properties [${foundLayoutProps.join(', ')}]. Use transform instead to avoid layout thrashing.`,
      line: loc.line,
      column: loc.column,
      file: filePath
    });
  }
}

/**
 * Rule 5: NO_GSAP_FROM
 * Detect gsap.from() calls - should use gsap.set() + gsap.to()
 */
function checkNoGsapFrom(path, violations, filePath) {
  if (!t.isCallExpression(path.node)) return;
  
  const call = path.node;
  if (!t.isMemberExpression(call.callee)) return;
  
  const { object, property } = call.callee;
  if (!t.isIdentifier(object) || object.name !== 'gsap') return;
  if (!t.isIdentifier(property) || property.name !== 'from') return;
  
  const loc = getLoc(call);
  violations.push({
    rule: 'NO_GSAP_FROM',
    severity: 'error',
    message: 'gsap.from() should not be used. Use gsap.set() + gsap.to() instead for better control and clarity.',
    line: loc.line,
    column: loc.column,
    file: filePath
  });
}

/**
 * Rule 6: NO_TRANSITION_ALL
 * Detect "transition: all" in strings and style objects
 */
function checkNoTransitionAll(path, violations, filePath) {
  // Check string literals and template literals
  if (t.isStringLiteral(path.node)) {
    const value = path.node.value;
    if (/transition\s*:\s*all/i.test(value)) {
      const loc = getLoc(path.node);
      violations.push({
        rule: 'NO_TRANSITION_ALL',
        severity: 'error',
        message: 'Avoid "transition: all". Specify exact properties to transition instead.',
        line: loc.line,
        column: loc.column,
        file: filePath
      });
    }
  }
  
  if (t.isTemplateLiteral(path.node)) {
    const value = extractStringValue(path.node);
    if (value && /transition\s*:\s*all/i.test(value)) {
      const loc = getLoc(path.node);
      violations.push({
        rule: 'NO_TRANSITION_ALL',
        severity: 'error',
        message: 'Avoid "transition: all". Specify exact properties to transition instead.',
        line: loc.line,
        column: loc.column,
        file: filePath
      });
    }
  }
  
  // Check in style objects
  if (t.isObjectProperty(path.node) || t.isObjectMethod(path.node)) {
    const prop = path.node;
    if (t.isObjectMethod(prop)) return;
    
    let key = null;
    if (t.isIdentifier(prop.key)) {
      key = prop.key.name;
    } else if (t.isStringLiteral(prop.key)) {
      key = prop.key.value;
    }
    
    if (key !== 'transition') return;
    
    let stringValue = null;
    if (t.isStringLiteral(prop.value)) {
      stringValue = prop.value.value;
    } else if (t.isTemplateLiteral(prop.value)) {
      stringValue = extractStringValue(prop.value);
    }
    
    if (stringValue && /^\s*all\s/i.test(stringValue)) {
      const loc = getLoc(prop);
      violations.push({
        rule: 'NO_TRANSITION_ALL',
        severity: 'error',
        message: 'Avoid "transition: all". Specify exact properties to transition instead.',
        line: loc.line,
        column: loc.column,
        file: filePath
      });
    }
  }
}

/**
 * Rule 7: SECTION_NEEDS_ID
 * Every <Section> or <section> must have an id prop
 */
function checkSectionNeedsId(path, violations, filePath) {
  if (!t.isJSXOpeningElement(path.node)) return;
  
  const elem = path.node;
  if (!t.isJSXIdentifier(elem.name) && !t.isJSXNamespacedName(elem.name)) return;
  
  let elemName = null;
  if (t.isJSXIdentifier(elem.name)) {
    elemName = elem.name.name;
  }
  
  if (elemName !== 'Section' && elemName !== 'section') return;
  
  // Check if id attribute exists
  const hasId = elem.attributes.some(attr => {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      return attr.name.name === 'id';
    }
    return false;
  });
  
  if (!hasId) {
    const loc = getLoc(elem);
    violations.push({
      rule: 'SECTION_NEEDS_ID',
      severity: 'error',
      message: `<${elemName}> element must have an id attribute for accessibility and tracking.`,
      line: loc.line,
      column: loc.column,
      file: filePath
    });
  }
}

/**
 * Rule 8: MAX_CHILDREN_PER_SECTION
 * <Section> with more than 8 direct JSX children
 */
function checkMaxChildrenPerSection(path, violations, filePath, maxChildren = 8) {
  if (!t.isJSXElement(path.node)) return;
  
  const elem = path.node;
  if (!t.isJSXIdentifier(elem.openingElement.name)) return;
  
  const elemName = elem.openingElement.name.name;
  if (elemName !== 'Section' && elemName !== 'section') return;
  
  // Count direct JSX children (not text nodes)
  const jsxChildren = elem.children.filter(child => t.isJSXElement(child) || t.isJSXExpressionContainer(child));
  
  if (jsxChildren.length > maxChildren) {
    const loc = getLoc(elem.openingElement);
    violations.push({
      rule: 'MAX_CHILDREN_PER_SECTION',
      severity: 'warning',
      message: `<${elemName}> has ${jsxChildren.length} direct children, exceeds max of ${maxChildren}. Consider breaking into sub-components.`,
      line: loc.line,
      column: loc.column,
      file: filePath
    });
  }
}

/**
 * Rule 9: COMPONENT_DEPTH_CHECK
 * Nested JSX elements deeper than 6 levels
 */
function checkComponentDepth(path, violations, filePath, maxDepth = 6) {
  if (!t.isJSXElement(path.node)) return;
  
  let depth = 0;
  let current = path;
  
  while (current && current.node) {
    if (t.isJSXElement(current.node)) {
      depth++;
    }
    current = current.parentPath;
  }
  
  if (depth > maxDepth) {
    const elem = path.node;
    let elemName = 'unknown';
    if (t.isJSXIdentifier(elem.openingElement.name)) {
      elemName = elem.openingElement.name.name;
    }
    
    const loc = getLoc(elem.openingElement);
    violations.push({
      rule: 'COMPONENT_DEPTH_CHECK',
      severity: 'warning',
      message: `JSX nesting depth is ${depth}, exceeds max of ${maxDepth}. Consider extracting components to reduce nesting.`,
      line: loc.line,
      column: loc.column,
      file: filePath
    });
  }
}

/**
 * Main analyzer function
 * @param {string} filePath - Path to the JSX/TSX file
 * @returns {{violations: Array, file: string}}
 */
export function analyzeJSX(filePath) {
  const violations = [];
  
  try {
    const source = readFileSync(filePath, 'utf-8');
    
    // Parse with JSX and TypeScript support
    const ast = parse(source, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        ['decorators', { decoratorsBeforeExport: false }],
        'classProperties'
      ]
    });
    
    // Traverse the AST
    traverse(ast, {
      JSXAttribute(path) {
        checkNoInlineStyles(path, violations, filePath);
        checkNoHardcodedColors(path, violations, filePath);
      },
      ObjectProperty(path) {
        checkNoHardcodedColors(path, violations, filePath);
        checkNoHardcodedPx(path, violations, filePath);
        checkNoTransitionAll(path, violations, filePath);
      },
      CallExpression(path) {
        checkNoLayoutAnimation(path, violations, filePath);
        checkNoGsapFrom(path, violations, filePath);
      },
      StringLiteral(path) {
        checkNoTransitionAll(path, violations, filePath);
      },
      TemplateLiteral(path) {
        checkNoTransitionAll(path, violations, filePath);
      },
      JSXOpeningElement(path) {
        checkSectionNeedsId(path, violations, filePath);
      },
      JSXElement(path) {
        checkMaxChildrenPerSection(path, violations, filePath);
        checkComponentDepth(path, violations, filePath);
      }
    });
    
  } catch (error) {
    violations.push({
      rule: 'PARSE_ERROR',
      severity: 'error',
      message: `Failed to parse file: ${error.message}`,
      line: 0,
      column: 0,
      file: filePath
    });
  }
  
  return {
    violations,
    file: filePath
  };
}

export default analyzeJSX;
