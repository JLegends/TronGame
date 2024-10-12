import React, { useEffect, useRef } from 'react';

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

export default function GameGrid({ width, height, players, socket }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scale = Math.min(
      canvas.width / width,
      canvas.height / height
    );

    // Clear the canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#333333';
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, height * scale);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(width * scale, y * scale);
      ctx.stroke();
    }

    // Draw players
    players.forEach((player, index) => {
      ctx.strokeStyle = COLORS[index];
      ctx.beginPath();
      ctx.moveTo(player.x * scale, player.y * scale);
      player.trail.forEach(point => {
        ctx.lineTo(point.x * scale, point.y * scale);
      });
      ctx.stroke();
    });
  }, [width, height, players]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let direction;
      switch (e.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        default:
          return;
      }
      socket.send(JSON.stringify({ type: 'move', direction }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [socket]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="game-grid"
    />
  );
}