export default function TailwindChaos() {
  return (
    <div>
      <div className="max-w-xs">A</div>
      <div className="max-w-sm">B</div>
      <div className="max-w-md">C</div>
      <div className="max-w-lg">D</div>
      <div className="max-w-xl">E</div>
      <div className="max-w-2xl">F</div>
      <div className="max-w-3xl">G</div>
      <p className="py-1 py-2 py-3 py-4 py-5 py-6 py-8 py-10 py-12 py-16 py-20 py-24 text-9xl">
        Giant text
      </p>
      <div className="w-[347px] h-[123px] p-[15px]">Arbitrary values</div>
      <div className="grid grid-cols-8">Too many columns</div>
    </div>
  )
}
