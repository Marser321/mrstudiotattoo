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
    const { data: result, error } = await supabase.functions.invoke('get-ghl-slots', {
      body: { calendarId, startDate, endDate }
    })
    
    if (error) throw error
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
