/**
 * DOM Extractor — uses Playwright to extract computed styles and layout metrics
 */
import { chromium } from 'playwright';

/**
 * Normalize RGB/RGBA color values to a standard form
 * Converts rgb(255, 0, 0) and rgba(255, 0, 0, 1) to normalized hex or rgb string
 */
function normalizeColor(colorStr) {
  if (!colorStr || colorStr === 'transparent') return null;

  // If already rgb/rgba format, normalize it
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    // Return normalized rgb string
    return `rgb(${r},${g},${b})`;
  }

  // If hex color, return as-is
  if (colorStr.match(/^#[0-9a-fA-F]{3,6}$/)) {
    return colorStr.toLowerCase();
  }

  // For named colors, return as-is
  return colorStr;
}

export async function extractDOMMetrics(htmlPath) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  const metrics = await page.evaluate(() => {
    const results = {
      headings: [],
      sections: [],
      textElements: [],
      grids: [],
      buttons: [],
      animations: [],
      colors: [],
      fontSizes: [],
      animationCount: 0,
      totalElements: 0,
    };

    const colorsSet = new Set();
    const fontSizesSet = new Set();
    let animationCount = 0;

    // Helper function to normalize colors
    const normalizeColor = (colorStr) => {
      if (!colorStr || colorStr === 'transparent') return null;
      const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        return `rgb(${r},${g},${b})`;
      }
      if (colorStr.match(/^#[0-9a-fA-F]{3,6}$/)) {
        return colorStr.toLowerCase();
      }
      return colorStr;
    };

    // Extract all elements
    const allElements = document.querySelectorAll('*');
    results.totalElements = allElements.length;

    // Headings
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
      const styles = window.getComputedStyle(el);
      results.headings.push({
        tag: el.tagName.toLowerCase(),
        text: el.textContent.trim().substring(0, 50),
        fontSize: parseFloat(styles.fontSize),
        fontWeight: styles.fontWeight,
        lineHeight: parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2,
        rect: el.getBoundingClientRect().toJSON(),
      });

      // Extract heading colors
      const textColor = normalizeColor(styles.color);
      if (textColor) colorsSet.add(textColor);
      const bgColor = normalizeColor(styles.backgroundColor);
      if (bgColor) colorsSet.add(bgColor);
    });

    // Sections
    document.querySelectorAll('section, [class*="section"], [id]').forEach(el => {
      if (el.tagName === 'SECTION' || el.getAttribute('role') === 'region') {
        const styles = window.getComputedStyle(el);
        results.sections.push({
          id: el.id || null,
          tag: el.tagName.toLowerCase(),
          paddingTop: parseFloat(styles.paddingTop),
          paddingBottom: parseFloat(styles.paddingBottom),
          height: el.getBoundingClientRect().height,
          childCount: el.children.length,
          rect: el.getBoundingClientRect().toJSON(),
        });

        // Extract section colors
        const bgColor = normalizeColor(styles.backgroundColor);
        if (bgColor) colorsSet.add(bgColor);
      }
    });

    // Text elements (p, span, li, a with text)
    document.querySelectorAll('p, span, li, a, label, td, th').forEach(el => {
      if (el.textContent.trim().length > 0) {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        fontSizesSet.add(Math.round(fontSize));
        results.textElements.push({
          tag: el.tagName.toLowerCase(),
          fontSize,
          lineHeight: parseFloat(styles.lineHeight) || fontSize * 1.5,
          color: styles.color,
          rect: el.getBoundingClientRect().toJSON(),
        });

        // Extract text colors
        const textColor = normalizeColor(styles.color);
        if (textColor) colorsSet.add(textColor);
        const bgColor = normalizeColor(styles.backgroundColor);
        if (bgColor) colorsSet.add(bgColor);
      }
    });

    // Grid containers
    document.querySelectorAll('[class*="grid"]').forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.display === 'grid') {
        const cols = styles.gridTemplateColumns.split(' ').filter(c => c !== '').length;
        results.grids.push({
          columns: cols,
          childCount: el.children.length,
          rect: el.getBoundingClientRect().toJSON(),
          childRects: Array.from(el.children).map(c => c.getBoundingClientRect().toJSON()),
        });
      }
    });

    // Buttons / CTAs
    document.querySelectorAll('button, a[class*="btn"], a[class*="cta"], [role="button"]').forEach(el => {
      const styles = window.getComputedStyle(el);
      results.buttons.push({
        text: el.textContent.trim().substring(0, 50),
        fontSize: parseFloat(styles.fontSize),
        padding: parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom),
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        rect: el.getBoundingClientRect().toJSON(),
      });

      // Extract button colors
      const textColor = normalizeColor(styles.color);
      if (textColor) colorsSet.add(textColor);
      const bgColor = normalizeColor(styles.backgroundColor);
      if (bgColor) colorsSet.add(bgColor);
    });

    // Detect animations and transitions
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const animation = styles.animation || styles.animationName;
      const transition = styles.transition;
      const willChange = styles.willChange;

      // Check if element has animation that is not 'none'
      if (animation && animation !== 'none') {
        animationCount++;
      }
      // Check if element has transition that is not the default
      else if (transition && transition !== 'all 0s ease 0s') {
        animationCount++;
      }
      // Check for will-change property (indicates planned animation)
      else if (willChange && willChange !== 'auto') {
        animationCount++;
      }
    });

    // Convert Sets to Arrays for JSON serialization
    results.colors = Array.from(colorsSet);
    results.fontSizes = Array.from(fontSizesSet);
    results.animationCount = animationCount;

    return results;
  });

  await browser.close();
  return metrics;
}
