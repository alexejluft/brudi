import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';

/**
 * Analyzes design token usage in TSX/JSX files
 * @param {string} filePath - Path to the TSX/JSX file
 * @param {string} tokensFilePath - Optional path to tokens.ts file
 * @returns {Object} { violations: [...], metrics: {...}, file: string }
 */
export function analyzeTokens(filePath, tokensFilePath) {
  const violations = [];
  const metrics = {
    tokenReferences: 0,
    hardcodedValues: 0,
    adoptionRatio: 0,
  };

  // Handle file not found gracefully
  if (!fs.existsSync(filePath)) {
    return { violations: [], metrics, file: filePath };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy'],
      allowImportExportEverywhere: true,
    });

    // Rule 1: HARDCODED_DURATION in gsap calls
    checkHardcodedDuration(ast, violations);

    // Rule 2: HARDCODED_EASING in gsap calls
    checkHardcodedEasing(ast, violations);

    // Rule 4: HARDCODED_COLOR_IN_JSX
    checkHardcodedColors(ast, content, violations, metrics);

    // Count token references
    countTokenReferences(ast, metrics);

    // Rule 3: TOKEN_DEFINED_NOT_USED
    checkUnusedTokens(filePath, tokensFilePath, violations, metrics);

    // Calculate adoption ratio
    const total = metrics.tokenReferences + metrics.hardcodedValues;
    metrics.adoptionRatio = total > 0 ? metrics.tokenReferences / total : 0;
  } catch (error) {
    violations.push({
      rule: 'PARSE_ERROR',
      severity: 'error',
      message: `Failed to parse file: ${error.message}`,
      line: 0,
      column: 0,
    });
  }

  return { violations, metrics, file: filePath };
}

/**
 * Check for hardcoded duration in gsap calls
 */
function checkHardcodedDuration(ast, violations) {
  traverseNode(ast, (node) => {
    if (isGsapCall(node)) {
      const args = node.arguments;
      if (args.length > 0) {
        const configArg = args[args.length - 1];

        if (
          configArg &&
          configArg.type === 'ObjectExpression'
        ) {
          configArg.properties.forEach((prop) => {
            if (
              prop.key &&
              prop.key.name === 'duration' &&
              prop.value &&
              prop.value.type === 'NumericLiteral'
            ) {
              violations.push({
                rule: 'HARDCODED_DURATION',
                severity: 'error',
                message: 'Hardcoded duration in gsap call. Use token reference instead.',
                line: prop.loc?.start?.line || 0,
                column: prop.loc?.start?.column || 0,
              });
            }
          });
        }
      }
    }
  });
}

/**
 * Check for hardcoded easing in gsap calls
 */
function checkHardcodedEasing(ast, violations) {
  traverseNode(ast, (node) => {
    if (isGsapCall(node)) {
      const args = node.arguments;
      if (args.length > 0) {
        const configArg = args[args.length - 1];

        if (
          configArg &&
          configArg.type === 'ObjectExpression'
        ) {
          configArg.properties.forEach((prop) => {
            if (
              prop.key &&
              prop.key.name === 'ease' &&
              prop.value &&
              prop.value.type === 'StringLiteral'
            ) {
              violations.push({
                rule: 'HARDCODED_EASING',
                severity: 'error',
                message: 'Hardcoded easing in gsap call. Use token reference instead.',
                line: prop.loc?.start?.line || 0,
                column: prop.loc?.start?.column || 0,
              });
            }
          });
        }
      }
    }
  });
}

/**
 * Check for hardcoded colors in JSX
 * AST-based: only flags colors found in StringLiteral and TemplateLiteral nodes
 */
function checkHardcodedColors(ast, content, violations, metrics) {
  const colorPattern = /(#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|hsla\()/;

  traverseNode(ast, (node) => {
    // Check JSXAttribute with StringLiteral values
    if (
      node.type === 'JSXAttribute' &&
      node.value &&
      node.value.type === 'StringLiteral'
    ) {
      const stringValue = node.value.value;
      if (colorPattern.test(stringValue) && !isInVarReference(stringValue)) {
        violations.push({
          rule: 'HARDCODED_COLOR_IN_JSX',
          severity: 'error',
          message: 'Hardcoded color value in JSX. Use design token instead.',
          line: node.loc?.start?.line || 0,
          column: node.loc?.start?.column || 0,
        });
        metrics.hardcodedValues++;
      }
    }

    // Check style object properties (color, backgroundColor, etc.)
    if (
      node.type === 'ObjectProperty' &&
      node.key &&
      node.key.name &&
      (node.key.name === 'color' ||
        node.key.name === 'backgroundColor' ||
        node.key.name === 'borderColor' ||
        node.key.name === 'fill' ||
        node.key.name === 'stroke')
    ) {
      // Check StringLiteral values
      if (node.value && node.value.type === 'StringLiteral') {
        const stringValue = node.value.value;
        if (colorPattern.test(stringValue) && !isInVarReference(stringValue)) {
          violations.push({
            rule: 'HARDCODED_COLOR_IN_JSX',
            severity: 'error',
            message: 'Hardcoded color value in style object. Use design token instead.',
            line: node.loc?.start?.line || 0,
            column: node.loc?.start?.column || 0,
          });
          metrics.hardcodedValues++;
        }
      }

      // Check TemplateLiteral values
      if (node.value && node.value.type === 'TemplateLiteral') {
        node.value.quasis.forEach((quasi) => {
          if (quasi.value && quasi.value.cooked) {
            if (colorPattern.test(quasi.value.cooked) && !isInVarReference(quasi.value.cooked)) {
              violations.push({
                rule: 'HARDCODED_COLOR_IN_JSX',
                severity: 'error',
                message: 'Hardcoded color value in template literal. Use design token instead.',
                line: node.loc?.start?.line || 0,
                column: node.loc?.start?.column || 0,
              });
              metrics.hardcodedValues++;
            }
          }
        });
      }
    }
  });
}

/**
 * Count token references (var(--...) and token.*)
 * AST-based: only counts explicit MemberExpressions and call expressions
 */
function countTokenReferences(ast, metrics) {
  traverseNode(ast, (node) => {
    // Count MemberExpression: tokens.colorPrimary or tokens['spacing-lg']
    if (
      node.type === 'MemberExpression' &&
      node.object &&
      (node.object.name === 'tokens' || node.object.name === 'token')
    ) {
      // Only count if property is valid (not a nested traversal artifact)
      if (node.property) {
        metrics.tokenReferences++;
      }
    }

    // Count JSXAttribute values that reference tokens
    if (
      node.type === 'JSXAttribute' &&
      node.value &&
      node.value.type === 'JSXExpressionContainer' &&
      node.value.expression &&
      node.value.expression.type === 'MemberExpression'
    ) {
      const expr = node.value.expression;
      if (expr.object && (expr.object.name === 'tokens' || expr.object.name === 'token')) {
        metrics.tokenReferences++;
      }
    }

    // Count ImportSpecifier references to tokens (import { colorPrimary } from 'tokens')
    if (node.type === 'ImportSpecifier') {
      // Each imported token is a reference
      metrics.tokenReferences++;
    }
  });
}

/**
 * Check for unused tokens
 * AST-based: parses each consumer file and looks for actual token usage via AST
 */
function checkUnusedTokens(filePath, tokensFilePath, violations, metrics) {
  let tokensPath = tokensFilePath;

  if (!tokensPath) {
    // Try to find tokens.ts in common locations
    const projectRoot = findProjectRoot(filePath);
    const commonPaths = [
      path.join(projectRoot, 'src', 'tokens.ts'),
      path.join(projectRoot, 'tokens.ts'),
      path.join(path.dirname(filePath), 'tokens.ts'),
    ];

    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        tokensPath = p;
        break;
      }
    }
  }

  if (!tokensPath || !fs.existsSync(tokensPath)) {
    return;
  }

  try {
    const tokensContent = fs.readFileSync(tokensPath, 'utf-8');
    const tokensAst = parse(tokensContent, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy'],
      allowImportExportEverywhere: true,
    });

    const exportedTokens = new Set();

    // Collect exported tokens
    tokensAst.program.body.forEach((node) => {
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration && node.declaration.id) {
          exportedTokens.add(node.declaration.id.name);
        }
        if (node.specifiers) {
          node.specifiers.forEach((spec) => {
            if (spec.exported) {
              exportedTokens.add(spec.exported.name);
            }
          });
        }
      }
    });

    // Check if tokens are used in the project
    const projectRoot = findProjectRoot(filePath);
    const allProjectFiles = getAllFiles(projectRoot);

    const usedTokens = new Set();
    allProjectFiles.forEach((file) => {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) {
        return;
      }
      if (file === tokensPath) return;

      try {
        const content = fs.readFileSync(file, 'utf-8');
        const consumerAst = parse(content, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx', 'decorators-legacy'],
          allowImportExportEverywhere: true,
        });

        // AST-based search for token usage
        traverseNode(consumerAst, (node) => {
          // Match: tokens.colorPrimary or tokens['spacing-lg']
          if (
            node.type === 'MemberExpression' &&
            node.object &&
            (node.object.name === 'tokens' || node.object.name === 'token') &&
            node.property
          ) {
            let propertyName = null;
            if (node.property.type === 'Identifier') {
              propertyName = node.property.name;
            } else if (node.property.type === 'StringLiteral') {
              propertyName = node.property.value;
            }
            if (propertyName && exportedTokens.has(propertyName)) {
              usedTokens.add(propertyName);
            }
          }

          // Match: import { colorPrimary } from 'tokens'
          if (node.type === 'ImportSpecifier') {
            const importedName = node.local?.name;
            if (importedName && exportedTokens.has(importedName)) {
              usedTokens.add(importedName);
            }
          }

          // Match: var(--token-name) CSS custom properties
          if (
            node.type === 'StringLiteral' &&
            node.value &&
            node.value.includes('var(--')
          ) {
            const matches = node.value.match(/var\(--([^)]+)\)/g);
            if (matches) {
              matches.forEach((match) => {
                const tokenName = match.replace(/var\(--/, '').replace(/\)/, '');
                // Convert kebab-case to camelCase if needed
                const camelCaseTokenName = tokenName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                if (exportedTokens.has(camelCaseTokenName)) {
                  usedTokens.add(camelCaseTokenName);
                }
              });
            }
          }
        });
      } catch (error) {
        // Ignore parse/read errors
      }
    });

    // Report unused tokens
    exportedTokens.forEach((token) => {
      if (!usedTokens.has(token)) {
        violations.push({
          rule: 'TOKEN_DEFINED_NOT_USED',
          severity: 'warning',
          message: `Token "${token}" is defined but not used in the project`,
          line: 0,
          column: 0,
        });
      }
    });
  } catch (error) {
    // Ignore errors in token parsing
  }
}

/**
 * Check if string is a var() reference
 */
function isInVarReference(str) {
  return /var\s*\(\s*--/.test(str);
}

/**
 * Check if node is a gsap call
 */
function isGsapCall(node) {
  if (node.type !== 'CallExpression') return false;

  const callee = node.callee;
  if (!callee) return false;

  if (
    callee.type === 'MemberExpression' &&
    callee.object &&
    callee.object.name === 'gsap'
  ) {
    const method = callee.property?.name;
    return ['to', 'from', 'fromTo'].includes(method);
  }

  return false;
}

/**
 * Find project root by looking for package.json
 */
function findProjectRoot(filePath) {
  let current = path.dirname(filePath);

  while (current !== '/' && current !== '.') {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current;
    }
    current = path.dirname(current);
  }

  return path.dirname(filePath);
}

/**
 * Get all files recursively
 */
function getAllFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  try {
    const entries = fs.readdirSync(dir);
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!entry.startsWith('.') && entry !== 'node_modules') {
            files.push(...getAllFiles(fullPath));
          }
        } else {
          files.push(fullPath);
        }
      } catch (error) {
        // Ignore
      }
    });
  } catch (error) {
    // Ignore
  }

  return files;
}

/**
 * Generic node traversal helper
 */
function traverseNode(node, callback) {
  if (!node) return;

  callback(node);

  for (const key in node) {
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item && typeof item === 'object' && item.type) {
          traverseNode(item, callback);
        }
      });
    } else if (value && typeof value === 'object' && value.type) {
      traverseNode(value, callback);
    }
  }
}
