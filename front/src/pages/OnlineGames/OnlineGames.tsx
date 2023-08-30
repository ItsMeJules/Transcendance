import { useEffect, useState } from "react";
import { useWebsocketContext } from "services/Websocket/Websocket";
import User from "services/User/User";
import { MDBContainer, MDBCard } from 'mdb-react-ui-kit';
import OnlineGamesHeader from "./Components/OnlineGamesHeader";
import OnlineGamesList from "./Components/OnlineGamesList";

import './css/OnlineGames.scss'

const OnlineGames = () => {
  const socket = useWebsocketContext();
  const [gamesData, setGamesData] = useState<any>({})
  const [games, setGames] = useState<Map<number, { player1: User, player1Score: number, player2: User, player2Score: number }>>(new Map());
  const [gameList, setGameList] = useState<any[]>([]);

  useEffect(() => {
    socket.game?.on('onlineGames', (data: any) => {
      setGamesData(data);
    });
    socket.game?.emit('onlineGames', { action: 'query' });
  }, [socket.game]);

  useEffect(() => {
    const newGameList = (Object.entries(gamesData) as Array<[string, any]>).map(
      ([gameId, game]: [string, any]) => ({
        gameId: Number(gameId),
        player1: game.player1,
        player1Score: game.player1Score,
        player2: game.player2,
        player2Score: game.player2Score,
      }));
    setGameList(newGameList);
  }, [gamesData]);

  return (
    <main className="right-screen-container">
      <body className="online-games-main-container">

        <header className="online-games-header">
          Online games
        </header>

        <MDBContainer className="online-games-container">
          <OnlineGamesList gamesList={gameList} />
        </MDBContainer>

      </body>
    </main>
  );
}

export default OnlineGames;