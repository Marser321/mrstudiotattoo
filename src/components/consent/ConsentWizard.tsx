import { useState, useCallback, useMemo } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, FileSignature, AlertTriangle, Printer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { consentService, type ConsentFormData } from '@/services/consentService';
import { t, type Lang } from './i18n';

/* ─────────────────────────────────────────────────────────────────
 * TYPES
 * ────────────────────────────────────────────────────────────── */

interface PersonalData {
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
}

interface GuardianData {
  guardianName: string;
  guardianId: string;
  guardianRelation: string;
  guardianPhone: string;
}

function calcAge(birthDate: string): number {
  if (!birthDate) return 99;
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

interface MedicalData {
  hasConditions: boolean | null;
  conditionsDetail: string;
  takesMedication: boolean | null;
  medicationDetail: string;
  isPregnant: boolean | null;
  recentSubstances: boolean | null;
}

interface TattooData {
  design: string;
  bodyLocation: string;
  artist: string;
}

const artists = [
  { id: 'reinier', name: 'Reinier Rielo' },
  { id: 'tony', name: 'Tony' },
  { id: 'any', name: 'Sin Preferencia' },
];

/* ─────────────────────────────────────────────────────────────────
 * STEP INDICATOR (reused pattern from MultiStepBooking)
 * ────────────────────────────────────────────────────────────── */

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-10 sm:mb-12 justify-center">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center gap-2 sm:gap-3">
            <div
              className={`
                w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-serif text-sm
                transition-all duration-500 border
                ${isDone
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : isActive
                    ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                    : 'bg-transparent border-white/10 text-white/20'
                }
              `}
            >
              {isDone ? <CheckCircle2 className="w-4 h-4" /> : step}
            </div>
            {i < total - 1 && (
              <div className={`w-6 sm:w-12 h-px transition-colors duration-500 ${
                isDone ? 'bg-primary/40' : 'bg-white/10'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * TOGGLE BUTTON — thumb-friendly Sí/No
 * ────────────────────────────────────────────────────────────── */

function ToggleYesNo({
  value,
  onChange,
  label,
  yesLabel = 'Sí',
  noLabel = 'No',
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  label: string;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div className="mb-5">
      <p className="font-sans text-sm text-white/80 mb-3 leading-relaxed">{label}</p>
      <div className="flex gap-3">
        {[
          { val: true, text: yesLabel },
          { val: false, text: noLabel },
        ].map((opt) => {
          const isSelected = value === opt.val;
          return (
            <button
              key={opt.text}
              type="button"
              onClick={() => onChange(opt.val)}
              className={`
                flex-1 py-4 font-sans text-sm tracking-wide uppercase
                border transition-all duration-300 rounded-lg
                min-h-[48px] active:scale-[0.97]
                ${isSelected
                  ? opt.val
                    ? 'bg-primary/10 border-primary/40 text-primary ring-1 ring-primary/20'
                    : 'bg-white/[0.04] border-white/20 text-white'
                  : 'bg-transparent border-white/[0.07] text-white/40 hover:border-white/15'
                }
              `}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * DARK INPUT STYLES (consistent with DESIGN.md)
 * ────────────────────────────────────────────────────────────── */

const inputClasses =
  'bg-white/[0.03] border-white/[0.07] text-white placeholder:text-white/20 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-lg h-12 font-sans text-sm';

const textareaClasses =
  'bg-white/[0.03] border-white/[0.07] text-white placeholder:text-white/20 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-lg font-sans text-sm min-h-[80px] resize-none';

/* ─────────────────────────────────────────────────────────────────
 * STEP 1 — Personal Data
 * ────────────────────────────────────────────────────────────── */

function StepPersonal({
  data,
  onChange,
  lang,
  guardian,
  onGuardianChange,
}: {
  data: PersonalData;
  onChange: (d: PersonalData) => void;
  lang: Lang;
  guardian: GuardianData;
  onGuardianChange: (g: GuardianData) => void;
}) {
  const update = (field: keyof PersonalData, val: string) =>
    onChange({ ...data, [field]: val });
  const updateG = (field: keyof GuardianData, val: string) =>
    onGuardianChange({ ...guardian, [field]: val });
  const isMinor = calcAge(data.birthDate) < 18;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">
        {t.step[lang]} 1
      </p>
      <h2 className="font-serif text-2xl sm:text-4xl tracking-tight mb-2">
        {t.s1Title[lang]} <span className="italic font-light text-primary">{t.s1Accent[lang]}</span>
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">
        {t.s1Desc[lang]}
      </p>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">
            {t.fullName[lang]}
          </label>
          <Input value={data.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder={t.fullNamePh[lang]} className={inputClasses} />
        </div>
        <div>
          <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">
            {t.birthDate[lang]}
          </label>
          <Input type="date" value={data.birthDate} onChange={(e) => update('birthDate', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">
            {t.phone[lang]}
          </label>
          <Input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputClasses} />
        </div>
        <div>
          <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">
            {t.email[lang]}
          </label>
          <Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="tu@email.com" className={inputClasses} />
        </div>

        {/* Guardian fields — visible only for minors */}
        {isMinor && (
          <div className="mt-6 pt-6 border-t border-primary/20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-3 border border-primary/20 bg-primary/[0.03] p-4 rounded-xl mb-2">
              <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-primary/80 leading-relaxed">{t.minorBanner[lang]}</p>
            </div>
            <div>
              <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">{t.guardianName[lang]}</label>
              <Input value={guardian.guardianName} onChange={(e) => updateG('guardianName', e.target.value)} placeholder={t.guardianNamePh[lang]} className={inputClasses} />
            </div>
            <div>
              <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">{t.guardianId[lang]}</label>
              <Input value={guardian.guardianId} onChange={(e) => updateG('guardianId', e.target.value)} placeholder={t.guardianIdPh[lang]} className={inputClasses} />
            </div>
            <div>
              <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">{t.guardianRelation[lang]}</label>
              <Input value={guardian.guardianRelation} onChange={(e) => updateG('guardianRelation', e.target.value)} placeholder={t.guardianRelationPh[lang]} className={inputClasses} />
            </div>
            <div>
              <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">{t.guardianPhone[lang]}</label>
              <Input type="tel" value={guardian.guardianPhone} onChange={(e) => updateG('guardianPhone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputClasses} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * STEP 2 — Medical Questionnaire
 * ────────────────────────────────────────────────────────────── */

function StepMedical({ data, onChange, lang }: { data: MedicalData; onChange: (d: MedicalData) => void; lang: Lang }) {
  const update = (field: keyof MedicalData, val: boolean | string) => onChange({ ...data, [field]: val });
  const y = t.yes[lang], n = t.no[lang];
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">{t.step[lang]} 2</p>
      <h2 className="font-serif text-2xl sm:text-4xl tracking-tight mb-2">{t.s2Title[lang]} <span className="italic font-light text-primary">{t.s2Accent[lang]}</span></h2>
      <p className="font-sans text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">{t.s2Desc[lang]}</p>
      <div className="max-w-md space-y-2">
        <ToggleYesNo label={t.q1[lang]} value={data.hasConditions} onChange={(v) => update('hasConditions', v)} yesLabel={y} noLabel={n} />
        {data.hasConditions === true && (
          <div className="ml-1 mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <Textarea value={data.conditionsDetail} onChange={(e) => update('conditionsDetail', e.target.value)} placeholder={t.q1Ph[lang]} className={textareaClasses} />
          </div>
        )}
        <ToggleYesNo label={t.q2[lang]} value={data.takesMedication} onChange={(v) => update('takesMedication', v)} yesLabel={y} noLabel={n} />
        {data.takesMedication === true && (
          <div className="ml-1 mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <Textarea value={data.medicationDetail} onChange={(e) => update('medicationDetail', e.target.value)} placeholder={t.q2Ph[lang]} className={textareaClasses} />
          </div>
        )}
        <ToggleYesNo label={t.q3[lang]} value={data.isPregnant} onChange={(v) => update('isPregnant', v)} yesLabel={y} noLabel={n} />
        <ToggleYesNo label={t.q4[lang]} value={data.recentSubstances} onChange={(v) => update('recentSubstances', v)} yesLabel={y} noLabel={n} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * STEP 3 — Tattoo Details
 * ────────────────────────────────────────────────────────────── */

function StepTattoo({ data, onChange, lang }: { data: TattooData; onChange: (d: TattooData) => void; lang: Lang }) {
  const update = (field: keyof TattooData, val: string) => onChange({ ...data, [field]: val });
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">{t.step[lang]} 3</p>
      <h2 className="font-serif text-2xl sm:text-4xl tracking-tight mb-2">{t.s3Title[lang]} <span className="italic font-light text-primary">{t.s3Accent[lang]}</span></h2>
      <p className="font-sans text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">{t.s3Desc[lang]}</p>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">{t.design[lang]}</label>
          <Textarea value={data.design} onChange={(e) => update('design', e.target.value)} placeholder={t.designPh[lang]} className={textareaClasses} />
        </div>
        <div>
          <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">{t.bodyLoc[lang]}</label>
          <Input value={data.bodyLocation} onChange={(e) => update('bodyLocation', e.target.value)} placeholder={t.bodyLocPh[lang]} className={inputClasses} />
        </div>
        <div>
          <label className="font-sans text-[0.625rem] tracking-[0.15em] uppercase text-muted-foreground block mb-2">{t.artistLabel[lang]}</label>
          <div className="grid grid-cols-3 gap-3">
            {artists.map((a) => {
              const active = data.artist === a.id;
              return (
                <button key={a.id} type="button" onClick={() => update('artist', a.id)}
                  className={`py-4 px-2 border font-sans text-xs tracking-wide transition-all duration-300 rounded-lg text-center min-h-[48px] active:scale-[0.97] ${active ? 'border-primary/40 bg-primary/[0.04] text-white ring-1 ring-primary/20' : 'border-white/[0.07] text-white/50 hover:border-white/15'}`}>
                  {a.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * STEP 4 — Review & Generate
 * ────────────────────────────────────────────────────────────── */

function StepReview({
  personal, medical, tattoo, guardian, isMinor, onGenerate, isLoading, result, lang,
}: {
  personal: PersonalData; medical: MedicalData; tattoo: TattooData; guardian: GuardianData;
  isMinor: boolean; onGenerate: () => void; isLoading: boolean;
  result: { success: boolean; message: string } | null; lang: Lang;
}) {
  const artistName = artists.find((a) => a.id === tattoo.artist)?.name || t.noPreference[lang];
  const y = t.yes[lang], n = t.no[lang];

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (result?.success) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl tracking-tight mb-4">
          {t.successTitle[lang]} <span className="italic font-light text-primary">{t.successAccent[lang]}</span>
        </h2>
        <p className="font-sans text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-2">{t.successMsg[lang]}</p>
        <p className="font-sans text-xs text-muted-foreground/60 max-w-sm mx-auto mb-6">{t.successSub[lang]}</p>
        <button type="button" onClick={handlePrint}
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-white/70 font-sans text-xs tracking-[0.12em] uppercase rounded-lg hover:border-white/20 hover:text-white transition-all print:hidden">
          <Printer className="w-4 h-4" /> {t.printBtn[lang]}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <p className="font-sans text-[0.6875rem] tracking-[0.12em] uppercase text-primary mb-3">{t.step[lang]} 4</p>
      <h2 className="font-serif text-2xl sm:text-4xl tracking-tight mb-2">{t.s4Title[lang]} <span className="italic font-light text-primary">{t.s4Accent[lang]}</span></h2>
      <p className="font-sans text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">{t.s4Desc[lang]}</p>

      {/* Printable Summary Card */}
      {/* On-screen Summary (Hidden on Print) */}
      <div className="border border-white/[0.07] bg-card p-6 sm:p-8 rounded-xl max-w-md mb-6 print:hidden">
        <h3 className="font-sans text-[0.625rem] tracking-[0.2em] uppercase text-primary mb-4">{t.personalSection[lang]}</h3>
        <div className="space-y-2 mb-6">
          <SummaryRow label={t.nameLabel[lang]} value={personal.fullName} />
          <SummaryRow label={t.birthLabel[lang]} value={personal.birthDate} />
          <SummaryRow label={t.phoneLabel[lang]} value={personal.phone} />
          <SummaryRow label={t.email[lang].replace(' *','')} value={personal.email} />
        </div>

        {isMinor && (
          <>
            <div className="h-px bg-white/[0.05] mb-6" />
            <h3 className="font-sans text-[0.625rem] tracking-[0.2em] uppercase text-primary mb-4">{t.guardianSection[lang]}</h3>
            <div className="space-y-2 mb-6">
              <SummaryRow label={t.nameLabel[lang]} value={guardian.guardianName} />
              <SummaryRow label={t.idLabel[lang]} value={guardian.guardianId} />
              <SummaryRow label={t.relationLabel[lang]} value={guardian.guardianRelation} />
              <SummaryRow label={t.phoneLabel[lang]} value={guardian.guardianPhone} />
            </div>
          </>
        )}

        <div className="h-px bg-white/[0.05] mb-6" />
        <h3 className="font-sans text-[0.625rem] tracking-[0.2em] uppercase text-primary mb-4">{t.medicalSection[lang]}</h3>
        <div className="space-y-2 mb-6">
          <SummaryRow label={t.conditions[lang]} value={medical.hasConditions ? `${y} — ${medical.conditionsDetail}` : n} />
          <SummaryRow label={t.medications[lang]} value={medical.takesMedication ? `${y} — ${medical.medicationDetail}` : n} />
          <SummaryRow label={t.pregnancy[lang]} value={medical.isPregnant ? y : n} />
          <SummaryRow label={t.substances[lang]} value={medical.recentSubstances ? y : n} />
        </div>

        <div className="h-px bg-white/[0.05] mb-6" />
        <h3 className="font-sans text-[0.625rem] tracking-[0.2em] uppercase text-primary mb-4">{t.tattooSection[lang]}</h3>
        <div className="space-y-2">
          <SummaryRow label={t.design[lang].replace(' *','')} value={tattoo.design} />
          <SummaryRow label={t.locationLabel[lang]} value={tattoo.bodyLocation} />
          <SummaryRow label={t.artistLabelReview[lang]} value={artistName} />
        </div>
      </div>

      {/* Printable Legal Document (Hidden on Screen) */}
      <div id="consent-printable" className="hidden print:block print:bg-white print:text-black print:p-8 print:w-full print:max-w-none text-sm leading-relaxed font-serif">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest mb-2">MR. STUDIO TATTOO</h1>
          <p className="text-xs text-gray-600 font-sans">1756 SW 8th St, #201, Miami, Florida 33135 · Tel: +1 (786) 209-5950 · mr.studiotattoo@gmail.com</p>
          <h2 className="text-xl font-bold mt-8 uppercase tracking-wide">{lang === 'es' ? 'CONTRATO DE CONSENTIMIENTO INFORMADO PARA TATUAJE' : 'INFORMED CONSENT AND RELEASE AGREEMENT FOR TATTOO'}</h2>
        </div>

        <h3 className="font-bold text-md mb-4 uppercase border-b border-gray-300 pb-2">{lang === 'es' ? 'I. DATOS DEL CLIENTE' : 'I. CLIENT INFORMATION'}</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 font-sans text-sm">
          <div className="col-span-2"><strong>{lang === 'es' ? 'Nombre Completo:' : 'Full Name:'}</strong> {personal.fullName}</div>
          <div>
             <strong>{lang === 'es' ? 'Fecha de Nacimiento:' : 'Date of Birth:'}</strong> {personal.birthDate} 
          </div>
          <div>
             <strong>{lang === 'es' ? 'Edad:' : 'Age:'}</strong> {calcAge(personal.birthDate)} {lang === 'es' ? 'años' : 'years'}
          </div>
          <div><strong>{lang === 'es' ? 'Teléfono:' : 'Phone:'}</strong> {personal.phone}</div>
          <div><strong>Email:</strong> {personal.email}</div>
          <div className="col-span-2"><strong>{lang === 'es' ? '¿Padece alguna enfermedad o condición médica?:' : 'Medical conditions (if any):'}</strong> {medical.hasConditions ? `${y} - ${medical.conditionsDetail}` : n}</div>
          <div className="col-span-2"><strong>{lang === 'es' ? '¿Toma medicamentos actualmente?:' : 'Current medications:'}</strong> {medical.takesMedication ? `${y} - ${medical.medicationDetail}` : n}</div>
          <div className="col-span-2"><strong>{lang === 'es' ? '¿Está embarazada o amamantando?:' : 'Pregnant or breastfeeding:'}</strong> {medical.isPregnant ? y : n}</div>
          <div className="col-span-2"><strong>{lang === 'es' ? '¿Ha consumido alcohol o drogas en las últimas 24 horas?:' : 'Alcohol or drug use in the last 24 hours:'}</strong> {medical.recentSubstances ? y : n}</div>
        </div>

        {isMinor && (
          <>
            <h3 className="font-bold text-md mb-4 uppercase border-b border-gray-300 pb-2">{lang === 'es' ? 'DATOS DEL TUTOR LEGAL' : 'LEGAL GUARDIAN INFORMATION'}</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 font-sans text-sm">
              <div className="col-span-2"><strong>{lang === 'es' ? 'Nombre del Tutor:' : 'Guardian Name:'}</strong> {guardian.guardianName}</div>
              <div><strong>{lang === 'es' ? 'Identificación / ID:' : 'ID:'}</strong> {guardian.guardianId}</div>
              <div><strong>{lang === 'es' ? 'Parentesco:' : 'Relation:'}</strong> {guardian.guardianRelation}</div>
              <div className="col-span-2"><strong>{lang === 'es' ? 'Teléfono:' : 'Phone:'}</strong> {guardian.guardianPhone}</div>
            </div>
          </>
        )}

        <h3 className="font-bold text-md mb-4 uppercase border-b border-gray-300 pb-2">{lang === 'es' ? 'II. DESCRIPCIÓN DEL TATUAJE' : 'II. TATTOO DESCRIPTION'}</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 font-sans text-sm">
          <div className="col-span-2"><strong>{lang === 'es' ? 'Diseño / Motivo:' : 'Design / Concept:'}</strong> {tattoo.design}</div>
          <div><strong>{lang === 'es' ? 'Ubicación en el cuerpo:' : 'Body Location:'}</strong> {tattoo.bodyLocation}</div>
          <div><strong>{lang === 'es' ? 'Artista tatuador(a):' : 'Tattoo Artist:'}</strong> {artistName}</div>
        </div>

        <h3 className="font-bold text-md mb-4 uppercase border-b border-gray-300 pb-2">{lang === 'es' ? 'III. DECLARACIÓN Y LIBERACIÓN DE RESPONSABILIDAD' : 'III. CONSENT AND LIABILITY RELEASE'}</h3>
        <p className="text-justify text-sm mb-16 font-sans text-gray-800 leading-relaxed">
          {lang === 'es' 
            ? 'Declaro bajo juramento que soy mayor de 18 años de edad (o cuento con el consentimiento de mi tutor legal), que la información proporcionada es veraz y completa, y que he sido informado(a) sobre la naturaleza permanente del tatuaje y los riesgos inherentes al procedimiento. Libero de toda responsabilidad civil a MR. Studio Tattoo, sus propietarios, artistas y empleados, excepto en casos de negligencia comprobada. Acepto cumplir estrictamente con los cuidados posteriores.\nAutorizo el uso de fotografías o videos de mi tatuaje con fines promocionales (opcional).'
            : 'I certify that I am at least 18 years of age (or have the consent of my legal guardian) and that all information provided is true and complete. I have been informed of the permanent nature of tattooing and its inherent risks. I hereby release MR. Studio Tattoo, its owners, artists, and employees from any liability except in cases of proven negligence. I agree to follow all aftercare instructions.\nI authorize the use of photographs or videos of my tattoo for promotional purposes (optional).'
          }
        </p>

        <div className="flex justify-between gap-12 mt-16 pt-12">
          <div className="flex-1 text-center">
            <div className="border-b border-black h-8 mb-3"></div>
            <p className="text-xs font-bold uppercase">{lang === 'es' ? 'Firma del Cliente' : 'Client Signature'}</p>
            <p className="text-[10px] text-gray-500 mt-2">{lang === 'es' ? 'Fecha:' : 'Date:'} {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}</p>
          </div>
          {isMinor && (
            <div className="flex-1 text-center">
              <div className="border-b border-black h-8 mb-3"></div>
              <p className="text-xs font-bold uppercase">{lang === 'es' ? 'Firma del Tutor Legal' : 'Guardian Signature'}</p>
              <p className="text-[10px] text-gray-500 mt-2">{lang === 'es' ? 'Fecha:' : 'Date:'} {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}</p>
            </div>
          )}
          <div className="flex-1 text-center">
            <div className="border-b border-black h-8 mb-3"></div>
            <p className="text-xs font-bold uppercase">{lang === 'es' ? 'Firma del Artista' : 'Artist Signature'}</p>
            <p className="text-[10px] text-gray-500 mt-2">{lang === 'es' ? 'Fecha:' : 'Date:'} {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}</p>
          </div>
        </div>
      </div>

      {medical.recentSubstances && (
        <div className="flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/[0.03] p-4 rounded-xl max-w-md mb-6 animate-in fade-in duration-300 print:hidden">
          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-yellow-500/80 leading-relaxed">{t.substanceWarn[lang]}</p>
        </div>
      )}

      {result && !result.success && (
        <div className="flex items-start gap-3 border border-primary/20 bg-primary/[0.03] p-4 rounded-xl max-w-md mb-6 animate-in fade-in duration-300 print:hidden">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-primary/80 leading-relaxed">{result.message}</p>
        </div>
      )}

      {/* CTA — Red per DESIGN.md */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full max-w-md py-5 bg-primary text-white font-sans text-[0.6875rem]
                   tracking-[0.2em] uppercase flex items-center justify-center gap-3
                   hover:bg-primary/80 active:scale-[0.98]
                   transition-all duration-300 rounded-lg
                   shadow-lg shadow-primary/20
                   disabled:opacity-50 disabled:pointer-events-none
                   focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none
                   group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        {isLoading ? (
          <span className="relative z-10 flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generando Contrato...
          </span>
        ) : (
          <>
            <FileSignature className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Generar Contrato para Firmar</span>
          </>
        )}
      </button>

      <p className="font-sans text-[0.5625rem] text-muted-foreground uppercase tracking-[0.15em] mt-3 max-w-md text-center">
        Recibirás el contrato en tu email para firma electrónica.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5">
      <span className="font-sans text-[0.625rem] tracking-[0.1em] uppercase text-muted-foreground shrink-0">
        {label}
      </span>
      <span className="font-sans text-xs text-white text-right leading-relaxed">
        {value || '—'}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * MAIN WIZARD COMPONENT
 * ────────────────────────────────────────────────────────────── */

export function ConsentWizard() {
  const [lang, setLang] = useState<Lang>('es');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [personal, setPersonal] = useState<PersonalData>({ fullName: '', birthDate: '', phone: '', email: '' });
  const [guardian, setGuardian] = useState<GuardianData>({ guardianName: '', guardianId: '', guardianRelation: '', guardianPhone: '' });
  const [medical, setMedical] = useState<MedicalData>({ hasConditions: null, conditionsDetail: '', takesMedication: null, medicationDetail: '', isPregnant: null, recentSubstances: null });
  const [tattoo, setTattoo] = useState<TattooData>({ design: '', bodyLocation: '', artist: '' });

  const isMinor = useMemo(() => calcAge(personal.birthDate) < 18, [personal.birthDate]);
  const totalSteps = 4;

  const isStep1Valid =
    personal.fullName.trim() !== '' && personal.birthDate !== '' && personal.phone.trim() !== '' && personal.email.trim() !== '' &&
    (!isMinor || (guardian.guardianName.trim() !== '' && guardian.guardianId.trim() !== '' && guardian.guardianRelation.trim() !== '' && guardian.guardianPhone.trim() !== ''));

  const isStep2Valid = medical.hasConditions !== null && medical.takesMedication !== null && medical.isPregnant !== null && medical.recentSubstances !== null;
  const isStep3Valid = tattoo.design.trim() !== '' && tattoo.bodyLocation.trim() !== '';

  const canNext = (step === 1 && isStep1Valid) || (step === 2 && isStep2Valid) || (step === 3 && isStep3Valid) || step === 4;
  const next = () => { if (canNext && step < totalSteps) setStep(step + 1); };
  const prev = () => { if (step > 1) setStep(step - 1); };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setResult(null);
    const formData: ConsentFormData = {
      fullName: personal.fullName, birthDate: personal.birthDate, phone: personal.phone, email: personal.email,
      hasConditions: medical.hasConditions ?? false, conditionsDetail: medical.conditionsDetail,
      takesMedication: medical.takesMedication ?? false, medicationDetail: medical.medicationDetail,
      isPregnant: medical.isPregnant ?? false, recentSubstances: medical.recentSubstances ?? false,
      tattooDesign: tattoo.design, bodyLocation: tattoo.bodyLocation, artist: tattoo.artist || 'any',
    };
    try {
      await consentService.sendConsent(formData);
      setResult({ success: true, message: t.successMsg[lang] });
    } catch {
      setResult({ success: false, message: t.errorMsg[lang] });
    } finally {
      setIsLoading(false);
    }
  }, [personal, medical, tattoo, lang]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Language Toggle */}
      <div className="flex justify-end mb-4 print:hidden">
        <div className="flex border border-white/10 rounded-lg overflow-hidden">
          {(['es', 'en'] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLang(l)}
              className={`px-4 py-2 font-sans text-[0.625rem] tracking-[0.15em] uppercase transition-all duration-300
                ${lang === l ? 'bg-primary/10 text-primary border-primary/30' : 'text-white/40 hover:text-white/60'}`}>
              {l === 'es' ? 'ES' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      <StepIndicator current={step} total={totalSteps} />

      <div className="min-h-[420px]">
        {step === 1 && <StepPersonal data={personal} onChange={setPersonal} lang={lang} guardian={guardian} onGuardianChange={setGuardian} />}
        {step === 2 && <StepMedical data={medical} onChange={setMedical} lang={lang} />}
        {step === 3 && <StepTattoo data={tattoo} onChange={setTattoo} lang={lang} />}
        {step === 4 && (
          <StepReview personal={personal} medical={medical} tattoo={tattoo} guardian={guardian}
            isMinor={isMinor} onGenerate={handleGenerate} isLoading={isLoading} result={result} lang={lang} />
        )}
      </div>

      {/* Navigation */}
      {step < totalSteps && (
        <div className="flex items-center justify-between mt-12 sm:mt-16 pt-8 border-t border-white/[0.05] print:hidden">
          <button type="button" onClick={prev} disabled={step === 1}
            className="flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-white transition-colors disabled:opacity-20 disabled:pointer-events-none">
            <ArrowLeft className="w-3.5 h-3.5" /> {t.prev[lang]}
          </button>
          <button type="button" onClick={next} disabled={!canNext}
            className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-primary text-white font-sans text-xs tracking-[0.15em] uppercase rounded-md hover:bg-primary/80 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none">
            {t.next[lang]} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {step === totalSteps && !result?.success && (
        <div className="mt-8 print:hidden">
          <button type="button" onClick={prev}
            className="flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {t.modifyData[lang]}
          </button>
        </div>
      )}
    </div>
  );
}
