import React from 'react';

export default function GameOver({ winner, onReturnToQueue }) {
  return (
    <div className="game-over">
      <h2>Game Over</h2>
      {winner ? (
        <p>Winner: Player {winner}</p>
      ) : (
        <p>It's a draw!</p>
      )}
      <button onClick={onReturnToQueue}>Return to Queue</button>
    </div>
  );
}