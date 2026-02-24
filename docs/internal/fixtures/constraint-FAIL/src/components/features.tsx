'use client';

export default function Features() {
  return (
    <div className="max-w-2xl py-8 bg-gray-800">
      <h2>Features</h2>
      <div className="grid gap-4 py-12">
        <div className="max-w-sm gap-2">Feature 1</div>
        <div className="max-w-md gap-6">Feature 2</div>
        <div className="max-w-lg gap-12">Feature 3</div>
        <div className="max-w-xl gap-20">Feature 4</div>
        <div className="max-w-7xl gap-24">Feature 5</div>
        <div className="max-w-4xl gap-32">Feature 6</div>
        <div className="max-w-5xl gap-40">Feature 7</div>
        <div className="max-w-6xl gap-48">Feature 8</div>
      </div>
    </div>
  );
}
