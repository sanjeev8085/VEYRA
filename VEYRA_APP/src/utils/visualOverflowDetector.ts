/**
 * VEYRA — Real-Time Visual DOM Overflow Detector
 * Performs bounding client rect calculations on every element to detect any visual clipping or container bursting.
 */

export interface OverflowViolation {
  element: HTMLElement;
  tagName: string;
  className: string;
  id: string;
  left: number;
  right: number;
  width: number;
  viewportWidth: number;
}

export function detectVisualOverflow(): OverflowViolation[] {
  if (typeof window === 'undefined' || typeof document === 'undefined') return [];

  const viewportWidth = window.innerWidth;
  const violations: OverflowViolation[] = [];

  const elements = document.querySelectorAll<HTMLElement>('*');

  elements.forEach((el) => {
    // Ignore hidden or zero-size elements
    if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

    // Ignore horizontal touch scroll containers where horizontal scroll is intended
    if (
      el.classList.contains('touch-scroll-row') ||
      el.classList.contains('table-responsive') ||
      style.overflowX === 'auto' ||
      style.overflowX === 'scroll'
    ) {
      return;
    }

    const rect = el.getBoundingClientRect();

    // Check if element extends past viewport bounds (with 1px threshold for rounding)
    if (rect.left < -1.5 || rect.right > viewportWidth + 1.5) {
      violations.push({
        element: el,
        tagName: el.tagName.toLowerCase(),
        className: el.className,
        id: el.id,
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        viewportWidth,
      });
    }
  });

  if (violations.length > 0) {
    console.warn(`[VEYRA Overflow Detector] Found ${violations.length} visual overflow violations at ${viewportWidth}px viewport:`, violations);
  }

  return violations;
}

if (typeof window !== 'undefined') {
  (window as unknown as { detectVisualOverflow: typeof detectVisualOverflow }).detectVisualOverflow = detectVisualOverflow;
}
