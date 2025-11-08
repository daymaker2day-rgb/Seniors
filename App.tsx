import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ActivityCard from './components/ActivityCard';
import Footer from './components/Footer';
import F2FModal from './components/F2FModal';
import CalendarModal from './components/CalendarModal';
import LiveVideoPreview from './components/LiveVideoPreview';
import ScheduleModal from './components/ScheduleModal';
import ReminderToast from './components/ReminderToast';
import { UserRole } from './components/UserMenu';
import { ACTIVITIES } from './constants';
import type { Activity, Appointment } from './types';

const REMINDER_LEAD_TIME_MS = 5 * 60 * 1000; // 5 minutes

const App: React.FC = () => {
  const [isF2FModalOpen, setIsF2FModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeReminder, setActiveReminder] = useState<Appointment | null>(null);

  // User role state
  const [currentUser, setCurrentUser] = useState<UserRole>({
    id: 'me',
    name: 'Me',
    position: 'center',
    color: 'bg-blue-500'
  });

  const [userLayout, setUserLayout] = useState<UserRole[]>([
    { id: 'me', name: 'Me', position: 'center', color: 'bg-blue-500' },
    { id: 'family', name: 'Family Member', position: 'top-left', color: 'bg-green-500' },
    { id: 'client', name: 'Client', position: 'top-right', color: 'bg-purple-500' }
  ]);

  // Fix: Use ReturnType<typeof setTimeout> for the timeout ID type.
  // This is compatible with browser environments where setTimeout returns a number,
  // resolving the "Cannot find namespace 'NodeJS'" error.
  const reminderTimeoutIds = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    // Cleanup all timeouts when the component unmounts
    return () => {
      Object.values(reminderTimeoutIds.current).forEach(clearTimeout);
    };
  }, []);


  const handleOpenF2F = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsF2FModalOpen(true);
  };

  const handleCloseF2F = () => {
    setIsF2FModalOpen(false);
    setSelectedActivity(null);
  };

  const handleOpenCalendar = () => {
    setIsCalendarModalOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarModalOpen(false);
  };

  const handleOpenSchedule = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsScheduleModalOpen(true);
  };
  
  const handleCloseSchedule = () => {
    setIsScheduleModalOpen(false);
    setSelectedActivity(null);
  };

  const scheduleReminder = (appointment: Appointment) => {
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`).getTime();
    const reminderTime = appointmentTime - REMINDER_LEAD_TIME_MS;
    const timeoutDuration = reminderTime - Date.now();

    if (timeoutDuration > 0) {
      const timeoutId = setTimeout(() => {
        setActiveReminder(appointment);
      }, timeoutDuration);
      reminderTimeoutIds.current[appointment.id] = timeoutId;
    }
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()));
    scheduleReminder(newAppointment);
    handleCloseSchedule();
  };
  
  const handleDismissReminder = () => {
    setActiveReminder(null);
  };

  const handleJoinFromReminder = (activity: Activity) => {
    setActiveReminder(null);
    handleOpenF2F(activity);
  };

  const handleUserChange = (user: UserRole) => {
    setCurrentUser(user);
    // Update the layout to reflect the current user's position
    const updatedLayout = userLayout.map(u => 
      u.id === user.id ? { ...u, position: 'center' as const } : u
    );
    setUserLayout(updatedLayout);
  };

  const handleLayoutChange = (newLayout: UserRole[]) => {
    setUserLayout(newLayout);
  };


  return (
    <>
      <div className="min-h-screen bg-slate-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>

        <div className="relative z-10 flex flex-col items-center">
          <Header 
            currentUser={currentUser}
            onUserChange={handleUserChange}
            onLayoutChange={handleLayoutChange}
          />
          
          <div className="w-full max-w-7xl mx-auto my-8 flex justify-center">
            <button
              onClick={handleOpenCalendar}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-3 text-lg font-semibold text-cyan-300 shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-white/40"
            >
              🗓️ View My Calendar
            </button>
          </div>

          <LiveVideoPreview 
            currentUser={currentUser}
            userLayout={userLayout}
          />

          <main className="w-full max-w-7xl mx-auto mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ACTIVITIES.map((activity, index) => (
                <ActivityCard
                  key={index}
                  activity={activity}
                  onStartF2F={handleOpenF2F}
                  onSchedule={handleOpenSchedule}
                />
              ))}
            </div>
          </main>
          <Footer />
        </div>
      </div>
      {selectedActivity && (
        <F2FModal
          isOpen={isF2FModalOpen}
          onClose={handleCloseF2F}
          activity={selectedActivity}
        />
      )}
      {selectedActivity && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={handleCloseSchedule}
          activity={selectedActivity}
          onScheduleAppointment={handleAddAppointment}
        />
      )}
      <CalendarModal isOpen={isCalendarModalOpen} onClose={handleCloseCalendar} appointments={appointments} />
      {activeReminder && (
        <ReminderToast
          appointment={activeReminder}
          onDismiss={handleDismissReminder}
          onJoin={() => handleJoinFromReminder(activeReminder.activity)}
        />
      )}
    </>
  );
};

export default App;