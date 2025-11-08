import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center text-gray-500 mt-16 pb-8">
      <p>&copy; {new Date().getFullYear()} DayMaker. All rights reserved.</p>
      <p className="text-sm mt-2">
        PSST! A friendly bot is in the works to help spread the word and connect even more people!
      </p>
    </footer>
  );
};

export default Footer;
