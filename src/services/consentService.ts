import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

function getSupabase() {
  if (!_supabase) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('Supabase no está configurado. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}

export interface ConsentFormData {
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  hasConditions: boolean;
  conditionsDetail: string;
  takesMedication: boolean;
  medicationDetail: string;
  isPregnant: boolean;
  recentSubstances: boolean;
  tattooDesign: string;
  bodyLocation: string;
  artist: string;
}

export const consentService = {
  async sendConsent(formData: ConsentFormData): Promise<{ documentId: string }> {
    const [firstName, ...rest] = formData.fullName.split(' ')
    const lastName = rest.join(' ')

    const { data: result, error } = await getSupabase().functions.invoke('send-ghl-contract', {
      body: {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        medicalInfo: {
          hasConditions: formData.hasConditions,
          conditionsDetail: formData.conditionsDetail,
          takesMedication: formData.takesMedication,
          medicationDetail: formData.medicationDetail,
          isPregnant: formData.isPregnant,
          recentSubstances: formData.recentSubstances,
        },
        tattooInfo: {
          design: formData.tattooDesign,
          bodyLocation: formData.bodyLocation,
          artist: formData.artist,
        },
      },
    })

    if (error) throw error
    return result
  },
}
