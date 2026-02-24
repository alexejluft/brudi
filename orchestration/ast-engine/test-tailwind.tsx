import React from 'react';
import { cn, clsx } from 'clsx';

export function ComponentWithViolations() {
  return (
    <div>
      {/* MAX_CONTAINER_VARIANTS violation: > 4 max-w-* values */}
      <div className="max-w-sm">Container 1</div>
      <div className="max-w-md">Container 2</div>
      <div className="max-w-lg">Container 3</div>
      <div className="max-w-xl">Container 4</div>
      <div className="max-w-2xl">Container 5 - VIOLATION</div>

      {/* SPACING_VARIANCE violation: > 6 unique spacing values */}
      <div className="py-2 px-3">Content</div>
      <div className="gap-4 space-y-2">Items</div>
      <div className="mt-5 mb-6">Section</div>
      <div className="ml-8 mr-7">Aside</div>
      <div className="pt-9 pb-10">Header</div>
      <div className="pl-11 pr-12">Footer</div>
      <div className="p-1">Extra - VIOLATION</div>

      {/* NO_ARBITRARY_VALUES violation: arbitrary values */}
      <div className="w-[100px] h-[200px]">Custom sizing</div>
      <div className="p-[24px]">Custom padding</div>
      <div className="text-[18px]">Custom text</div>

      {/* MAX_GRID_COLS violation: > 4 columns */}
      <div className="grid grid-cols-8">
        <div>Cell 1</div>
      </div>

      {/* TEXT_HIERARCHY_CHECK violation: body text too large */}
      <p className="text-3xl">Paragraph with huge text</p>
      <span className="text-2xl">Span too large</span>

      {/* FONT_VARIANT_LIMIT violation: > 6 font sizes */}
      <div className="text-xs">Extra small</div>
      <div className="text-sm">Small</div>
      <div className="text-base">Base</div>
      <div className="text-lg">Large</div>
      <div className="text-xl">Extra large</div>
      <div className="text-2xl">2XL</div>
      <div className="text-3xl">3XL - VIOLATION</div>

      {/* Good spacing usage */}
      <div className="p-0">Always OK - zero</div>
      <div className="m-0">Always OK - zero</div>
    </div>
  );
}

export function TextHierarchyExample() {
  return (
    <div>
      <h1 className="text-4xl">Main Title</h1>
      <h2 className="text-3xl">Subtitle</h2>
      <h3 className="text-2xl">Section</h3>
      <p className="text-base">Normal paragraph - Good</p>
      <p className="text-lg">Medium paragraph - Good</p>
      <p className="text-5xl">Huge paragraph - VIOLATION</p>
    </div>
  );
}

export function UtilityFunctionExample() {
  const classes = cn(
    'flex gap-2 mt-4',
    clsx({
      'text-xl': true,
      'font-bold': false,
    })
  );

  return <div className={classes}>Using utility functions</div>;
}
