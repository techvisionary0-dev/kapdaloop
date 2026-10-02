import React from 'react';

type Props = { className?: string; style?: React.CSSProperties };

export function ShirtIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 8 L12 16 L8 26 L14 30 L16 24 V56 H48 V24 L50 30 L56 26 L52 16 L44 8 L40 12 Q32 18 24 12 Z" fill="currentColor" opacity="0.85"/>
      <path d="M24 12 Q32 18 40 12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <line x1="20" y1="56" x2="48" y2="56" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

export function JeansIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16 8 H48 L46 56 H34 L32 24 L30 56 H18 Z" fill="currentColor" opacity="0.85"/>
      <line x1="32" y1="8" x2="32" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <rect x="16" y="8" width="32" height="3" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

export function SareeIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 10 Q20 8 32 12 Q44 16 54 10 L56 54 Q44 58 32 54 Q20 50 10 54 Z" fill="currentColor" opacity="0.7"/>
      <path d="M10 16 Q20 14 32 18 Q44 22 54 16" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <path d="M10 22 Q20 20 32 24 Q44 28 54 22" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <path d="M10 28 Q20 26 32 30 Q44 34 54 28" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <circle cx="32" cy="38" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="20" cy="42" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="44" cy="42" r="2" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

export function SweaterIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 10 L10 18 L8 28 L14 32 L16 26 V56 H48 V26 L50 32 L56 28 L54 18 L46 10 L42 14 Q32 20 22 14 Z" fill="currentColor" opacity="0.8"/>
      <path d="M18 30 L20 34 L22 30 L24 34 L26 30 L28 34 L30 30 L32 34 L34 30 L36 34 L38 30 L40 34 L42 30 L44 34 L46 30" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M18 38 L20 42 L22 38 L24 42 L26 38 L28 42 L30 38 L32 42 L34 38 L36 42 L38 38 L40 42 L42 38 L44 42 L46 38" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M18 46 L20 50 L22 46 L24 50 L26 46 L28 50 L30 46 L32 50 L34 46 L36 50 L38 46 L40 50 L42 46 L44 50 L46 46" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
    </svg>
  );
}

export function ThreadNeedleIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M48 8 L52 12 L20 44 L12 52 L10 50 L18 42 Z" fill="currentColor" opacity="0.8"/>
      <circle cx="50" cy="10" r="2.5" fill="currentColor" opacity="0.6"/>
      <path d="M14 50 Q20 38 30 34 Q40 30 44 18" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeDasharray="3 2"/>
      <circle cx="14" cy="50" r="1.5" fill="currentColor" opacity="0.7"/>
    </svg>
  );
}

export function RecycleLoopIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 12 L40 26 L24 26 Z" fill="currentColor" opacity="0.7" transform="rotate(0 32 32)"/>
      <path d="M44 30 L52 44 L36 44 Z" fill="currentColor" opacity="0.7" transform="rotate(120 32 32)"/>
      <path d="M20 30 L28 44 L12 44 Z" fill="currentColor" opacity="0.7" transform="rotate(240 32 32)"/>
      <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    </svg>
  );
}

export function MixedFabricIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="8" width="22" height="22" rx="4" fill="currentColor" opacity="0.6"/>
      <rect x="34" y="8" width="22" height="22" rx="4" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="34" width="22" height="22" rx="4" fill="currentColor" opacity="0.45"/>
      <rect x="34" y="34" width="22" height="22" rx="4" fill="currentColor" opacity="0.7"/>
    </svg>
  );
}

export function QuestionMarkIcon({ className, style }: Props) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="24" fill="currentColor" opacity="0.15"/>
      <path d="M24 24 Q24 16 32 16 Q40 16 40 24 Q40 30 32 32 V38" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="44" r="2.5" fill="currentColor"/>
    </svg>
  );
}

export function getMaterialIcon(material: string): React.FC<Props> {
  const map: Record<string, React.FC<Props>> = {
    Cotton: ShirtIcon,
    Denim: JeansIcon,
    Polyester: ShirtIcon,
    Wool: SweaterIcon,
    Mixed: MixedFabricIcon,
    NotSure: QuestionMarkIcon,
  };
  return map[material] ?? QuestionMarkIcon;
}
