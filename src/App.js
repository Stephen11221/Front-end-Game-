import './App.css';
import Dashboard from './comp/Dashboard';
import PlaceholderGame from './comp/PlaceholderGame';
import SnakeGame from './comp/SnakeGame';
import LoadingPage from './comp/LoadingPage';

import React, { useState, useEffect } from 'react';

function App() {
  const [selected, setSelected] = useState('snake');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  let gameContent;
  if (selected === 'snake') {
    gameContent = <SnakeGame />;
  } else {
    gameContent = <PlaceholderGame type={selected} />;
  }

  return (
    <div className="App" style={{ minHeight: '100dvh', background: '#222', position: 'relative' }}>
      {loading && <LoadingPage />}
      <Dashboard selected={selected} onSelect={setSelected} />
      <div style={{ position: 'absolute', left: 220, right: 0, top: 0, bottom: 0, minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {gameContent}
      </div>
    </div>
  );
}

export default App;
