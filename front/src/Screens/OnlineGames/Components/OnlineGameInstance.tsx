import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../Utils";
import { useWebsocketContext } from "../../../Wrappers/Websocket";
import { useEffect, useState } from "react";

interface OnlineGameInstanceProps {
  gamesList: any[];
}

const OnlineGameInstance: React.FC<OnlineGameInstanceProps> = ({ gamesList }) => {
  const [gameData, setGameData] = useState<any | null>(null);
  const socket = useWebsocketContext();

  const handleWatchGame = (gameId: string) => {
    socket.game?.emit('watchGame', { gameId: gameId });
  }
 
  useEffect(() => {
    socket.game?.on('watchGame', (data: any) => {
      setGameData(data)
    });
  }, [socket.game]);

  useEffect(() => {
    console.log('gameData:', gameData);
  }, [gameData]);

  return (
    <main className="games__instance">
      {gamesList.map((game) => (
        <button title="Go watch game" key={game.gameId} onClick={() => handleWatchGame(game.gameId)}>
          <article className="games__instance_style" key={game.gameId}>
            <img className="games__picture" src={game.player1.profilePicture} alt={game.player1.username} />
            <span className="games__nameleft ">{game.player1.username}</span>
            <span className="games__score ">{game.player1Score} - {game.player2Score}</span>
            <span className="games__nameright ">{game.player2.username}</span>
            <img className="games__pictureright" src={game.player2.profilePicture} alt={game.player2.username} />
          </article>
        </button>
      ))}
    </main>
  );
}

export default OnlineGameInstance;