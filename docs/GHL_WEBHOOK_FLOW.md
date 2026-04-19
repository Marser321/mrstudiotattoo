# Guía de Sincronización Webhook: GoHighLevel y Plataforma de Pago

Esta documentación describe el flujo asíncrono para notificar a GoHighLevel tras la recepción exitosa de un depósito en la plataforma de reservas de *Studio Ready Ink*.

## El Paradigma (Outbound Webhook)

Dado que las reservas requieren un pago adelantado (Retainer/Depósito), la cita no debe asentar oficialmente en el CRM comercial hasta que la transacción se complete. 

1. El usuario completa el "Booking Wizard" y paga en el frontend (ej. mediante ventana de Stripe).
2. Stripe emite un webhook de `payment_intent.succeeded` hacia Supabase (o directamente el frontend consolida el éxito).
3. Entra a nuestro **Outbound Webhook** o script que llama a nuestra Deno Edge Function `create-ghl-appointment`.
4. Una vez creada la cita localmente o en el *Pipeline*, debemos notificar al CRM para el seguimiento (Triggers/Workflows).

## Configuración del Workflow en GoHighLevel

Para atrapar la alerta de pago exitoso y empezar campañas:

### 1. Inbound Webhook Trigger (En GHL)
- Ve a **Automation** -> **Workflows** -> **Create Workflow**.
- En "Add New Workflow Trigger", selecciona **Inbound Webhook**.
- GHL te proporcionará una URL de captura (ej. `https://services.leadconnectorhq.com/hooks/xyz...`). Copia esta URL.

### 2. Payload Esperado (Desde nuestro Backend/Stripe)
Nuestro backend (o el evento de éxito en React) debe disparar una petición `POST` hacia la URL anterior con la siguiente estructura:

```json
{
  "event": "deposit_paid",
  "contact": {
    "email": "cliente@email.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe"
  },
  "appointment_details": {
    "artist_id": "usr_rielo_123",
    "concept": "Microrealismo León",
    "date": "2026-05-15T14:30:00Z"
  },
  "transaction": {
    "amount": 150,
    "currency": "USD",
    "status": "succeeded",
    "stripe_receipt": "re_123456"
  }
}
```

### 3. Mapeo en el Workflow de GHL
Cuando envíes la primera petición de prueba, GHL leerá el esquema. En el panel de GHL deberás:
- Asignar el campo `contact.email` al campo estándar de Email del contacto.
- Asignar `contact.phone` al Teléfono.

### 4. Acciones Siguientes (Automatizaciones)
Una vez atrapado el webhook, el Workflow debe ejecutar:
1. **Create/Update Contact**: Afianza los datos del cliente.
2. **Add Contact Tag**: Añadir la etiqueta `Deposit_Paid` o `New_Tattoo_Client`.
3. **Pipeline Stage**: Mover la tarjeta de la oportunidad en el Pipeline de Ventas a "Cita Confirmada".
4. **Send SMS/Email**: Enviar campaña: "Tu depósito de $150 ha sido recibido. Aquí tienes las instrucciones para tu sesión..."
