import React, { useState } from 'react';

export interface UserRole {
  id: 'me' | 'family' | 'client';
  name: string;
  position: 'center' | 'top-left' | 'top-right';
  color: string;
}

interface UserMenuProps {
  currentUser: UserRole;
  onUserChange: (user: UserRole) => void;
  onLayoutChange: (layout: UserRole[]) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, onUserChange, onLayoutChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const userRoles: UserRole[] = [
    { id: 'me', name: 'Me', position: 'center', color: 'bg-blue-500' },
    { id: 'family', name: 'Family Member', position: 'top-left', color: 'bg-green-500' },
    { id: 'client', name: 'Client', position: 'top-right', color: 'bg-purple-500' }
  ];

  const handleUserSelect = (user: UserRole) => {
    onUserChange(user);
    setIsOpen(false);
  };

  const handleLayoutSwap = () => {
    // Swap positions between users
    const newLayout = userRoles.map(role => {
      if (role.id === 'family' && role.position === 'top-left') {
        return { ...role, position: 'top-right' as const };
      } else if (role.id === 'client' && role.position === 'top-right') {
        return { ...role, position: 'top-left' as const };
      }
      return role;
    });
    onLayoutChange(newLayout);
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
                Current: <span className="text-white font-medium">{currentUser.name}</span>
              </div>

              {/* User Role Options */}
              <div className="space-y-1 mb-2">
                {userRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleUserSelect(role)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentUser.id === role.id
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      <span>{role.name}</span>
                      <span className="text-xs text-gray-500">({role.position})</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Layout Options */}
              <div className="border-t border-gray-700 pt-2">
                <button
                  onClick={handleLayoutSwap}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  🔄 Swap Video Positions
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