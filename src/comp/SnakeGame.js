import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INIT_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
const INIT_DIR = 'right';
const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const SPEEDS = [180, 140, 110, 80]; // ms per move, increases with level

// Image URLs (replace with your preferred images)
const SNAKE_HEAD_IMG = 'https://cdn-icons-png.flaticon.com/128/616/616408.png';
const SNAKE_BODY_IMG = 'https://cdn-icons-png.flaticon.com/128/616/616408.png';
const FOOD_IMG = 'https://cdn-icons-png.flaticon.com/128/1046/1046784.png';

function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
  return pos;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState([...INIT_SNAKE]);
  const [dir, setDir] = useState(INIT_DIR);
  const [food, setFood] = useState(randomFood(INIT_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [moveTick, setMoveTick] = useState(0);
  const moveRef = useRef();
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  const gameOverRef = useRef(gameOver);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e) {
      if (gameOverRef.current) return;
      if (e.key === 'ArrowUp' && dirRef.current !== 'down') setDir('up');
      if (e.key === 'ArrowDown' && dirRef.current !== 'up') setDir('down');
      if (e.key === 'ArrowLeft' && dirRef.current !== 'right') setDir('left');
      if (e.key === 'ArrowRight' && dirRef.current !== 'left') setDir('right');
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Touch controls (swipe)
  useEffect(() => {
    let startX = null, startY = null;
    function handleTouchStart(e) {
      if (e.touches && e.touches[0]) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }
    function handleTouchEnd(e) {
      if (!startX || !startY) return;
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
      const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : null;
      if (endX == null || endY == null) return;
      const dx = endX - startX;
      const dy = endY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && dirRef.current !== 'left') setDir('right');
        else if (dx < -30 && dirRef.current !== 'right') setDir('left');
      } else {
        if (dy > 30 && dirRef.current !== 'up') setDir('down');
        else if (dy < -30 && dirRef.current !== 'down') setDir('up');
      }
      startX = startY = null;
    }
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    dirRef.current = dir;
    snakeRef.current = snake;
    gameOverRef.current = gameOver;
    if (gameOver) return;
    const speed = SPEEDS[Math.min(level - 1, SPEEDS.length - 1)];
    moveRef.current = setTimeout(() => {
      setMoveTick(t => t + 1);
    }, speed);
    return () => clearTimeout(moveRef.current);
  }, [moveTick, dir, gameOver, level]);

  // Move snake
  useEffect(() => {
    if (gameOver) return;
    const head = { ...snake[0] };
    const move = DIRS[dir];
    head.x += move.x;
    head.y += move.y;
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }
    // Check self collision
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      setGameOver(true);
      return;
    }
    let newSnake = [head, ...snake];
    // Check food
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      setFood(randomFood(newSnake));
      if ((score + 1) % 5 === 0 && level < 4) setLevel(l => l + 1);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [moveTick]);

  function restart() {
    setSnake([...INIT_SNAKE]);
    setDir(INIT_DIR);
    setFood(randomFood(INIT_SNAKE));
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setMoveTick(t => t + 1);
  }

  // Render grid
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#222',
      color: '#fff',
      fontFamily: 'monospace',
    }}>
      <div style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        background: '#111',
        border: '4px solid #4caf50',
        borderRadius: 12,
        position: 'relative',
        marginBottom: 18,
        touchAction: 'none',
      }}>
        {/* Snake */}
        {snake.map((seg, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: seg.x * CELL_SIZE,
            top: seg.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            zIndex: 2,
          }}>
            {i === 0 ? (
              <img src={SNAKE_HEAD_IMG} alt="head" style={{ width: '100%', height: '100%' }} onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.background = '#ffeb3b'; }} />
            ) : (
              <img src={SNAKE_BODY_IMG} alt="body" style={{ width: '100%', height: '100%' }} onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.background = '#4caf50'; }} />
            )}
          </div>
        ))}
        {/* Food */}
        <div style={{
          position: 'absolute',
          left: food.x * CELL_SIZE,
          top: food.y * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
          zIndex: 1,
        }}>
          <img src={FOOD_IMG} alt="food" style={{ width: '100%', height: '100%' }} onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.background = '#e53935'; }} />
        </div>
        {/* Game Over Overlay */}
        {gameOver && (
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            zIndex: 10,
            borderRadius: 12,
          }}>
            <div style={{ marginBottom: 18 }}>Game Over</div>
            <div style={{ marginBottom: 10 }}>Score: <strong>{score}</strong></div>
            <button style={{ fontSize: 18, padding: '10px 24px', borderRadius: 8, background: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={restart}>Restart</button>
            <button style={{ fontSize: 16, marginTop: 10, padding: '8px 18px', borderRadius: 8, background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => window.location.reload()}>Back to Dashboard</button>
          </div>
        )}
      </div>
      <div style={{ fontSize: 20, marginBottom: 8 }}>Score: {score} &nbsp; Level: {level}</div>
      <div style={{ fontSize: 14, color: '#aaa' }}>Controls: Arrow keys or swipe</div>
    </div>
  );
}
