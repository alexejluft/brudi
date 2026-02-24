/**
 * Brudi Creative DNA ESLint Plugin
 * Enforces Alex's award-level design standards through static analysis
 *
 * Flat Config (ESLint 9+) compatible plugin
 *
 * Rules:
 * - no-transition-all: Prevents performance-killing transition: all
 * - no-gsap-from-in-react: Prevents FOUC with gsap.from() in React
 * - scrolltrigger-cleanup-required: Ensures ScrollTrigger cleanup in useEffect
 * - no-layout-animation: Prevents jank from layout property animations
 */

const noTransitionAllRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow transition: all - use specific properties instead',
      category: 'Performance',
      recommended: true,
    },
    messages: {
      transitionAll:
        "Use specific transition properties (transform, box-shadow, background-color). 'transition: all' causes performance issues and animates unintended properties.",
    },
    schema: [],
  },
  create(context) {
    return {
      // Detect in JSX attributes
      JSXAttribute(node) {
        if (!node.name) return;

        const attrName = node.name.name || node.name.property?.name || '';

        // Check for className attribute with transition-all
        if (attrName === 'className' && node.value?.type === 'Literal') {
          const classValue = node.value.value || '';
          if (typeof classValue === 'string' && classValue.includes('transition-all')) {
            context.report({
              node,
              messageId: 'transitionAll',
            });
          }
        }

        // Check for style attribute
        if (attrName === 'style' && node.value?.type === 'JSXExpressionContainer') {
          const objExpr = node.value.expression;
          if (objExpr?.type === 'ObjectExpression') {
            objExpr.properties?.forEach((prop) => {
              if (
                (prop.key?.name === 'transition' || prop.key?.value === 'transition') &&
                prop.value?.type === 'Literal'
              ) {
                const transValue = prop.value.value || '';
                if (typeof transValue === 'string' && transValue.includes('all')) {
                  context.report({
                    node: prop,
                    messageId: 'transitionAll',
                  });
                }
              }
            });
          }
        }
      },

      // Detect in CSS-in-JS style objects
      ObjectExpression(node) {
        node.properties?.forEach((prop) => {
          const keyName = prop.key?.name || prop.key?.value;
          if (keyName === 'transition' && prop.value?.type === 'Literal') {
            const value = prop.value.value || '';
            if (typeof value === 'string' && value.includes('all')) {
              context.report({
                node: prop,
                messageId: 'transitionAll',
              });
            }
          }
        });
      },

      // Detect in string literals (inline styles)
      Literal(node) {
        if (typeof node.value === 'string') {
          if (node.value.includes('transition:') && node.value.includes('all')) {
            // Only report if it looks like a style string
            const parent = node.parent;
            if (parent?.type === 'Property' || parent?.type === 'JSXAttribute') {
              // Already handled in specific checks
            }
          }
        }
      },
    };
  },
};

const noGsapFromInReactRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow gsap.from() in React - use gsap.set() + gsap.to() instead',
      category: 'Animation',
      recommended: true,
    },
    messages: {
      gsapFromFouc:
        "Use gsap.set() + gsap.to() instead of gsap.from(). gsap.from() causes FOUC (Flash of Unstyled Content) in React because the element renders in its final state first.",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        // Check for gsap.from()
        if (
          node.callee?.type === 'MemberExpression' &&
          (node.callee.object?.name === 'gsap' || node.callee.object?.property?.name === 'gsap') &&
          node.callee.property?.name === 'from'
        ) {
          context.report({
            node,
            messageId: 'gsapFromFouc',
          });
        }

        // Also catch: timeline.from()
        if (
          node.callee?.type === 'MemberExpression' &&
          node.callee.property?.name === 'from' &&
          (node.callee.object?.name?.includes('timeline') ||
            node.callee.object?.name?.includes('tl') ||
            node.callee.object?.name?.includes('sequence'))
        ) {
          context.report({
            node,
            messageId: 'gsapFromFouc',
          });
        }
      },
    };
  },
};

const scrolltriggerCleanupRequiredRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require cleanup of ScrollTrigger instances in useEffect',
      category: 'Memory',
      recommended: true,
    },
    messages: {
      missingCleanup:
        'ScrollTrigger must be cleaned up in useEffect return. Add cleanup: ScrollTrigger.getAll().forEach(st => st.kill()) or context.revert() to prevent memory leaks and duplicate triggers.',
    },
    schema: [],
  },
  create(context) {
    let inUseEffect = false;
    let hasScrollTrigger = false;
    let hasCleanup = false;
    let useEffectNode = null;

    return {
      CallExpression(node) {
        // Detect useEffect call
        if (
          node.callee?.name === 'useEffect' ||
          (node.callee?.type === 'MemberExpression' && node.callee.property?.name === 'useEffect')
        ) {
          inUseEffect = true;
          useEffectNode = node;
          hasScrollTrigger = false;
          hasCleanup = false;

          // Get the callback function (first argument)
          const callbackArg = node.arguments?.[0];
          if (callbackArg?.type === 'ArrowFunctionExpression' || callbackArg?.type === 'FunctionExpression') {
            const body = callbackArg.body;
            const bodyStmts = body?.type === 'BlockStatement' ? body.body : [body];

            // Check for ScrollTrigger in body
            const bodyText = context.getSourceCode().getText(callbackArg);
            if (bodyText.includes('ScrollTrigger') || bodyText.includes('scrollTrigger')) {
              hasScrollTrigger = true;
            }

            // Check if last statement is a return with cleanup
            if (bodyStmts && bodyStmts.length > 0) {
              const lastStmt = bodyStmts[bodyStmts.length - 1];
              if (lastStmt?.type === 'ReturnStatement') {
                const returnedFunc = lastStmt.argument;
                if (returnedFunc?.type === 'ArrowFunctionExpression' || returnedFunc?.type === 'FunctionExpression') {
                  const cleanupText = context.getSourceCode().getText(returnedFunc);
                  if (
                    cleanupText.includes('ScrollTrigger.getAll()') ||
                    cleanupText.includes('context.revert()') ||
                    cleanupText.includes('.kill()') ||
                    cleanupText.includes('.forEach')
                  ) {
                    hasCleanup = true;
                  }
                }
              }
            }

            // Report if missing cleanup
            if (hasScrollTrigger && !hasCleanup) {
              context.report({
                node: useEffectNode,
                messageId: 'missingCleanup',
              });
            }
          }

          inUseEffect = false;
        }
      },
    };
  },
};

const noLayoutAnimationRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow animation of layout properties - use transform instead',
      category: 'Performance',
      recommended: true,
    },
    messages: {
      layoutAnimation:
        'Animate transform (translateX/Y, scale) instead of layout properties (margin, width, height, padding, top, left, right, bottom). Layout animations cause jank and repaints.',
    },
    schema: [],
  },
  create(context) {
    const layoutProps = ['margin', 'width', 'height', 'padding', 'top', 'left', 'right', 'bottom', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];

    return {
      CallExpression(node) {
        // Detect gsap.to/from/fromTo calls
        if (
          node.callee?.type === 'MemberExpression' &&
          (node.callee.object?.name === 'gsap' || node.callee.object?.property?.name === 'gsap')
        ) {
          const methodName = node.callee.property?.name;
          if (['to', 'from', 'fromTo'].includes(methodName)) {
            // Second argument (for to/from) or third (for fromTo) is the vars object
            let varsObj = null;
            if (methodName === 'fromTo') {
              varsObj = node.arguments?.[2];
            } else {
              varsObj = node.arguments?.[1];
            }

            if (varsObj?.type === 'ObjectExpression') {
              varsObj.properties?.forEach((prop) => {
                const propName = prop.key?.name || prop.key?.value;
                if (layoutProps.includes(propName)) {
                  context.report({
                    node: prop,
                    messageId: 'layoutAnimation',
                  });
                }
              });
            }
          }
        }

        // Detect timeline.to/from/fromTo calls
        if (
          node.callee?.type === 'MemberExpression' &&
          ['to', 'from', 'fromTo'].includes(node.callee.property?.name) &&
          (node.callee.object?.name?.includes('timeline') ||
            node.callee.object?.name?.includes('tl') ||
            node.callee.object?.name?.includes('sequence'))
        ) {
          const tlMethodName = node.callee.property?.name;
          let varsObj = node.arguments?.[tlMethodName === 'fromTo' ? 2 : 1];
          if (varsObj?.type === 'ObjectExpression') {
            varsObj.properties?.forEach((prop) => {
              const propName = prop.key?.name || prop.key?.value;
              if (layoutProps.includes(propName)) {
                context.report({
                  node: prop,
                  messageId: 'layoutAnimation',
                });
              }
            });
          }
        }
      },

      // Detect CSS transitions on layout properties
      Property(node) {
        if (node.key?.type === 'Identifier' && node.key.name === 'transition') {
          if (node.value?.type === 'Literal') {
            const transValue = node.value.value || '';
            layoutProps.forEach((layoutProp) => {
              if (typeof transValue === 'string' && transValue.includes(layoutProp)) {
                context.report({
                  node,
                  messageId: 'layoutAnimation',
                });
              }
            });
          }
        }
      },
    };
  },
};

// Export as ESLint flat config plugin
module.exports = {
  rules: {
    'no-transition-all': noTransitionAllRule,
    'no-gsap-from-in-react': noGsapFromInReactRule,
    'scrolltrigger-cleanup-required': scrolltriggerCleanupRequiredRule,
    'no-layout-animation': noLayoutAnimationRule,
  },
};
