import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
)

export const ghlService = {
  async captureLead(data: { name: string; email: string; phone: string }) {
    const [firstName, ...rest] = data.name.split(' ')
    const lastName = rest.join(' ')
    
    // Using the 'capture-ghl-lead' function we wrote earlier
    const { data: result, error } = await supabase.functions.invoke('capture-ghl-lead', {
      body: { firstName, lastName, email: data.email, phone: data.phone }
    })
    
    if (error) throw error
    return result // expected to return contactId
  },

  async getSlots(calendarId: string, startDate: string, endDate: string) {
    const baseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!baseUrl || !anonKey) {
      throw new Error('Supabase no está configurado.')
    }

    const url = new URL(`${baseUrl}/functions/v1/get-calendar-slots`)
    url.searchParams.set('calendarId', calendarId)
    url.searchParams.set('startDate', startDate)
    url.searchParams.set('endDate', endDate)

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(err.error || `HTTP ${response.status}`)
    }

    const result = await response.json()
    return result.slots || []
  },

  async createAppointment(appointment: { contactId: string; calendarId: string; startTime: string }) {
    const { data: result, error } = await supabase.functions.invoke('create-ghl-appointment', {
      body: appointment
    })
    
    if (error) throw error
    return result
  }
}
