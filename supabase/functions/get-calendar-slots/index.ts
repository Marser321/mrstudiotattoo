import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * GET /get-calendar-slots
 *
 * Query params:
 *   calendarId  — GHL calendar ID for the selected artist
 *   startDate   — ISO date string (e.g. "2026-04-28")
 *   endDate     — ISO date string (e.g. "2026-05-04")
 *
 * Returns:
 *   { slots: [{ raw: "2026-04-28T10:00:00-05:00", date: "Apr 28", time: "10:00 AM" }, ...] }
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const calendarId = url.searchParams.get('calendarId')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    if (!calendarId || !startDate || !endDate) {
      throw new Error('Missing required params: calendarId, startDate, endDate')
    }

    const GHL_API_TOKEN = Deno.env.get('GHL_API_TOKEN')

    if (!GHL_API_TOKEN) {
      throw new Error('Missing GHL_API_TOKEN configuration')
    }

    // Build GHL Free Slots endpoint URL
    const ghlUrl = new URL(
      `https://services.leadconnectorhq.com/calendars/${encodeURIComponent(calendarId)}/free-slots`
    )
    ghlUrl.searchParams.set('startDate', startDate)
    ghlUrl.searchParams.set('endDate', endDate)

    const response = await fetch(ghlUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_API_TOKEN}`,
        'Version': '2021-04-15',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errBody = await response.text()
      throw new Error(`GHL Calendar API error: ${response.status} — ${errBody}`)
    }

    const data = await response.json()

    // GHL returns { slots: { "<date>": ["iso_datetime", ...] } } or { slots: ["iso_datetime", ...] }
    // Normalize both formats into a flat array
    let rawSlots: string[] = []

    if (Array.isArray(data.slots)) {
      rawSlots = data.slots
    } else if (data.slots && typeof data.slots === 'object') {
      // Object keyed by date → flatten all arrays
      for (const dateKey of Object.keys(data.slots)) {
        const daySlots = data.slots[dateKey]
        if (Array.isArray(daySlots)) {
          rawSlots.push(...daySlots)
        }
      }
    }

    // Format each ISO datetime into human-readable parts
    const formattedSlots = rawSlots.map((isoString: string) => {
      const d = new Date(isoString)

      const date = d.toLocaleDateString('es-MX', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      })

      const time = d.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })

      return {
        raw: isoString,
        date,
        time,
      }
    })

    return new Response(
      JSON.stringify({ slots: formattedSlots, total: formattedSlots.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
