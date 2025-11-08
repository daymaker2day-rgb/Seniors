export interface Activity {
  emoji: string;
  title: string;
  description: string;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  activity: Activity;
  clientName: string;
  notes?: string;
}