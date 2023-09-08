import { Link, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "utils/routing/routing";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { useEffect, useState } from "react";
import OnlineGameInstance from "./OnlineGameInstance";

interface OnlineGameInstanceProps {
  gamesList: any[];
}

const OnlineGamesList: React.FC<OnlineGameInstanceProps> = ({ gamesList }) => {
  const [gameData, setGameData] = useState<any | null>(null);
  const [inGame, setInGame] = useState(false);
  const socket = useWebsocketContext();
  const history = useNavigate();

  useEffect(() => {
    socket.game?.on('watchGame', (data: any) => {
      setGameData(data);
    });
    socket.game?.on('inGame', (data: any) => {
      setInGame(true);
    });
    return () => {
      socket.game?.off('watchGame');
      socket.game?.off('inGame');
    };
  }, [socket.game]);

  useEffect(() => {
    if (inGame) {
      history(APP_ROUTES.PLAY_ABSOLUTE);
      return;
    }
  }, [inGame]);

  useEffect(() => {
    if (gameData) {
      const dataString = JSON.stringify(gameData);
      const dataJSON = JSON.parse(dataString);
      if (dataJSON.status === "OK") {
        localStorage.setItem('gameDataWatch', JSON.stringify(dataJSON.gameState));
        localStorage.setItem('player1Watch', JSON.stringify(dataJSON.player1));
        localStorage.setItem('player2Watch', JSON.stringify(dataJSON.player2));
        history(APP_ROUTES.SPECTATE_ABSOLUTE);
      }
    }
  }, [gameData]);

  return (
    <main className="games__instances">
      {gamesList.map((game) =>
        <OnlineGameInstance
          key={game.gameId}
          game={game} />
      )}
    </main>
  );
}

export default OnlineGamesList;
