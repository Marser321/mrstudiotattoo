import { CheckCircle2, CalendarPlus, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ──────────────────────────────────────────────────────────────────
   CONFIRMATION SCREEN
   Displays full project brief summary
   Download .ics + WhatsApp link
   ────────────────────────────────────────────────────────────────── */

interface ProjectBrief {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  styles: string[];
  ideaType: string;
  description: string;
  referenceImageName: string;
  preferredArtistId: string;
  bodyZones: string[];
  customZone: string;
  dimension: string;
  date: Date | undefined;
  time: string;
}

interface StepConfirmationProps {
  brief: ProjectBrief;
}

export function StepConfirmation({ brief }: StepConfirmationProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es-ES' : 'en-US';

  const formattedDate = brief.date?.toLocaleDateString(lang, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }) || '';

  const formattedTime = brief.time
    ? new Date(brief.time).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  /* Generate .ics calendar file download */
  const handleAddToCalendar = () => {
    if (!brief.date || !brief.time) return;

    const startDate = new Date(brief.time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2h session

    const formatICS = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatICS(startDate)}`,
      `DTEND:${formatICS(endDate)}`,
      `SUMMARY:Tattoo Session — Mr. Studio Tattoo`,
      `DESCRIPTION:${t('bookingV2.confirmation.icsDesc')}`,
      'LOCATION:Mr. Studio Tattoo',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mr-tato-session.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryRows: { labelKey: string; value: string }[] = [
    { labelKey: 'service', value: t(`bookingV2.serviceType.${brief.serviceType.replace('-', '')}`, brief.serviceType) },
    { labelKey: 'styles', value: brief.styles.map(s => t(`bookingV2.style.${s.replace(/-/g, '')}`, s)).join(', ') || '—' },
    { labelKey: 'bodyZones', value: [...brief.bodyZones.map(z => t(`bookingV2.bodyZone.zones.${z.replace(/-/g, '')}`, z)), ...(brief.customZone ? [brief.customZone] : [])].join(', ') || '—' },
    { labelKey: 'dimension', value: brief.dimension ? t(`bookingV2.dimensions.${brief.dimension}`) : '—' },
    { labelKey: 'artist', value: brief.preferredArtistId || t('bookingV2.confirmation.studioAssigns') },
    { labelKey: 'date', value: formattedDate || '—' },
    { labelKey: 'time', value: formattedTime || '—' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 animate-in zoom-in duration-500 delay-150 fill-mode-both">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>

      <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
        {t('bookingV2.confirmation.title')}{' '}
        <span className="italic font-light text-primary">{t('bookingV2.confirmation.accent')}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
        {t('bookingV2.confirmation.desc')}
      </p>

      {/* Summary card */}
      <div className="border border-border bg-card rounded-xl p-6 md:p-8 max-w-lg mx-auto text-left mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all">
        <h3 className="font-serif text-lg mb-5 text-foreground">
          {t('bookingV2.confirmation.summaryTitle')}
        </h3>

        <div className="space-y-0">
          {summaryRows.map((row) => (
            <div key={row.labelKey} className="flex justify-between items-start py-3 border-b border-border last:border-0">
              <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground shrink-0 pt-0.5">
                {t(`bookingV2.confirmation.${row.labelKey}`)}
              </span>
              <span className="font-sans text-sm text-foreground text-right max-w-[200px]">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Description preview */}
        {brief.description && (
          <div className="mt-5 pt-4 border-t border-border">
            <p className="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground mb-2">
              {t('bookingV2.confirmation.projectNotes')}
            </p>
            <p className="font-sans text-xs text-foreground/70 leading-relaxed italic">
              "{brief.description.slice(0, 200)}{brief.description.length > 200 ? '...' : ''}"
            </p>
          </div>
        )}

        {brief.referenceImageName && (
          <div className="mt-3 flex items-center gap-2">
            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground">
              {t('bookingV2.confirmation.refImage')}:
            </span>
            <span className="font-sans text-xs text-primary">{brief.referenceImageName}</span>
          </div>
        )}
      </div>

      {/* Artist brief notice */}
      <div className="max-w-lg mx-auto mb-8 p-4 border border-primary/20 bg-primary/[0.03] rounded-xl animate-in slide-in-from-bottom-4 duration-500 delay-1000 fill-mode-both">
        <p className="font-sans text-xs text-primary/80 leading-relaxed">
          ✨ {t('bookingV2.confirmation.artistBrief')}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-500 delay-1000 fill-mode-both">
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-border bg-card rounded-xl
                     font-sans text-xs tracking-[0.1em] uppercase text-foreground/70
                     hover:border-primary/30 hover:text-primary transition-all"
        >
          <CalendarPlus size={16} />
          {t('bookingV2.confirmation.addCalendar')}
        </button>

        <a
          href="https://wa.me/17866140610"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl
                     font-sans text-xs tracking-[0.1em] uppercase
                     hover:bg-primary/90 transition-all"
        >
          <MessageCircle size={16} />
          {t('bookingV2.confirmation.chatWithUs')}
        </a>
      </div>
    </div>
  );
}
