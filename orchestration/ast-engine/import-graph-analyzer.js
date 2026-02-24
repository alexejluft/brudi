import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';

/**
 * Analyzes import relationships across files
 * @param {string} projectDir - Path to project directory
 * @returns {Object} { violations: [...], metrics: {...} }
 */
export function analyzeImportGraph(projectDir) {
  const violations = [];
  const metrics = {
    circularDependencies: 0,
    maxImportDepth: 0,
    fileCount: 0,
  };

  if (!fs.existsSync(projectDir)) {
    return { violations: [], metrics };
  }

  try {
    // Get all TypeScript files
    const files = getAllTsFiles(projectDir);
    metrics.fileCount = files.length;

    if (files.length === 0) {
      return { violations: [], metrics };
    }

    // Load path alias config
    const pathAliases = loadPathAliases(projectDir);

    // Build dependency graph
    const graph = buildDependencyGraph(files, projectDir, pathAliases);

    // Rule 1: CIRCULAR_DEPENDENCY
    checkCircularDependencies(graph, violations, metrics);

    // Rule 2: DEEP_IMPORT_CHAIN
    checkDeepImportChain(graph, violations, metrics);

    // Rule 3: PRIMITIVES_NOT_USED (AST-based)
    checkUnusedPrimitives(projectDir, files, violations);

    // Rule 4: PRIMITIVES_OVERWRITTEN (new check)
    checkPrimitivesOverwritten(files, violations);

    // Rule 5: DUPLICATE_IMPORT
    checkDuplicateImports(graph, violations);
  } catch (error) {
    violations.push({
      rule: 'GRAPH_ERROR',
      severity: 'error',
      message: `Failed to analyze import graph: ${error.message}`,
    });
  }

  return { violations, metrics };
}

/**
 * Load path aliases from tsconfig.json or jsconfig.json
 */
function loadPathAliases(projectDir) {
  const aliases = {};

  // Try tsconfig.json first
  const tsconfigPath = path.join(projectDir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      if (tsconfig.compilerOptions?.paths) {
        for (const [alias, targets] of Object.entries(tsconfig.compilerOptions.paths)) {
          const baseUrl = tsconfig.compilerOptions.baseUrl || '.';
          if (targets[0]) {
            // Convert @/* -> src/* pattern to actual mapping
            const pattern = alias.replace(/\/\*$/, '');
            const target = targets[0].replace(/\/\*$/, '');
            aliases[pattern] = path.resolve(projectDir, baseUrl, target);
          }
        }
      }
      return aliases;
    } catch (error) {
      // Ignore parse errors
    }
  }

  // Try jsconfig.json
  const jsconfigPath = path.join(projectDir, 'jsconfig.json');
  if (fs.existsSync(jsconfigPath)) {
    try {
      const jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf-8'));
      if (jsconfig.compilerOptions?.paths) {
        for (const [alias, targets] of Object.entries(jsconfig.compilerOptions.paths)) {
          const baseUrl = jsconfig.compilerOptions.baseUrl || '.';
          if (targets[0]) {
            const pattern = alias.replace(/\/\*$/, '');
            const target = targets[0].replace(/\/\*$/, '');
            aliases[pattern] = path.resolve(projectDir, baseUrl, target);
          }
        }
      }
      return aliases;
    } catch (error) {
      // Ignore parse errors
    }
  }

  // Default: @/ -> src/
  aliases['@'] = path.join(projectDir, 'src');

  return aliases;
}

/**
 * Get all .ts and .tsx files in directory recursively
 */
function getAllTsFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  try {
    const entries = fs.readdirSync(dir);
    entries.forEach((entry) => {
      // Skip node_modules and hidden directories
      if (entry.startsWith('.') || entry === 'node_modules') {
        return;
      }

      const fullPath = path.join(dir, entry);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          files.push(...getAllTsFiles(fullPath));
        } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
          files.push(fullPath);
        }
      } catch (error) {
        // Ignore stat errors
      }
    });
  } catch (error) {
    // Ignore read errors
  }

  return files;
}

/**
 * Build dependency graph from import statements
 */
function buildDependencyGraph(files, projectDir, pathAliases) {
  const graph = new Map(); // filePath -> Set of imported files

  files.forEach((file) => {
    graph.set(file, new Set());

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy'],
        allowImportExportEverywhere: true,
      });

      // Extract imports
      ast.program.body.forEach((node) => {
        if (node.type === 'ImportDeclaration') {
          const source = node.source.value;
          const resolvedPath = resolveImportPath(source, file, projectDir, pathAliases);

          if (resolvedPath && fs.existsSync(resolvedPath)) {
            graph.get(file).add(resolvedPath);
          }
        }
      });
    } catch (error) {
      // Ignore parse errors
    }
  });

  return graph;
}

/**
 * Resolve import path to absolute file path
 */
function resolveImportPath(source, fromFile, projectDir, pathAliases) {
  if (source.startsWith('.')) {
    // Relative import
    const dir = path.dirname(fromFile);
    let resolved = path.resolve(dir, source);

    // Try with extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    for (const ext of extensions) {
      if (fs.existsSync(resolved + ext)) {
        return resolved + ext;
      }
    }

    // Try as directory with index
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      for (const ext of extensions) {
        const indexPath = path.join(resolved, 'index' + ext);
        if (fs.existsSync(indexPath)) {
          return indexPath;
        }
      }
    }

    return resolved;
  }

  // Check for path aliases (e.g., @/ imports)
  if (pathAliases) {
    for (const [alias, basePath] of Object.entries(pathAliases)) {
      if (source.startsWith(alias + '/') || source === alias) {
        // Replace alias with actual path
        const relative = source.startsWith(alias + '/')
          ? source.substring(alias.length + 1)
          : '';
        let resolved = relative ? path.join(basePath, relative) : basePath;

        // Try with extensions
        const extensions = ['.ts', '.tsx', '.js', '.jsx'];
        for (const ext of extensions) {
          if (fs.existsSync(resolved + ext)) {
            return resolved + ext;
          }
        }

        // Try as directory with index
        if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
          for (const ext of extensions) {
            const indexPath = path.join(resolved, 'index' + ext);
            if (fs.existsSync(indexPath)) {
              return indexPath;
            }
          }
        }

        return resolved;
      }
    }
  }

  // Absolute import - skip (from node_modules)
  return null;
}

/**
 * Check for circular dependencies using DFS
 */
function checkCircularDependencies(graph, violations, metrics) {
  const visited = new Set();
  const recursionStack = new Set();
  const cycles = [];

  function dfs(node, path) {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = graph.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, path);
      } else if (recursionStack.has(neighbor)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart).concat(neighbor);
        const cycleStr = cycle.join(' -> ');

        // Avoid duplicate reports
        if (!cycles.some((c) => c === cycleStr)) {
          cycles.push(cycleStr);
        }
      }
    }

    path.pop();
    recursionStack.delete(node);
  }

  // Check each node
  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node, []);
    }
  }

  // Report cycles
  cycles.forEach((cycle) => {
    violations.push({
      rule: 'CIRCULAR_DEPENDENCY',
      severity: 'error',
      message: `Circular dependency detected: ${cycle}`,
    });
  });

  metrics.circularDependencies = cycles.length;
}

/**
 * Check for deep import chains (> 4 levels)
 */
function checkDeepImportChain(graph, violations, metrics) {
  let maxDepth = 0;

  function calculateDepth(node, visited = new Set()) {
    if (visited.has(node)) {
      return 0; // Cycle detected, stop
    }

    visited.add(node);
    const neighbors = graph.get(node) || new Set();

    if (neighbors.size === 0) {
      return 1;
    }

    let maxChildDepth = 0;
    for (const neighbor of neighbors) {
      const childDepth = calculateDepth(neighbor, new Set(visited));
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }

    return maxChildDepth + 1;
  }

  // Find the longest import chain from entry points
  for (const node of graph.keys()) {
    const depth = calculateDepth(node);
    maxDepth = Math.max(maxDepth, depth);
  }

  metrics.maxImportDepth = maxDepth;

  if (maxDepth > 4) {
    violations.push({
      rule: 'DEEP_IMPORT_CHAIN',
      severity: 'warning',
      message: `Import chain depth is ${maxDepth}, exceeds max of 4 levels`,
    });
  }
}

/**
 * Check if src/primitives/ directory exists but is not used (AST-based)
 */
function checkUnusedPrimitives(projectDir, files, violations) {
  const primitivesDir = path.join(projectDir, 'src', 'primitives');

  if (!fs.existsSync(primitivesDir)) {
    return;
  }

  // Check if any file imports from primitives using AST
  let isPrimitivesUsed = false;

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy'],
        allowImportExportEverywhere: true,
      });

      // Look for ImportDeclaration nodes with primitives in source
      ast.program.body.forEach((node) => {
        if (node.type === 'ImportDeclaration') {
          const importSource = node.source.value;
          // Check if import contains 'primitives' directory reference
          if (
            importSource.includes('/primitives') ||
            importSource.includes('primitives/') ||
            importSource === 'primitives'
          ) {
            isPrimitivesUsed = true;
          }
        }
      });
    } catch (error) {
      // Ignore parse errors
    }
  });

  if (!isPrimitivesUsed) {
    violations.push({
      rule: 'PRIMITIVES_NOT_USED',
      severity: 'warning',
      message: 'src/primitives/ directory exists but is not imported anywhere',
    });
  }
}

/**
 * Check for duplicate imports (same module in > 5 files)
 */
function checkDuplicateImports(graph, violations) {
  const importCounts = new Map(); // source -> count

  for (const neighbors of graph.values()) {
    for (const neighbor of neighbors) {
      const count = importCounts.get(neighbor) || 0;
      importCounts.set(neighbor, count + 1);
    }
  }

  // Report modules imported in > 5 files
  importCounts.forEach((count, module) => {
    if (count > 5) {
      violations.push({
        rule: 'DUPLICATE_IMPORT',
        severity: 'warning',
        message: `Module "${path.basename(module)}" is imported in ${count} files. Consider re-exporting.`,
      });
    }
  });
}

/**
 * Check if files import from primitives and re-export modified versions
 */
function checkPrimitivesOverwritten(files, violations) {
  const primitivesReExports = {};

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy'],
        allowImportExportEverywhere: true,
      });

      const imports = new Set();
      const reExports = new Set();

      // Collect all imports from primitives
      ast.program.body.forEach((node) => {
        if (node.type === 'ImportDeclaration') {
          const importSource = node.source.value;
          if (
            importSource.includes('/primitives') ||
            importSource.includes('primitives/')
          ) {
            // Collect imported names
            node.specifiers.forEach((spec) => {
              if (spec.type === 'ImportSpecifier') {
                imports.add(spec.imported.name);
              } else if (spec.type === 'ImportDefaultSpecifier') {
                imports.add('default');
              }
            });
          }
        }
      });

      // Check for re-exports of imported names
      ast.program.body.forEach((node) => {
        if (node.type === 'ExportNamedDeclaration') {
          // Check if this re-exports from primitives
          if (node.source?.value.includes('/primitives')) {
            if (node.specifiers) {
              node.specifiers.forEach((spec) => {
                if (spec.type === 'ExportSpecifier') {
                  reExports.add(spec.exported.name);
                }
              });
            }
          }

          // Check if this exports something that was imported from primitives
          if (node.declaration) {
            if (
              node.declaration.type === 'FunctionDeclaration' ||
              node.declaration.type === 'ClassDeclaration'
            ) {
              if (node.declaration.id && imports.has(node.declaration.id.name)) {
                reExports.add(node.declaration.id.name);
              }
            }
          }
        } else if (node.type === 'ExportDefaultDeclaration') {
          if (node.declaration) {
            if (
              node.declaration.type === 'Identifier' &&
              imports.has(node.declaration.name)
            ) {
              reExports.add('default');
            }
          }
        }
      });

      if (imports.size > 0 && reExports.size > 0) {
        const overwritten = Array.from(reExports);
        if (!primitivesReExports[file]) {
          primitivesReExports[file] = overwritten;
        }
      }
    } catch (error) {
      // Ignore parse errors
    }
  });

  // Report files that overwrite primitives
  for (const [file, overwritten] of Object.entries(primitivesReExports)) {
    if (overwritten.length > 0) {
      violations.push({
        rule: 'PRIMITIVES_OVERWRITTEN',
        severity: 'warning',
        message: `${path.relative(
          path.dirname(file),
          file
        )} re-exports modified versions of primitives: ${overwritten.join(', ')}`,
      });
    }
  }
}
