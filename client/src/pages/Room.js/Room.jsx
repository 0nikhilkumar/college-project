import React, { useEffect, useState } from 'react'
import styles from "./Room.module.css"
import { useWebRTC } from '../../hooks/useWebRTC'
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRoom } from '../../http';

const Room = () => {
  const {id: roomId} = useParams();
  const navigate = useNavigate();
  const user = useSelector((state)=> state.auth.user);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [numberOfClients, setNumberOfClients] = useState(clients);
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(true);

  useEffect(()=> {
    handleMute(isMute, user.id);
  }, [isMute]);

  const handleManualLeave = ()=> {
    navigate('/rooms');
  };

  useEffect(()=> {
    const fetchRoom = async () => {
      const {data} = await getRoom(roomId);
      setRoom((prev) => data);
    };

    fetchRoom();
  }, [roomId]);

  const handleMuteClick = (clientId)=> {
    setMute((isMute) => !isMute);
  }

  useEffect(()=> {
    setNumberOfClients(()=> {
      return [...new Set(clients)];
    })
  }, [clients]);

  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="backArrow" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button onClick={handleManualLeave} className={styles.actionBtn}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {numberOfClients.map((client, index) => (
            <div className={styles.client} key={index}>
              <div className={styles.userHead}>
                <audio
                  ref={(instance) => provideRef(instance, client.id)}
                  autoPlay></audio>
                <img
                  className={styles.userAvatar}
                  src={client.avatar}
                  alt="avatar"
                />
                <button
                  onClick={() => handleMuteClick(client.id)}
                  className={styles.micBtn}>
                  {client.muted ? (
                    <img className={styles.mic} src="/images/mic-mute.png" alt="mic-mute-btn" />
                  ) : (
                    <img className={styles.micImg} src="/images/mic.png" alt="mic-icon" />
                  )}
                </button>
              </div>
              <h4>{client.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Room
