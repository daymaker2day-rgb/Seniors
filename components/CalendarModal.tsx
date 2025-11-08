import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

const DayView: React.FC<{ date: Date; appointments: Appointment[]; onBack: () => void }> = ({ date, appointments, onBack }) => {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showTimeSetup, setShowTimeSetup] = useState(false);

  const dayAppointments = appointments
    .filter(app => app.date === date.toISOString().split('T')[0])
    .sort((a, b) => a.time.localeCompare(b.time));

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const handleAddTimeSlot = (time: string) => {
    setSelectedTime(time);
    // Here you could add logic to create a new appointment
    setShowTimeSetup(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-white/10">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            {date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <p className="text-gray-300 mt-1">{dayAppointments.length} activities scheduled</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowTimeSetup(!showTimeSetup)} 
            className="bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 text-green-300 font-bold py-2 px-4 rounded-lg transition-all duration-200"
          >
            + Add Time
          </button>
          <button 
            onClick={onBack} 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            ← Back to Month
          </button>
        </div>
      </div>

      {/* Time Setup Panel */}
      {showTimeSetup && (
        <div className="mb-6 bg-slate-900/60 border border-slate-600 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">⏰ Select Available Time Slots</h3>
          <div className="grid grid-cols-6 gap-2">
            {timeSlots.map(time => {
              const isBooked = dayAppointments.some(app => app.time === time);
              return (
                <button
                  key={time}
                  onClick={() => !isBooked && handleAddTimeSlot(time)}
                  disabled={isBooked}
                  className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isBooked 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 cursor-not-allowed' 
                      : 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/30 hover:scale-105'
                  }`}
                >
                  {time}
                  {isBooked && <div className="text-xs">Booked</div>}
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowTimeSetup(false)}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {dayAppointments.length > 0 ? (
          dayAppointments.map((app, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
              <div className="text-lg font-bold text-purple-300 w-20 flex-shrink-0 text-center bg-purple-500/20 rounded-lg py-2">
                {app.time}
              </div>
              <div className="border-l-2 border-purple-500 pl-4 flex-grow">
                <p className="font-semibold text-cyan-300">{app.activity.title}</p>
                <p className="text-sm text-gray-300">with {app.clientName}</p>
                {app.notes && <p className="text-xs text-gray-400 mt-1 italic">Notes: {app.notes}</p>}
              </div>
              <div className="flex gap-2">
                <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                <button className="text-red-400 hover:text-red-300 text-sm">Cancel</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-400 text-lg">No activities scheduled for this day</p>
            <button 
              onClick={() => setShowTimeSetup(true)}
              className="mt-4 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 px-6 py-2 rounded-lg transition-all duration-200"
            >
              Schedule Something
            </button>
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800/90 border border-white/30 rounded-2xl shadow-2xl w-full max-w-5xl text-white relative overflow-hidden">
        
        {/* Header with Close Button */}
        <div className="flex justify-between items-center bg-slate-900/80 px-6 py-4 border-b border-white/20">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              📅 My Calendar
            </h1>
            <p className="text-gray-400 text-sm">Your scheduled activities</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-200 text-xl font-bold"
            aria-label="Close Calendar"
          >
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {selectedDate ? (
            <DayView date={selectedDate} appointments={appointments} onBack={() => setSelectedDate(null)} />
          ) : (
            <>
              {/* Month Navigation - More Prominent */}
              <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-white/10">
                <button 
                  onClick={handlePrevMonth} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 transition-all duration-200 text-xl"
                  title="Previous Month"
                >
                  ←
                </button>
                
                <div className="text-center">
                  <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    {currentDate.toLocaleString('default', { month: 'long' })} {year}
                  </h2>
                  <p className="text-gray-300 mt-1">Click any day to view details</p>
                </div>
                
                <button 
                  onClick={handleNextMonth} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 transition-all duration-200 text-xl"
                  title="Next Month"
                >
                  →
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 text-center font-semibold border border-slate-600 rounded-lg overflow-hidden">
                {daysOfWeek.map(day => (
                  <div key={day} className="p-3 border-r border-b border-slate-600 bg-slate-900/60 text-cyan-300 font-bold">{day}</div>
                ))}
                {renderMonthView()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;