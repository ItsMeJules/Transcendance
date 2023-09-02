import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import './GiveUp.scss'
import { GameProperties } from 'pages/Play/models/Properties';

interface GiveUpProps {
  socket: Socket | null;
  whichPlayer: number;
  game: GameProperties;
  noGame: boolean;
  gameStatus: string;
}

const GiveUp: React.FC<GiveUpProps> = ({ socket, whichPlayer, game, noGame, gameStatus }) => {
  const [giveUp, setGiveUp] = useState(false);

  const handleQuitGame = () => {
    if (!giveUp) {
      setGiveUp(true);
      const interval = setInterval(() => {
        setGiveUp(false);
        clearInterval(interval);
      }, 3000);
    } else if (giveUp && socket) {
      socket?.emit('giveUp', { player: whichPlayer, action: 'giveUp' });
    }
  };

  return (
    <>{!game.isEnded && !noGame && gameStatus !== 'giveUp' && gameStatus !== 'ended' && 
      <article className='give-up-main-container'>
        <button className="give-up-button-text" onClick={handleQuitGame} >
          {giveUp ? 'Confirm by clicking again' : 'Give up?'}
        </button >
      </article>}
    </>
  );
}

export default GiveUp;