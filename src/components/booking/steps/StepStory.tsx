import { useState } from 'react';
import { ImagePlus, Sparkles, Palette, X, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   STEP 4 — Tell Your Story
   Three paths: "I have an image", "I have an idea", "Artist choice"
   Each expands inline to capture more detail
   Uses real artist photos from /assets/artists/
   ────────────────────────────────────────────────────────────────── */

const artists = [
  { id: 'ramses', name: "Ramsés 'El Faraón'", roleKey: 'realismRole', img: '/assets/artists/ramses.jpeg', specialties: ['Realismo', 'Black & Grey'] },
  { id: 'misael', name: 'Misael Inc', roleKey: 'neoTradRole', img: '/assets/artists/misael.jpeg', specialties: ['Neo-Tradicional', 'Color'] },
  { id: 'tony', name: "Tony 'El Verdugo'", roleKey: 'geoRole', img: '/assets/artists/tony.jpeg', specialties: ['Geométrico', 'Custom'] },
  { id: 'khris', name: 'Khris', roleKey: 'fineLineRole', img: '/assets/artists/khris.jpeg', specialties: ['Fine Line', 'Minimalista'] },
  { id: 'alejandro', name: 'Alejandro', roleKey: 'blackworkRole', img: '/assets/artists/alejandro.jpeg', specialties: ['Blackwork', 'Ornamental'] },
  { id: 'alinette', name: 'Alinette', roleKey: 'watercolorRole', img: '/assets/artists/alinette.jpeg', specialties: ['Acuarela', 'Floral'] },
];

interface StepStoryProps {
  data: {
    ideaType: string;          // 'image' | 'idea' | 'artist'
    description: string;
    referenceImageName: string; // filename for display
    preferredArtistId: string;
  };
  onChange: (field: string, value: string) => void;
  onFileSelect: (file: File) => void;
}

export function StepStory({ data, onChange, onFileSelect }: StepStoryProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const ideaOptions = [
    { id: 'image', icon: ImagePlus, key: 'hasImage' },
    { id: 'idea', icon: Sparkles, key: 'hasIdea' },
    { id: 'artist', icon: Palette, key: 'artistChoice' },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t('bookingV2.step')} 4
      </p>
      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3">
        {t('bookingV2.story.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.story.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
        {t('bookingV2.story.desc')}
      </p>

      {/* Three option cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mb-8">
        {ideaOptions.map((opt) => {
          const active = data.ideaType === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange('ideaType', opt.id)}
              className={`group relative flex flex-col items-center text-center p-6 sm:p-8 border transition-all duration-500 overflow-hidden rounded-xl
                ${active
                  ? 'border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-foreground/15'
                }`}
            >
              <div className={`mb-4 transition-colors duration-300 ${
                active ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-primary/60'
              }`}>
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className={`font-serif text-base sm:text-lg mb-1 transition-colors duration-300 leading-tight ${
                active ? 'text-foreground' : 'text-foreground/70'
              }`}>
                {t(`bookingV2.story.${opt.key}`)}
              </h3>

              <div className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                active ? 'w-full' : 'w-0'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Expanded content based on selection */}
      <div className="max-w-2xl">
        {/* Image Upload */}
        {data.ideaType === 'image' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-400 space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-primary bg-primary/[0.04]'
                  : 'border-border hover:border-foreground/20'
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-sans text-sm text-muted-foreground mb-2">
                {t('bookingV2.story.dragDrop')}
              </p>
              <p className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground/40 mb-4">
                JPG, PNG, WEBP — Max 10MB
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-lg
                                font-sans text-xs tracking-wider uppercase text-foreground/70
                                hover:border-primary/30 cursor-pointer transition-all">
                <ImagePlus size={14} />
                {t('bookingV2.story.browseFiles')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>

              {data.referenceImageName && (
                <div className="mt-4 flex items-center justify-center gap-2 text-primary">
                  <span className="font-sans text-xs">{data.referenceImageName}</span>
                  <button
                    type="button"
                    onClick={() => onChange('referenceImageName', '')}
                    className="hover:text-primary/60 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Optional description */}
            <div>
              <label className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2 font-medium">
                {t('bookingV2.story.additionalNotes')}
              </label>
              <textarea
                value={data.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder={t('bookingV2.story.notesPlaceholder')}
                rows={3}
                className="w-full bg-card border border-border rounded-lg p-4 text-sm font-sans text-foreground
                           focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                           transition-all duration-300 placeholder:text-muted-foreground/30 resize-none"
              />
            </div>
          </div>
        )}

        {/* Text description */}
        {data.ideaType === 'idea' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
            <label className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2 font-medium">
              {t('bookingV2.story.describeIdea')}
            </label>
            <textarea
              value={data.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder={t('bookingV2.story.ideaPlaceholder')}
              rows={5}
              className="w-full bg-card border border-border rounded-lg p-4 text-sm font-sans text-foreground
                         focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                         transition-all duration-300 placeholder:text-muted-foreground/30 resize-none"
            />
          </div>
        )}

        {/* Artist selection — NOW WITH REAL PHOTOS */}
        {data.ideaType === 'artist' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
            <p className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground mb-4 font-medium">
              {t('bookingV2.story.chooseArtist')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {artists.map((a) => {
                const active = data.preferredArtistId === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onChange('preferredArtistId', active ? '' : a.id)}
                    className={`group relative flex flex-col items-center text-center overflow-hidden border transition-all duration-500 rounded-xl
                      ${active
                        ? 'border-primary/50 ring-2 ring-primary/30 scale-[0.97]'
                        : 'border-border bg-card hover:border-foreground/15 hover:scale-[0.98]'
                      }`}
                  >
                    {/* Artist Photo */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <img
                        src={a.img}
                        alt={a.name}
                        loading="lazy"
                        className={`w-full h-full object-cover object-top transition-all duration-700 ${
                          active
                            ? 'scale-110 brightness-80'
                            : 'scale-100 brightness-[0.5] grayscale-[30%] group-hover:brightness-70 group-hover:grayscale-0 group-hover:scale-105'
                        }`}
                      />
                      {/* Dark gradient for text readability */}
                      <div className={`absolute inset-0 transition-opacity duration-500 ${
                        active
                          ? 'bg-gradient-to-t from-primary/30 via-black/20 to-black/5'
                          : 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
                      }`} />

                      {/* Selected check badge */}
                      {active && (
                        <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200 shadow-lg">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}

                      {/* Top accent line */}
                      {active && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-in fade-in duration-300" />
                      )}

                      {/* Artist info overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className={`font-serif text-sm sm:text-base mb-0.5 drop-shadow-lg transition-colors duration-300 leading-tight ${
                          active ? 'text-white' : 'text-white/90'
                        }`}>{a.name}</h4>
                        <span className="font-sans text-[0.5rem] tracking-[0.1em] uppercase text-white/50 drop-shadow leading-snug">
                          {t(`booking.multiStep.${a.roleKey}`)}
                        </span>

                        {/* Specialty tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {a.specialties.map(spec => (
                            <span
                              key={spec}
                              className={`font-sans text-[0.45rem] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-sm transition-all duration-300 ${
                                active
                                  ? 'bg-primary/20 text-primary-foreground/80 border border-primary/30'
                                  : 'bg-black/40 text-white/40 border border-white/10'
                              }`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional description when choosing artist */}
            <div className="mt-4">
              <label className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2 font-medium">
                {t('bookingV2.story.additionalNotes')}
              </label>
              <textarea
                value={data.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder={t('bookingV2.story.notesPlaceholder')}
                rows={3}
                className="w-full bg-card border border-border rounded-lg p-4 text-sm font-sans text-foreground
                           focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                           transition-all duration-300 placeholder:text-muted-foreground/30 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
