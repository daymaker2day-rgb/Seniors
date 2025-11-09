import type { UserUsage } from '../types';

export class UsageTracker {
  private static STORAGE_KEY = 'daymaker_usage';
  
  static getUsage(phone: string): UserUsage {
    const allUsage = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const userKey = phone.replace(/\D/g, ''); // Clean phone number
    
    const defaultUsage: UserUsage = {
      activitiesUsed: 0,
      sessionTimeUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0], // Today's date
      plan: 'basic'
    };
    
    const usage = allUsage[userKey] || defaultUsage;
    
    // Check if we need to reset monthly usage
    const today = new Date().toISOString().split('T')[0];
    const lastReset = new Date(usage.lastResetDate);
    const now = new Date(today);
    
    // Reset if it's been more than 30 days
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 30) {
      usage.activitiesUsed = 0;
      usage.sessionTimeUsed = 0;
      usage.lastResetDate = today;
      this.saveUsage(phone, usage);
    }
    
    return usage;
  }
  
  static saveUsage(phone: string, usage: UserUsage): void {
    const allUsage = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const userKey = phone.replace(/\D/g, '');
    allUsage[userKey] = usage;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allUsage));
  }
  
  static canStartActivity(phone: string, plan: string): { allowed: boolean; reason?: string } {
    const usage = this.getUsage(phone);
    usage.plan = plan as 'basic' | 'premium'; // Update plan
    
    const limits = {
      basic: { activities: 8, sessionMinutes: 90 },
      premium: { activities: 25, sessionMinutes: 240 }
    };
    
    const userLimits = limits[plan as keyof typeof limits];
    
    if (usage.activitiesUsed >= userLimits.activities) {
      return {
        allowed: false,
        reason: `You've used all ${userLimits.activities} activities this month. Upgrade to Premium for more!`
      };
    }
    
    if (usage.sessionTimeUsed >= userLimits.sessionMinutes) {
      return {
        allowed: false,
        reason: `You've used all ${userLimits.sessionMinutes} minutes this month. Upgrade to Premium for more!`
      };
    }
    
    return { allowed: true };
  }
  
  static recordActivityStart(phone: string, plan: string): void {
    const usage = this.getUsage(phone);
    usage.plan = plan as 'basic' | 'premium';
    usage.activitiesUsed += 1;
    this.saveUsage(phone, usage);
  }
  
  static recordSessionTime(phone: string, minutes: number): void {
    const usage = this.getUsage(phone);
    usage.sessionTimeUsed += minutes;
    this.saveUsage(phone, usage);
  }
  
  static getUsageDisplay(phone: string, plan: string): string {
    const usage = this.getUsage(phone);
    
    const limits = {
      basic: { activities: 8, sessionMinutes: 90 },
      premium: { activities: 25, sessionMinutes: 240 }
    };
    
    const userLimits = limits[plan as keyof typeof limits];
    
    const activitiesLeft = userLimits.activities - usage.activitiesUsed;
    const minutesLeft = userLimits.sessionMinutes - usage.sessionTimeUsed;
    
    return `${activitiesLeft} activities left | ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m left`;
  }
}