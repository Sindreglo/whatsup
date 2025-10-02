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
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  // Generate a simple UID in valid range (like Call.tsx might be doing internally)
  const [uid] = useState<number>(() => {
    const simpleUid = Math.floor(Math.random() * 10000) + 1000; // 1000-10999
    console.log('Generated simple UID:', simpleUid);
    return simpleUid;
  });

  // Agora hooks - let Agora auto-assign UID
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  
  // Enable/disable tracks based on state (like in Call.tsx)
  useEffect(() => {
    if (localCameraTrack) {
      console.log('Setting camera track enabled:', isVideoEnabled);
      localCameraTrack.setEnabled(isVideoEnabled);
    }
  }, [localCameraTrack, isVideoEnabled]);

  useEffect(() => {
    if (localMicrophoneTrack) {
      console.log('Setting microphone track enabled:', !isMuted);
      localMicrophoneTrack.setEnabled(!isMuted);
    }
  }, [localMicrophoneTrack, isMuted]);
  
  // Join channel with simple UID
  const joinResult = useJoin({
    appid: appId,
    channel: channelName,
    token: null,
    uid: uid,
  });

  // Log join result
  useEffect(() => {
    console.log('Auto-joining channel:', channelName, 'with UID:', uid, 'AppID:', appId ? 'Set' : 'Missing');
    console.log('Join result:', joinResult);
  }, [channelName, appId, joinResult, uid]);

  // Publish local tracks (like in Call.tsx)
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Debug logging for track publishing
  useEffect(() => {
    console.log('Publishing tracks effect triggered:', {
      camera: !!localCameraTrack,
      microphone: !!localMicrophoneTrack,
      cameraEnabled: localCameraTrack?.enabled,
      micEnabled: localMicrophoneTrack?.enabled
    });
  }, [localCameraTrack, localMicrophoneTrack]);

  // Debug logging
  console.log('ChannelManager state:', { 
    appId: appId ? 'Set' : 'Missing',
    localTracks: {
      camera: !!localCameraTrack,
      cameraEnabled: localCameraTrack?.enabled,
      microphone: !!localMicrophoneTrack,
      microphoneEnabled: localMicrophoneTrack?.enabled
    }
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

  const handleToggleVideo = async () => {
    if (localCameraTrack) {
      const newVideoState = !isVideoEnabled;
      await localCameraTrack.setEnabled(newVideoState);
      setIsVideoEnabled(newVideoState);
    }
  };

  return (
    <>
      <VideoCall 
        channelName={channelName} 
        localCameraTrack={localCameraTrack}
        localMicrophoneTrack={localMicrophoneTrack}
      />
      {/* Video toggle button */}
      <button 
        className={`${!isVideoEnabled ? 'backgroundColorRed' : 'backgroundColorPrimary'}`}
        onClick={handleToggleVideo}
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '80px',
          zIndex: 1000 
        }}
        aria-label={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
      >
        {isVideoEnabled ? '📹' : '📵'}
      </button>
      {/* Mute button */}
      <button 
        className={`${isMuted ? 'backgroundColorRed' : 'backgroundColorPrimary'}`}
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