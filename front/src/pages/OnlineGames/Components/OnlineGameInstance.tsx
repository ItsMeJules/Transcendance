import React from 'react';
import { useWebsocketContext } from 'services/Websocket/Websocket';

interface OnlineGameInstanceProps {
  game: any;
}

const OnlineGameInstance: React.FC<OnlineGameInstanceProps> = ({ game }) => {
  const socket = useWebsocketContext();

  const handleWatchGame = (gameId: string) => {
    socket.game?.emit('watchGame', { gameId: gameId });
  }

  return (
    <article className="games__instance" key={game.gameId}>
      <button title="Go watch game" key={game.gameId} onClick={() => handleWatchGame(game.gameId)}>
        <article className="games__instance_style" key={game.gameId}>
          <img className="games__picture" src={game.player1.profilePicture} alt={game.player1.username} />
          <span className="games__nameleft ">{game.player1.username}</span>
          <span className="games__score ">{game.player1Score} - {game.player2Score}</span>
          <span className="games__nameright ">{game.player2.username}</span>
          <img className="games__pictureright" src={game.player2.profilePicture} alt={game.player2.username} />
        </article>
      </button>
    </article>
  );
};

export default OnlineGameInstance;