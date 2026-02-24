// FAIL: NO_ARBITRARY_VALUES - Arbitrary Tailwind values instead of predefined utilities
// Expected violations: w-[123px], h-[456px], p-[25px] and similar arbitrary values

export default function ArbitraryValues() {
  return (
    <div className="w-[847px] h-[532px] p-[17px]">
      <section className="max-w-[1200px] min-h-[800px]">
        <div className="flex gap-[23px]">
          <div className="w-[300px] h-[250px]">Box 1</div>
          <div className="flex-1">
            <p className="text-[18px] leading-[1.6]">
              Custom sized paragraph with arbitrary line height
            </p>
          </div>
        </div>
      </section>
      <div className="rounded-[12px] border-[3px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        Card with arbitrary border and shadow
      </div>
    </div>
  )
}
