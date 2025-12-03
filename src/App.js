import './App.css';
import Game from './comp/game';
import Dashboard from './comp/Dashboard';
import PlaceholderGame from './comp/PlaceholderGame';

import React, { useState } from 'react';

function App() {
  const [selected, setSelected] = useState(null);

  let content;
  if (!selected) {
    content = <Dashboard onSelect={setSelected} />;
  } else if (selected === 'race') {
    content = <Game />;
  } else {
    content = <PlaceholderGame type={selected} />;
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
