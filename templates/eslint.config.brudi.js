/**
 * Brudi Creative DNA ESLint Configuration Template
 *
 * Copy this file to your project's root as eslint.config.js
 * and update the import path to match your project structure.
 *
 * ESLint 9+ (Flat Config) required
 *
 * Usage:
 * 1. Copy to: <project-root>/eslint.config.js
 * 2. Update brudi import path if needed
 * 3. npm install eslint@9
 * 4. npm run lint
 */

import brudiPlugin from './orchestration/eslint-rules/brudi-creative-dna.js';
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      '.astro/**',
      'coverage/**',
      '.git/**',
    ],
  },

  // Base ESLint config for all files
  {
    files: ['**/*.{js,jsx,ts,tsx,mts,mjs}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // TypeScript support (if using TypeScript)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // React support (if using React)
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Use TypeScript instead
      'react/no-unescaped-entities': 'warn',
    },
  },

  // BRUDI CREATIVE DNA RULES (Core)
  {
    files: ['**/*.{jsx,tsx,js,ts}'],
    plugins: {
      brudi: brudiPlugin,
    },
    rules: {
      // Performance: Layout animations cause jank
      'brudi/no-layout-animation': 'warn',

      // Performance: transition: all animates unintended properties
      'brudi/no-transition-all': 'error',

      // React Motion: gsap.from() causes FOUC
      'brudi/no-gsap-from-in-react': 'error',

      // Memory: ScrollTrigger cleanup prevents leaks
      'brudi/scrolltrigger-cleanup-required': 'warn',
    },
  },

  // Custom rules for components
  {
    files: ['src/components/**/*.{jsx,tsx}'],
    rules: {
      // Stricter in component libraries
      'brudi/no-layout-animation': 'error',
      'brudi/no-transition-all': 'error',
    },
  },

  // Relax rules for config files
  {
    files: ['next.config.js', 'tailwind.config.js', 'postcss.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
