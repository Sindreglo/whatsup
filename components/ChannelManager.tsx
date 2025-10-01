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
    // Create a more unique UID using timestamp + random
    const uniqueUid = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setUid(uniqueUid);
    console.log('Generated UID:', uniqueUid);
  }, []);

  // Agora hooks
  const { localCameraTrack } = useLocalCameraTrack(isJoined);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isJoined);
  
  // Join channel with error handling
  const joinResult = useJoin({
    appid: appId,
    channel: channelName,
    token: null, // Using null for testing, implement token server for production
    uid: uid,
  }, isJoined);

  // Log join result
  useEffect(() => {
    if (isJoined) {
      console.log('Join attempt result:', joinResult);
      console.log('Joining channel:', channelName, 'with UID:', uid, 'AppID:', appId);
    }
  }, [isJoined, joinResult, channelName, uid, appId]);

  // Publish local tracks - filter out null tracks
  const tracksToPublish = [localMicrophoneTrack, localCameraTrack].filter(track => track !== null);
  usePublish(tracksToPublish, isJoined);

  // Debug logging
  console.log('ChannelManager state:', { 
    isJoined, 
    appId: appId ? 'Set' : 'Missing', 
    uid,
    tracksReady: tracksToPublish.length 
  });

  const handleJoin = () => {
    if (!appId) {
      console.error('App ID is missing!');
      return;
    }
    if (!uid) {
      console.error('UID not generated yet!');
      return;
    }
    console.log('Attempting to join with:', { appId: appId.substring(0, 8) + '...', uid, channelName });
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