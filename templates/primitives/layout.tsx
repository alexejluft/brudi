'use client';

import React, { ReactNode, ElementType } from 'react';

/**
 * Container — Enforces consistent max-width and horizontal padding
 *
 * Use this as the universal wrapper for section content to ensure
 * consistent padding and centering across the entire project.
 *
 * @example
 * <Section id="features" spacing="lg">
 *   <Container>
 *     <h2>Our Features</h2>
 *     <p>Description...</p>
 *   </Container>
 * </Section>
 */

type ContainerSize = 'narrow' | 'default' | 'wide' | 'full';

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

const sizeMap: Record<ContainerSize, string> = {
  narrow: 'max-w-4xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
};

export function Container({
  children,
  size = 'default',
  className = '',
}: ContainerProps): JSX.Element {
  const sizeClass = sizeMap[size];

  return (
    <div className={`mx-auto ${sizeClass} px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Section — Wraps content sections with consistent vertical spacing
 *
 * Every section MUST have an `id` prop for navigation anchors and analytics.
 * Use the `as` prop for semantic HTML (section, article, aside).
 * Use `spacing` to control py- padding: sm=py-16, md=py-24, lg=py-32, xl=py-40
 *
 * @example
 * <Section id="hero" spacing="lg" as="section">
 *   <Container>
 *     <h1>Welcome</h1>
 *   </Container>
 * </Section>
 */

type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl';

interface SectionProps {
  children: ReactNode;
  id: string; // REQUIRED for navigation and tracking
  spacing?: SectionSpacing;
  as?: ElementType;
  className?: string;
}

const spacingMap: Record<SectionSpacing, string> = {
  sm: 'py-16',
  md: 'py-24',
  lg: 'py-32',
  xl: 'py-40',
};

export function Section({
  children,
  id,
  spacing = 'md',
  as: Component = 'section',
  className = '',
}: SectionProps): JSX.Element {
  if (!id) {
    throw new Error('Section component requires an `id` prop for navigation and analytics.');
  }

  const spacingClass = spacingMap[spacing];

  return (
    <Component id={id} className={`${spacingClass} ${className}`}>
      {children}
    </Component>
  );
}

/**
 * Stack — Vertical layout with consistent gap
 *
 * Use this for flexbox column layouts with predictable spacing.
 * Automatically sets flex-direction: column.
 *
 * @example
 * <Stack gap="lg" className="items-center">
 *   <h3>Title</h3>
 *   <p>Description</p>
 * </Stack>
 */

type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface StackProps {
  children: ReactNode;
  gap?: StackGap;
  className?: string;
}

const gapMap: Record<StackGap, string> = {
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export function Stack({
  children,
  gap = 'md',
  className = '',
}: StackProps): JSX.Element {
  const gapClass = gapMap[gap];

  return (
    <div className={`flex flex-col ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Grid — Responsive grid with mobile-first sensible defaults
 *
 * Default: 1 column on mobile, 2 on md, 3 on lg
 * Customize with the `cols` prop:
 *
 * @example
 * <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 */

interface GridColConfig {
  sm?: number;
  md?: number;
  lg?: number;
}

interface GridProps {
  children: ReactNode;
  cols?: GridColConfig;
  gap?: StackGap;
  className?: string;
}

export function Grid({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className = '',
}: GridProps): JSX.Element {
  const gapClass = gapMap[gap];

  // Build grid-template-columns string for each breakpoint
  const smCols = cols.sm ?? 1;
  const mdCols = cols.md ?? 2;
  const lgCols = cols.lg ?? 3;

  const gridClasses = `
    grid
    ${gapClass}
    [grid-template-columns:repeat(${smCols},minmax(0,1fr))]
    sm:[grid-template-columns:repeat(${mdCols},minmax(0,1fr))]
    lg:[grid-template-columns:repeat(${lgCols},minmax(0,1fr))]
    ${className}
  `.trim();

  return <div className={gridClasses}>{children}</div>;
}

/**
 * LayoutDebug — Visual debugging component to verify spacing
 *
 * Use sparingly during development to ensure spacing is consistent.
 * Shows: spacing token names, gap values, max-width constraints.
 *
 * @example
 * <LayoutDebug>
 *   <Container size="wide">
 *     <h2>Content here</h2>
 *   </Container>
 * </LayoutDebug>
 */

interface LayoutDebugProps {
  children: ReactNode;
  showGrid?: boolean;
}

export function LayoutDebug({
  children,
  showGrid = true,
}: LayoutDebugProps): JSX.Element {
  return (
    <div
      className={`${showGrid ? '[background-image:linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] [background-size:8px_100%]' : ''}`}
    >
      {children}
    </div>
  );
}
