import React from 'react';

const games = [
  { key: 'snake', name: 'Snake Game', description: 'Classic snake game.' },
  { key: 'football', name: 'Football Game', description: 'Football arcade. (Coming Soon)' },
  { key: 'hunting', name: 'Hunting Game', description: 'Hunting adventure. (Coming Soon)' },
];

export default function Dashboard({ selected, onSelect }) {
  return (
    <div style={{
      height: '100dvh',
      display: 'flex',
      flexDirection: 'row',
      background: '#222',
      color: '#fff',
      width: '100vw',
      maxWidth: '100vw',
      overflow: 'hidden',
    }}>
      <aside style={{
        width: '32vw',
        minWidth: 90,
        maxWidth: 220,
        background: '#181818',
        borderRight: '2px solid #333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '18px 0',
        gap: 8,
      }}>
  <h2 style={{ textAlign: 'center', marginBottom: 14, fontSize: '3.5vw', minFontSize: 16 }}>Games</h2>
        {games.map(game => (
          <button
            key={game.key}
            onClick={() => onSelect(game.key)}
            style={{
              background: selected === game.key ? '#4caf50' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: '2.8vw',
              fontWeight: 'bold',
              padding: '10px 6px',
              margin: '0 8px 8px',
              cursor: 'pointer',
              boxShadow: selected === game.key ? '0 2px 8px #4caf50' : '0 2px 8px #0004',
              outline: selected === game.key ? '2px solid #4caf50' : 'none',
              transition: 'background 0.2s',
              minWidth: 70,
              maxWidth: '90vw',
            }}
          >
            {game.name}
            <div style={{ fontSize: '2vw', fontWeight: 'normal', marginTop: 6 }}>{game.description}</div>
          </button>
        ))}
      </aside>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', width: '68vw', maxWidth: '100vw', overflow: 'auto' }}>
        {/* The actual game will be rendered in App.js */}
      </main>
    </div>
  );
}
