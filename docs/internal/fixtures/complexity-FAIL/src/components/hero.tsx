'use client';

export default function Hero() {
  return (
    <section className="min-h-screen bg-slate-900">
      <h1 className="text-6xl font-bold">Missing animations and tokens</h1>
      <p>
        Only 1 easing type, transition: all forbidden pattern, no materiality tokens
      </p>
      <style>{`
        .btn {
          transition: all 0.3s ease;
          background-color: #3b82f6;
        }
        .btn:hover {
          background-color: #2563eb;
        }
      `}</style>
      <button className="btn px-8 py-4">Click Me</button>
    </section>
  );
}
