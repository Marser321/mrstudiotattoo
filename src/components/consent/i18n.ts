export type Lang = 'es' | 'en';

export const t = {
  // Step labels
  step: { es: 'Paso', en: 'Step' },

  // Navigation
  next: { es: 'Siguiente', en: 'Next' },
  prev: { es: 'Anterior', en: 'Back' },
  modifyData: { es: 'Modificar datos', en: 'Edit data' },
  yes: { es: 'Sí', en: 'Yes' },
  no: { es: 'No', en: 'No' },

  // Step 1 — Personal
  s1Title: { es: 'Datos', en: 'Personal' },
  s1Accent: { es: 'Personales', en: 'Information' },
  s1Desc: { es: 'Información básica para tu contrato de consentimiento.', en: 'Basic information for your consent contract.' },
  fullName: { es: 'Nombre Completo *', en: 'Full Name *' },
  fullNamePh: { es: 'Tu nombre completo', en: 'Your full name' },
  birthDate: { es: 'Fecha de Nacimiento *', en: 'Date of Birth *' },
  phone: { es: 'Teléfono *', en: 'Phone *' },
  email: { es: 'Email *', en: 'Email *' },

  // Step 1b — Guardian (minor)
  minorBanner: {
    es: 'Como menor de 18 años, se requiere la información de tu tutor legal para proceder.',
    en: 'As a minor under 18, legal guardian information is required to proceed.',
  },
  guardianName: { es: 'Nombre del Tutor Legal *', en: 'Legal Guardian Name *' },
  guardianNamePh: { es: 'Nombre completo del tutor', en: 'Guardian full name' },
  guardianId: { es: 'Número de Identificación del Tutor *', en: 'Guardian ID Number *' },
  guardianIdPh: { es: 'Ej: pasaporte, licencia...', en: 'E.g. passport, license...' },
  guardianRelation: { es: 'Relación con el Menor *', en: 'Relationship to Minor *' },
  guardianRelationPh: { es: 'Ej: Madre, Padre, Tutor Legal', en: 'E.g. Mother, Father, Legal Guardian' },
  guardianPhone: { es: 'Teléfono del Tutor *', en: 'Guardian Phone *' },

  // Step 2 — Medical
  s2Title: { es: 'Cuestionario', en: 'Medical' },
  s2Accent: { es: 'Médico', en: 'Questionnaire' },
  s2Desc: {
    es: 'Información necesaria para garantizar tu seguridad durante el procedimiento.',
    en: 'Required information to ensure your safety during the procedure.',
  },
  q1: { es: '¿Padece alguna enfermedad o condición médica?', en: 'Do you have any medical conditions?' },
  q1Ph: { es: 'Describe brevemente tu condición...', en: 'Briefly describe your condition...' },
  q2: { es: '¿Toma medicamentos actualmente?', en: 'Are you currently taking any medications?' },
  q2Ph: { es: '¿Qué medicamentos toma?', en: 'What medications are you taking?' },
  q3: { es: '¿Está embarazada o amamantando?', en: 'Are you pregnant or nursing?' },
  q4: { es: '¿Ha consumido alcohol o drogas en las últimas 24 horas?', en: 'Have you consumed alcohol or drugs in the last 24 hours?' },

  // Step 3 — Tattoo
  s3Title: { es: 'Detalles del', en: 'Tattoo' },
  s3Accent: { es: 'Tatuaje', en: 'Details' },
  s3Desc: { es: 'Describe el servicio que recibirás.', en: 'Describe the service you will receive.' },
  design: { es: 'Diseño / Motivo *', en: 'Design / Motif *' },
  designPh: { es: 'Describe el diseño que deseas...', en: 'Describe the design you want...' },
  bodyLoc: { es: 'Ubicación en el Cuerpo *', en: 'Body Location *' },
  bodyLocPh: { es: 'Ej: antebrazo derecho, espalda superior...', en: 'E.g. right forearm, upper back...' },
  artistLabel: { es: 'Artista Seleccionado', en: 'Selected Artist' },
  noPreference: { es: 'Sin Preferencia', en: 'No Preference' },

  // Step 4 — Review
  s4Title: { es: 'Revisa y', en: 'Review &' },
  s4Accent: { es: 'Genera', en: 'Generate' },
  s4Desc: {
    es: 'Verifica tus datos antes de generar el contrato de consentimiento.',
    en: 'Review your information before generating the consent contract.',
  },
  personalSection: { es: 'Datos Personales', en: 'Personal Information' },
  guardianSection: { es: 'Tutor Legal (Menor)', en: 'Legal Guardian (Minor)' },
  medicalSection: { es: 'Cuestionario Médico', en: 'Medical Questionnaire' },
  tattooSection: { es: 'Detalles del Tatuaje', en: 'Tattoo Details' },
  conditions: { es: 'Condiciones', en: 'Conditions' },
  medications: { es: 'Medicamentos', en: 'Medications' },
  pregnancy: { es: 'Embarazo', en: 'Pregnancy' },
  substances: { es: 'Sustancias 24h', en: 'Substances 24h' },
  locationLabel: { es: 'Ubicación', en: 'Location' },
  artistLabelReview: { es: 'Artista', en: 'Artist' },
  nameLabel: { es: 'Nombre', en: 'Name' },
  birthLabel: { es: 'Nacimiento', en: 'Birth Date' },
  phoneLabel: { es: 'Teléfono', en: 'Phone' },
  idLabel: { es: 'Identificación', en: 'ID Number' },
  relationLabel: { es: 'Relación', en: 'Relationship' },

  // CTA
  generateBtn: { es: 'Generar Contrato para Firmar', en: 'Generate Contract to Sign' },
  generating: { es: 'Generando Contrato...', en: 'Generating Contract...' },
  emailNote: {
    es: 'Recibirás el contrato en tu email para firma electrónica.',
    en: 'You will receive the contract via email for electronic signature.',
  },

  // Success
  successTitle: { es: 'Contrato', en: 'Contract' },
  successAccent: { es: 'Enviado', en: 'Sent' },
  successMsg: {
    es: 'El contrato ha sido enviado a tu correo electrónico para la firma final.',
    en: 'The contract has been sent to your email for final signature.',
  },
  successSub: {
    es: 'Revisa tu bandeja de entrada y firma electrónicamente para confirmar.',
    en: 'Check your inbox and sign electronically to confirm.',
  },

  // Print/PDF
  printBtn: { es: 'Imprimir / Descargar PDF', en: 'Print / Download PDF' },
  printTitle: { es: 'Consentimiento Informado — Mr Studio Tattoo', en: 'Informed Consent — Mr Studio Tattoo' },

  // Warnings
  substanceWarn: {
    es: 'El consumo de sustancias en las últimas 24 horas puede afectar el procedimiento. El artista se reserva el derecho de reprogramar la sesión.',
    en: 'Substance use in the last 24 hours may affect the procedure. The artist reserves the right to reschedule the session.',
  },
  errorMsg: {
    es: 'Hubo un problema al generar el contrato. Por favor intenta nuevamente.',
    en: 'There was a problem generating the contract. Please try again.',
  },
} as const;
