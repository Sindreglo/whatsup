'use client';

import { createContext, useContext, ReactNode } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

// Initialize Agora client
AgoraRTC.setLogLevel(0);

interface AgoraContextType {
  client: IAgoraRTCClient;
  appId: string;
}

const AgoraContext = createContext<AgoraContextType | null>(null);

export const useAgora = () => {
  const context = useContext(AgoraContext);
  if (!context) {
    throw new Error('useAgora must be used within AgoraProvider');
  }
  return context;
};

interface AgoraProviderProps {
  children: ReactNode;
}

export function AgoraProvider({ children }: AgoraProviderProps) {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  const appId = process.env.PUBLIC_AGORA_APP_ID || '';

  // Note: App ID validation should be handled in components that use it

  return (
    <AgoraContext.Provider value={{ client, appId }}>
      {children}
    </AgoraContext.Provider>
  );
}