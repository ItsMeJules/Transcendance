import { useState } from "react";
import { useWebsocketContext } from "services/Websocket/Websocket";

interface playButtonProps {
  gameMode: number;
  inQueue: number;
  buttonText: string;
}

const PlayButton: React.FC<playButtonProps> = ({ gameMode, inQueue, buttonText }) => {
  const socket = useWebsocketContext();

  const handleJoinGameQueue = async (gameMode: number) => {
    if (inQueue !== gameMode) {
      socket.game?.emit('joinGameQueue', { gameMode: gameMode });
    } else if (inQueue === gameMode)
      socket.game?.emit('leaveGameQueue');
  }

  return (
    <button className="corner-button" onClick={() => handleJoinGameQueue(gameMode)}>
      <span>{inQueue === gameMode ? "Cancel - leave queue" : `${buttonText}`}</span>
    </button>
  );
}

export default PlayButton;