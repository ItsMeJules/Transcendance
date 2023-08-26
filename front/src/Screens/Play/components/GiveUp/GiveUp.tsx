import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

interface GiveUpProps {
  socket: Socket | null;
  whichPlayer: number;
  gameIsEnded: boolean;
}

const GiveUp: React.FC<GiveUpProps> = ({ socket, whichPlayer, gameIsEnded}) => {
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
    <article className='give-up-main-container'>
      {!gameIsEnded &&
        <button className="give-up-button-text" onClick={handleQuitGame} >
          {giveUp ? 'Confirm by clicking again' : 'Give up?'}
        </button >}
    </article>
  );
}

export default GiveUp;