'use client';

import { useRemoteUsers, RemoteUser, LocalUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';
import styles from './VideoCall.module.scss';

interface VideoCallProps {
  channelName: string;
  localCameraTrack: ICameraVideoTrack | null;
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
}

export default function VideoCall({ channelName, localCameraTrack, localMicrophoneTrack }: VideoCallProps) {
  const remoteUsers = useRemoteUsers();

  // Debug logging
  console.log('Remote users:', remoteUsers.length, remoteUsers.map(u => u.uid));
  console.log('Local tracks:', { camera: !!localCameraTrack, mic: !!localMicrophoneTrack });

  // Generate user blocks: local user + remote users
  const allUsers = [
    { type: 'local', uid: 'local' },
    ...remoteUsers.map(user => ({ type: 'remote', uid: user.uid }))
  ];

  console.log('Total users to render:', allUsers.length);

  return (
    <div className={styles.videoGrid} data-count={allUsers.length}>
      {allUsers.map((user, index) => (
        <div key={user.uid} className={styles.videoItem}>
          {user.type === 'local' ? (
            <LocalUser
              cameraOn={true}
              micOn={true}
              videoTrack={localCameraTrack}
              audioTrack={localMicrophoneTrack}
            />
          ) : (
            <RemoteUser
              user={remoteUsers.find(u => u.uid === user.uid)!}
            />
          )}
          <div className={styles.userLabel}>
            {user.type === 'local' ? 'You' : `User ${user.uid}`}
          </div>
        </div>
      ))}
    </div>
  );
}