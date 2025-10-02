'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraRTCProvider } from 'agora-rtc-react';
import ChannelManager from '../components/ChannelManager';

// Initialize client outside component to prevent recreation
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function Home() {
  const [isJoined, setIsJoined] = useState(false);
  const channelName = 'main';

  const handleJoinCall = () => {
    setIsJoined(true);
  };

  const handleLeaveCall = () => {
    setIsJoined(false);
  };

  if (isJoined) {
    return (
      <AgoraRTCProvider client={client as any}>
        <ChannelManager 
          channelName={channelName} 
          onLeave={handleLeaveCall}
        />
      </AgoraRTCProvider>
    );
  }

  return (
    <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <img src="/social.png" alt="WhatsUp logo" className={styles.icon} />
            WhatsUp
          </h1>
        </header>

      <button className="button" onClick={handleJoinCall}>
        Join Call
      </button>
        
        <section className={styles.guide}>
          <h2>Add WhatsUp to your homescreen</h2>
          <ol>
            <li>Tap the <b>⋮</b> menu (top right).</li>
            <li>Choose <b>"Add to Home screen"</b>.</li>
            <li>Confirm and drag the icon wherever you want.</li>
          </ol>
        </section>

        <footer className={styles.footer}>
          <small>Built with Next.js · Static exportable</small>
        </footer>
    </main>
  );
}
