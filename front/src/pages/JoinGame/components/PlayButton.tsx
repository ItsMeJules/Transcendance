import { useWebsocketContext } from "services/Websocket/Websocket";

interface playButtonProps {
  gameMode: number;
  inQueue: number;
  buttonText: string;
}

const PlayButton: React.FC<playButtonProps> = ({ gameMode, inQueue, buttonText }) => {
  const gameSocket = useWebsocketContext().game;

  const handleJoinGameQueue = async (gameMode: number) => {
    if (inQueue !== gameMode) {
      gameSocket?.emit('joinGameQueue', { gameMode: gameMode });
    } else if (inQueue === gameMode)
      gameSocket?.emit('leaveGameQueue');
  }

  return (
    <button className={`corner-button ${inQueue === gameMode ? 'cancel-color' : ''}`} onClick={() => handleJoinGameQueue(gameMode)}>
      <span>{inQueue === gameMode ? <>Cancel<br/>leave queue</> : `${buttonText}`}</span>
    </button>
  );
}

export default PlayButton;
