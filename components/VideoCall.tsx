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
      {allUsers.map((user, index) => {
        if (user.type === 'local') {
          return (
            <div key={user.uid} className={styles.videoItem}>
              <LocalUser
                cameraOn={true}
                micOn={true}
                videoTrack={localCameraTrack}
                audioTrack={localMicrophoneTrack}
              />
              <div className={styles.userLabel}>You</div>
            </div>
          );
        } else {
          const remoteUser = remoteUsers.find(u => u.uid === user.uid);
          console.log('Rendering remote user:', {
            uid: user.uid,
            hasVideoTrack: !!remoteUser?.videoTrack,
            hasAudioTrack: !!remoteUser?.audioTrack,
            userObject: remoteUser
          });
          
          return (
            <div key={user.uid} className={styles.videoItem}>
              <RemoteUser
                user={remoteUser!}
                playVideo={true}
                playAudio={true}
              />
              <div className={styles.userLabel}>User {user.uid}</div>
            </div>
          );
        }
      })}
    </div>
  );
}