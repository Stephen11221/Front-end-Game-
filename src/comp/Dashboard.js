import React from 'react';

const games = [
  { key: 'race', name: 'Race Game', description: 'Top-down car race game.' },
  { key: 'snake', name: 'Snake Game', description: 'Classic snake game. (Coming Soon)' },
  { key: 'football', name: 'Football Game', description: 'Football arcade. (Coming Soon)' },
  { key: 'hunting', name: 'Hunting Game', description: 'Hunting adventure. (Coming Soon)' },
];

export default function Dashboard({ onSelect }) {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#222',
      color: '#fff',
      padding: '24px',
    }}>
      <h1 style={{ marginBottom: 24 }}>Game Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {games.map(game => (
          <button
            key={game.key}
            onClick={() => onSelect(game.key)}
            style={{
              minWidth: 180,
              minHeight: 80,
              background: '#333',
              color: '#fff',
              border: '2px solid #4caf50',
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #0004',
            }}
          >
            {game.name}
            <div style={{ fontSize: 14, fontWeight: 'normal', marginTop: 8 }}>{game.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
