import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ActivityCard from './components/ActivityCard';
import Footer from './components/Footer';
import F2FModal from './components/F2FModal';
import CalendarModal from './components/CalendarModal';
import LiveVideoPreview from './components/LiveVideoPreview';
import ScheduleModal from './components/ScheduleModal';
import ReminderToast from './components/ReminderToast';
import AuthPage from './components/AuthPage';
import ContentCreationModal from './components/ContentCreationModal';
import SettingsModal from './components/SettingsModal';
import { UserRole } from './components/UserMenu';
import { ACTIVITIES } from './constants';
import { UsageTracker } from './utils/usageTracker';
import type { Activity, Appointment } from './types';

const REMINDER_LEAD_TIME_MS = 5 * 60 * 1000; // 5 minutes

interface UserInfo {
  phone: string;
  plan: string;
  name: string;
  email?: string;
}

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isF2FModalOpen, setIsF2FModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isContentCreationModalOpen, setIsContentCreationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeReminder, setActiveReminder] = useState<Appointment | null>(null);

  // User role state - Default to DayMaker only
  const [currentUser, setCurrentUser] = useState<UserRole>({
    id: 'daymaker',
    name: 'DayMaker',
    position: 'center',
    color: 'bg-gradient-to-r from-cyan-500 to-purple-500'
  });

  const [userLayout, setUserLayout] = useState<UserRole[]>([
    { id: 'daymaker', name: 'DayMaker', position: 'center', color: 'bg-gradient-to-r from-cyan-500 to-purple-500' }
  ]);

  // Camera state
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  
  // Video visibility state
  const [videosVisible, setVideosVisible] = useState<boolean>(true);

  const reminderTimeoutIds = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Check for saved user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('daymaker_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Check if login is within last 30 days
      const loginDate = new Date(userData.loginDate);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 30) {
        setUserInfo({ 
          phone: userData.phone || userData.email, // Support legacy email users
          plan: userData.plan, 
          name: userData.name,
          email: userData.email
        });
      } else {
        // Clear old data
        localStorage.removeItem('daymaker_user');
      }
    }
  }, []);

  useEffect(() => {
    // Cleanup all timeouts when the component unmounts
    return () => {
      Object.values(reminderTimeoutIds.current).forEach(clearTimeout);
    };
  }, []);

  const handleAuthComplete = (userData: UserInfo) => {
    // Save to both new and legacy storage for compatibility
    const saveData = {
      ...userData,
      loginDate: new Date().toISOString()
    };
    
    localStorage.setItem('daymaker_user', JSON.stringify(saveData));
    setUserInfo(userData);
  };

  const handleSignOut = () => {
    localStorage.removeItem('daymaker_user');
    setUserInfo(null);
  };


  const handleOpenF2F = (activity: Activity) => {
    // Check if user can start activity (usage limits)
    if (userInfo) {
      const usageCheck = UsageTracker.canStartActivity(userInfo.phone, userInfo.plan);
      if (!usageCheck.allowed) {
        alert(usageCheck.reason);
        return;
      }
      
      // Record activity usage
      UsageTracker.recordActivityStart(userInfo.phone, userInfo.plan);
    }
    
    setSelectedActivity(activity);
    
    // Special handling for Content Creation
    if (activity.title === 'Content Creation') {
      setIsContentCreationModalOpen(true);
    } else {
      setIsF2FModalOpen(true);
    }
  };

  const handleCloseF2F = () => {
    setIsF2FModalOpen(false);
    setSelectedActivity(null);
  };

  const handleCloseContentCreation = () => {
    setIsContentCreationModalOpen(false);
    setSelectedActivity(null);
  };

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsModalOpen(false);
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

  const handleToggleVideos = (show: boolean) => {
    setVideosVisible(show);
  };

  const handleToggleCamera = (enabled: boolean) => {
    setCameraEnabled(enabled);
  };

  // Show authentication page if user is not logged in
  if (!userInfo) {
    return <AuthPage onComplete={handleAuthComplete} />;
  }

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
            onToggleVideos={handleToggleVideos}
            videosVisible={videosVisible}
            onToggleCamera={handleToggleCamera}
            cameraEnabled={cameraEnabled}
            onSignOut={handleSignOut}
            onOpenSettings={handleOpenSettings}
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
            videosVisible={videosVisible}
          />

          <main className="w-full max-w-7xl mx-auto mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ACTIVITIES.map((activity, index) => (
                <ActivityCard
                  key={index}
                  activity={activity}
                  onStartF2F={handleOpenF2F}
                  onSchedule={handleOpenSchedule}
                  userPlan={userInfo?.plan}
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
      {selectedActivity && (
        <ContentCreationModal
          isOpen={isContentCreationModalOpen}
          onClose={handleCloseContentCreation}
          activity={selectedActivity}
        />
      )}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettings}
      />
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