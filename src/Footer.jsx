import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#101010] p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-white">&copy; {new Date().getFullYear()} Radio Player. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
