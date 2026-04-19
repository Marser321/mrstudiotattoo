# Guía de Inyección Mr. Tato - Lovable

Utiliza estos componentes independientes para portar la **Burbuja de Reserva Cristalina** y el **Fondo Noir Rojo Sangre** a tu entorno de Lovable.

## Componentes
- **[MrTatoBookingButton.tsx](file:///Users/mariomorera/.gemini/antigravity/brain/dda85c71-ccce-427f-bc76-3918dbbaf3a9/MrTatoBookingButton.tsx)**: Botón de acción flotante (FAB) autocontenido con lógica de morphing y física magnética.
- **[MrTatoNoirStage.tsx](file:///Users/mariomorera/.gemini/antigravity/brain/dda85c71-ccce-427f-bc76-3918dbbaf3a9/MrTatoNoirStage.tsx)**: Escenario de fondo atmosférico autocontenido con gradientes rojo sangre, trazos de tinta SVG y grano de película.
- **[MrTatoBookingPremium.tsx](file:///Users/mariomorera/.gemini/antigravity/brain/dda85c71-ccce-427f-bc76-3918dbbaf3a9/MrTatoBookingPremium.tsx)**: Página completa de agendamiento premium con captura de leads, selección de artista y calendario interactivo.
- **[MrTatoVideoSequence.tsx](file:///Users/mariomorera/.gemini/antigravity/brain/dda85c71-ccce-427f-bc76-3918dbbaf3a9/MrTatoVideoSequence.tsx)**: Motor de renderizado de alta performance para los 600 frames sincronizados con el scroll.



## Requisitos Previos
1. **Dependencias**: Asegúrate de instalarlas en tu entorno de Lovable:
   ```bash
   npm install gsap lucide-react
   ```
2. **Tailwind CSS**: Estos componentes utilizan clases estándar de Tailwind. No se requiere configuración personalizada.

## Pasos para la Inyección
1. **El Fondo (The Background)**:
   - Crea un nuevo archivo `components/MrTatoNoirStage.tsx`.
   - Pega el contenido del artifact proporcionado.
   - Úsalo en la raíz de tu página (tiene `fixed inset-0`, por lo que se mantendrá detrás de todo).
2. **El Botón (The Button)**:
   - Crea un nuevo archivo `components/MrTatoBookingButton.tsx`.
   - Úsalo en cualquier parte de tu App. Flotará automáticamente.
3. **La Agenda Premium (The Booking Page)**:
   - Crea un nuevo archivo `pages/Booking.tsx`.
   - Pega el contenido de `MrTatoBookingPremium.tsx`.
   - Configura tu ruta en Lovable para apuntar a este componente.
4. **La Secuencia de Video (The Hero Sequence)**:
   - Crea un nuevo archivo `components/MrTatoVideoSequence.tsx`.
   - Úsalo dentro de tu contenedor Hero. Reemplazará el fondo estático por la animación fluida de 600 frames.

## Estructura de Archivos Recomendada
Para que la secuencia de 600 frames funcione, debes organizar tus imágenes en Lovable así:
`public/assets/hero-sequence-v4/`
- `frame_000.webp`
- `frame_001.webp`
- ...
- `frame_599.webp`



## Integración Segura (Cero Roturas)

Para asegurarte de no romper las tarjetas o el layout existente en Lovable, sigue estas reglas de oro:

### 1. Fondo sin Solapamiento
El componente `MrTatoNoirStage` ya no es "global" por defecto. Para usarlo de forma segura:
- Identifica el contenedor de tu **sección izquierda**.
- Asegúrate de que ese contenedor tenga `position: relative` y `overflow: hidden`.
- Suelta el componente `<MrTatoNoirBackground />` como el **primer hijo** de ese contenedor.
- Esto aplicará los gradientes y la tinta solo a ese fondo, sin tocar las tarjetas de la derecha.

### 2. Sustitución de Botón
Si ya tienes un botón de "Reserva" en Lovable:
- No lo borres todavía. Simplemente dale una clase de CSS `hidden` o `opacity-0`.
- Inyecta el `<MrTatoBookingButton />` en el nivel superior de tu App.
- El botón de Mr. Tato está configurado con un `z-index` muy alto (9999) para que siempre flote por encima de todo, pero sin romper el flujo de tus tarjetas.

### 3. Preservar Funcionalidad de Tarjetas
- No envuelvas tus tarjetas en los componentes de Mr. Tato.
- Mantén las tarjetas como hermanos (siblings) o en un contenedor separado.
- Nuestros componentes usan `pointer-events: none` en las capas de fondo para que puedas seguir haciendo click en tus tarjetas sin problemas.


