'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

// Dynamically import Call component to prevent SSR issues with Agora SDK
const Call = dynamic(() => import('../components/Call'), {
  ssr: false,
  loading: () => <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white' }}>Loading call...</div>
});

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
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
    return (
      <Call 
        appId={appId}
        channelName={channelName}
        onLeave={handleLeaveCall}
      />
    );
  }

  return (
    <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <img src="./social.png" alt="WhatsUp logo" className={styles.icon} />
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

        <section className={styles.passwordSection}>
          <h2>Channel Access Code</h2>
          <div className={styles.password}>WHATSUP2024</div>
          <p>Use this code to join private channels</p>
        </section>
    </main>
  );
}
