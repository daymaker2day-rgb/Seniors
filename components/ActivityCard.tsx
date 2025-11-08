import React from 'react';
import type { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onStartF2F: (activity: Activity) => void;
  onSchedule: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onStartF2F, onSchedule }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:border-white/40 flex flex-col items-center text-center h-full">
      <div className="text-5xl mb-4">{activity.emoji}</div>
      <h3 className="text-xl font-semibold text-cyan-300 mb-2">{activity.title}</h3>
      <p className="text-gray-300 text-base flex-grow mb-4">{activity.description}</p>
      <div className="mt-auto w-full flex flex-col sm:flex-row gap-2">
        <button 
          onClick={() => onStartF2F(activity)}
          className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Start F2F Chat
        </button>
        <button 
          onClick={() => onSchedule(activity)}
          className="flex-1 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400 text-purple-300 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;