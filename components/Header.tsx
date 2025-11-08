import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center my-8">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 pb-2">
        DayMaker
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mt-2 max-w-2xl mx-auto">
        Your daily spark of connection. Discover fun and easy activities to share with friends and family, anytime, anywhere.
      </p>
    </header>
  );
};

export default Header;
