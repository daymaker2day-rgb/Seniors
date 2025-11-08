import React, { useState } from 'react';
import type { Activity, Appointment } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity;
  onScheduleAppointment: (appointment: Appointment) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, activity, onScheduleAppointment }) => {
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !date || !time) {
      setError('Please fill in the client name, date, and time.');
      return;
    }
    setError('');
    onScheduleAppointment({
      id: `${Date.now()}-${Math.random()}`, // Unique ID for the appointment
      clientName,
      date,
      time,
      notes,
      activity,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800/50 border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg text-white p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl" aria-label="Close">&times;</button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-1 pr-8">
          Schedule Activity
        </h2>
        <p className="text-lg text-gray-300 mb-6">{activity.title}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-cyan-300 mb-1">Client Name</label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="date" className="block text-sm font-medium text-cyan-300 mb-1">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="time" className="block text-sm font-medium text-cyan-300 mb-1">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-cyan-300 mb-1">Notes (Optional)</label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 font-bold py-2 px-6 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-cyan-500/80 hover:bg-cyan-500 border border-cyan-400 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;