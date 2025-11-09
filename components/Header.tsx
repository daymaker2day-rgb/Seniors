import React, { useState } from 'react';
import UserMenu, { UserRole } from './UserMenu';
import MultiDeviceManager from './MultiDeviceManager';

interface DeviceConnection {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet' | 'desktop';
  connected: boolean;
  position?: string;
}

interface HeaderProps {
  currentUser: UserRole;
  onUserChange: (user: UserRole) => void;
  onLayoutChange: (layout: UserRole[]) => void;
  onToggleVideos: (show: boolean) => void;
  videosVisible: boolean;
  onToggleCamera?: (enabled: boolean) => void;
  cameraEnabled?: boolean;
  onSignOut?: () => void;
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onUserChange, 
  onLayoutChange, 
  onToggleVideos, 
  videosVisible,
  onToggleCamera,
  cameraEnabled,
  onSignOut,
  onOpenSettings
}) => {
  const [connectedDevices, setConnectedDevices] = useState<DeviceConnection[]>([]);

  const handleDeviceConnect = (device: DeviceConnection, position: string) => {
    setConnectedDevices(prev => [...prev, { ...device, position }]);
    // You could also trigger a layout update here if needed
    console.log(`Device ${device.name} connected to ${position}`);
  };

  const handleDeviceDisconnect = (deviceId: string) => {
    setConnectedDevices(prev => prev.filter(d => d.id !== deviceId));
    console.log(`Device disconnected: ${deviceId}`);
  };
  return (
    <>
      {/* Top Control Bar - Fixed positioning for all menus */}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-between items-start p-4">
        {/* Left side - Multi-Device Manager */}
        <MultiDeviceManager
          onDeviceConnect={handleDeviceConnect}
          onDeviceDisconnect={handleDeviceDisconnect}
          connectedDevices={connectedDevices}
        />

        {/* Center - Empty space for clean layout */}
        <div className="flex-1"></div>

        {/* Right side - Settings and User Menu */}
        <div className="flex items-start gap-2">
          {/* Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-gray-300 hover:text-white hover:border-white/40"
              title="Settings"
            >
              ⚙️
            </button>
          )}

          {/* User Menu */}
          <UserMenu 
            currentUser={currentUser}
            onUserChange={onUserChange}
            onLayoutChange={onLayoutChange}
            onToggleVideos={onToggleVideos}
            videosVisible={videosVisible}
            onToggleCamera={onToggleCamera}
            cameraEnabled={cameraEnabled}
            onSignOut={onSignOut}
          />
        </div>
      </div>

      <header className="relative text-center my-8 pt-16">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 pb-2">
        DAYMAKER2DAY
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mt-2 max-w-2xl mx-auto">
        Your daily spark of connection. Discover fun and easy activities to share with friends and family, anytime, anywhere.
      </p>
    </header>
    </>
  );
};

export default Header;
