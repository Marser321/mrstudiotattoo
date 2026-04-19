# PROMPT: Página de Reservas "Noir" (GHL + Supabase)

## OBJETIVO
Integrar una página de reservas de alta fidelidad con estética "Noir Legacy" (Lujo Silencioso, Modo Oscuro Radical, Acentos Rojos). Esta página está plenamente integrada con GoHighLevel mediante Supabase Edge Functions.

## Ficheros Fuente (GitHub)
Los assets y la lógica aislada se encuentran en: `https://github.com/Marser321/actmrtato`
- Componente Standalone: `/lovable-export/MrTatoBookingPremium.tsx`

---

## INSTRUCCIONES PARA LOVABLE

### PASO 1: Configuración de Secretos (Secrets)
Configura las siguientes variables en Lovable (Settings > Secrets):
- `VITE_SUPABASE_URL`: Tu URL del proyecto de Supabase.
- `VITE_SUPABASE_ANON_KEY`: Tu Anon Key de Supabase.

### PASO 2: Instalación de Dependencias
Asegúrate de instalar los paquetes necesarios:
```bash
npm install @supabase/supabase-js lucide-react
```

### PASO 3: Integración del Componente Aislado
1. Crea un nuevo componente en `src/components/booking/MrTatoBookingPremium.tsx`.
2. Copia el contenido ÍNTEGRO de `/lovable-export/MrTatoBookingPremium.tsx` del repositorio de GitHub.
3. Este archivo es **autocontenido**: incluye el cliente de Supabase, los wrappers de servicios de GHL y todos los estilos necesarios.

### PASO 4: Asegurar la Conectividad de Backend
El componente invocará las siguientes funciones en tu Supabase:
- `capture-ghl-lead`: Crea el contacto y devuelve `contactId`.
- `get-ghl-slots`: Consulta disponibilidad para un `calendarId` y rango de fechas.
- `create-ghl-appointment`: Reserva la cita final en la agenda de GHL.

---

## FILOSOFÍA DE DISEÑO (Noir Aesthetic)
- **Modo Oscuro Puro**: El fondo debe ser `#000000`.
- **Tipografía**: Combinación de Serif elegante (Playfair Display / Inter Italic) y Sans minimalista (Inter).
- **Acentos**: Rojo Sangre (`#dc2626`) para estados de éxito, errores y botones críticos.
- **Glassmorphism**: Efectos de desenfoque de fondo (`backdrop-blur-3xl`) en paneles laterales.

## REGLAS DE NEGOCIO
- **Barrera de Identidad**: No se muestra la agenda hasta que el cliente valida su nombre, email y teléfono.
- **Validación Automática**: El botón de validación se activa solo cuando los datos tienen un formato válido.
- **IDs de Calendario**: Asegúrate de que los IDs en la constante `artists` dentro del componente coincidan con tus calendarios reales de GoHighLevel.
