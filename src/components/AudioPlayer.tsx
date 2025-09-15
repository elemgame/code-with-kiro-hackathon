import React, { useEffect, useMemo, useRef, useState } from 'react';

interface AudioPlayerProps {
  isPlaying: boolean;
  volume?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  volume = 0.3,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // List of fantasy tracks (memoized for optimization)
  const tracks = useMemo(
    () => [`${process.env.PUBLIC_URL}/audio/forest.ogg`],
    []
  );

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;

      audioRef.current.addEventListener('loadeddata', () => {
        setIsLoaded(true);
      });

      audioRef.current.addEventListener('ended', () => {
        // Switch to next track
        setCurrentTrack(prev => {
          const nextTrack = (prev + 1) % tracks.length;
          return nextTrack >= 0 && nextTrack < tracks.length ? nextTrack : 0;
        });
      });

      audioRef.current.addEventListener('error', _e => {
        // Try next track on error
        setCurrentTrack(prev => {
          const nextTrack = (prev + 1) % tracks.length;
          return nextTrack >= 0 && nextTrack < tracks.length ? nextTrack : 0;
        });
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [tracks.length]);

  useEffect(() => {
    if (
      audioRef.current &&
      tracks.length > 0 &&
      currentTrack >= 0 &&
      currentTrack < tracks.length
    ) {
      const trackSrc = tracks[currentTrack];
      if (trackSrc) {
        audioRef.current.src = trackSrc;
        audioRef.current.load();
      }
    }
  }, [currentTrack, tracks]);

  // Update volume when volume prop changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume)); // Limit values from 0 to 1
    }
  }, [volume]);

  // Control playback
  useEffect(() => {
    if (audioRef.current && isLoaded) {
      if (isPlaying) {
        audioRef.current.play().catch(_error => {
          // Playback error - ignore
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isLoaded]);

  return null; // This component doesn't render anything visible
};

export default AudioPlayer;
