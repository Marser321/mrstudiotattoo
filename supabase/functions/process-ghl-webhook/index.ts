import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, phone, idea } = await req.json()

    // GHL INBOUND WEBHOOK URL
    // Pegar la URL de GoHighLevel aquí o configurar como variable de entorno GHL_WEBHOOK_URL
    const GHL_WEBHOOK_URL = Deno.env.get('GHL_WEBHOOK_URL') || 'TU_URL_DE_WEBHOOK_AQUÍ'

    if (GHL_WEBHOOK_URL === 'TU_URL_DE_WEBHOOK_AQUÍ') {
      console.warn("⚠️ GHL_WEBHOOK_URL no configurada. Usando modo simulación.")
    }

    const payload = {
      name,
      email,
      phone,
      notes: idea,
      source: 'Landing Page Noir - Intake Form',
      tags: ['lead', 'noir-landing', 'tattoo-inquiry']
    }

    console.log("Factoring Lead to GHL:", payload)

    // Outbound Webhook to GoHighLevel
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.text()

    return new Response(
      JSON.stringify({ success: true, message: 'Lead enviado a GHL', details: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
