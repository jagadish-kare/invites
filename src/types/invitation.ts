// Core invitation data types
export interface InvitationData {
  id: string;
  templateId: string;
  
  // Couple Info
  groomName: string;
  brideName: string;
  
  // Parents Info
  groomFatherName: string;
  groomMotherName: string;
  brideFatherName: string;
  brideMotherName: string;
  groomAddress: string;
  brideAddress: string;
  
  // Wedding Event
  weddingDate: string;
  weddingTime: string;
  weddingVenue: string;
  weddingVenueAddress: string;
  googleMapsLink: string;
  
  // Optional Events
  haladiDate?: string;
  haladiTime?: string;
  haladiVenue?: string;
  
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
}

export interface ScheduleItem {
  time: string;
  event: string;
  icon?: string;
}

export interface GuestbookEntry {
  id: number;
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
