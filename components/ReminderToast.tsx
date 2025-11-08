import React, { useEffect, useState } from 'react';
import type { Appointment } from '../types';

interface ReminderToastProps {
  appointment: Appointment;
  onDismiss: () => void;
  onJoin: () => void;
}

const ReminderToast: React.FC<ReminderToastProps> = ({ appointment, onDismiss, onJoin }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Allow animation to complete before calling parent dismiss
    setTimeout(onDismiss, 300);
  };

  const handleJoin = () => {
    setIsVisible(false);
    // Allow animation to complete before calling parent join
    setTimeout(onJoin, 300);
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 w-full max-w-sm bg-slate-800/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl text-white p-5 z-[100] transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
      aria-live="assertive"
    >
      <button onClick={handleDismiss} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-xl" aria-label="Dismiss">&times;</button>
      <div>
        <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-1 pr-6">
          Reminder: Starting Soon!
        </h3>
        <p className="text-gray-200">
          Your <span className="font-semibold text-cyan-300">{appointment.activity.title}</span> with <span className="font-semibold text-cyan-300">{appointment.clientName}</span> is about to begin.
        </p>
      </div>
      <div className="mt-4 flex gap-3">
        <button 
          onClick={handleJoin}
          className="flex-1 bg-cyan-500/80 hover:bg-cyan-500 border border-cyan-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Join Now
        </button>
        <button 
          onClick={handleDismiss}
          className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ReminderToast;
