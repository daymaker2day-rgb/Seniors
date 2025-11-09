import React from 'react';
import { UsageTracker } from '../utils/usageTracker';

interface UsageDisplayProps {
  userInfo?: {
    phone: string;
    plan: string;
    name: string;
  };
}

const UsageDisplay: React.FC<UsageDisplayProps> = ({ userInfo }) => {
  if (!userInfo) return null;

  const usageText = UsageTracker.getUsageDisplay(userInfo.phone, userInfo.plan);
  const usage = UsageTracker.getUsage(userInfo.phone);

  const limits = {
    basic: { activities: 8, sessionMinutes: 90 },
    premium: { activities: 25, sessionMinutes: 240 }
  };

  const userLimits = limits[userInfo.plan as keyof typeof limits];
  const activitiesPercent = (usage.activitiesUsed / userLimits.activities) * 100;
  const timePercent = (usage.sessionTimeUsed / userLimits.sessionMinutes) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 shadow-lg text-center min-w-[200px]">
      <div className="text-sm font-medium text-gray-300 mb-2">
        📊 {userInfo.plan.toUpperCase()} PLAN
      </div>
      
      {/* Activities Progress */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Activities</span>
          <span>{usage.activitiesUsed}/{userLimits.activities}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all ${
              activitiesPercent > 80 ? 'bg-red-500' : 
              activitiesPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(activitiesPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Time Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Time</span>
          <span>{Math.floor(usage.sessionTimeUsed / 60)}h {usage.sessionTimeUsed % 60}m / {Math.floor(userLimits.sessionMinutes / 60)}h</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all ${
              timePercent > 80 ? 'bg-red-500' : 
              timePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(timePercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Upgrade hint for basic users */}
      {userInfo.plan === 'basic' && (activitiesPercent > 70 || timePercent > 70) && (
        <div className="text-xs text-yellow-400 mt-2">
          💡 Upgrade for more activities!
        </div>
      )}
    </div>
  );
};

export default UsageDisplay;