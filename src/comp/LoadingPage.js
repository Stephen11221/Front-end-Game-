import React from 'react';

export default function LoadingPage() {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(34,34,34,0.95)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      flexDirection: 'column',
      fontSize: 28,
      fontWeight: 'bold',
    }}>
      <div style={{ marginBottom: 18 }}>
        <span role="img" aria-label="loading" style={{ fontSize: 48 }}>⏳</span>
      </div>
      <div>Loading...</div>
    </div>
  );
}
