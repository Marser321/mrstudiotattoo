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
    const { calendarId, startDate, endDate, timezone } = await req.json()
    const GHL_API_TOKEN = Deno.env.get('GHL_API_TOKEN')

    if (!GHL_API_TOKEN) {
      throw new Error('Missing GHL API Token')
    }

    // GHL v2 Free Slots Endpoint
    const url = new URL(`https://services.leadconnectorhq.com/calendars/${calendarId}/free-slots`)
    url.searchParams.append('startDate', startDate) // Unix millis
    url.searchParams.append('endDate', endDate)     // Unix millis
    if (timezone) url.searchParams.append('timezone', timezone)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_API_TOKEN}`,
        'Version': '2021-07-28',
      },
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
