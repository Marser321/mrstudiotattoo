import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ─── Step Components ───────────────────────────────────────────── */
import { StepContact } from './steps/StepContact';
import { StepServiceType } from './steps/StepServiceType';
import { StepStyle } from './steps/StepStyle';
import { StepStory } from './steps/StepStory';
import { StepBodyZone } from './steps/StepBodyZone';
import { StepDimensions } from './steps/StepDimensions';
import { StepSchedule } from './steps/StepSchedule';
import { StepConfirmation } from './steps/StepConfirmation';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ghlService } from '@/services/ghlService';

/* ─────────────────────────────────────────────────────────────────
 * BOOKING STATE — All project data captured across 7 steps
 * ────────────────────────────────────────────────────────────── */

interface BookingState {
  /* Step 1: Contact */
  name: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
  /* Step 2: Service Type */
  serviceType: string;
  /* Step 3: Style */
  styles: string[];
  /* Step 4: Story */
  ideaType: string;
  description: string;
  referenceImageName: string;
  referenceFile: File | null;
  preferredArtistId: string;
  /* Step 5: Body Zone */
  bodyZones: string[];
  customZone: string;
  /* Step 6: Dimensions */
  dimension: string;
  /* Step 7: Schedule */
  selectedDate: Date | undefined;
  selectedTime: string;
}

const initialState: BookingState = {
  name: '',
  email: '',
  phone: '',
  smsOptIn: false,
  serviceType: '',
  styles: [],
  ideaType: '',
  description: '',
  referenceImageName: '',
  referenceFile: null,
  preferredArtistId: '',
  bodyZones: [],
  customZone: '',
  dimension: '',
  selectedDate: undefined,
  selectedTime: '',
};

/* ─────────────────────────────────────────────────────────────────
 * PROGRESS BAR — Animated segments like Cleopatra Ink
 * ────────────────────────────────────────────────────────────── */

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-12">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isComplete = step < current;
        const isCurrent = step === current;

        return (
          <div
            key={step}
            className={`h-1 rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isComplete
                ? 'flex-[2] bg-primary'
                : isCurrent
                  ? 'flex-[3] bg-primary'
                  : 'flex-1 bg-border'
            }`}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * MAIN COMPONENT — 7-Step Booking Orchestrator
 * ────────────────────────────────────────────────────────────── */

export function MultiStepBooking() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BookingState>(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_STEPS = 7;

  /* ── Field updaters ── */
  const updateField = useCallback((field: string, value: string | boolean) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleStyle = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      styles: prev.styles.includes(id)
        ? prev.styles.filter(s => s !== id)
        : [...prev.styles, id],
    }));
  }, []);

  const toggleBodyZone = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      bodyZones: prev.bodyZones.includes(id)
        ? prev.bodyZones.filter(z => z !== id)
        : [...prev.bodyZones, id],
    }));
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setState(prev => ({
      ...prev,
      referenceFile: file,
      referenceImageName: file.name,
    }));
  }, []);

  /* ── Step validation ── */
  const canNext = (): boolean => {
    switch (step) {
      case 1:
        return state.name.length >= 3 && state.email.includes('@') && state.phone.length >= 8;
      case 2:
        return state.serviceType !== '';
      case 3:
        // Skip style for piercings, otherwise need at least one style
        return state.serviceType === 'piercing' || state.styles.length > 0;
      case 4:
        return state.ideaType !== '';
      case 5:
        return state.bodyZones.length > 0 || state.customZone.length > 0;
      case 6:
        return state.dimension !== '';
      case 7:
        return state.selectedDate !== undefined && state.selectedTime !== '';
      default:
        return false;
    }
  };

  /* ── Navigation ── */
  const next = async () => {
    if (!canNext() || step > TOTAL_STEPS) return;

    // Skip style step for piercings
    if (step === 2 && state.serviceType === 'piercing') {
      setStep(4); // Jump to story
      return;
    }
    
    // Skip dimension step for piercings
    if (step === 5 && state.serviceType === 'piercing') {
      setStep(7); // Jump to schedule
      return;
    }

    if (step === TOTAL_STEPS) {
      // Submit booking
      await handleSubmit();
      return;
    }

    setStep(prev => prev + 1);
  };

  const prev = () => {
    if (step <= 1) return;

    // Handle piercing skip backwards
    if (step === 4 && state.serviceType === 'piercing') {
      setStep(2);
      return;
    }
    
    if (step === 7 && state.serviceType === 'piercing') {
      setStep(5);
      return;
    }

    setStep(prev => prev - 1);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      let uploadedImageUrl = '';
      if (state.referenceFile) {
        const url = await ghlService.uploadReferenceImage(state.referenceFile);
        if (url) uploadedImageUrl = url;
      }

      const brief = {
        contact: { name: state.name, email: state.email, phone: state.phone, smsOptIn: state.smsOptIn },
        project: {
          serviceType: state.serviceType,
          styles: state.styles,
          ideaType: state.ideaType,
          description: state.description,
          referenceImageName: state.referenceImageName,
          referenceImageUrl: uploadedImageUrl,
          preferredArtistId: state.preferredArtistId,
          bodyZones: state.bodyZones,
          customZone: state.customZone,
          dimension: state.dimension,
        },
        schedule: {
          date: state.selectedDate?.toISOString(),
          time: state.selectedTime,
        },
      };

      console.log('📋 PROJECT BRIEF →', JSON.stringify(brief, null, 2));

      await ghlService.submitProjectBrief(brief);

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit booking:', err);
      // Optional: Add toast notification for error
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Confirmation screen ── */
  if (isSubmitted) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
        <StepConfirmation
          brief={{
            name: state.name,
            email: state.email,
            phone: state.phone,
            serviceType: state.serviceType,
            styles: state.styles,
            ideaType: state.ideaType,
            description: state.description,
            referenceImageName: state.referenceImageName,
            preferredArtistId: state.preferredArtistId,
            bodyZones: state.bodyZones,
            customZone: state.customZone,
            dimension: state.dimension,
            date: state.selectedDate,
            time: state.selectedTime,
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {/* Step Content */}
      <div className="min-h-[420px]">
        {step === 1 && (
          <StepContact
            data={{ name: state.name, email: state.email, phone: state.phone, smsOptIn: state.smsOptIn }}
            onChange={updateField}
          />
        )}
        {step === 2 && (
          <StepServiceType selected={state.serviceType} onSelect={(id) => updateField('serviceType', id)} />
        )}
        {step === 3 && (
          <StepStyle selected={state.styles} onToggle={toggleStyle} />
        )}
        {step === 4 && (
          <StepStory
            data={{
              ideaType: state.ideaType,
              description: state.description,
              referenceImageName: state.referenceImageName,
              preferredArtistId: state.preferredArtistId,
            }}
            onChange={updateField}
            onFileSelect={handleFileSelect}
          />
        )}
        {step === 5 && (
          <StepBodyZone
            serviceType={state.serviceType}
            selected={state.bodyZones}
            onToggle={toggleBodyZone}
            customZone={state.customZone}
            onCustomZoneChange={(val) => updateField('customZone', val)}
          />
        )}
        {step === 6 && (
          <StepDimensions selected={state.dimension} onSelect={(id) => updateField('dimension', id)} />
        )}
        {step === 7 && (
          <StepSchedule
            selectedDate={state.selectedDate}
            onSelectDate={(date) => setState(prev => ({ ...prev, selectedDate: date }))}
            selectedTime={state.selectedTime}
            onSelectTime={(time) => updateField('selectedTime', time)}
            artistId={state.preferredArtistId}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
        <MagneticButton
          type="button"
          onClick={prev}
          disabled={step === 1}
          magneticStrength={0.15}
          className="flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase
                     text-muted-foreground hover:text-foreground transition-colors
                     disabled:opacity-20 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('bookingV2.nav.prev')}
        </MagneticButton>

        <MagneticButton
          type="button"
          onClick={next}
          disabled={!canNext() || isSubmitting}
          magneticStrength={0.3}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-sans text-xs
                     tracking-[0.15em] uppercase
                     hover:bg-primary/80 transition-all duration-300
                     disabled:opacity-50 disabled:pointer-events-none
                     focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none
                     group overflow-hidden relative"
          style={{ borderRadius: '0.5rem' }}
        >
          {/* Shimmer */}
          {!isSubmitting && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          )}
          <span className="relative z-10">
            {isSubmitting 
              ? t('bookingV2.nav.submitting', 'Procesando...') 
              : step === TOTAL_STEPS ? t('bookingV2.nav.finalize') : t('bookingV2.nav.next')}
          </span>
          {!isSubmitting && <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />}
        </MagneticButton>
      </div>
    </div>
  );
}
