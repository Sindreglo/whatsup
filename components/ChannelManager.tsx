'use client';

import { useState, useEffect } from 'react';
import { useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish } from 'agora-rtc-react';
import VideoCall from './VideoCall';

interface ChannelManagerProps {
  channelName: string;
  onLeave?: () => void;
}

export default function ChannelManager({ channelName, onLeave }: ChannelManagerProps) {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
  const [isMuted, setIsMuted] = useState(false);
  const [uid, setUid] = useState<string | number>('');

  // Generate a random user ID
  useEffect(() => {
    // Create a more unique UID using timestamp + random
    const uniqueUid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setUid(uniqueUid);
    console.log('Generated UID:', uniqueUid);
  }, []);

  // Agora hooks - auto-start since component only renders when user wants to join
  const { localCameraTrack } = useLocalCameraTrack(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);
  
  // Join channel immediately when component mounts
  const joinResult = useJoin({
    appid: appId,
    channel: channelName,
    token: null,
    uid: uid,
  }, true); // Always true since we only render when user wants to join

  // Log join result
  useEffect(() => {
    console.log('Auto-joining channel:', channelName, 'with UID:', uid, 'AppID:', appId ? 'Set' : 'Missing');
  }, [channelName, uid, appId]);

  // Publish local tracks - filter out null tracks
  const tracksToPublish = [localMicrophoneTrack, localCameraTrack].filter(track => track !== null);
  usePublish(tracksToPublish, true);

  // Debug logging for track publishing
  useEffect(() => {
    if (tracksToPublish.length > 0) {
      console.log('Publishing tracks:', {
        camera: !!localCameraTrack,
        microphone: !!localMicrophoneTrack,
        totalTracks: tracksToPublish.length
      });
    }
  }, [localCameraTrack, localMicrophoneTrack, tracksToPublish.length]);

  // Debug logging
  console.log('ChannelManager state:', { 
    appId: appId ? 'Set' : 'Missing', 
    uid,
    tracksReady: tracksToPublish.length 
  });

  const handleLeave = () => {
    if (onLeave) {
      onLeave();
    }
  };

  const handleToggleMute = async () => {
    if (localMicrophoneTrack) {
      const newMutedState = !isMuted;
      await localMicrophoneTrack.setEnabled(!newMutedState);
      setIsMuted(newMutedState);
    }
  };

  return (
    <>
      <VideoCall 
        channelName={channelName} 
        localCameraTrack={localCameraTrack}
        localMicrophoneTrack={localMicrophoneTrack}
      />
      {/* Mute button */}
      <button 
        className={`iconButton ${isMuted ? 'backgroundColorRed' : 'backgroundColorPrimary'}`}
        onClick={handleToggleMute}
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px',
          zIndex: 1000 
        }}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🎤'}
      </button>
      {/* Leave button */}
      <button 
        className="iconButton backgroundColorRed" 
        onClick={handleLeave}
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 1000 
        }}
      >
        📞
      </button>
    </>
  );
}