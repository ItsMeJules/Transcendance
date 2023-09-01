import { useEffect, useRef, useState } from "react";
import { useHref } from "react-router-dom";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { Socket } from "socket.io-client";

interface playButtonProps {
  gameMode: number;
  inQueue: number;
  buttonText: string;
}

const PlayButton: React.FC<playButtonProps> = ({ gameMode, inQueue, buttonText }) => {
  const socketRef = useRef<Socket | null>(null);
  const socket = useWebsocketContext();


  const handleJoinGameQueue = async (gameMode: number) => {
    // console.log("gamemode:", gameMode, " inQueue:", inQueue);
    console.log('socket:', socketRef.current?.id);
    if (inQueue !== gameMode) {
      socketRef.current?.emit('joinGameQueue', { gameMode: gameMode });
    } else if (inQueue === gameMode)
      socketRef.current?.emit('leaveGameQueue');
  }

  useEffect(() => {
    if (!socket.game)
      return ;
    // Only update if socketRef hasn't been set or if it's different from the previous value.
    if (!socketRef.current && socket.game) {
      console.log('defninf socketRef with:', socket.game.id);
      socketRef.current = socket.game;
    }
  }, [socket.game]);

  useEffect(() => {
    console.log('socket:', socket.game?.id);
    console.log('socketRef:', socketRef.current?.id);
  }, []);

  return (
    <button className="corner-button" onClick={() => handleJoinGameQueue(gameMode)}>
      <span>{inQueue === gameMode ? "Cancel - leave queue" : `${buttonText}`}</span>
    </button>
  );
}

export default PlayButton;
