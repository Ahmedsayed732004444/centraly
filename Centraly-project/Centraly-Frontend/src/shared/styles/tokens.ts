/**
 * CENTRALY DESIGN SYSTEM — Design Tokens
 * Single source of truth for all shared class names.
 * Usage: import { tokens } from '@/shared/styles/tokens'
 */

export const tokens = {
  // --- Typography ---
  font: {
    label:      "text-sm font-semibold text-[var(--color-text-main)]",
    helperText: "text-xs text-[var(--color-text-muted)]",
    muted:      "text-sm text-[var(--color-text-muted)]",
  },

  // --- Form Inputs ---
  input: "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none",
  select: "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white",

  // --- Buttons ---
  btn: {
    primary:   "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
    secondary: "px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-main)] hover:bg-gray-100 font-medium text-sm",
    ghost:     "px-4 py-2 bg-gray-100 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-main)] hover:bg-gray-200 transition-colors font-medium",
    // Color-only (no padding/weight baked in) so callers compose their own sizing,
    // same way tokens.btn.secondary is composed with extra classes elsewhere.
    warning:   "bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50",
    success:   "bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50",
  },

  // --- Table ---
  table: {
    header: "px-6 py-3 font-semibold text-[var(--color-text-main)] text-sm whitespace-nowrap",
    cell:   "px-6 py-4",
  },

  // --- Badge ---
  badge: {
    indigo: "bg-indigo-50 text-[var(--color-primary)] px-2.5 py-1 rounded-full text-xs font-medium",
    success: "bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium",
    warning: "bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium",
    danger: "bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-medium",
    // Bordered status chips (e.g. a ticket's Pending/Delivered/Returned header badge) -
    // a different look from the pill badges above, used where a stronger outline reads
    // better against a colored panel.
    statusPending: "bg-yellow-50 text-yellow-800 border border-yellow-200",
    statusDelivered: "bg-green-50 text-green-800 border border-green-200",
    statusReturned: "bg-red-50 text-red-800 border border-red-200",
  },

  // --- Card / Surface ---
  card: "bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)]",

  // --- Dark summary/highlight panel (e.g. a totals card) ---
  darkSummaryPanel: {
    root: "bg-blue-900 text-white",
    divider: "border-blue-800",
    accent: "text-emerald-400",
  },

  // --- Sidebar ---
  sidebar: {
    root:       "w-64 bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)] flex flex-col h-screen fixed right-0 top-0 border-l border-[var(--color-sidebar-border)]",
    logo:       "h-16 flex items-center justify-center border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-logo)]",
    groupTitle: "px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2",
    link:       "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
    activeLink: "bg-[var(--color-primary)] text-white",
    hoverLink:  "hover:bg-[var(--color-sidebar-border)] hover:text-white",
  },
} as const;
