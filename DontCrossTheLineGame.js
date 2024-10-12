import React, { useState, useEffect, useRef } from 'react';
import GameQueue from './GameQueue';
import GameGrid from './GameGrid';
import GameOver from './GameOver';

const GRID_WIDTH = 120;
const GRID_HEIGHT = 60;

export default function DontCrossTheLineGame() {
  const [gameState, setGameState] = useState('queue');
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket('https://jlegends.github.io/TronGame.github.io/');

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'playerJoined':
          setPlayers(data.players);
          break;
        case 'gameStarted':
          setGameState('playing');
          setPlayers(data.players);
          break;
        case 'gameOver':
          setGameState('over');
          setWinner(data.winner);
          break;
        case 'error':
          alert(data.message);
          break;
      }
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const joinQueue = () => {
    socketRef.current.send(JSON.stringify({ type: 'joinQueue' }));
  };

  const startGame = () => {
    socketRef.current.send(JSON.stringify({ type: 'startGame' }));
  };

  const returnToQueue = () => {
    setGameState('queue');
    joinQueue();
  };

  return (
    <div className="game-container">
      <h1>Don't Cross the Line</h1>
      {gameState === 'queue' && (
        <GameQueue 
          players={players} 
          onJoin={joinQueue} 
          onStart={startGame} 
        />
      )}
      {gameState === 'playing' && (
        <GameGrid 
          width={GRID_WIDTH} 
          height={GRID_HEIGHT} 
          players={players} 
          socket={socketRef.current} 
        />
      )}
      {gameState === 'over' && (
        <GameOver 
          winner={winner} 
          onReturnToQueue={returnToQueue} 
        />
      )}
    </div>
  );
}
