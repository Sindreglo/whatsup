'use client';

import { useState, useEffect } from 'react';
import { useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish } from 'agora-rtc-react';
import VideoCall from './VideoCall';

interface ChannelManagerProps {
  channelName: string;
}

export default function ChannelManager({ channelName }: ChannelManagerProps) {
  const appId = process.env.PUBLIC_AGORA_APP_ID || '';
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [uid, setUid] = useState<string | number>('');

  // Generate a random user ID
  useEffect(() => {
    setUid(Math.floor(Math.random() * 10000));
  }, []);

  // Agora hooks
  const { localCameraTrack } = useLocalCameraTrack(isJoined);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isJoined);
  
  // Join channel
  useJoin({
    appid: appId,
    channel: channelName,
    token: null, // Using null for testing, implement token server for production
    uid: uid,
  }, isJoined);

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack], isJoined);

  const handleJoin = () => {
    setIsJoined(true);
  };

  const handleLeave = () => {
    setIsJoined(false);
  };

  const handleToggleMute = async () => {
    if (localMicrophoneTrack) {
      const newMutedState = !isMuted;
      await localMicrophoneTrack.setEnabled(!newMutedState);
      setIsMuted(newMutedState);
    }
  };

  if (!isJoined) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        gap: '16px',
        color: 'white'
      }}>
        <h2>Ready to join {channelName}?</h2>
        <button className="button" onClick={handleJoin}>
          Join Call
        </button>
      </div>
    );
  }

  return (
    <>
      <VideoCall 
        channelName={channelName} 
        localCameraTrack={localCameraTrack}
        localMicrophoneTrack={localMicrophoneTrack}
      />
      {/* Mute button */}
      <button 
        className={` ${isMuted ? 'backgroundColorRed' : 'backgroundColorPrimary'}`}
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