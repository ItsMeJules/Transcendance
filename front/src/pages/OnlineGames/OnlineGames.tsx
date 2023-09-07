import { MDBContainer } from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useWebsocketContext } from "services/Websocket/Websocket";
import OnlineGamesList from "./Components/OnlineGamesList";

import { useAppDispatch } from "utils/redux/Store";
import { setRightScreenNoGame } from "utils/redux/reducers/RightScreenSlice";
import './css/OnlineGames.scss';

const OnlineGames: React.FC = () => {
  const dispatch = useAppDispatch()
  const socket = useWebsocketContext();
  const [gamesData, setGamesData] = useState<any>({})
  const [gameList, setGameList] = useState<any[]>([]);

  // Socket on
  useEffect(() => {
    socket.game?.on('onlineGames', (data: any) => {
      console.log('ONLINE GAMES RECEIVED:', data);
      dispatch(setRightScreenNoGame(false));
      setGamesData(data);
    });
    socket.game?.emit('onlineGames', { action: 'query' });
    return () => {
      socket.game?.off('onlineGames');
    }
  }, [socket.game, dispatch]);

  useEffect(() => {
    const tmpGameList = (Object.entries(gamesData) as Array<[string, any]>).map(
      ([gameId, game]: [string, any]) => ({
        gameId: Number(gameId),
        player1: game.player1,
        player1Score: game.player1Score,
        player2: game.player2,
        player2Score: game.player2Score,
      }));
    setGameList(tmpGameList);
  }, [gamesData]);

  return (
    <article className="online-games-main-container">

      <header className="online-games-header">
        Online games
      </header>

      <MDBContainer className="online-games-container">
        <OnlineGamesList gamesList={gameList} />
      </MDBContainer>

    </article>
  );
}

export default OnlineGames;