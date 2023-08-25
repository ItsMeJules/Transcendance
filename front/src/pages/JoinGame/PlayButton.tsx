import { useState } from "react";
import { useWebsocketContext } from "../../services/Websocket";
import { GameData } from "../../services/Game/Game";

interface playButtonProps {
  gameMode: number,
  setSocketData: (data: any) => void;
}

const PlayButton: React.FC<playButtonProps> = ({ gameMode, setSocketData }) => {
  const socket = useWebsocketContext();
  const [isInQueue, setIsInQueue] = useState(false);

  const handleJoinGameQueue = async (gameMode: number) => {
    if (!isInQueue) {
      socket.game?.emit('joinGameQueue', { gameMode: gameMode });
      socket.game?.on('joinGameQueue', (data: any) => {
        // console.log('join game socket data:', data);
        setSocketData(data);
      });
      setIsInQueue(true);
    } else {
      socket.game?.emit('leaveGameQueue');
      setIsInQueue(false);
      setSocketData({ status: 'LEAVE'});
    }
  }

  return (
    < button className="text-white border border-white"
      style={{ fontSize: '30px', zIndex: '1' }
      }
      onClick={() => handleJoinGameQueue(gameMode)}>
      {isInQueue ? "Cancel - leave queue" : "Play - join queue"}
    </button >
  );
}

export default PlayButton;
