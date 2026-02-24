// Direct tokenizer test to show token structure
import * as parser from '@babel/parser';

function tokenizeClass(classString) {
  if (!classString || typeof classString !== 'string') {
    return null;
  }

  const raw = classString.trim();
  if (!raw) return null;

  let remaining = raw;
  const variants = [];
  let negative = false;
  let utility = '';
  let value = '';
  let arbitrary = false;

  const responsivePrefixes = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  const stateVariants = [
    'hover', 'focus', 'active', 'disabled', 'group-hover', 'group-focus',
    'focus-visible', 'focus-within', 'visited', 'target', 'first', 'last',
    'odd', 'even', 'only-child', 'only-of-type', 'empty', 'checked',
    'indeterminate', 'invalid', 'required', 'valid', 'read-only', 'read-write',
    'placeholder-shown', 'autofill', 'enabled', 'dark', 'light'
  ];
  const allVariants = [...responsivePrefixes, ...stateVariants];

  while (remaining.includes(':')) {
    const colonIndex = remaining.indexOf(':');
    const possibleVariant = remaining.substring(0, colonIndex);

    if (allVariants.includes(possibleVariant)) {
      variants.push(possibleVariant);
      remaining = remaining.substring(colonIndex + 1);
    } else {
      break;
    }
  }

  if (remaining.startsWith('-')) {
    negative = true;
    remaining = remaining.substring(1);
  }

  const arbitraryMatch = remaining.match(/^([a-z-]+)-\[(.+)\]$/);
  if (arbitraryMatch) {
    arbitrary = true;
    utility = arbitraryMatch[1];
    value = arbitraryMatch[2];
  } else {
    const dashIndex = remaining.lastIndexOf('-');
    if (dashIndex > 0) {
      utility = remaining.substring(0, dashIndex);
      value = remaining.substring(dashIndex + 1);
    } else if (dashIndex === 0) {
      utility = '';
      value = remaining.substring(1);
    } else {
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

// Test various class patterns
const testClasses = [
  'sm:hover:bg-blue-500',      // responsive + state variant + utility
  '-mt-4',                       // negative spacing
  'w-[123px]',                   // arbitrary value
  'grid-cols-4',                 // grid column
  'text-xl',                     // text size
  'flex',                        // single word utility
  'dark:bg-slate-900',           // dark mode variant
  'md:grid-cols-[1fr_2fr]',      // responsive + arbitrary
  'group-hover:opacity-50',      // state variant
];

console.log('Tokenizer Test Results:\n');
testClasses.forEach(cls => {
  const token = tokenizeClass(cls);
  console.log(`Input: "${cls}"`);
  console.log(`Output: ${JSON.stringify(token, null, 2)}`);
  console.log('---');
});
