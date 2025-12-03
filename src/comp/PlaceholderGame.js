import React from 'react';

export default function PlaceholderGame({ type }) {
  const names = {
    snake: 'Snake Game',
    football: 'Football Game',
    hunting: 'Hunting Game',
  };
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#222',
      color: '#fff',
      fontSize: 28,
      fontWeight: 'bold',
    }}>
      <div style={{ marginBottom: 24 }}>{names[type] || 'Game'} (Coming Soon)</div>
      <button style={{ fontSize: 18, padding: '10px 24px', borderRadius: 8, background: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => window.location.reload()}>Back to Dashboard</button>
    </div>
  );
}
