import React from 'react';

export function CleanComponent() {
  return (
    <div className="flex gap-4">
      <div className="max-w-lg p-0">
        <h1 className="text-4xl">Title</h1>
        <p className="text-base">Body text</p>
      </div>
    </div>
  );
}

export function SimpleButton() {
  return (
    <button className="px-4 py-2 text-sm font-bold">
      Click me
    </button>
  );
}
