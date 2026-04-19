# PROMPT: Página de Reservas Premium (GHL + Supabase)

## OBJETIVO
Integrar una página de reservas de alta fidelidad, con estética "Noir" (lujo silencioso, modo oscuro radical, acentos rojos) que esté plenamente funcional con GoHighLevel mediante Supabase Edge Functions.

## Ficheros Fuente (GitHub)
Los assets y la lógica se encuentran en: `https://github.com/Marser321/actmrtato`
- Componente Base: `/lovable-export/MrTatoBookingPremium.tsx`

---

## INSTRUCCIONES PARA LOVABLE

### PASO 1: Configuración de Entorno
Asegúrate de configurar los secretos en Lovable (Settings > Secrets):
- `VITE_SUPABASE_URL`: Tu URL de Supabase Project.
- `VITE_SUPABASE_ANON_KEY`: Tu Anon Key de Supabase.

### PASO 2: Instalación de Dependencias
Ejecuta en la terminal de Lovable:
```bash
npm install @supabase/supabase-js lucide-react sonner
```

### PASO 3: Integración del Componente
1. Crea un nuevo archivo en tu proyecto Lovable: `src/components/booking/MrTatoBookingPremium.tsx`.
2. Copia el contenido del archivo `/lovable-export/MrTatoBookingPremium.tsx` del repositorio `https://github.com/Marser321/actmrtato`.
3. Este componente es **standalone**, incluye su propia lógica de servicio para conectar con Supabase.

### PASO 4: Conectores de Backend (Edge Functions)
El componente espera que las siguientes funciones existan en tu Supabase:
- `capture-ghl-lead`: Crea el contacto en GHL y devuelve el `contactId`.
- `get-ghl-slots`: Obtiene los huecos libres para un `calendarId` específico.
- `create-ghl-appointment`: Confirma la cita en la agenda de GHL.

---

## ESTÉTICA APLICADA (Noir Legacy)
- **Fondo**: `#000000` puro.
- **Tipografía**: Serif (Playfair Display o similar) para títulos, Sans (Inter) para UI.
- **Colores**: Acento rojo sangre (`#dc2626`) para estados activos y botones destacados.
- **Interacción**: 
  - Paso 1 (Identidad) bloquea el resto del formulario hasta que se valida el contacto.
  - Efectos de blur y glassmorphism en el panel de calendario.
  - Micro-animaciones de entrada (`fade-in`, `slide-up`).

## REGLAS CRÍTICAS
1. No usar iFrames. Todo el flujo es nativo y asíncrono.
2. Mantener el sistema de "Validación de Identidad" antes de mostrar la agenda.
3. Asegurar que los IDs de calendario en el array `artists` coincidan con los de tu subcuenta de GoHighLevel.
