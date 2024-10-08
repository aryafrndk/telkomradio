import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeUp, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState("Loading...");
  const [currentArtist, setCurrentArtist] = useState("Loading...");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Initial volume set to 50%
  const [isMuted, setIsMuted] = useState(false); // State for mute

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0); // Update mute state based on volume
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false; // Unmute
      } else {
        audioRef.current.muted = true; // Mute
      }
      setIsMuted(!isMuted);
    }
  };

  const fetchSongMetadata = async () => {
    try {
      const response = await axios.get(
        "https://sukmben.radiogentara.com/radio/8140/status-json.xsl"
      );
      const data = response.data;

      if (
        data.icestats &&
        data.icestats.source &&
        Array.isArray(data.icestats.source)
      ) {
        const source = data.icestats.source.find((src) =>
          src.listenurl.includes("/8140/stream")
        );
        if (source) {
          setCurrentSong(source.title || "No title available");
          setCurrentArtist(source.artist || "Telkom Radio");
        }
      } else if (data.icestats && data.icestats.source) {
        setCurrentSong(data.icestats.source.title || "No title available");
        setCurrentArtist(data.icestats.source.artist || "Telkom Radio");
      } else {
        setCurrentSong("No title available");
        setCurrentArtist("Telkom Radio");
      }
    } catch (error) {
      console.error("Error fetching song metadata:", error);
      setCurrentSong("Error fetching title");
      setCurrentArtist("Error fetching artist");
    }
  };

  useEffect(() => {
    fetchSongMetadata();
    const interval = setInterval(fetchSongMetadata, 10000); // Fetch metadata every 10 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set initial volume
    }
  }, [volume]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#860f0f] text-white">
      <h2 className="text-3xl font-bold mb-4">Telkom Radio Player</h2>
      <p className="text-xl font-bold mb-2">Now Playing: </p>
      <div className="text-center mb-4">
        <p className="text-lg font-bold">
          {currentSong.length > 30 ? (
            <span className="block truncate">{currentSong}</span>
          ) : (
            currentSong
          )} - {currentArtist}
        </p>
      </div>
      <div className="flex space-x-4 items-center mb-10">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-[#101010] hover:bg-[#101011] rounded"
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="2x" />
        </button>
      </div>
      {/* Volume control visible on larger screens */}
      <div className="hidden sm:flex items-center">
        <FontAwesomeIcon icon={faVolumeUp} size="2x" className="mr-2" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24"
        />
        <span className="ml-2">{Math.round(volume * 100)}%</span>
      </div>
      {/* Mute button visible on smaller screens */}
      <div className="flex sm:hidden items-center">
        <button onClick={toggleMute} className="px-4 py-2 bg-[#101010] hover:bg-[#101011] rounded">
          <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} size="2x" />
        </button>
      </div>
      <audio
        ref={audioRef}
        src="https://sukmben.radiogentara.com/radio/8140/stream"
        className="w-full max-w-md mb-4"
      />
    </div>
  );
};

export default AudioPlayer;
