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
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, onUserChange, onLayoutChange, onToggleVideos, videosVisible }) => {
  const [isOpen, setIsOpen] = useState(false);

  const userRoles: UserRole[] = [
    { id: 'daymaker', name: 'DayMaker', position: 'center', color: 'bg-gradient-to-r from-cyan-500 to-purple-500' }
  ];

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
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                  <span className="text-white font-medium">DayMaker</span>
                </div>
              </div>

              {/* Video Controls Only */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onToggleVideos(!videosVisible);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {videosVisible ? '👁️ Hide Video Images' : '👁️‍🗨️ Show Video Images'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;