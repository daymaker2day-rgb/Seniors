export interface Activity {
  emoji: string;
  title: string;
  description: string;
  premium?: boolean; // Mark premium-only activities
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  activity: Activity;
  clientName: string;
  notes?: string;
}

export interface UserUsage {
  activitiesUsed: number;
  sessionTimeUsed: number; // in minutes
  lastResetDate: string; // YYYY-MM-DD
  plan: 'basic' | 'premium';
}