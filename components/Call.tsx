"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  useRemoteVideoTracks,
} from "agora-rtc-react";
import React from "react";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { BsFillTelephoneFill } from 'react-icons/bs';
import styles from './Call.module.scss';


function Call(props: { appId: string; channelName: string; onLeave?: () => void }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const [micOn, setMicOn] = React.useState(true);
  const [camOn, setCamOn] = React.useState(true);

  return (
    <AgoraRTCProvider client={client}>
      <Videos
        channelName={props.channelName}
        AppID={props.appId}
        micOn={micOn}
        camOn={camOn}
      />
      <div className={styles.controls}>
        <button
          className={`${styles.controlButton} ${styles.endCall}`}
          onClick={() => props.onLeave && props.onLeave()}
          title="End Call"
        >
          <BsFillTelephoneFill className="icon" />
        </button>
        <button
          className={`${styles.controlButton} ${styles.micButton} ${!micOn ? styles.muted : ''}`}
          onClick={() => setMicOn((v) => !v)}
          title={micOn ? "Mute Mic" : "Unmute Mic"}
        >
          {micOn ? (
            <MdMic className="w-5 h-5" />
          ) : (
            <MdMicOff className="w-5 h-5" />
          )}
        </button>
        <button
          className={`${styles.controlButton} ${styles.cameraButton} ${!camOn ? styles.disabled : ''}`}
          onClick={() => setCamOn((v) => !v)}
          title={camOn ? "Turn Off Camera" : "Turn On Camera"}
        >
          {camOn ? (
            <MdVideocam className="w-5 h-5" />
          ) : (
            <MdVideocamOff className="w-5 h-5" />
          )}
        </button>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos(props: {
  channelName: string;
  AppID: string;
  micOn: boolean;
  camOn: boolean;
}) {
  const { AppID, channelName, micOn, camOn } = props;
  
  // Debug logging
  console.log('Videos component props:', { AppID, channelName, micOn, camOn });
  
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  // Enable/disable mic and camera based on props
  React.useEffect(() => {
    if (localMicrophoneTrack) localMicrophoneTrack.setEnabled(micOn);
  }, [micOn, localMicrophoneTrack]);
  React.useEffect(() => {
    if (localCameraTrack) localCameraTrack.setEnabled(camOn);
  }, [camOn, localCameraTrack]);
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  // Explicitly subscribe to video tracks for all remote users
  // This ensures video tracks are available before rendering RemoteUser components
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);

  // Debug logging for remote users
  console.log('Remote users:', remoteUsers.length, remoteUsers.map(u => ({ 
    uid: u.uid, 
    hasVideo: u.hasVideo, 
    hasAudio: u.hasAudio,
    videoTrack: !!u.videoTrack,
    audioTrack: !!u.audioTrack
  })));

  usePublish([localMicrophoneTrack, localCameraTrack]);
  const joinResult = useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
  });
  
  // Debug join result
  console.log('Join result:', joinResult);

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className={styles.loadingContainer}>Loading devices...</div>
    );

  return (
    <>
        <div
          className={styles.remoteGrid}
          data-count={remoteUsers.length}
        >
          {remoteUsers
            .map((user) => (
              <div key={user.uid} className={styles.remoteUser}>
                <RemoteUser user={user} />
                <div className={styles.userLabel}>
                  User {user.uid}
                </div>
              </div>
            ))}
        </div>
      <div className={styles.localVideo}>
        <LocalVideoTrack track={localCameraTrack} play={true} />
        <div className={styles.userLabel}>
          You
        </div>
      </div>
    </>
  );
}

export default Call;