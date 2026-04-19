/**
 * GHL Configuration Mapping
 * 
 * Replace placeholders with actual GHL IDs in the final stage.
 */

export const GHL_CONFIG = {
  // Map our UI Artist IDs to GHL Calendar IDs
  artistCalendars: {
    'usr_rielo_123': 'CALENDAR_ID_REINIER_RIELO', // Replace with actual ID
    'usr_tony_456': 'CALENDAR_ID_TONY',        // Replace with actual ID
  },
  
  // Default Location ID for the Studio
  locationId: 'STUDIO_LOCATION_ID', // Replace with actual ID

  // Map our UI sizes to duration names or notes
  durations: {
    'small': '1 Hour Session',
    'medium': '2-3 Hour Session',
    'large': 'Full Session (4h+)',
  }
};
