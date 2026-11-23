// Core invitation data types
export type EventType = 'wedding' | 'housewarming' | 'birthday' | 'engagement' | 'other';

export interface InvitationData {
  id: string;
  templateId: string;
  
  // Event Type & Custom Labels
  eventType: EventType;
  eventTitle: string; // e.g., "Wedding Ceremony", "Griha Pravesh", "Birthday Party"
  
  // Custom Ceremony Labels (user-editable headings)
  mainCeremonyLabel: string; // e.g., "WEDDING CEREMONY", "GRIHA PRAVESH"
  secondaryCeremonyLabel?: string; // e.g., "HALADI CEREMONY", "POOJA"
  receptionLabel?: string; // e.g., "RECEPTION", "DINNER", "PARTY"
  
  // Main Persons (For wedding: groom/bride, for other events: host names)
  groomName: string; // or "Host Name 1"
  brideName: string; // or "Host Name 2" (optional for non-wedding)
  
  // Parents/Family Info
  groomFatherName: string;
  groomMotherName: string;
  brideFatherName: string;
  brideMotherName: string;
  groomAddress: string;
  brideAddress: string;
  
  // Main Event
  weddingDate: string;
  weddingTime: string;
  weddingVenue: string;
  weddingVenueAddress: string;
  googleMapsLink: string;
  
  // Secondary Event (Optional)
  haladiDate?: string;
  haladiTime?: string;
  haladiVenue?: string;
  
  // Third Event (Optional)
  receptionDate?: string;
  receptionTime?: string;
  receptionVenue?: string;
  
  // Media
  mainPhoto: string;
  galleryPhotos: string[];
  qrCodeImage: string;
  qrLabel: string;
  
  // Schedule
  schedule: ScheduleItem[];
  
  // Meta
  createdAt: string;
  status?: 'live' | 'expired' | 'draft';
}

export interface ScheduleItem {
  time: string;
  event: string;
  icon?: string;
}

export interface GuestbookEntry {
  id: number | string;
  invitationId: string;
  guestName: string;
  wishes: string;
  createdAt: string;
}

// Template system types
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  colors: TemplateColors;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
}

// Component prop types for templates
export interface TemplateProps {
  data: InvitationData;
  onGuestbookSubmit: (name: string, wishes: string) => Promise<void>;
  guestbookEntries: GuestbookEntry[];
}

// Event type options for dropdown
export const EVENT_TYPES: { value: EventType; label: string; defaultTitle: string }[] = [
  { value: 'wedding', label: 'Wedding', defaultTitle: 'Wedding Invitation' },
  { value: 'housewarming', label: 'House Warming (Griha Pravesh)', defaultTitle: 'Griha Pravesh' },
  { value: 'engagement', label: 'Engagement', defaultTitle: 'Engagement Ceremony' },
  { value: 'birthday', label: 'Birthday', defaultTitle: 'Birthday Celebration' },
  { value: 'other', label: 'Other', defaultTitle: 'You are Invited' },
];
