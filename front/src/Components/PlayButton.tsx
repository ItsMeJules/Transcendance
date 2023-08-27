import { useState } from "react";
import { useWebsocketContext } from "../Wrappers/Websocket";
import { GameData } from "../Services/Game";

interface playButtonProps {
  gameMode: number,
  setSocketData: (data: any) => void;
  buttonText: string;
}

const PlayButton: React.FC<playButtonProps> = ({ gameMode, setSocketData, buttonText }) => {
  const socket = useWebsocketContext();
  const [isInQueue, setIsInQueue] = useState(false);

  const handleJoinGameQueue = async (gameMode: number) => {
    if (!isInQueue) {
      socket.game?.emit('joinGameQueue', { gameMode: gameMode });
      socket.game?.on('joinGameQueue', (data: any) => {
        setSocketData(data);
      });
      setIsInQueue(true);
    } else {
      socket.game?.emit('leaveGameQueue');
      setIsInQueue(false);
      setSocketData({ status: 'LEAVE' });
    }
  }

  return (
    < button className="text-white border border-white"
      style={{ fontSize: '30px', zIndex: '1' }
      }
      onClick={() => handleJoinGameQueue(gameMode)}>
      {isInQueue ? "Cancel - leave queue" : `${buttonText}`}
    </button >
  );
}

export default PlayButton;