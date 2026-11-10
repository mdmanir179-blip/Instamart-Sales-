/**
 * Brand color palette manager:
 * - NAFA: Distinct Electric Purple / Violet (#7c3aed)
 * - averX: Distinct Fresh Emerald Green (#10b981)
 * - Any other brand: Deterministically mapped to distinctive, high-contrast palette
 */

export const KNOWN_BRAND_COLORS: Record<string, { bg: string; text: string; hex: string; lightBg: string; border: string }> = {
  nafa: {
    bg: 'bg-violet-600',
    text: 'text-violet-600 dark:text-violet-400',
    hex: '#7c3aed',
    lightBg: 'bg-violet-50 dark:bg-violet-950/60',
    border: 'border-violet-200 dark:border-violet-800'
  },
  averx: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600 dark:text-emerald-400',
    hex: '#10b981',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    border: 'border-emerald-200 dark:border-emerald-800'
  }
};

const EXTRA_BRAND_PALETTES = [
  { hex: '#2563eb', bg: 'bg-blue-600', text: 'text-blue-600 dark:text-blue-400', lightBg: 'bg-blue-50 dark:bg-blue-950/60', border: 'border-blue-200 dark:border-blue-800' },
  { hex: '#ea580c', bg: 'bg-orange-600', text: 'text-orange-600 dark:text-orange-400', lightBg: 'bg-orange-50 dark:bg-orange-950/60', border: 'border-orange-200 dark:border-orange-800' },
  { hex: '#e11d48', bg: 'bg-rose-600', text: 'text-rose-600 dark:text-rose-400', lightBg: 'bg-rose-50 dark:bg-rose-950/60', border: 'border-rose-200 dark:border-rose-800' },
  { hex: '#0891b2', bg: 'bg-cyan-600', text: 'text-cyan-600 dark:text-cyan-400', lightBg: 'bg-cyan-50 dark:bg-cyan-950/60', border: 'border-cyan-200 dark:border-cyan-800' },
  { hex: '#d97706', bg: 'bg-amber-600', text: 'text-amber-600 dark:text-amber-400', lightBg: 'bg-amber-50 dark:bg-amber-950/60', border: 'border-amber-200 dark:border-amber-800' },
  { hex: '#9333ea', bg: 'bg-purple-600', text: 'text-purple-600 dark:text-purple-400', lightBg: 'bg-purple-50 dark:bg-purple-950/60', border: 'border-purple-200 dark:border-purple-800' },
  { hex: '#0d9488', bg: 'bg-teal-600', text: 'text-teal-600 dark:text-teal-400', lightBg: 'bg-teal-50 dark:bg-teal-950/60', border: 'border-teal-200 dark:border-teal-800' },
];

export function getBrandTheme(brand: string) {
  const normalized = (brand || '').toLowerCase().trim();
  if (KNOWN_BRAND_COLORS[normalized]) {
    return KNOWN_BRAND_COLORS[normalized];
  }

  // Hash-based deterministic color assignment for unknown/newly added brands
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % EXTRA_BRAND_PALETTES.length;
  return EXTRA_BRAND_PALETTES[index];
}
