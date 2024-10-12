import React from 'react';

export default function GameQueue({ players, onJoin, onStart }) {
  return (
    <div className="game-queue">
      <h2>Game Queue</h2>
      <p>Players in queue: {players.length}</p>
      {players.length === 0 ? (
        <button onClick={onJoin}>Join Game Queue</button>
      ) : (
        <button onClick={onStart} disabled={players.length < 2}>
          Start Game
        </button>
      )}
    </div>
  );
}