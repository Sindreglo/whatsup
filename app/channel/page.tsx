'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

// Dynamically import Call component to prevent SSR issues
const Call = dynamic(() => import('../../components/Call'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: 'white'
    }}>
      Loading video call...
    </div>
  )
});

export default function Channel() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className={styles.container}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: 'white'
        }}>
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Call 
        appId={process.env.NEXT_PUBLIC_AGORA_APP_ID!}
        channelName="main" 
      />
    </main>
  );
}