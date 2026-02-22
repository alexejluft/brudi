---
name: visualizing-data
description: Use when building charts and data visualizations in React. Covers Recharts for standard charts, D3.js for custom visualizations, and accessibility best practices.
---

# Visualizing Data

## The Rule

**Recharts for standard charts. D3 for custom/complex. Server Components aggregate data. ResponsiveContainer always. ARIA labels mandatory.**

---

## Recharts: Standard Charts

```tsx
// ✅ Correct: Line, Bar, Pie — with ResponsiveContainer
'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function SalesChart({ data }: { data: { month: string; sales: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} role="img" aria-label="Monthly sales trend">
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#0052CC" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ❌ WRONG: Fixed width, no ResponsiveContainer → broken on mobile
// <LineChart width={800} height={300} data={data}>
```

---

## D3.js: Custom Visualizations

```tsx
// ✅ Correct: D3 for complex/custom — use ref, not DOM manipulation
'use client'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

export function CustomChart({ data }: { data: number[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()  // Clear before redraw

    const scale = d3.scaleLinear().domain([0, d3.max(data)!]).range([0, 200])
    svg.selectAll('rect').data(data).join('rect')
      .attr('x', (_, i) => i * 30).attr('y', d => 200 - scale(d))
      .attr('width', 25).attr('height', d => scale(d))
      .attr('fill', '#0052CC')
  }, [data])
  return <svg ref={svgRef} width="100%" height={200} role="img" aria-label="Custom bar chart" />
}

// ❌ WRONG: D3 for a simple bar chart → Recharts is 10x simpler
// ❌ WRONG: D3 direct DOM manipulation without React ref → memory leaks
```

---

## Server-Side Data Prep

```tsx
// ✅ Correct: Aggregate in Server Component, render in Client
// app/dashboard/page.tsx (Server Component)
export default async function Dashboard() {
  const data = await db.sales.groupBy({
    by: ['month'], _sum: { amount: true }
  })
  return <SalesChart data={data} />
}

// ❌ WRONG: Fetching entire raw dataset on client → slow, wasteful
```

---

## Accessibility + Performance

```tsx
// ✅ ARIA labels + color-blind safe palette (OkabeIto)
<ResponsiveContainer role="img" aria-label="Revenue by quarter">
  <BarChart data={data}><Bar dataKey="revenue" fill="#0173B2" /></BarChart>
</ResponsiveContainer>
const colors = ['#0173B2', '#DE8F05', '#029E73', '#D55E00', '#CC78BC']

// ✅ Lazy load + virtualize large datasets
const HeavyChart = dynamic(() => import('./HeavyChart'), { loading: () => <Skeleton /> })
const visibleData = data.slice(startIndex, startIndex + 100)  // 1000+ points
// ❌ WRONG: No ARIA, red/green palette, 10K+ points rendered at once
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| D3 for simple charts | Use Recharts — less code, more features |
| No ResponsiveContainer | Always wrap, `width="100%"` |
| No ARIA labels | `role="img"` + `aria-label` on container |
| Rendering 10K+ points | Aggregate server-side or virtualize |
| No loading state | `dynamic()` with loading skeleton |
| Red/green only palette | Use OkabeIto or ColorBrewer palettes |
