import React, { useState } from 'react';
import { GameProperties } from '../../models/Properties';

interface ScoreBoardProps {
  game: GameProperties;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ game }) => {

  return (
    <article className="score-main-container">
      <section>Score</section>
      <section>{game.pl1.score} - {game.pl2.score}</section>
    </article>    
  );
}

export default ScoreBoard;