import { analyzeTailwind } from './tailwind-analyzer.js';

// Create a test file
const testContent = `
export function TestComponent() {
  return (
    <div className="sm:hover:bg-blue-500 -mt-4 w-[123px] max-w-4xl md:max-w-2xl">
      <p className="text-2xl font-bold">Heading</p>
      <span className="text-lg py-4 px-6">Body text</span>
      <div className="grid-cols-5 gap-4 space-x-2">Grid</div>
    </div>
  );
}
`;

import { writeFileSync } from 'fs';
writeFileSync('/tmp/test-tailwind.jsx', testContent);

const result = analyzeTailwind('/tmp/test-tailwind.jsx');
console.log('Analysis Results:');
console.log(JSON.stringify(result, null, 2));
