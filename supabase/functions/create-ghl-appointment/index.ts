import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contactId, calendarId, startTime, title, description } = await req.json()
    const GHL_API_TOKEN = Deno.env.get('GHL_API_TOKEN')
    const LOCATION_ID = Deno.env.get('GHL_LOCATION_ID')

    if (!GHL_API_TOKEN || !LOCATION_ID) {
      throw new Error('Missing GHL Configuration')
    }

    // GHL v2 Create Appointment Endpoint
    const response = await fetch('https://services.leadconnectorhq.com/calendars/events/appointments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarId,
        locationId: LOCATION_ID,
        contactId,
        startTime, // ISO 8601
        title: title || 'Tattoo Session',
        description,
        appointmentStatus: 'confirmed'
      }),
    })

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.status,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
