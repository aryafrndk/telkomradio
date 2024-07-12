import React from 'react';
import logo from './assets/images/telkomradio.png'; // Ubah path sesuai lokasi logo Anda

const Header = () => {
  return (
    <header className="w-full bg-[#101010] p-4">
      <div className="container mx-auto flex items-center">
        <img src={logo} alt="Radio Player Logo" className="h-12 mx-4" />
      </div>
    </header>
  );
};

export default Header;
