import React from 'react';
import AudioPlayer from './AudioPlayer';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AudioPlayer />
      </main>
      <Footer />
    </div>
  );
};

export default App;
