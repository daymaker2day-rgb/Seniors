import React from 'react';
import type { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onStartF2F: (activity: Activity) => void;
  onSchedule: (activity: Activity) => void;
  userPlan?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onStartF2F, 
  onSchedule, 
  userPlan = 'basic' 
}) => {
  const isPremiumActivity = activity.premium;
  const userHasPremium = userPlan === 'premium';
  const canUseActivity = !isPremiumActivity || userHasPremium;

  const handleStartF2F = () => {
    if (!canUseActivity) {
      alert('This is a Premium feature! Upgrade to access all activities.');
      return;
    }
    onStartF2F(activity);
  };

  const handleSchedule = () => {
    if (!canUseActivity) {
      alert('This is a Premium feature! Upgrade to access all activities.');
      return;
    }
    onSchedule(activity);
  };

  return (
    <div className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:border-white/40 flex flex-col items-center text-center h-full ${!canUseActivity ? 'opacity-60' : ''}`}>
      {/* Premium Badge */}
      {isPremiumActivity && (
        <div className="absolute top-2 right-2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            ⭐ PREMIUM
          </span>
        </div>
      )}
      
      <div className="text-5xl mb-4">{activity.emoji}</div>
      <h3 className="text-xl font-semibold text-cyan-300 mb-2">{activity.title}</h3>
      <p className="text-gray-300 text-base flex-grow mb-4">{activity.description}</p>
      
      <div className="mt-auto w-full flex flex-col sm:flex-row gap-2">
        <button 
          onClick={handleStartF2F}
          disabled={!canUseActivity}
          className={`flex-1 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
            canUseActivity 
              ? 'bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300' 
              : 'bg-gray-500/20 border border-gray-500 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canUseActivity ? 'Start F2F Chat' : '🔒 Premium Only'}
        </button>
        <button 
          onClick={handleSchedule}
          disabled={!canUseActivity}
          className={`flex-1 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
            canUseActivity 
              ? 'bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400 text-purple-300' 
              : 'bg-gray-500/20 border border-gray-500 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canUseActivity ? 'Schedule' : '🔒 Premium'}
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;