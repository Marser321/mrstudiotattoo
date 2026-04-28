import { useState, useEffect, useRef } from 'react';
import { X, Plus, RotateCcw, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   STEP 5 — Body Zone Selector ⭐ KEY FEATURE
   Interactive SVG silhouette. Now supports Tattoos AND Piercings.
   Tattoos: Polygons (Front/Back)
   Piercings: Glowing nodes superimposed on the same body silhouette.
   ────────────────────────────────────────────────────────────────── */

interface BodyZone {
  id: string;
  key: string;
  path: string;          // SVG path data
  labelPos: { x: number; y: number };
}

// Utility to generate a circular SVG path for piercing nodes
const circlePath = (cx: number, cy: number, r: number = 6) => 
  `M ${cx}, ${cy-r} A ${r},${r} 0 1,0 ${cx},${cy+r} A ${r},${r} 0 1,0 ${cx},${cy-r}`;

// --- MAIN BODY OUTLINE (Used as interactive zones for tattoos, and static outline for piercings) ---
const tattooFrontZones: BodyZone[] = [
  { id: 'head', key: 'head', path: 'M146,30 C146,14 158,4 170,4 C182,4 194,14 194,30 C194,46 182,56 170,56 C158,56 146,46 146,30 Z', labelPos: { x: 170, y: 32 } },
  { id: 'neck', key: 'neck', path: 'M160,56 L180,56 L180,72 L160,72 Z', labelPos: { x: 170, y: 64 } },
  { id: 'chest', key: 'chest', path: 'M130,76 L210,76 L210,130 L130,130 Z', labelPos: { x: 170, y: 103 } },
  { id: 'abdomen', key: 'abdomen', path: 'M138,130 L202,130 L202,178 L138,178 Z', labelPos: { x: 170, y: 154 } },
  { id: 'left-shoulder', key: 'leftShoulder', path: 'M102,76 L130,76 L130,100 L108,100 Z', labelPos: { x: 116, y: 88 } },
  { id: 'right-shoulder', key: 'rightShoulder', path: 'M210,76 L238,76 L232,100 L210,100 Z', labelPos: { x: 224, y: 88 } },
  { id: 'left-upper-arm', key: 'leftUpperArm', path: 'M96,100 L128,100 L124,156 L92,156 Z', labelPos: { x: 110, y: 128 } },
  { id: 'right-upper-arm', key: 'rightUpperArm', path: 'M212,100 L244,100 L248,156 L216,156 Z', labelPos: { x: 230, y: 128 } },
  { id: 'left-forearm', key: 'leftForearm', path: 'M88,156 L122,156 L116,224 L82,224 Z', labelPos: { x: 102, y: 190 } },
  { id: 'right-forearm', key: 'rightForearm', path: 'M218,156 L252,156 L258,224 L224,224 Z', labelPos: { x: 238, y: 190 } },
  { id: 'left-hand', key: 'leftHand', path: 'M78,224 L114,224 L110,252 L74,252 Z', labelPos: { x: 94, y: 238 } },
  { id: 'right-hand', key: 'rightHand', path: 'M226,224 L262,224 L266,252 L230,252 Z', labelPos: { x: 246, y: 238 } },
  { id: 'hip', key: 'hip', path: 'M136,178 L204,178 L210,202 L130,202 Z', labelPos: { x: 170, y: 190 } },
  { id: 'left-thigh', key: 'leftThigh', path: 'M130,202 L168,202 L164,290 L126,290 Z', labelPos: { x: 147, y: 246 } },
  { id: 'right-thigh', key: 'rightThigh', path: 'M172,202 L210,202 L214,290 L176,290 Z', labelPos: { x: 193, y: 246 } },
  { id: 'left-knee', key: 'leftKnee', path: 'M126,290 L164,290 L162,318 L128,318 Z', labelPos: { x: 145, y: 304 } },
  { id: 'right-knee', key: 'rightKnee', path: 'M176,290 L214,290 L212,318 L178,318 Z', labelPos: { x: 195, y: 304 } },
  { id: 'left-calf', key: 'leftCalf', path: 'M128,318 L162,318 L158,394 L132,394 Z', labelPos: { x: 145, y: 356 } },
  { id: 'right-calf', key: 'rightCalf', path: 'M178,318 L212,318 L208,394 L182,394 Z', labelPos: { x: 195, y: 356 } },
  { id: 'left-foot', key: 'leftFoot', path: 'M128,394 L160,394 L162,420 L124,420 Z', labelPos: { x: 143, y: 407 } },
  { id: 'right-foot', key: 'rightFoot', path: 'M180,394 L212,394 L216,420 L178,420 Z', labelPos: { x: 197, y: 407 } },
];

const tattooBackZones: BodyZone[] = [
  { id: 'head-back', key: 'head', path: 'M146,30 C146,14 158,4 170,4 C182,4 194,14 194,30 C194,46 182,56 170,56 C158,56 146,46 146,30 Z', labelPos: { x: 170, y: 32 } },
  { id: 'neck-back', key: 'neck', path: 'M160,56 L180,56 L180,72 L160,72 Z', labelPos: { x: 170, y: 64 } },
  { id: 'upper-back', key: 'chest', path: 'M130,76 L210,76 L210,130 L130,130 Z', labelPos: { x: 170, y: 103 } },
  { id: 'lower-back', key: 'abdomen', path: 'M138,130 L202,130 L202,178 L138,178 Z', labelPos: { x: 170, y: 154 } },
  { id: 'left-shoulder-back', key: 'leftShoulder', path: 'M102,76 L130,76 L130,100 L108,100 Z', labelPos: { x: 116, y: 88 } },
  { id: 'right-shoulder-back', key: 'rightShoulder', path: 'M210,76 L238,76 L232,100 L210,100 Z', labelPos: { x: 224, y: 88 } },
  { id: 'left-tricep', key: 'leftUpperArm', path: 'M96,100 L128,100 L124,156 L92,156 Z', labelPos: { x: 110, y: 128 } },
  { id: 'right-tricep', key: 'rightUpperArm', path: 'M212,100 L244,100 L248,156 L216,156 Z', labelPos: { x: 230, y: 128 } },
  { id: 'left-forearm-back', key: 'leftForearm', path: 'M88,156 L122,156 L116,224 L82,224 Z', labelPos: { x: 102, y: 190 } },
  { id: 'right-forearm-back', key: 'rightForearm', path: 'M218,156 L252,156 L258,224 L224,224 Z', labelPos: { x: 238, y: 190 } },
  { id: 'left-hand-back', key: 'leftHand', path: 'M78,224 L114,224 L110,252 L74,252 Z', labelPos: { x: 94, y: 238 } },
  { id: 'right-hand-back', key: 'rightHand', path: 'M226,224 L262,224 L266,252 L230,252 Z', labelPos: { x: 246, y: 238 } },
  { id: 'glutes', key: 'hip', path: 'M136,178 L204,178 L210,202 L130,202 Z', labelPos: { x: 170, y: 190 } },
  { id: 'left-hamstring', key: 'leftThigh', path: 'M130,202 L168,202 L164,290 L126,290 Z', labelPos: { x: 147, y: 246 } },
  { id: 'right-hamstring', key: 'rightThigh', path: 'M172,202 L210,202 L214,290 L176,290 Z', labelPos: { x: 193, y: 246 } },
  { id: 'left-knee-back', key: 'leftKnee', path: 'M126,290 L164,290 L162,318 L128,318 Z', labelPos: { x: 145, y: 304 } },
  { id: 'right-knee-back', key: 'rightKnee', path: 'M176,290 L214,290 L212,318 L178,318 Z', labelPos: { x: 195, y: 304 } },
  { id: 'left-calf-back', key: 'leftCalf', path: 'M128,318 L162,318 L158,394 L132,394 Z', labelPos: { x: 145, y: 356 } },
  { id: 'right-calf-back', key: 'rightCalf', path: 'M178,318 L212,318 L208,394 L182,394 Z', labelPos: { x: 195, y: 356 } },
  { id: 'left-heel', key: 'leftFoot', path: 'M128,394 L160,394 L162,420 L124,420 Z', labelPos: { x: 143, y: 407 } },
  { id: 'right-heel', key: 'rightFoot', path: 'M180,394 L212,394 L216,420 L178,420 Z', labelPos: { x: 197, y: 407 } },
];

// --- PIERCING ZONES (NODES) ---
// Coords aligned relative to the tattooFrontZones / tattooBackZones body
const piercingFrontZones: BodyZone[] = [
  { id: 'ear-l', key: 'earLeft', path: circlePath(146, 30), labelPos: { x: 110, y: 30 } },
  { id: 'ear-r', key: 'earRight', path: circlePath(194, 30), labelPos: { x: 230, y: 30 } },
  { id: 'eyebrow-l', key: 'eyebrow', path: circlePath(158, 20, 4), labelPos: { x: 120, y: 15 } },
  { id: 'eyebrow-r', key: 'eyebrow', path: circlePath(182, 20, 4), labelPos: { x: 220, y: 15 } },
  { id: 'nose', key: 'nose', path: circlePath(170, 35, 4), labelPos: { x: 130, y: 35 } },
  { id: 'lip', key: 'lip', path: circlePath(170, 45, 4), labelPos: { x: 210, y: 45 } },
  { id: 'nipple-l', key: 'nipple', path: circlePath(150, 103, 5), labelPos: { x: 110, y: 103 } },
  { id: 'nipple-r', key: 'nipple', path: circlePath(190, 103, 5), labelPos: { x: 230, y: 103 } },
  { id: 'navel', key: 'navel', path: circlePath(170, 154, 5), labelPos: { x: 130, y: 154 } },
  { id: 'surface-chest', key: 'surface', path: circlePath(170, 80, 5), labelPos: { x: 210, y: 80 } },
];

const piercingBackZones: BodyZone[] = [
  { id: 'ear-l-back', key: 'earLeft', path: circlePath(146, 30), labelPos: { x: 110, y: 30 } },
  { id: 'ear-r-back', key: 'earRight', path: circlePath(194, 30), labelPos: { x: 230, y: 30 } },
  { id: 'nape', key: 'nape', path: circlePath(170, 64, 5), labelPos: { x: 130, y: 64 } },
  { id: 'lower-back-surface', key: 'lowerBack', path: circlePath(170, 160, 5), labelPos: { x: 210, y: 160 } },
];

interface StepBodyZoneProps {
  serviceType?: string; // 'tattoo' | 'piercing'
  selected: string[];
  onToggle: (id: string) => void;
  customZone: string;
  onCustomZoneChange: (value: string) => void;
}

export function StepBodyZone({ serviceType = 'tattoo', selected, onToggle, customZone, onCustomZoneChange }: StepBodyZoneProps) {
  const { t } = useTranslation();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(!!customZone);
  const [view, setView] = useState<'front' | 'back'>('front');
  const [drawComplete, setDrawComplete] = useState(false);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);

  const isPiercing = serviceType === 'piercing';
  
  // The interactive zones the user can click
  let activeZones: BodyZone[] = [];
  if (isPiercing) {
    activeZones = view === 'front' ? piercingFrontZones : piercingBackZones;
  } else {
    activeZones = view === 'front' ? tattooFrontZones : tattooBackZones;
  }

  // The static background outline (always the body)
  const backgroundOutline = view === 'front' ? tattooFrontZones : tattooBackZones;

  // Trigger SVG line drawing animation
  useEffect(() => {
    setDrawComplete(false);
    const timer = setTimeout(() => {
      pathsRef.current.forEach(path => {
        if (path) {
          const length = path.getTotalLength() || 100;
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;
          void path.getBoundingClientRect(); // Trigger reflow
          path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.23, 1, 0.32, 1)';
          path.style.strokeDashoffset = '0';
        }
      });
      setTimeout(() => setDrawComplete(true), 1500);
    }, 50);

    return () => clearTimeout(timer);
  }, [view, isPiercing]);

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t('bookingV2.step')} 5
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        {t('bookingV2.bodyZone.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.bodyZone.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        {isPiercing ? t('bookingV2.bodyZone.descPiercing', 'Selecciona el punto exacto de la perforación en el modelo.') : t('bookingV2.bodyZone.desc')}
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SVG Container */}
        <div className="relative shrink-0 flex flex-col items-center">
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 mb-6 bg-card border border-border p-1 rounded-full shadow-sm">
            <button
              onClick={() => setView('front')}
              className={`px-6 py-1.5 rounded-full font-sans text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-2 ${
                view === 'front' 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User size={12} />
              {t('bookingV2.bodyZone.front', 'FRENTE')}
            </button>
            <button
              onClick={() => setView('back')}
              className={`px-6 py-1.5 rounded-full font-sans text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-300 flex items-center gap-2 ${
                view === 'back' 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <RotateCcw size={10} />
              {t('bookingV2.bodyZone.back', 'ESPALDA')}
            </button>
          </div>

          <svg
            viewBox="0 0 340 440"
            className="w-[240px] sm:w-[280px] h-auto drop-shadow-xl"
            fill="none"
          >
            <defs>
              <filter id="glassmorphism" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Static Background Outline (Only visible if Piercing, to guide the user) */}
            {isPiercing && (
              <g opacity="0.15" stroke="currentColor" strokeWidth="1" className="text-foreground pointer-events-none">
                {backgroundOutline.map(bgZone => (
                  <path key={`bg-${bgZone.id}`} d={bgZone.path} />
                ))}
              </g>
            )}

            {/* Clickable active zones */}
            {activeZones.map((zone, index) => {
              const isSelected = selected.includes(zone.id);
              const isHovered = hoveredZone === zone.id;
              
              // Piercings get neon glow dot, Tattoos get glassmorphism area fill
              const activeFilter = isPiercing ? 'url(#glow)' : 'url(#glassmorphism)';
              const strokeW = isPiercing ? (isSelected ? 2 : 1) : (isSelected ? 1.5 : 0.75);

              return (
                <g key={zone.id}>
                  <path
                    ref={el => pathsRef.current[index] = el}
                    d={zone.path}
                    fill={
                      isSelected
                        ? 'var(--color-primary)'
                        : isHovered
                          ? 'var(--color-primary)'
                          : isPiercing ? 'var(--color-card)' : 'transparent'
                    }
                    fillOpacity={!drawComplete ? 0 : isSelected ? (isPiercing ? 1 : 0.25) : isHovered ? (isPiercing ? 0.8 : 0.08) : (isPiercing ? 0.4 : 0)}
                    stroke={
                      isSelected
                        ? 'var(--color-primary)'
                        : isHovered
                          ? 'var(--color-primary)'
                          : isPiercing ? 'var(--color-primary)' : 'var(--color-border)'
                    }
                    strokeWidth={strokeW}
                    strokeOpacity={isSelected ? 1 : isHovered ? 0.8 : (isPiercing ? 0.5 : 0.3)}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter={isSelected ? activeFilter : 'none'}
                    className="cursor-pointer transition-colors duration-300"
                    onClick={() => onToggle(zone.id)}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                  />
                  
                  {/* Label */}
                  {(isHovered || isSelected) && drawComplete && (
                    <text
                      x={zone.labelPos.x}
                      y={zone.labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none select-none animate-in fade-in duration-200"
                      fill={isSelected ? 'var(--color-primary)' : 'var(--color-foreground)'}
                      fontSize="7"
                      fontFamily="sans-serif"
                      letterSpacing="0.5"
                      fontWeight="600"
                      opacity={0.9}
                    >
                      {t(`bookingV2.bodyZone.zones.${zone.key}`, { defaultValue: zone.key }).toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected zones panel */}
        <div className="flex-1 w-full min-w-0">
          <div className="border border-border rounded-xl p-5 bg-card/50 backdrop-blur-sm min-h-[200px] transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground font-medium">
                {t('bookingV2.bodyZone.selectedAreas')}
              </h4>
              <span className="font-sans text-xs text-primary tabular-nums border border-primary/20 px-2 py-0.5 rounded-md bg-primary/5">
                {selected.length}
              </span>
            </div>

            {selected.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/30 animate-in fade-in duration-500">
                <Plus size={24} className="mb-2 opacity-50" />
                <p className="font-sans text-xs text-center tracking-wide">
                  {t('bookingV2.bodyZone.tapToAdd')}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 animate-in zoom-in-95 duration-300">
                {selected.map((id) => {
                  const zone = [...tattooFrontZones, ...tattooBackZones, ...piercingFrontZones, ...piercingBackZones].find(z => z.id === id);
                  if (!zone) return null;
                  
                  let labelText = t(`bookingV2.bodyZone.zones.${zone.key}`, { defaultValue: zone.key });
                  if (id.includes('-back') || id === 'glutes') {
                    labelText += ' (Atrás)';
                  }
                  if (id.includes('-l')) labelText += ' (Izq)';
                  if (id.includes('-r')) labelText += ' (Der)';
                  
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onToggle(id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg
                                 font-sans text-xs tracking-wide text-primary hover:bg-primary/20 transition-all duration-300 group hover:scale-105 active:scale-95"
                    >
                      {labelText}
                      <X size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="mt-4 w-full flex items-center justify-between p-4 border border-border rounded-xl bg-card/50 backdrop-blur-sm
                       font-sans text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground
                       hover:border-primary/40 hover:text-primary transition-all duration-300 group"
          >
            {t('bookingV2.bodyZone.otherArea')}
            <Plus size={14} className={`transition-transform duration-500 ${showCustom ? 'rotate-45 text-primary' : 'group-hover:rotate-90'}`} />
          </button>

          {showCustom && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <input
                type="text"
                value={customZone}
                onChange={(e) => onCustomZoneChange(e.target.value)}
                placeholder={t('bookingV2.bodyZone.customPlaceholder')}
                className="w-full bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 text-sm font-sans text-foreground
                           focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30
                           transition-all duration-500 placeholder:text-muted-foreground/30 shadow-inner"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
