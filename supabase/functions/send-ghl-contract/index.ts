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
    const {
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      medicalInfo,
      tattooInfo,
    } = await req.json()

    const GHL_API_TOKEN = Deno.env.get('GHL_API_TOKEN')
    const LOCATION_ID = Deno.env.get('GHL_LOCATION_ID')
    const TEMPLATE_ID = Deno.env.get('GHL_CONSENT_TEMPLATE_ID')

    if (!GHL_API_TOKEN || !LOCATION_ID) {
      throw new Error('Missing GHL Configuration')
    }

    if (!TEMPLATE_ID) {
      throw new Error('Missing GHL_CONSENT_TEMPLATE_ID')
    }

    // Step 1: Upsert contact in GHL
    const contactResponse = await fetch(
      'https://services.leadconnectorhq.com/contacts/upsert',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_API_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          locationId: LOCATION_ID,
          tags: ['consent-form', 'web-lead'],
          customFields: [
            { key: 'birth_date', value: birthDate },
            { key: 'medical_conditions', value: medicalInfo.hasConditions ? medicalInfo.conditionsDetail : 'None' },
            { key: 'medications', value: medicalInfo.takesMedication ? medicalInfo.medicationDetail : 'None' },
            { key: 'pregnant_nursing', value: medicalInfo.isPregnant ? 'Yes' : 'No' },
            { key: 'recent_substances', value: medicalInfo.recentSubstances ? 'Yes' : 'No' },
            { key: 'tattoo_design', value: tattooInfo.design },
            { key: 'tattoo_location', value: tattooInfo.bodyLocation },
            { key: 'selected_artist', value: tattooInfo.artist },
          ],
        }),
      }
    )

    const contactData = await contactResponse.json()
    const contactId = contactData?.contact?.id

    if (!contactId) {
      throw new Error('Failed to upsert contact in GHL')
    }

    // Step 2: Send contract template to the contact
    const documentResponse = await fetch(
      `https://services.leadconnectorhq.com/documents/templates/${TEMPLATE_ID}/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_API_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          locationId: LOCATION_ID,
          sendTo: email,
          customFields: {
            client_name: `${firstName} ${lastName}`,
            birth_date: birthDate,
            phone: phone,
            email: email,
            medical_conditions: medicalInfo.hasConditions ? medicalInfo.conditionsDetail : 'Ninguna',
            medications: medicalInfo.takesMedication ? medicalInfo.medicationDetail : 'Ninguno',
            pregnant_nursing: medicalInfo.isPregnant ? 'Sí' : 'No',
            recent_substances: medicalInfo.recentSubstances ? 'Sí' : 'No',
            tattoo_design: tattooInfo.design,
            tattoo_body_location: tattooInfo.bodyLocation,
            selected_artist: tattooInfo.artist,
          },
        }),
      }
    )

    if (!documentResponse.ok) {
      const errBody = await documentResponse.text()
      throw new Error(`GHL Document API error: ${documentResponse.status} — ${errBody}`)
    }

    const documentData = await documentResponse.json()

    return new Response(
      JSON.stringify({
        documentId: documentData?.id || 'sent',
        contactId,
        success: true,
      }),
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
