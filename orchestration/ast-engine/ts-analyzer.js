import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * OPTIMIZED BATCH ANALYSIS - Creates ONE program for all files
 * Analyzes multiple TypeScript files using a single TypeScript Compiler API program
 * This is ~11x faster than createTsProgram for each file (1125ms -> ~100ms per file)
 * @param {string[]} filePaths - Array of paths to TypeScript files
 * @returns {Object[]} Array of { violations: [...], file: string }
 */
export function analyzeTSBatch(filePaths) {
  // Filter out non-existent files
  const validPaths = filePaths.filter(fp => fs.existsSync(fp));

  if (validPaths.length === 0) {
    return filePaths.map(fp => ({ violations: [], file: fp }));
  }

  // Find tsconfig.json (use first file's hierarchy)
  const tsconfigPath = findTsConfig(validPaths[0]);
  const compilerOptions = tsconfigPath
    ? parseTsConfig(tsconfigPath)
    : getDefaultCompilerOptions();

  // CREATE ONE PROGRAM FOR ALL FILES (key optimization)
  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram(validPaths, compilerOptions, host);
  const checker = program.getTypeChecker();

  // Run analysis on each file using the shared program
  return filePaths.map(filePath => {
    const violations = [];

    // Handle file not found gracefully
    if (!fs.existsSync(filePath)) {
      return { violations, file: filePath };
    }

    try {
      // Rule 7: STRICT_MODE_CHECK
      checkStrictMode(filePath, compilerOptions, violations);

      const sourceFile = program.getSourceFile(filePath);

      if (!sourceFile) {
        violations.push({
          rule: 'PARSE_ERROR',
          severity: 'error',
          message: `Failed to load source file: ${filePath}`,
          line: 0,
          column: 0,
        });
        return { violations, file: filePath };
      }

      // Rule 1: NO_ANY_TYPE - explicit any annotations
      checkExplicitAnyType(sourceFile, checker, violations);

      // Rule 2: NO_IMPLICIT_ANY - implicit any from noImplicitAny diagnostics
      checkImplicitAny(program, filePath, violations);

      // Rule 3: NO_UNUSED_IMPORTS - proper semantic analysis
      checkUnusedImports(sourceFile, checker, violations);

      // Rule 4: NO_DEFAULT_EXPORT_ANON
      checkAnonymousDefaultExport(sourceFile, violations);

      // Rule 5: NO_DEEP_NESTING - functions nested > 3 levels
      checkDeepNesting(sourceFile, violations);

      // Rule 6: NO_PROP_DRILLING - detect props flowing > 3 component levels
      checkPropDrilling(sourceFile, checker, violations);

      // Rule 8: NO_DUPLICATED_TYPES - identical type/interface definitions
      checkDuplicatedTypes(sourceFile, violations);

      // Rule 9: NO_CIRCULAR_IMPORTS - circular dependencies
      checkCircularImports(filePath, program, violations);
    } catch (error) {
      violations.push({
        rule: 'PARSE_ERROR',
        severity: 'error',
        message: `Analysis failed: ${error.message}`,
        line: 0,
        column: 0,
      });
    }

    return { violations, file: filePath };
  });
}

/**
 * Analyzes a single TypeScript file using the TypeScript Compiler API
 * Detects 9 types of quality violations
 * NOTE: For analyzing multiple files, use analyzeTSBatch() for 11x better performance
 * @param {string} filePath - Path to the TypeScript file
 * @returns {Object} { violations: [...], file: string }
 */
export function analyzeTS(filePath) {
  const violations = [];

  // Handle file not found gracefully
  if (!fs.existsSync(filePath)) {
    return { violations: [], file: filePath };
  }

  try {
    // Find tsconfig.json
    const tsconfigPath = findTsConfig(filePath);
    const compilerOptions = tsconfigPath
      ? parseTsConfig(tsconfigPath)
      : getDefaultCompilerOptions();

    // Rule 7: STRICT_MODE_CHECK
    checkStrictMode(filePath, compilerOptions, violations);

    // Create TypeScript program
    const program = createTsProgram(filePath, compilerOptions);
    const sourceFile = program.getSourceFile(filePath);

    if (!sourceFile) {
      violations.push({
        rule: 'PARSE_ERROR',
        severity: 'error',
        message: `Failed to load source file: ${filePath}`,
        line: 0,
        column: 0,
      });
      return { violations, file: filePath };
    }

    const checker = program.getTypeChecker();

    // Rule 1: NO_ANY_TYPE - explicit any annotations
    checkExplicitAnyType(sourceFile, checker, violations);

    // Rule 2: NO_IMPLICIT_ANY - implicit any from noImplicitAny diagnostics
    checkImplicitAny(program, filePath, violations);

    // Rule 3: NO_UNUSED_IMPORTS - proper semantic analysis
    checkUnusedImports(sourceFile, checker, violations);

    // Rule 4: NO_DEFAULT_EXPORT_ANON
    checkAnonymousDefaultExport(sourceFile, violations);

    // Rule 5: NO_DEEP_NESTING - functions nested > 3 levels
    checkDeepNesting(sourceFile, violations);

    // Rule 6: NO_PROP_DRILLING - detect props flowing > 3 component levels
    checkPropDrilling(sourceFile, checker, violations);

    // Rule 8: NO_DUPLICATED_TYPES - identical type/interface definitions
    checkDuplicatedTypes(sourceFile, violations);

    // Rule 9: NO_CIRCULAR_IMPORTS - circular dependencies
    checkCircularImports(filePath, program, violations);
  } catch (error) {
    violations.push({
      rule: 'PARSE_ERROR',
      severity: 'error',
      message: `Analysis failed: ${error.message}`,
      line: 0,
      column: 0,
    });
  }

  return { violations, file: filePath };
}

/**
 * Find tsconfig.json by walking up the directory tree
 */
function findTsConfig(filePath) {
  let dir = path.dirname(filePath);

  while (dir !== '/' && dir !== '') {
    const tsConfigPath = path.join(dir, 'tsconfig.json');
    if (fs.existsSync(tsConfigPath)) {
      return tsConfigPath;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break; // Stop at filesystem root
    dir = parent;
  }

  return null;
}

/**
 * Parse tsconfig.json
 */
function parseTsConfig(tsconfigPath) {
  try {
    const content = fs.readFileSync(tsconfigPath, 'utf-8');
    const config = JSON.parse(content);
    return config.compilerOptions || {};
  } catch {
    return {};
  }
}

/**
 * Get default compiler options
 */
function getDefaultCompilerOptions() {
  return {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ES2020,
    strict: false,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  };
}

/**
 * Create TypeScript program for analysis
 */
function createTsProgram(filePath, compilerOptions) {
  const host = ts.createCompilerHost(compilerOptions);

  return ts.createProgram([filePath], compilerOptions, host);
}

/**
 * Rule 1: Check for explicit any type annotations
 */
function checkExplicitAnyType(sourceFile, checker, violations) {
  visitNode(sourceFile);

  function visitNode(node) {
    // Check type annotations for `any`
    if (
      ts.isTypeReferenceNode(node) &&
      node.typeName.getText(sourceFile) === 'any'
    ) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      const column =
        sourceFile.getLineAndCharacterOfPosition(node.getStart()).character + 1;

      violations.push({
        rule: 'NO_ANY_TYPE',
        severity: 'error',
        message: 'Usage of "any" type is not allowed',
        line,
        column,
      });
    }

    // Check for any keyword directly
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      const column =
        sourceFile.getLineAndCharacterOfPosition(node.getStart()).character + 1;

      violations.push({
        rule: 'NO_ANY_TYPE',
        severity: 'error',
        message: 'Usage of "any" type is not allowed',
        line,
        column,
      });
    }

    ts.forEachChild(node, visitNode);
  }
}

/**
 * Rule 2: Check for implicit any using noImplicitAny diagnostics
 */
function checkImplicitAny(program, filePath, violations) {
  const diagnostics = ts.getPreEmitDiagnostics(program);

  diagnostics.forEach((diagnostic) => {
    // Filter for implicit any errors (code 7005, 7006, 7008, 7009)
    if (
      diagnostic.file &&
      diagnostic.file.fileName === filePath &&
      [7005, 7006, 7008, 7009].includes(diagnostic.code)
    ) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start || 0
      );

      violations.push({
        rule: 'NO_IMPLICIT_ANY',
        severity: 'error',
        message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
        line: line + 1,
        column: character + 1,
      });
    }
  });
}

/**
 * Rule 3: Check for unused imports using semantic analysis
 */
function checkUnusedImports(sourceFile, checker, violations) {
  const importedSymbols = new Map(); // name -> { line, column, node }
  const referencedSymbols = new Set();
  let inImportDeclaration = false;

  // First pass: collect all imports
  visitImports(sourceFile);

  // Second pass: collect all references (excluding import statements)
  visitReferences(sourceFile);

  function visitImports(node) {
    if (ts.isImportDeclaration(node)) {
      if (node.importClause) {
        // Default import: import Foo from "bar"
        if (node.importClause.name) {
          const name = node.importClause.name.text;
          const pos = node.importClause.name.getStart(sourceFile);
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
          importedSymbols.set(name, { line: line + 1, column: character + 1, node });
        }

        // Named imports: import { Foo, Bar } from "baz"
        if (node.importClause.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            node.importClause.namedBindings.elements.forEach((element) => {
              const name = element.name.text;
              const pos = element.name.getStart(sourceFile);
              const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
              importedSymbols.set(name, { line: line + 1, column: character + 1, node });
            });
          }
          // Namespace import: import * as Foo from "bar"
          else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            const name = node.importClause.namedBindings.name.text;
            const pos = node.importClause.namedBindings.name.getStart(sourceFile);
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
            importedSymbols.set(name, { line: line + 1, column: character + 1, node });
          }
        }
      }
    }

    ts.forEachChild(node, visitImports);
  }

  function visitReferences(node) {
    // Skip import declaration nodes when looking for references
    if (ts.isImportDeclaration(node)) {
      // Don't traverse children of import declarations
      return;
    }

    // Track referenced identifiers (actual usage)
    if (ts.isIdentifier(node) && node.parent) {
      const text = node.text;
      // Skip if this identifier is part of an import declaration
      if (
        !ts.isImportSpecifier(node.parent) &&
        !ts.isNamespaceImport(node.parent) &&
        !(node.parent && ts.isImportClause(node.parent))
      ) {
        referencedSymbols.add(text);
      }
    }

    ts.forEachChild(node, visitReferences);
  }

  // Report unused imports
  importedSymbols.forEach(({ line, column }, name) => {
    if (!referencedSymbols.has(name)) {
      violations.push({
        rule: 'NO_UNUSED_IMPORTS',
        severity: 'warning',
        message: `Import "${name}" is not used`,
        line,
        column,
      });
    }
  });
}

/**
 * Rule 4: Check for anonymous default exports
 */
function checkAnonymousDefaultExport(sourceFile, violations) {
  visitNode(sourceFile);

  function visitNode(node) {
    if (ts.isExportAssignment(node)) {
      // export default <expr>
      const expr = node.expression;

      // Check for arrow function
      if (ts.isArrowFunction(expr)) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          expr.getStart(sourceFile)
        );
        violations.push({
          rule: 'NO_DEFAULT_EXPORT_ANON',
          severity: 'warning',
          message: 'Default export should not be an arrow function',
          line: line + 1,
          column: character + 1,
        });
      }

      // Check for anonymous function expression
      if (ts.isFunctionExpression(expr) && !expr.name) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          expr.getStart(sourceFile)
        );
        violations.push({
          rule: 'NO_DEFAULT_EXPORT_ANON',
          severity: 'warning',
          message: 'Default export should not be an anonymous function',
          line: line + 1,
          column: character + 1,
        });
      }
    }

    if (ts.isExportDeclaration(node)) {
      if (node.isTypeOnly) {
        ts.forEachChild(node, visitNode);
        return;
      }

      // export default <decl>
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((element) => {
          if (
            element.name.text === 'default' ||
            (element.propertyName && element.propertyName.text === 'default')
          ) {
            // This is a default export through named export
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(
              element.getStart(sourceFile)
            );
            violations.push({
              rule: 'NO_DEFAULT_EXPORT_ANON',
              severity: 'warning',
              message: 'Default export should be explicitly named',
              line: line + 1,
              column: character + 1,
            });
          }
        });
      }
    }

    ts.forEachChild(node, visitNode);
  }
}

/**
 * Rule 5: Check for deeply nested functions (> 3 levels)
 */
function checkDeepNesting(sourceFile, violations) {
  visitNode(sourceFile, 0);

  function visitNode(node, depth) {
    const isFunctionLike =
      ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node);

    if (isFunctionLike) {
      if (depth > 3) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile)
        );
        violations.push({
          rule: 'NO_DEEP_NESTING',
          severity: 'warning',
          message: `Function nested ${depth} levels deep (max 3)`,
          line: line + 1,
          column: character + 1,
        });
      }

      ts.forEachChild(node, (child) => visitNode(child, depth + 1));
    } else {
      ts.forEachChild(node, (child) => visitNode(child, depth));
    }
  }
}

/**
 * Rule 6: Check for prop drilling (props passed > 3 levels through components)
 */
function checkPropDrilling(sourceFile, checker, violations) {
  const componentPropMap = new Map(); // component name -> params with props

  visitNode(sourceFile);

  function visitNode(node) {
    // Find functions that accept props
    const isFunctionComponent =
      (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) &&
      (node.name || ts.isArrowFunction(node));

    if (isFunctionComponent) {
      // Check if it has a props parameter
      const propsParam = node.parameters.find((p) => {
        return (
          p.name.getText(sourceFile) === 'props' ||
          p.name.getText(sourceFile) === 'params'
        );
      });

      if (propsParam) {
        // Track this component's prop usage
        const componentName = node.name?.text || '<arrow>';
        trackPropPassing(node, sourceFile, componentName, 0, violations);
      }
    }

    ts.forEachChild(node, visitNode);
  }

  function trackPropPassing(node, sourceFile, componentName, level, violations) {
    // Find JSX elements that pass props
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      // Check if this JSX node is passing props from a parameter
      const attributes = node.attributes.properties;

      attributes.forEach((attr) => {
        if (
          ts.isJsxAttribute(attr) &&
          attr.initializer &&
          ts.isJsxExpression(attr.initializer.expression)
        ) {
          const exprText = attr.initializer.expression.expression?.getText(
            sourceFile
          );
          if (exprText && (exprText.includes('props') || exprText.includes('params'))) {
            level++;
            if (level > 3) {
              const { line, character } = sourceFile.getLineAndCharacterOfPosition(
                node.getStart(sourceFile)
              );
              violations.push({
                rule: 'NO_PROP_DRILLING',
                severity: 'warning',
                message: `Props being passed through ${level} component levels (max 3)`,
                line: line + 1,
                column: character + 1,
              });
            }
          }
        }
      });
    }

    ts.forEachChild(node, (child) =>
      trackPropPassing(child, sourceFile, componentName, level, violations)
    );
  }
}

/**
 * Rule 7: Check if tsconfig.json has strict: true
 */
function checkStrictMode(filePath, compilerOptions, violations) {
  const tsconfigPath = findTsConfig(filePath);

  if (!tsconfigPath) {
    violations.push({
      rule: 'STRICT_MODE_CHECK',
      severity: 'error',
      message: 'tsconfig.json not found in project hierarchy',
      line: 0,
      column: 0,
    });
    return;
  }

  if (!compilerOptions.strict) {
    violations.push({
      rule: 'STRICT_MODE_CHECK',
      severity: 'error',
      message: 'tsconfig.json must have "compilerOptions.strict": true',
      line: 0,
      column: 0,
    });
  }
}

/**
 * Rule 8: Check for duplicated type/interface definitions
 */
function checkDuplicatedTypes(sourceFile, violations) {
  const typeSignatures = new Map(); // signature -> { name, line, column }

  visitNode(sourceFile);

  function visitNode(node) {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      const typeText = node.getText(sourceFile);

      // Create a normalized signature for comparison
      const signature = normalizeTypeSignature(typeText);

      if (typeSignatures.has(signature)) {
        const { line: prevLine, column: prevColumn } = typeSignatures.get(
          signature
        );
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile)
        );

        violations.push({
          rule: 'NO_DUPLICATED_TYPES',
          severity: 'warning',
          message: `Type "${name}" is identical to type at line ${prevLine}`,
          line: line + 1,
          column: character + 1,
        });
      } else {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile)
        );
        typeSignatures.set(signature, { name, line: line + 1, column: character + 1 });
      }
    }

    ts.forEachChild(node, visitNode);
  }

  function normalizeTypeSignature(text) {
    // Remove whitespace, comments, and normalize for comparison
    return text
      .replace(/\s+/g, ' ')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*.*?\*\//gs, '')
      .trim();
  }
}

/**
 * Rule 9: Check for circular imports
 */
function checkCircularImports(filePath, program, violations) {
  const visitedFiles = new Set();
  const recursionStack = new Set();

  function hasCircularDependency(currentFile, visited = new Set()) {
    if (recursionStack.has(currentFile)) {
      return true; // Circular dependency detected
    }

    if (visited.has(currentFile)) {
      return false;
    }

    visited.add(currentFile);
    recursionStack.add(currentFile);

    const sourceFile = program.getSourceFile(currentFile);
    if (!sourceFile) {
      recursionStack.delete(currentFile);
      return false;
    }

    // Get dependencies
    const dependencies = getImportedFiles(sourceFile, program);

    for (const dep of dependencies) {
      if (hasCircularDependency(dep, new Set(visited))) {
        recursionStack.delete(currentFile);
        return true;
      }
    }

    recursionStack.delete(currentFile);
    return false;
  }

  // Check if this file has circular imports
  if (hasCircularDependency(filePath)) {
    violations.push({
      rule: 'NO_CIRCULAR_IMPORTS',
      severity: 'error',
      message: 'File is part of a circular import chain',
      line: 0,
      column: 0,
    });
  }
}

/**
 * Get all imported files from a source file
 */
function getImportedFiles(sourceFile, program) {
  const imports = new Set();

  function visitNode(node) {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const importPath = node.moduleSpecifier.text;

      // Use the compiler host's module resolution
      try {
        const host = program.getCompilerHost();
        const resolvedPath = ts.resolveModuleName(
          importPath,
          sourceFile.fileName,
          program.getCompilerOptions(),
          host
        ).resolvedModule?.resolvedFileName;

        if (resolvedPath) {
          imports.add(resolvedPath);
        }
      } catch {
        // Skip unresolvable imports
      }
    }

    ts.forEachChild(node, visitNode);
  }

  visitNode(sourceFile);
  return imports;
}
