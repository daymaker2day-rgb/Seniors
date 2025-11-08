import React from 'react';
import UserMenu, { UserRole } from './UserMenu';

interface HeaderProps {
  currentUser: UserRole;
  onUserChange: (user: UserRole) => void;
  onLayoutChange: (layout: UserRole[]) => void;
  onToggleVideos: (show: boolean) => void;
  videosVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onUserChange, onLayoutChange, onToggleVideos, videosVisible }) => {
  return (
    <>
      {/* User Menu - Fixed to Far Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <UserMenu 
          currentUser={currentUser}
          onUserChange={onUserChange}
          onLayoutChange={onLayoutChange}
          onToggleVideos={onToggleVideos}
          videosVisible={videosVisible}
        />
      </div>

      <header className="relative text-center my-8">

      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 pb-2">
        DayMaker
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mt-2 max-w-2xl mx-auto">
        Your daily spark of connection. Discover fun and easy activities to share with friends and family, anytime, anywhere.
      </p>
    </header>
    </>
  );
};

export default Header;
