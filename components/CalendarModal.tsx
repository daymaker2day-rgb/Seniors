import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

const DayView: React.FC<{ date: Date; appointments: Appointment[]; onBack: () => void }> = ({ date, appointments, onBack }) => {
  const dayAppointments = appointments
    .filter(app => app.date === date.toISOString().split('T')[0])
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              {date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
           <p className="text-gray-400">Your Schedule for the Day</p>
        </div>
        <button onClick={onBack} className="bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; Back to Month
        </button>
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {dayAppointments.length > 0 ? (
          dayAppointments.map((app, i) => (
             <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center gap-4">
               <div className="text-lg font-bold text-purple-300 w-24 flex-shrink-0">{app.time}</div>
               <div className="border-l-2 border-purple-500 pl-4">
                  <p className="font-semibold text-cyan-300">{app.activity.title}</p>
                  <p className="text-sm text-gray-300">with {app.clientName}</p>
                  {app.notes && <p className="text-xs text-gray-400 mt-1 italic">Notes: {app.notes}</p>}
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400">No activities scheduled for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
};


const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset view when modal is closed
      setSelectedDate(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const appointmentsByDate = appointments.reduce((acc, app) => {
    const dateKey = app.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(app);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderMonthView = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border-r border-b border-slate-700"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const dayAppointments = appointmentsByDate[dateKey] || [];
      
      days.push(
        <button 
            key={day} 
            onClick={() => setSelectedDate(new Date(year, month, day))}
            className={`p-2 border-r border-b border-slate-700 min-h-[100px] flex flex-col text-left hover:bg-slate-700/50 transition-colors duration-200 ${isToday ? 'bg-cyan-500/20' : ''}`}
        >
          <span className={`font-bold ${isToday ? 'text-cyan-300' : 'text-gray-200'}`}>{day}</span>
          <div className="mt-1 text-xs space-y-1">
            {dayAppointments.slice(0, 2).map((event, i) => (
              <div key={i} className="bg-purple-600/50 rounded px-1.5 py-0.5">
                <p className="font-semibold truncate">{event.activity.title}</p>
                <p className="text-purple-200 truncate">{event.time}</p>
              </div>
            ))}
            {dayAppointments.length > 2 && (
                <div className="text-purple-300 font-bold mt-1">
                    {dayAppointments.length - 2} more...
                </div>
            )}
          </div>
        </button>
      );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800/50 border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl text-white p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl z-10" aria-label="Close">&times;</button>
        
        {selectedDate ? (
          <DayView date={selectedDate} appointments={appointments} onBack={() => setSelectedDate(null)} />
        ) : (
          <>
            <div className="flex justify-between items-center text-center mb-4">
              <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-white/10">&larr;</button>
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-1">
                    {currentDate.toLocaleString('default', { month: 'long' })} {year}
                </h2>
                <p className="text-gray-400">Your Scheduled Activities</p>
              </div>
              <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-white/10">&rarr;</button>
            </div>
            <div className="grid grid-cols-7 text-center font-semibold border-t border-l border-slate-700">
                {daysOfWeek.map(day => (
                    <div key={day} className="p-2 border-r border-b border-slate-600 bg-slate-900/40">{day}</div>
                ))}
                {renderMonthView()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarModal;