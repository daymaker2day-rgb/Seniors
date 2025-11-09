import React, { useState } from 'react';

export interface UserRole {
  id: 'daymaker' | 'me' | 'family' | 'client';
  name: string;
  position: 'center' | 'top-left' | 'top-right';
  color: string;
}

interface UserMenuProps {
  currentUser: UserRole;
  onUserChange: (user: UserRole) => void;
  onLayoutChange: (layout: UserRole[]) => void;
  onToggleVideos: (show: boolean) => void;
  videosVisible: boolean;
  onToggleCamera?: (enabled: boolean) => void;
  cameraEnabled?: boolean;
  onSignOut?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  currentUser, 
  onUserChange, 
  onLayoutChange, 
  onToggleVideos, 
  videosVisible,
  onToggleCamera,
  cameraEnabled = true,
  onSignOut
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPositions, setShowPositions] = useState<string | null>(null);

  const userRoles: UserRole[] = [
    { id: 'daymaker', name: 'DayMaker', position: 'center', color: 'bg-gradient-to-r from-cyan-500 to-purple-500' },
    { id: 'family', name: 'Family Member', position: 'top-left', color: 'bg-gradient-to-r from-green-500 to-blue-500' },
    { id: 'client', name: 'Client', position: 'top-right', color: 'bg-gradient-to-r from-pink-500 to-red-500' }
  ];

  const positions = [
    { id: 'center', name: 'Main Video (Center)', icon: '🎯' },
    { id: 'top-left', name: 'Top Left', icon: '↖️' },
    { id: 'top-right', name: 'Top Right', icon: '↗️' }
  ];

  const handleRoleWithPositionSelect = (roleId: string, position: string) => {
    const role = userRoles.find(r => r.id === roleId);
    if (!role) return;

    const newUser = { ...role, position: position as UserRole['position'] };
    onUserChange(newUser);
    onLayoutChange([newUser]);
    setShowPositions(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Menu Button - Circle with M */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        title="User Menu"
      >
        M
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="absolute top-14 right-0 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl min-w-48">
            <div className="p-2">
              {/* Current User Display */}
              <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentUser.color}`}></div>
                  <span className="text-white font-medium">{currentUser.name}</span>
                </div>
              </div>

              {/* User Role Selection */}
              <div className="space-y-1">
                {userRoles.map((role) => (
                  <div key={role.id}>
                    <button
                      onClick={() => {
                        if (showPositions === role.id) {
                          setShowPositions(null);
                        } else {
                          setShowPositions(role.id);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        currentUser.id === role.id 
                          ? 'bg-gray-700 text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${role.color}`}></div>
                          {role.name}
                        </div>
                        <span className="text-xs">📍 Choose Position</span>
                      </div>
                    </button>
                    
                    {/* Position submenu */}
                    {showPositions === role.id && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-gray-600 pl-2">
                        {positions.map((position) => (
                          <button
                            key={position.id}
                            onClick={() => handleRoleWithPositionSelect(role.id, position.id)}
                            className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                          >
                            <span className="mr-2">{position.icon}</span>
                            {position.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Video and Camera Controls */}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <button
                    onClick={() => {
                      onToggleVideos(!videosVisible);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {videosVisible ? '👁️ Hide Video Images' : '👁️‍🗨️ Show Video Images'}
                  </button>
                  
                  {/* Camera Toggle */}
                  {onToggleCamera && (
                    <button
                      onClick={() => {
                        onToggleCamera(!cameraEnabled);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                      {cameraEnabled ? '📹 Turn Camera Off' : '📷 Turn Camera On'}
                    </button>
                  )}
                  
                  {/* Sign Out */}
                  {onSignOut && (
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      🚪 Sign Out
                    </button>
                  )}
                  
                  {/* Billing Contact */}
                  <a
                    href="mailto:daymaker2day@gmail.com?subject=DAYMAKER2DAY Billing Question"
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    💳 Billing Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;