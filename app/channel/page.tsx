'use client';

import styles from './page.module.scss';
import ChannelManager from '../../components/ChannelManager';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraRTCProvider } from 'agora-rtc-react';

// Initialize client outside component to prevent recreation
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function Channel() {
  const channelName = 'main';

  return (
    <main className={styles.container}>
      <AgoraRTCProvider client={client as any}>
        <ChannelManager channelName={channelName} />
      </AgoraRTCProvider>
      <a href="/">
        <button className="iconButton backgroundColorRed" aria-label="Back to Home">
          📞
        </button>
      </a>
    </main>
  );
}