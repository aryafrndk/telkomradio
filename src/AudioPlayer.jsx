import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState('Loading...');
  const [currentArtist, setCurrentArtist] = useState('Loading...');

  const handlePlay = () => {
    audioRef.current.play();
  };

  const handlePause = () => {
    audioRef.current.pause();
  };

  const fetchSongMetadata = async () => {
    try {
      const response = await axios.get('https://sukmben.radiogentara.com/radio/8140/status-json.xsl');
      const data = response.data;

      if (data.icestats && data.icestats.source && Array.isArray(data.icestats.source)) {
        const source = data.icestats.source.find(src => src.listenurl.includes('/8140/stream'));
        if (source) {
          setCurrentSong(source.title || 'No title available');
          setCurrentArtist(source.artist || 'No artist available');
        }
      } else if (data.icestats && data.icestats.source) {
        setCurrentSong(data.icestats.source.title || 'No title available');
        setCurrentArtist(data.icestats.source.artist || 'No artist available');
      } else {
        setCurrentSong('No title available');
        setCurrentArtist('No artist available');
      }
    } catch (error) {
      console.error('Error fetching song metadata:', error);
      setCurrentSong('Error fetching title');
      setCurrentArtist('Error fetching artist');
    }
  };

  useEffect(() => {
    fetchSongMetadata();
    const interval = setInterval(fetchSongMetadata, 10000); // Fetch metadata every 10 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4"> Telkom Radio Player</h2>
      <p className="text-xl mb-2">Current Track: {currentSong} - {currentArtist}</p>
      <audio
        ref={audioRef}
        src="https://sukmben.radiogentara.com/radio/8140/stream"
        controls
        className="w-full max-w-md mb-4"
      />
      <div className="flex space-x-4">
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Pause
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
