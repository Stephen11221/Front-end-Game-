import React, { useEffect, useRef, useState } from 'react';
import './game.css';

// Top-down race game constants
const CONTAINER_W = 350;
const CONTAINER_H = 600;
const PLAYER_W = 36;
const PLAYER_H = 54;
const LANES = 3;
const LANE_X = [70, 155, 240]; // x centers for 3 lanes
const MAX_SPEED = 12; // top speed
const ACCEL = 0.06; // acceleration per frame
const BRAKE = 0.2;
const BASE_SCROLL = 2.0; // base scroll multiplier

export default function Game() {
  const playerRef = useRef({ lane: 1, x: LANE_X[1] - PLAYER_W / 2, y: CONTAINER_H - 120 });
  const speedRef = useRef(4); // current speed (affects obstacle scroll)
  const obstaclesRef = useRef([]);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [tick, setTick] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [carLoaded, setCarLoaded] = useState(false);

  // for touch controls
  const touchState = useRef({ accel: false, brake: false });
  const swipeStartX = useRef(null);

  // configurable car image (change URL to another image if you prefer)
  // Using an externally hosted image — replace with your preferred URL.
  const carImageUrl = 'https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/svg/destination.svg';

  // Level derived from distance: level 1..15, every 1000 distance increments level
  const level = Math.min(15, Math.floor(distance / 1000) + 1);

  // Controls handling (keyboard)
  useEffect(() => {
    function down(e) {
      const k = e.key;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') moveLeft();
      if (k === 'ArrowRight' || k === 'd' || k === 'D') moveRight();
      if (k === 'ArrowUp' || k === 'w' || k === 'W') touchState.current.accel = true;
      if (k === 'ArrowDown' || k === 's' || k === 'S') touchState.current.brake = true;
    }
    function up(e) {
      const k = e.key;
      if (k === 'ArrowUp' || k === 'w' || k === 'W') touchState.current.accel = false;
      if (k === 'ArrowDown' || k === 's' || k === 'S') touchState.current.brake = false;
    }
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // preload car image and set loaded flag; fallback to CSS color if it fails
  useEffect(() => {
    if (!carImageUrl) return;
    const img = new Image();
    img.onload = () => setCarLoaded(true);
    img.onerror = () => setCarLoaded(false);
    img.src = carImageUrl;
  }, [carImageUrl]);

  function moveLeft() {
    const p = playerRef.current;
    p.lane = Math.max(0, p.lane - 1);
    p.x = LANE_X[p.lane] - PLAYER_W / 2;
    setTick((t) => t + 1);
  }
  function moveRight() {
    const p = playerRef.current;
    p.lane = Math.min(LANES - 1, p.lane + 1);
    p.x = LANE_X[p.lane] - PLAYER_W / 2;
    setTick((t) => t + 1);
  }
  function accelerate() {
    speedRef.current = Math.min(MAX_SPEED, speedRef.current + 1.2);
  }
  function brake() {
    speedRef.current = Math.max(0, speedRef.current - 2);
  }

  // spawn obstacles periodically
  useEffect(() => {
    let spawnTimer = 0;
    function spawnTick(dt) {
      spawnTimer += dt;
      // spawn rate scales with level (higher level -> more obstacles)
      const spawnInterval = Math.max(400 - level * 20, 140); // ms
      if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        const lane = Math.floor(Math.random() * LANES);
        const w = 46 + Math.floor(Math.random() * 40);
        const h = 24 + Math.floor(Math.random() * 30);
        obstaclesRef.current.push({ x: LANE_X[lane] - w / 2, y: -h - 10, width: w, height: h });
      }
      requestAnimationFrame((t) => spawnTick(16));
    }
    const id = requestAnimationFrame((t) => spawnTick(0));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // main loop: move obstacles down based on speed, detect collisions, update distance
  useEffect(() => {
    function loop(ts) {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = ts - lastTimeRef.current;
      lastTimeRef.current = ts;

      if (!gameOver) {
        // smooth speed decay (coast)
        speedRef.current = Math.max(0, speedRef.current - ACCEL * 0.2);

        // touch controls affect speed continuously
        if (touchState.current.accel) {
          speedRef.current = Math.min(MAX_SPEED, speedRef.current + ACCEL * 6);
        }
        if (touchState.current.brake) {
          speedRef.current = Math.max(0, speedRef.current - BRAKE * 3);
        }

        // increase distance by speed * dt
        const distAdd = speedRef.current * (dt / 16) * BASE_SCROLL * (1 + (level - 1) * 0.05);
        setDistance((d) => Math.floor(d + distAdd));

        // move obstacles
        const s = speedRef.current + level * 0.2; // obstacles move faster at higher levels
        const obs = obstaclesRef.current;
        for (let i = obs.length - 1; i >= 0; i--) {
          obs[i].y += s * (dt / 16) * 4;
          // remove off-screen obstacles
          if (obs[i].y > CONTAINER_H + 50) obs.splice(i, 1);
        }

        // occasionally small automatic acceleration to keep race lively
        if (Math.random() < 0.01) speedRef.current = Math.min(MAX_SPEED, speedRef.current + 0.2);

        // check collisions: player rect vs obstacles
        const p = playerRef.current;
        for (const o of obs) {
          if (
            p.x < o.x + o.width &&
            p.x + PLAYER_W > o.x &&
            p.y < o.y + o.height &&
            p.y + PLAYER_H > o.y
          ) {
            // collision -> game over
            setGameOver(true);
            speedRef.current = 0;
            break;
          }
        }

        // minor auto-brake if speed too high for level
        if (speedRef.current > 2 + level * 0.6) speedRef.current -= 0.3;

        setTick((t) => t + 1);
      }

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameOver, level]);

  function restart() {
    obstaclesRef.current = [];
    playerRef.current = { lane: 1, x: LANE_X[1] - PLAYER_W / 2, y: CONTAINER_H - 120 };
    speedRef.current = 4;
    setDistance(0);
    setGameOver(false);
    lastTimeRef.current = null;
    setTick((t) => t + 1);
  }

  // touch / swipe handlers on the container
  function handleTouchStart(e) {
    if (e.touches && e.touches[0]) swipeStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (!swipeStartX.current) return;
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
    if (endX == null) return;
    const dx = endX - swipeStartX.current;
    if (dx > 40) moveRight();
    else if (dx < -40) moveLeft();
    swipeStartX.current = null;
  }

  // pointer handlers for on-screen buttons
  function controlDown(action) {
    if (action === 'left') moveLeft();
    else if (action === 'right') moveRight();
    else if (action === 'accel') touchState.current.accel = true;
    else if (action === 'brake') touchState.current.brake = true;
  }
  function controlUp(action) {
    if (action === 'accel') touchState.current.accel = false;
    if (action === 'brake') touchState.current.brake = false;
  }

  const p = playerRef.current;

  return (
    <div
      className="game-container"
      style={{ width: CONTAINER_W, height: CONTAINER_H }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="track" />

      <div className="hud">
        <div>Distance: {distance} m</div>
        <div>Level: {level} / 15</div>
        <div>Speed: {Math.round(speedRef.current)}</div>
      </div>

      {/* player car */}
      <div className="player" style={{ left: p.x, top: p.y }}>
        {carLoaded ? (
          <img className="player-img" src={carImageUrl} alt="car" />
        ) : null}
      </div>

      {/* obstacles */}
      {obstaclesRef.current.map((o, i) => (
        <div
          key={i}
          className="obstacle"
          style={{ left: o.x, top: o.y, width: o.width, height: o.height }}
        />
      ))}

      {gameOver && (
        <div className="game-over">
          <div className="panel">
            <h2 style={{ margin: '6px 0 8px' }}>{level >= 15 ? 'Champion!' : 'You Crashed'}</h2>
            <div style={{ marginBottom: 10 }}>Distance: <strong>{distance} m</strong></div>
            <div style={{ marginBottom: 14 }}>Level reached: <strong>{level}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button onClick={restart}>Restart</button>
              <button className="secondary" onClick={() => window.location.reload()}>Reload App</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', left: 8, top: 8, color: '#fff', fontSize: 12 }}>
        Controls: ← → to change lane, ↑ accelerate, ↓ brake
      </div>

      {/* touch / pointer controls (visible on mobile; also usable on desktop) */}
      <div className="controls" aria-hidden={false}>
        <div
          className="btn"
          onPointerDown={() => controlDown('left')}
          onPointerUp={() => controlUp('left')}
          onPointerLeave={() => controlUp('left')}
        >
          ◀
        </div>
        <div
          className="btn big"
          onPointerDown={() => controlDown('accel')}
          onPointerUp={() => controlUp('accel')}
          onPointerLeave={() => controlUp('accel')}
        >
          ▲
        </div>
        <div
          className="btn"
          onPointerDown={() => controlDown('right')}
          onPointerUp={() => controlUp('right')}
          onPointerLeave={() => controlUp('right')}
        >
          ▶
        </div>
        <div
          className="btn"
          onPointerDown={() => controlDown('brake')}
          onPointerUp={() => controlUp('brake')}
          onPointerLeave={() => controlUp('brake')}
        >
          ▼
        </div>
      </div>

    </div>
  );
}
