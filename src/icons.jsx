// Shared icon components — no external package required.
// All icons are 24×24 viewBox Lucide-style SVGs.

const ic = (path, opts = {}) => {
  const Comp = ({ className = 'w-5 h-5' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill={opts.fill ? 'currentColor' : 'none'}
      stroke={opts.fill ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
  Comp.displayName = opts.name || 'Icon';
  return Comp;
};

export const LayoutDashboard = ic(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>,
  { name: 'LayoutDashboard' }
);

export const Tag = ic(
  <path d="M12 2H7a2 2 0 0 0-2 2v5l9.29 9.29a2 2 0 0 0 2.82 0l3.18-3.18a2 2 0 0 0 0-2.82L12 2zM7.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />,
  { name: 'Tag' }
);

export const UtensilsCrossed = ic(
  <>
    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
    <path d="m15 15 3.35-3.35a2.12 2.12 0 0 1 3 3L18 18l2 2-6 2-2-6 2 2z" />
    <path d="m2 2 7.27 7.27" />
    <path d="M5 11 2 22l11-3-5.27-5.27" />
  </>,
  { name: 'UtensilsCrossed' }
);

export const ShoppingBag = ic(
  <>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </>,
  { name: 'ShoppingBag' }
);

export const LogOut = ic(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </>,
  { name: 'LogOut' }
);

export const Menu = ic(
  <>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </>,
  { name: 'Menu' }
);

export const X = ic(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>,
  { name: 'X' }
);

export const Pencil = ic(
  <>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </>,
  { name: 'Pencil' }
);

export const Plus = ic(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>,
  { name: 'Plus' }
);

export const Zap = ic(
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  { name: 'Zap' }
);

export const ChevronRight = ic(
  <polyline points="9 18 15 12 9 6" />,
  { name: 'ChevronRight' }
);

export const BarChart3 = ic(
  <>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </>,
  { name: 'BarChart3' }
);

export const Truck = ic(
  <>
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
    <rect x="9" y="11" width="14" height="10" rx="2" />
    <circle cx="12" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
  </>,
  { name: 'Truck' }
);

export const AlertTriangle = ic(
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>,
  { name: 'AlertTriangle' }
);

export const Lock = ic(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>,
  { name: 'Lock' }
);

export const Loader2 = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
Loader2.displayName = 'Loader2';

export const RefreshCw = ic(
  <>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </>,
  { name: 'RefreshCw' }
);

export const Receipt = ic(
  <>
    <polyline points="5 7 5 3 19 3 19 7" />
    <line x1="5" y1="7" x2="19" y2="7" />
    <path d="M19 7v14l-3-2-2 2-2-2-2 2-3-2V7" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </>,
  { name: 'Receipt' }
);

export const Clock = ic(
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>,
  { name: 'Clock' }
);

export const ShoppingCart = ic(
  <>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </>,
  { name: 'ShoppingCart' }
);

export const CheckCircle2 = ic(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>,
  { name: 'CheckCircle2' }
);

export const XCircle = ic(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </>,
  { name: 'XCircle' }
);

export const Banknote = ic(
  <>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </>,
  { name: 'Banknote' }
);

export const CreditCard = ic(
  <>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </>,
  { name: 'CreditCard' }
);

export const Bell = ic(
  <>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>,
  { name: 'Bell' }
);
